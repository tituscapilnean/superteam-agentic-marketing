// Arrows, space, PageUp/PageDown or a click/tap move between slides.
// F toggles fullscreen, N toggles presenter notes (each slide's data-notes).
// The slide number lives in the hash (#3), so a link can open a given slide.
(function () {
  var stage = document.querySelector('.stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var counter = document.getElementById('count');
  var notes = document.getElementById('notes');
  var notesText = notes.querySelector('p');
  var i = 0;

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
  }
  function show(n, fromHash) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (el, k) {
      el.classList.toggle('active', k === i);
      el.setAttribute('aria-hidden', k === i ? 'false' : 'true');
    });
    counter.textContent = (i + 1) + ' / ' + slides.length;
    notesText.textContent = slides[i].getAttribute('data-notes') || 'No notes for this slide.';
    if (!fromHash && location.hash !== '#' + (i + 1)) history.replaceState(null, '', '#' + (i + 1));
  }
  function fromHash() {
    var n = parseInt(location.hash.slice(1), 10);
    show(isNaN(n) ? 0 : n - 1, true);
  }
  function toggleFull() {
    var d = document;
    if (!d.fullscreenElement) { (d.documentElement.requestFullscreen || function () {}).call(d.documentElement); }
    else if (d.exitFullscreen) { d.exitFullscreen(); }
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); show(i + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); show(i - 1); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(slides.length - 1);
    else if (k === 'f' || k === 'F') toggleFull();
    else if (k === 'n' || k === 'N') notes.hidden = !notes.hidden;
  });
  document.querySelector('.viewport').addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    show(e.clientX > window.innerWidth / 2 ? i + 1 : i - 1);
  });
  document.getElementById('prev').addEventListener('click', function () { show(i - 1); });
  document.getElementById('next').addEventListener('click', function () { show(i + 1); });
  document.getElementById('full').addEventListener('click', toggleFull);
  document.getElementById('note').addEventListener('click', function () { notes.hidden = !notes.hidden; });

  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', fromHash);
  fit();
  fromHash();
})();
