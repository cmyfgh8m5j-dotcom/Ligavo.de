// Nav shadow on scroll
const navHeader = document.querySelector('header.nav');
if (navHeader) {
  const onScroll = () => navHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Tabs: Für Handwerksbetriebe / Für Bauherren
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Live-demo chat animation (scripted, loops while section is visible)
const demoBody = document.getElementById('demoChatBody');
if (demoBody) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let demoRunId = 0;
  let demoVisible = false;
  let demoRunning = false;

  const scrollDemoBottom = () => { demoBody.scrollTop = demoBody.scrollHeight; };

  function addBotBubble(html) {
    const msg = document.createElement('div');
    msg.className = 'demo-msg bot';
    msg.innerHTML = `<div class="demo-bubble">${html}</div>`;
    demoBody.appendChild(msg);
    scrollDemoBottom();
  }

  function addUserBubble(text) {
    const msg = document.createElement('div');
    msg.className = 'demo-msg user';
    msg.innerHTML = `<div class="demo-bubble">${text}</div>`;
    demoBody.appendChild(msg);
    scrollDemoBottom();
  }

  function addTyping() {
    const t = document.createElement('div');
    t.className = 'demo-msg demo-typing';
    t.id = 'demoTyping';
    t.innerHTML = '<div class="demo-bubble"><span></span><span></span><span></span></div>';
    demoBody.appendChild(t);
    scrollDemoBottom();
  }

  function removeTyping() {
    const t = document.getElementById('demoTyping');
    if (t) t.remove();
  }

  async function botSay(runId, html, delay = 900) {
    addTyping();
    await sleep(delay);
    if (runId !== demoRunId) return;
    removeTyping();
    addBotBubble(html);
    await sleep(400);
  }

  async function userPickChip(runId, options, pickedIndex) {
    const wrap = document.createElement('div');
    wrap.className = 'demo-chips';
    wrap.innerHTML = options.map((o) => `<button class="demo-chip">${o}</button>`).join('');
    demoBody.appendChild(wrap);
    scrollDemoBottom();
    await sleep(700);
    if (runId !== demoRunId) return;
    const chips = wrap.querySelectorAll('.demo-chip');
    chips[pickedIndex].classList.add('picked');
    await sleep(350);
    if (runId !== demoRunId) return;
    wrap.remove();
    addUserBubble(options[pickedIndex]);
    await sleep(500);
  }

  async function addResultCard(runId) {
    await sleep(200);
    if (runId !== demoRunId) return;
    const card = document.createElement('div');
    card.className = 'demo-result';
    card.innerHTML = `
      <span class="demo-result-label">3 passende Betriebe · Hamburg-Altona</span>
      <div class="demo-result-row"><span>Fliesen-Fachbetrieb</span><b>★★★★★</b></div>
      <div class="demo-result-row"><span>Sanitär-Meisterbetrieb</span><b>★★★★☆</b></div>
      <div class="demo-result-row"><span>Bad-Sanierung Spezialist</span><b>★★★★☆</b></div>
      <div class="demo-result-cost"><span>Geschätzte Kosten</span><b>3.800 – 6.200&nbsp;€</b></div>
    `;
    demoBody.appendChild(card);
    scrollDemoBottom();
  }

  async function playDemo(runId) {
    demoBody.innerHTML = '';
    await botSay(runId, 'Hallo! Ich bin der <b>Ligavo-Assistent</b>. Was ist Ihr Anliegen?');
    if (runId !== demoRunId) return;
    await sleep(300);
    addUserBubble('Unser Bad muss saniert werden.');
    await sleep(600);
    if (runId !== demoRunId) return;

    await botSay(runId, 'Verstanden – <b>Sanitär &amp; Fliesen</b>. Wie groß ist die Fläche ungefähr?');
    if (runId !== demoRunId) return;
    await userPickChip(runId, ['unter 10 m²', '10 – 30 m²', 'über 30 m²'], 1);
    if (runId !== demoRunId) return;

    await botSay(runId, 'Danke! In welcher Region befinden Sie sich?');
    if (runId !== demoRunId) return;
    await sleep(300);
    addUserBubble('22765, Hamburg-Altona');
    await sleep(600);
    if (runId !== demoRunId) return;

    await botSay(runId, 'Perfekt – ich suche passende, geprüfte Betriebe in Ihrer Nähe …', 1200);
    if (runId !== demoRunId) return;
    await addResultCard(runId);
    await sleep(4200);
  }

  async function demoLoop() {
    if (demoRunning) return;
    demoRunning = true;
    const runId = ++demoRunId;
    while (demoVisible && runId === demoRunId) {
      await playDemo(runId);
      if (prefersReducedMotion) break;
      await sleep(900);
    }
    demoRunning = false;
  }

  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      demoVisible = entry.isIntersecting;
      if (demoVisible) demoLoop();
      else demoRunId++;
    });
  }, { threshold: 0.35 });
  demoObserver.observe(demoBody.closest('.demo-chat-wrap'));
}

// Signup form -> single reliable endpoint (Google Apps Script): logs to the
// Sheet, emails info@ligavo.de, and auto-replies to the submitter.
// (FormSubmit was dropped after repeated outages/timeouts.)
const SHEET_LOG_URL = 'https://script.google.com/macros/s/AKfycbyOvmOKiioxBy0Ows58uocVSAr1QUVqcIXWGqHh6FyYYz_mqKE3OnI2quj8kSKY_pKbww/exec';
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  const fCompanyField = document.getElementById('fCompanyField');
  const toggleCompanyField = () => {
    const role = signupForm.querySelector('input[name="role"]:checked').value;
    fCompanyField.style.display = role === 'Bauherr' ? 'none' : '';
  };
  signupForm.querySelectorAll('input[name="role"]').forEach((r) => r.addEventListener('change', toggleCompanyField));
  toggleCompanyField();

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formSuccess').style.display = 'block';

    const data = new FormData(signupForm);
    const params = new URLSearchParams();
    ['role', 'name', 'company', 'email', 'message', '_honey'].forEach((key) => params.append(key, data.get(key) || ''));

    const goToThanks = () => {
      window.location.href = window.location.origin + '/index.html?sent=1';
    };
    // Never let the user get stuck: redirect after the request settles,
    // or after 6s regardless (Apps Script is fast, but this is a safety net).
    const safety = setTimeout(goToThanks, 6000);
    fetch(SHEET_LOG_URL, { method: 'POST', body: params })
      .catch(() => {})
      .finally(() => { clearTimeout(safety); goToThanks(); });
  });
}

// Show a success banner after a redirected form submission (?sent=1), then clean the URL
if (new URLSearchParams(window.location.search).get('sent') === '1') {
  const banner = document.createElement('div');
  banner.className = 'sent-banner';
  banner.innerHTML = '<span>✓ Danke! Ihre Anfrage wurde erfolgreich gesendet.</span>';
  document.body.prepend(banner);
  window.history.replaceState({}, '', window.location.pathname);
  setTimeout(() => banner.classList.add('show'), 30);
  setTimeout(() => {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  }, 5000);
}
