/* ── Nav scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── Scroll animations ── */
const mo = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('[data-motion]').forEach(el => mo.observe(el));

/* ── Animated counters ── */
function runCounters() {
  document.querySelectorAll('.sb-num, .s-num').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = +el.dataset.count;
    let cur = 0;
    const step = target / 55;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 22);
  });
}
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  new IntersectionObserver(e => { if (e[0].isIntersecting) { runCounters(); } }, { threshold: .5 }).observe(statsBar);
}

/* ── Countdown Timer ── */
(function () {
  const target = new Date('2026-06-06T20:00:00+03:00').getTime();
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) return;
    document.getElementById('cd-days').textContent  = pad(Math.floor(diff / 86400000));
    document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
    document.getElementById('cd-mins').textContent  = pad(Math.floor((diff % 3600000) / 60000));
    document.getElementById('cd-secs').textContent  = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── Notify form ── */
const nf = document.getElementById('notify-form');
if (nf) {
  nf.addEventListener('submit', e => {
    e.preventDefault();
    nf.style.display = 'none';
    document.getElementById('notify-ok').style.display = 'block';
  });
}

/* ── Hamburger ── */
const hb = document.getElementById('hamburger');
const nl = document.getElementById('nav-links');
if (hb && nl) {
  hb.addEventListener('click', () => {
    const open = nl.classList.toggle('mobile-open');
    if (open) {
      Object.assign(nl.style, {
        display: 'flex', flexDirection: 'column', position: 'fixed',
        top: '64px', right: '1.25rem', background: 'rgba(7,6,15,.98)',
        border: '1px solid rgba(255,45,107,.2)', borderRadius: '10px',
        padding: '1rem 1.5rem', gap: '1rem', zIndex: '200',
        backdropFilter: 'blur(20px)'
      });
    } else {
      nl.style.display = '';
    }
  });
}

/* ── Confetti burst on load ── */
(function () {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '999';
  canvas.style.pointerEvents = 'none';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f5c518','#ff2d6b','#00d4ff','#00ff88','#7c3aed','#ff6b35'];
  const emojis = ['🧬','💥','😱','🔬','🎭'];
  const pieces = [];
  const COUNT = 80;

  for (let i = 0; i < COUNT; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - .5) * 4,
      vy: 1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      vrot: (Math.random() - .5) * 8,
      size: 8 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      emoji: Math.random() < .25 ? emojis[Math.floor(Math.random() * emojis.length)] : null,
      alpha: 1
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
      if (frame > 80) p.alpha = Math.max(0, p.alpha - .01);
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      if (p.emoji) {
        ctx.font = p.size * 1.5 + 'px serif';
        ctx.fillText(p.emoji, -p.size/2, p.size/2);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * .4);
      }
      ctx.restore();
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
  }
  // slight delay so page loads first
  setTimeout(draw, 400);
})();
