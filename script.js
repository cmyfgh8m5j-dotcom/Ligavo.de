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

// Signup form -> mailto (no backend yet)
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = signupForm.querySelector('input[name="role"]:checked').value;
    const name = signupForm.fName.value.trim();
    const company = signupForm.fCompany.value.trim();
    const email = signupForm.fEmail.value.trim();
    const message = signupForm.fMessage.value.trim();

    const to = role === 'Handwerksbetrieb' ? 'betriebe@ligavo.de' : 'info@ligavo.de';
    const subject = `Interesse als ${role} — ${name}`;
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
