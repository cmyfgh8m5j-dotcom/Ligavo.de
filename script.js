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

// Signup form -> mailto (no backend yet)
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
    const role = signupForm.querySelector('input[name="role"]:checked').value;
    const name = signupForm.fName.value.trim();
    const company = signupForm.fCompany.value.trim();
    const email = signupForm.fEmail.value.trim();
    const message = signupForm.fMessage.value.trim();

    const to = 'info@ligavo.de';
    const subject = `Interesse als ${role} – ${name}`;
    const bodyLines = [
      `Ich bin: ${role}`,
      `Name: ${name}`,
      company ? `Betrieb / Gewerk: ${company}` : null,
      `E-Mail: ${email}`,
      message ? `Nachricht: ${message}` : null
    ].filter(Boolean);
    const body = bodyLines.join('\n');

    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('formSuccess').style.display = 'block';
    window.location.href = mailto;
  });
}
