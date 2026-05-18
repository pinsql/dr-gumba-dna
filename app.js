/* ── Nav scroll + mobile ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));

const burger = document.getElementById('burger');
const navList = document.getElementById('nav-list');
if (burger && navList) {
  burger.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    Object.assign(navList.style, open ? {
      display: 'flex', flexDirection: 'column', position: 'fixed',
      top: '68px', right: '1.25rem', zIndex: '200',
      background: 'rgba(10,10,10,.98)', border: '1px solid rgba(255,255,255,.08)',
      borderRadius: '12px', padding: '1.25rem 1.75rem', gap: '.9rem',
      backdropFilter: 'blur(24px)', boxShadow: '0 20px 40px rgba(0,0,0,.5)'
    } : { display: '' });
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && navList.classList.contains('open')) {
      navList.classList.remove('open');
      navList.style.display = '';
    }
  });
}

/* ── Scroll-reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

/* ── Counter animation ── */
function startCounters() {
  document.querySelectorAll('.ss-num').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = +el.dataset.count;
    let cur = 0, step = target / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 20);
  });
}
const strip = document.querySelector('.stats-strip');
if (strip) new IntersectionObserver(e => { if (e[0].isIntersecting) startCounters(); }, { threshold: .5 }).observe(strip);

/* ── Countdown ── */
(function() {
  const target = new Date('2026-06-06T20:00:00+03:00').getTime();
  const pad = n => String(n).padStart(2,'0');
  function tick() {
    const d = target - Date.now();
    if (d <= 0) return;
    document.getElementById('cd-days').textContent  = pad(Math.floor(d / 86400000));
    document.getElementById('cd-hours').textContent = pad(Math.floor((d % 86400000) / 3600000));
    document.getElementById('cd-mins').textContent  = pad(Math.floor((d % 3600000) / 60000));
    document.getElementById('cd-secs').textContent  = pad(Math.floor((d % 60000) / 1000));
  }
  tick(); setInterval(tick, 1000);
})();

/* ── Notify form ── */
const nf = document.getElementById('notify-form');
if (nf) nf.addEventListener('submit', e => {
  e.preventDefault();
  nf.style.display = 'none';
  document.getElementById('notify-ok').style.display = 'block';
});

/* ── Subtle DNA particle background (lightweight) ── */
(function() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { position:'fixed', inset:'0', zIndex:'0', pointerEvents:'none', opacity:'.18' });
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const helices = [
    { x: window.innerWidth * .05, speed: .18, offset: 0, hue: 47 },
    { x: window.innerWidth * .95, speed: .14, offset: Math.PI, hue: 280 },
    { x: window.innerWidth * .5,  speed: .12, offset: Math.PI/2, hue: 350 },
  ];
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += .006;
    helices.forEach(h => {
      const amp = 22, vstep = 22;
      const rows = Math.ceil((canvas.height + 60) / vstep);
      for (let r = 0; r < rows; r++) {
        const y = r * vstep - 30;
        const phase = t * h.speed + h.offset + r * .18;
        const x1 = h.x + Math.sin(phase) * amp;
        const x2 = h.x + Math.sin(phase + Math.PI) * amp;
        const a = .04 + .04 * Math.abs(Math.sin(phase));
        ctx.beginPath(); ctx.arc(x1, y, 2.5, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${h.hue},70%,65%,${a*2})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y, 2.5, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${h.hue},70%,65%,${a*2})`; ctx.fill();
        if (r % 3 === 0) {
          ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y);
          ctx.strokeStyle = `hsla(${h.hue},60%,65%,${a*1.5})`; ctx.lineWidth=1; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
