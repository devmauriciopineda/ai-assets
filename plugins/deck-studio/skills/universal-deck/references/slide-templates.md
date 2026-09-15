# Slide templates

One block per `data-type`. Skeleton matches `../templates/index.html` — copy the markup, do not
reinvent the structure. All visible text is Spanish; class names and attributes are English.

Common shell of every slide:

```html
<section class="slide" id="sN" data-type="content" data-title="Título corto para el índice">
  <header class="slide-head">
    <h1 class="slide-title">Título de la diapositiva</h1>
    <p class="slide-subtitle">Frase informativa que amplía el título.</p>
  </header>
  <div class="slide-body">…</div>
</section>
```

`.slide-subtitle` is visible to the audience: write it as real, informative prose that adds to the
title. The plan's *goal per slide* is an **internal** planning artifact — it is never rendered in
the deck and must never be copied into this element.

`data-title` is the label used by the index and the progress counter: keep it short (≤ 42 chars)
and identical in wording to the corresponding report section.

The nine `data-type` values below are the closed vocabulary: `cover`, `index`, `content`, `table`,
`credits`, `person`, `quote`, `data`, `closing`. Exactly one `cover`, one `index` and one `closing`
per deck; the rest are used as often as the topic requires.

## `cover` — portada

```html
<section class="slide slide--cover" id="s1" data-type="cover" data-title="Portada">
  <p class="cover-kicker">Charla · Uso educativo</p>
  <h1 class="cover-title anim anim--fade-up">Título de la presentación</h1>
  <p class="cover-subtitle anim anim--fade-up" style="--delay:120ms">Subtítulo con el ángulo concreto</p>
  <p class="cover-meta">Presentación educativa · 15 diapositivas</p>
</section>
```

One per deck. No buttons, no index, no images required.

## `index` — índice

```html
<section class="slide slide--index" id="s2" data-type="index" data-title="Índice">
  <header class="slide-head"><h1 class="slide-title">Índice</h1></header>
  <ul class="index-list">
    <li><a class="index-link anim anim--from-left" href="#s1" data-title="Portada" style="--delay:0ms"><span class="index-num">01</span><span class="index-label">Portada</span></a></li>
    <li><a class="index-link anim anim--from-left" href="#s3" data-title="Qué es" style="--delay:120ms"><span class="index-num">03</span><span class="index-label">Qué es</span></a></li>
  </ul>
</section>
```

- **Links only.** No agenda, no timings, no summary, no prose.
- One `<li>` per other slide, **in slide order**, including the cover.
- The `index-num` matches the slide number shown by the progress counter.

## `content` — contenido textual

```html
<section class="slide slide--content" id="sN" data-type="content" data-title="Qué es">
  <header class="slide-head">
    <h1 class="slide-title anim anim--fade-up">Qué es</h1>
    <p class="slide-subtitle">Definición y alcance del tema en una frase.</p>
  </header>
  <div class="slide-body grid-2">
    <div class="prose anim anim--fade-up">
      <p>Texto dominante, 60–120 palabras.</p>
      <p>Segundo párrafo.</p>
    </div>
    <figure class="figure anim anim--from-right">
      <img src="assets/context/imagen.jpg" alt="Descripción de la imagen" data-credit="Autor · Origen">
      <figcaption>Pie de foto con la atribución.</figcaption>
    </figure>
  </div>
  <p class="source-note">Fuente: organismo o publicación, año.</p>
</section>
```

Use `.grid-2` only when there is an image or figure; otherwise a single `.prose` column.

## `table` — tabla de datos

```html
<section class="slide slide--table" id="sN" data-type="table" data-title="Comparativa">
  <header class="slide-head"><h1 class="slide-title anim anim--fade-up">Comparativa</h1></header>
  <table class="data-table anim anim--fade-in">
    <thead><tr><th scope="col">Año</th><th scope="col">Alternativa</th><th scope="col">Ventaja</th><th scope="col">Límite</th></tr></thead>
    <tbody>
      <tr><td>0000</td><td>…</td><td>…</td><td>…</td></tr>
    </tbody>
  </table>
  <p class="source-note">Fuente: …</p>
</section>
```

3–5 columns maximum. Homogeneous, comparable data — same fields in every row.

## `credits` — ficha / datos clave

Use it for the identification block: a product, a place, an organization, an event, a regulation.

```html
<section class="slide slide--credits" id="sN" data-type="credits" data-title="Ficha">
  <header class="slide-head"><h1 class="slide-title anim anim--fade-up">Ficha</h1></header>
  <dl class="credits-list anim anim--fade-up">
    <div><dt>Nombre</dt><dd>—</dd></div>
    <div><dt>Año</dt><dd>—</dd></div>
    <div><dt>Ámbito</dt><dd>—</dd></div>
    <div><dt>Autoría</dt><dd>—</dd></div>
    <div><dt>Cifra clave</dt><dd>—</dd></div>
    <div><dt>Estado</dt><dd>—</dd></div>
  </dl>
  <p class="source-note">Fuente: …</p>
</section>
```

Two-column `<dl>` grid, 6–12 fields. Adapt the labels to the topic; keep the fields homogeneous.

## `person` — perfil

A person or an organization.

```html
<section class="slide slide--person" id="sN" data-type="person" data-title="Perfil">
  <figure class="person-figure anim anim--from-left">
    <img src="assets/people/persona.jpg" alt="Nombre, año de la imagen" data-credit="Autor · Origen">
    <figcaption>Atribución · uso educativo</figcaption>
  </figure>
  <div class="person-body">
    <h1 class="slide-title anim anim--fade-up">Nombre</h1>
    <p class="person-role">Rol · años de actividad</p>
    <p class="anim anim--fade-up" style="--delay:120ms">Dos o tres frases de aporte.</p>
  </div>
  <p class="source-note">Fuente: …</p>
</section>
```

Photo is mandatory here; if no attributable image exists, use a `content` slide and say so.

## `quote` — cita

```html
<section class="slide slide--quote" id="sN" data-type="quote" data-title="Una cita">
  <blockquote class="quote anim anim--fade-up">
    <p>«Texto literal de la cita.»</p>
    <footer class="quote-source">Autor, <cite>Obra o declaración</cite>, año</footer>
  </blockquote>
  <p class="source-note">Fuente: publicación, fecha.</p>
</section>
```

Verbatim only: never paraphrase, never shorten without `[…]`, never translate into Spanish without
marking it as a translation and keeping the original.

## `data` — dato destacado

```html
<section class="slide slide--data" id="sN" data-type="data" data-title="Datos">
  <div class="grid-3">
    <div class="kpi anim anim--fade-up"><span class="kpi-value">00%</span><span class="kpi-label">Descripción del dato y su ámbito</span></div>
    <div class="kpi anim anim--fade-up" style="--delay:120ms"><span class="kpi-value">0000</span><span class="kpi-label">Descripción del dato</span></div>
  </div>
  <p class="source-note">Fuente: …</p>
</section>
```

3 KPIs maximum. Every figure carries a unit, a year or an explicit scope.

## `closing` — cierre

```html
<section class="slide slide--closing" id="sN" data-type="closing" data-title="Cierre">
  <h1 class="closing-title anim anim--fade-up">Gracias</h1>
  <p class="closing-subtitle">Fuentes y atribuciones en <code>fuentes.md</code> · Informe de soporte disponible</p>
</section>
```

One per deck. No new content here.
