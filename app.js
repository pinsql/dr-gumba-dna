/* ── DNA Canvas Background ── */
(function () {
  const canvas = document.getElementById('dna-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, raf;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const helices = [];
  for (let i = 0; i < 4; i++) {
    helices.push({
      x: Math.random() * W,
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      hue: [47, 270, 0, 160][i]
    });
  }

  const BASES = ['A', 'T', 'G', 'C'];
  const BASE_COLORS = {
    A: 'rgba(245,197,24,',
    T: 'rgba(239,68,68,',
    G: 'rgba(34,197,94,',
    C: 'rgba(168,85,247,'
  };

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    helices.forEach(h => {
      const cols = 6;
      const spacing = 50;
      const amplitude = 28;
      const vertSpacing = 24;
      const totalH = H + 100;
      const rows = Math.ceil(totalH / vertSpacing);

      for (let r = 0; r < rows; r++) {
        const y = r * vertSpacing - 50;
        const phase = t * h.speed + h.offset + r * 0.18;
        const x1 = h.x + Math.sin(phase) * amplitude;
        const x2 = h.x + Math.sin(phase + Math.PI) * amplitude;
        const alpha = 0.08 + 0.08 * Math.abs(Math.sin(phase));

        // Strand 1 dot
        ctx.beginPath();
        ctx.arc(x1, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${h.hue}, 80%, 65%, ${alpha * 2})`;
        ctx.fill();

        // Strand 2 dot
        ctx.beginPath();
        ctx.arc(x2, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${h.hue}, 80%, 65%, ${alpha * 2})`;
        ctx.fill();

        // Base pair connector
        if (r % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `hsla(${h.hue}, 60%, 65%, ${alpha * 1.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Base letter
          if (Math.random() < 0.02) {
            const base = BASES[Math.floor(Math.random() * 4)];
            const col = BASE_COLORS[base];
            ctx.font = '8px Rajdhani, monospace';
            ctx.fillStyle = col + alpha * 3 + ')';
            ctx.fillText(base, (x1 + x2) / 2 - 4, y + 3);
          }
        }
      }

      // Connect helix verticals
      for (let r = 0; r < rows - 1; r++) {
        const y1 = r * vertSpacing - 50;
        const y2 = (r + 1) * vertSpacing - 50;
        const phase1 = t * h.speed + h.offset + r * 0.18;
        const phase2 = t * h.speed + h.offset + (r + 1) * 0.18;
        const x1a = h.x + Math.sin(phase1) * amplitude;
        const x1b = h.x + Math.sin(phase2) * amplitude;
        const x2a = h.x + Math.sin(phase1 + Math.PI) * amplitude;
        const x2b = h.x + Math.sin(phase2 + Math.PI) * amplitude;
        const alpha = 0.06;

        ctx.beginPath();
        ctx.moveTo(x1a, y1);
        ctx.lineTo(x1b, y2);
        ctx.strokeStyle = `hsla(${h.hue}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2a, y1);
        ctx.lineTo(x2b, y2);
        ctx.strokeStyle = `hsla(${h.hue}, 70%, 60%, ${alpha})`;
        ctx.stroke();
      }
    });

    raf = requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Navbar scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

/* ── IntersectionObserver animations ── */
const motionEls = document.querySelectorAll('[data-motion]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
motionEls.forEach(el => observer.observe(el));

/* ── Counter animation ── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.count;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* ── Countdown Timer ── */
(function () {
  const target = new Date('2026-06-06T20:00:00+03:00').getTime();
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent = pad(mins);
    document.getElementById('cd-secs').textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── Notify form ── */
document.getElementById('notify-form').addEventListener('submit', function (e) {
  e.preventDefault();
  this.style.display = 'none';
  document.getElementById('notify-success').style.display = 'block';
});

/* ── Hamburger menu ── */
document.getElementById('hamburger').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  if (links.style.display === 'flex') {
    links.style.display = '';
    links.style.position = '';
  } else {
    links.style.display = 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'fixed';
    links.style.top = '70px';
    links.style.right = '1.5rem';
    links.style.background = 'rgba(8,8,16,0.98)';
    links.style.border = '1px solid rgba(245,197,24,0.15)';
    links.style.borderRadius = '8px';
    links.style.padding = '1rem 1.5rem';
    links.style.gap = '1rem';
    links.style.zIndex = '200';
  }
});
