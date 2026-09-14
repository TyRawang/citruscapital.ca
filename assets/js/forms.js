/* Form handling: posts to the HubSpot Forms API when configured,
   otherwise falls back to a pre-filled email so nothing is lost. */
(function () {
  var cfg = window.CITRUS || {};

  function getCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? m.pop() : '';
  }

  function show(el, ok, text) {
    var box = el.querySelector(ok ? '.form-msg--ok' : '.form-msg--err');
    var other = el.querySelector(ok ? '.form-msg--err' : '.form-msg--ok');
    if (other) other.classList.remove('show');
    if (box) { if (text) box.textContent = text; box.classList.add('show'); box.scrollIntoView({ block: 'nearest' }); }
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var key = form.dataset.form;
    var started = Date.now();
    var btn = form.querySelector('button[type=submit]');
    var btnText = btn ? btn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Spam checks: honeypot filled, or submitted faster than a human could
      var hp = form.querySelector('.hp input');
      if ((hp && hp.value) || Date.now() - started < 2500) { show(form, true); form.reset(); return; }

      if (!form.checkValidity()) { form.reportValidity(); return; }

      var fields = [];
      var lines = [];
      form.querySelectorAll('input[name], select[name], textarea[name]').forEach(function (el) {
        if (el.type === 'hidden' && el.name === 'hp') return;
        if (el.closest('.hp')) return;
        var v = el.value.trim();
        if (!v) return;
        fields.push({ objectTypeId: '0-1', name: el.name, value: v });
        var label = form.querySelector('label[for="' + el.id + '"]');
        lines.push((label ? label.textContent.replace('*', '').trim() : el.name) + ': ' + v);
      });

      var portal = cfg.hubspotPortalId;
      var guid = cfg.hubspotForms && cfg.hubspotForms[key];

      // Not configured yet: hand off to email so the message still arrives
      if (!portal || !guid) {
        var subject = key === 'application' ? 'Signature Advisory application' : 'Website enquiry';
        var body = lines.join('\n');
        window.location.href = 'mailto:hello@citruscapital.ca?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        show(form, true, 'Your email app should open with your message ready to send. If it did not, email us at hello@citruscapital.ca.');
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var payload = {
        fields: fields,
        context: {
          pageUri: location.href,
          pageName: document.title,
          hutk: getCookie('hubspotutk') || undefined
        }
      };

      fetch('https://api.hsforms.com/submissions/v3/integration/submit/' + portal + '/' + guid, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('HubSpot responded ' + r.status);
        return r.json();
      }).then(function () {
        form.reset();
        form.querySelectorAll('.form-fields').forEach(function (f) { f.hidden = true; });
        show(form, true);
        if (window.gtag) gtag('event', 'generate_lead', { form: key });
      }).catch(function () {
        show(form, false);
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
      });
    });
  });
})();
