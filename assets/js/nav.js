/* Mobile navigation, dropdown, hero video, cookie notice */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Services dropdown: button toggles for touch and keyboard; hover works via CSS
  document.querySelectorAll('.nav .has-sub > .menu-btn').forEach(function (btn) {
    var li = btn.parentElement;
    btn.addEventListener('click', function () {
      var open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!li.contains(e.target) && li.classList.contains('open')) {
        li.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
      }
    });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { li.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  });

  // Hero video: only load on wide screens, after the page has painted
  var hero = document.querySelector('.hero');
  if (hero && hero.dataset.video && window.matchMedia('(min-width: 768px)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && !(navigator.connection && navigator.connection.saveData)) {
    window.addEventListener('load', function () {
      var v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
      v.setAttribute('aria-hidden', 'true'); v.setAttribute('tabindex', '-1');
      v.src = hero.dataset.video;
      hero.insertBefore(v, hero.firstChild);
      v.play().catch(function () { v.remove(); });
    });
  }

  // Cookie notice (only shown once analytics is configured)
  var cookie = document.querySelector('.cookie');
  if (cookie && window.CITRUS && window.CITRUS.gaId) {
    var seen = false;
    try { seen = localStorage.getItem('cc-cookie') === '1'; } catch (e) {}
    if (!seen) cookie.classList.add('show');
    var ok = cookie.querySelector('button');
    if (ok) ok.addEventListener('click', function () {
      cookie.classList.remove('show');
      try { localStorage.setItem('cc-cookie', '1'); } catch (e) {}
    });
  }

  // Analytics (GA4) — loads only when a measurement ID is set in config.js
  if (window.CITRUS && window.CITRUS.gaId) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.CITRUS.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', window.CITRUS.gaId, { anonymize_ip: true });
  }
})();
