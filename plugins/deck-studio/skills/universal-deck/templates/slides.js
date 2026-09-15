/* Universal deck — navigation.
   Opens on the index slide, supports buttons, keyboard and fullscreen.
   Visible text is Spanish; identifiers and comments are English. */

(function () {
  'use strict';

  var deck = document.getElementById('deck');
  if (!deck) return;

  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
  if (!slides.length) return;

  var indexSlide = deck.querySelector('.slide[data-type="index"]');
  var prevBtn = document.querySelector('.nav-btn--prev');
  var nextBtn = document.querySelector('.nav-btn--next');
  var fsBtn = document.querySelector('.nav-btn--fs');
  var currentEl = document.querySelector('.deck-progress__current');
  var totalEl = document.querySelector('.deck-progress__total');
  var barFill = document.querySelector('.deck-progressbar__fill');

  var current = 0;

  function slideIndexFromHash() {
    var id = window.location.hash.replace('#', '');
    if (!id) return -1;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].id === id) return i;
    }
    return -1;
  }

  function goTo(target) {
    var next = Math.max(0, Math.min(slides.length - 1, target));
    if (slides[current] && current !== next) {
      slides[current].classList.remove('is-active');
    }
    current = next;

    var slide = slides[current];
    slide.classList.remove('is-active');
    void slide.offsetWidth; /* restart the entry microanimations */
    slide.classList.add('is-active');

    if (currentEl) currentEl.textContent = String(current + 1);
    if (totalEl) totalEl.textContent = String(slides.length);
    if (barFill) barFill.style.width = ((current + 1) / slides.length) * 100 + '%';
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;

    if (window.location.hash !== '#' + slide.id) {
      history.replaceState(null, '', '#' + slide.id);
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  /* Index links jump straight to their slide. */
  Array.prototype.forEach.call(deck.querySelectorAll('.index-link'), function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var id = (link.getAttribute('href') || '').replace('#', '');
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].id === id) { goTo(i); return; }
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        event.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        prev();
        break;
      case 'Home':
        event.preventDefault();
        goTo(0);
        break;
      case 'End':
        event.preventDefault();
        goTo(slides.length - 1);
        break;
      case 'i':
        if (indexSlide) goTo(slides.indexOf(indexSlide));
        break;
      case 'f':
        toggleFullscreen();
        break;
      default:
        break;
    }
  });

  window.addEventListener('hashchange', function () {
    var i = slideIndexFromHash();
    if (i >= 0 && i !== current) goTo(i);
  });

  /* Opens on the index slide. */
  var start = slideIndexFromHash();
  if (start < 0 && indexSlide) start = slides.indexOf(indexSlide);
  goTo(start < 0 ? 0 : start);
})();
