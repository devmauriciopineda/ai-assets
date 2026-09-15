#!/usr/bin/env node
/**
 * validate-deck.mjs — structural validator for presentation decks built on any topic.
 * Zero dependencies. Node >= 18.
 *
 * Usage:
 *   node <skill-dir>/scripts/validate-deck.mjs            # all decks under ./decks
 *   node <skill-dir>/scripts/validate-deck.mjs decks/slug
 *
 * Exit code: 0 when there are no failures, 1 otherwise. Warnings never fail the run.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SLIDE_TYPES = [
  'cover', 'index', 'content', 'table', 'credits', 'person', 'quote', 'data', 'closing',
];
const REQUIRED_FILES = [
  'presentacion/index.html',
  'presentacion/styles.css',
  'presentacion/slides.js',
  'informe-soporte.md',
  'fuentes.md',
];
const MIN_SLIDES = 5;
const MIN_SLIDE_TEXT = 40;
const MIN_INDEX_MATCH = 0.5;

const ok = (msg) => ({ level: 'pass', msg });
const warn = (msg) => ({ level: 'warn', msg });
const fail = (msg) => ({ level: 'fail', msg });

const read = (path) => readFileSync(path, 'utf8');

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return match ? match[1] : null;
};

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function parseSlides(html) {
  const slides = [];
  const re = /<section\b([^>]*)>([\s\S]*?)<\/section>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const tag = match[1];
    if (!/\bclass\s*=\s*"[^"]*\bslide\b/i.test(tag)) continue;
    slides.push({
      id: attr(tag, 'id'),
      type: attr(tag, 'data-type'),
      title: attr(tag, 'data-title'),
      inner: match[2],
      text: stripTags(match[2]),
    });
  }
  return slides;
}

function validateDeck(deckDir) {
  const results = [];
  const at = (...parts) => join(deckDir, ...parts);

  for (const file of REQUIRED_FILES) {
    results.push(existsSync(at(file)) ? ok(`file present: ${file}`) : fail(`missing file: ${file}`));
  }

  const htmlPath = at('presentacion/index.html');
  const html = existsSync(htmlPath) ? read(htmlPath) : '';

  if (html) {
    if (/<html[^>]*\blang="es"/i.test(html)) {
      results.push(ok('html lang="es"'));
    } else {
      results.push(fail('index.html: <html lang="es"> not found'));
    }

    for (const button of ['nav-btn--prev', 'nav-btn--next']) {
      results.push(
        html.includes(button)
          ? ok(`navigation button present: ${button}`)
          : fail(`index.html: navigation button .${button} not found`),
      );
    }

    const slides = parseSlides(html);
    const ids = slides.map((s) => s.id);

    results.push(
      slides.length >= MIN_SLIDES
        ? ok(`${slides.length} slides`)
        : fail(`index.html: only ${slides.length} slides, ${MIN_SLIDES} or more expected`),
    );

    if (slides.some((s) => !s.id)) results.push(fail('index.html: a slide is missing its id attribute'));
    const duplicated = ids.filter((id, i) => id && ids.indexOf(id) !== i);
    if (duplicated.length) {
      results.push(fail(`index.html: duplicated slide ids: ${[...new Set(duplicated)].join(', ')}`));
    }

    for (const slide of slides) {
      const label = `${slide.id || '?'} (${slide.type || 'no type'})`;
      if (!slide.title) results.push(fail(`${label}: missing data-title`));
      if (!slide.type || !SLIDE_TYPES.includes(slide.type)) {
        results.push(warn(`${label}: unknown data-type "${slide.type || ''}"`));
      }
      if (slide.type !== 'index' && slide.text.length < MIN_SLIDE_TEXT) {
        results.push(fail(`${label}: slide looks empty (${slide.text.length} chars of text)`));
      }
      if (slide.type !== 'index' && !/<h1\b/i.test(slide.inner) && slide.type !== 'quote') {
        results.push(warn(`${label}: no <h1> title`));
      }
    }

    for (const type of ['cover', 'index', 'closing']) {
      const count = slides.filter((s) => s.type === type).length;
      if (count === 0) results.push(fail(`index.html: no slide with data-type="${type}"`));
      if (count > 1) results.push(warn(`index.html: ${count} slides with data-type="${type}"`));
    }

    const indexSlides = slides.filter((s) => s.type === 'index');
    if (indexSlides.length === 1) {
      const index = indexSlides[0];
      const targets = [...index.inner.matchAll(/<a\b[^>]*class="[^"]*index-link[^"]*"[^>]*href="#([^"]+)"/gi)]
        .map((m) => m[1]);
      const others = slides.filter((s) => s.id !== index.id).map((s) => s.id);
      const missing = others.filter((id) => !targets.includes(id));
      const broken = targets.filter((id) => !ids.includes(id));
      if (missing.length) {
        results.push(fail(`index slide: no link to slide(s) ${missing.join(', ')}`));
      } else {
        results.push(ok('index slide links every other slide'));
      }
      if (broken.length) results.push(fail(`index slide: links to unknown id(s) ${broken.join(', ')}`));
      if (/class="[^"]*index-link[^"]*"[^>]*href="#/.test(index.inner) === false) {
        results.push(fail('index slide: no .index-link anchors found'));
      }
    }

    const remoteMedia = [...html.matchAll(/\bsrc\s*=\s*"(https?:[^"]*)"/gi)].map((m) => m[1]);
    if (remoteMedia.length) {
      results.push(fail(`index.html: remote media breaks offline projection: ${remoteMedia.join(', ')}`));
    }
    const remoteLinks = [...html.matchAll(/\bhref\s*=\s*"(https?:[^"]*)"/gi)].map((m) => m[1]);
    if (remoteLinks.length) {
      results.push(warn(`index.html: external links (attribution only): ${remoteLinks.join(', ')}`));
    }

    const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    for (const img of images) {
      const src = attr(img, 'src') || '';
      const name = src || '(no src)';
      if (!attr(img, 'alt')) results.push(fail(`img ${name}: missing alt`));
      if (!attr(img, 'data-credit')) results.push(fail(`img ${name}: missing data-credit`));
      if (!/^\.?\/?assets\//.test(src)) {
        results.push(fail(`img ${name}: must live under assets/people or assets/context`));
      } else if (!existsSync(at('presentacion', src.replace(/^\.\//, '')))) {
        results.push(fail(`img ${name}: file not found on disk`));
      }
    }
    if (images.length === 0) results.push(warn('index.html: no images at all'));
  }

  const cssPath = at('presentacion/styles.css');
  if (existsSync(cssPath)) {
    const css = read(cssPath);
    if (/prefers-reduced-motion/.test(css)) results.push(ok('styles.css: reduced-motion fallback'));
    else results.push(fail('styles.css: no prefers-reduced-motion block'));
    if (/url\(\s*['"]?https?:/i.test(css) || /@import\s+(url\()?['"]?https?:/i.test(css)) {
      results.push(fail('styles.css: remote font or asset reference'));
    }
  }

  const jsPath = at('presentacion/slides.js');
  if (existsSync(jsPath)) {
    const js = read(jsPath);
    if (/keydown/.test(js)) results.push(ok('slides.js: keyboard navigation'));
    else results.push(fail('slides.js: no keyboard handler'));
    if (/requestFullscreen/.test(js)) results.push(ok('slides.js: fullscreen support'));
    else results.push(fail('slides.js: no requestFullscreen call'));
  }

  const reportPath = at('informe-soporte.md');
  if (existsSync(reportPath)) {
    const report = read(reportPath);
    const headings = [...report.matchAll(/^##\s+\S+/gm)].length;
    if (headings >= 3) results.push(ok(`informe-soporte.md: ${headings} sections`));
    else results.push(fail(`informe-soporte.md: only ${headings} "##" sections, 3 or more expected`));

    const html = existsSync(htmlPath) ? read(htmlPath) : '';
    const titles = parseSlides(html).map((s) => s.title).filter(Boolean);
    if (titles.length) {
      const body = normalize(report);
      const matched = titles.filter((t) => body.includes(normalize(t))).length;
      const ratio = matched / titles.length;
      if (ratio < MIN_INDEX_MATCH) {
        results.push(
          warn(
            `informe-soporte.md: only ${matched}/${titles.length} slide titles appear in the report — ` +
              'the deck and the report should share the same topic index',
          ),
        );
      } else {
        results.push(ok('informe-soporte.md: shares the deck topic index'));
      }
    }
  }

  const sourcesPath = at('fuentes.md');
  if (existsSync(sourcesPath)) {
    const sources = read(sourcesPath);
    const entries = [...sources.matchAll(/^\s*(?:[-*]|\d+\.)\s+\S+/gm)].length;
    if (entries >= 3) results.push(ok(`fuentes.md: ${entries} entries`));
    else results.push(fail(`fuentes.md: only ${entries} entries, 3 or more expected`));
    if (!/educativ/i.test(sources)) {
      results.push(warn('fuentes.md: no educational-use declaration found'));
    }
  }

  return results;
}

function findDecks(target) {
  if (target) {
    const abs = resolve(target);
    if (!existsSync(abs)) return [];
    if (existsSync(join(abs, 'presentacion', 'index.html'))) return [abs];
    const children = readdirSync(abs)
      .map((name) => join(abs, name))
      .filter((path) => statSync(path).isDirectory() && existsSync(join(path, 'presentacion', 'index.html')));
    return children.length ? children : [abs];
  }
  const root = resolve(process.cwd(), 'decks');
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .map((name) => join(root, name))
    .filter((path) => statSync(path).isDirectory());
}

const target = process.argv[2];
const decks = findDecks(target);

if (!decks.length) {
  console.error(
    target
      ? `No deck folder found at ${resolve(target)}`
      : 'No deck folders found under ./decks',
  );
  process.exit(1);
}

let failures = 0;
let warnings = 0;

for (const deckDir of decks) {
  const results = validateDeck(deckDir);
  const fails = results.filter((r) => r.level === 'fail');
  const warns = results.filter((r) => r.level === 'warn');
  failures += fails.length;
  warnings += warns.length;

  console.log(`\n${deckDir}`);
  for (const r of fails) console.log(`  FAIL  ${r.msg}`);
  for (const r of warns) console.log(`  WARN  ${r.msg}`);
  const checks = results.filter((r) => r.level === 'pass').length;
  console.log(`  ${fails.length ? 'FAILED' : 'OK'}  ${checks} checks passed, ${warns.length} warnings`);
}

console.log(`\n${decks.length} deck(s) · ${failures} failure(s) · ${warnings} warning(s)`);
process.exit(failures ? 1 : 0);
