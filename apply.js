/* ── Multi-step form ── */
let currentStep = 1;

function updateDots() {
  [1,2,3].forEach(i => {
    document.getElementById('dot-' + i).classList.toggle('active', i === currentStep);
  });
}

function nextStep(from) {
  if (from === 1) {
    const name = document.getElementById('full-name').value.trim();
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value.trim();
    const loc = document.getElementById('location').value.trim();
    if (!name || !age || !phone || !loc) {
      showError('Tafadhali jaza sehemu zote za lazima (*)');
      return;
    }
    if (+age < 18) { showError('Lazima uwe na umri wa miaka 18 au zaidi.'); return; }
  }
  if (from === 2) {
    const type = document.querySelector('input[name="test-type"]:checked');
    const story = document.getElementById('story').value.trim();
    const others = document.getElementById('others').value.trim();
    if (!type || story.length < 50 || !others) {
      showError('Tafadhali jaza hadithi yako (angalau maneno 50) na sehemu zote za lazima.');
      return;
    }
  }
  document.getElementById('step-' + from).classList.remove('active');
  currentStep = from + 1;
  document.getElementById('step-' + currentStep).classList.add('active');
  updateDots();
  window.scrollTo({ top: document.querySelector('.form-wrapper').offsetTop - 80, behavior: 'smooth' });
}

function prevStep(from) {
  document.getElementById('step-' + from).classList.remove('active');
  currentStep = from - 1;
  document.getElementById('step-' + currentStep).classList.add('active');
  updateDots();
}

function showError(msg) {
  let err = document.getElementById('form-error');
  if (!err) {
    err = document.createElement('div');
    err.id = 'form-error';
    err.style.cssText = 'background:rgba(255,45,107,.12);border:1px solid rgba(255,45,107,.4);color:#ff6b9d;padding:.75rem 1rem;border-radius:6px;font-size:.85rem;font-weight:700;margin-bottom:1rem;';
    document.querySelector('.form-step.active').prepend(err);
  }
  err.textContent = '⚠️ ' + msg;
  setTimeout(() => err.remove(), 4000);
}

/* char counter */
const storyArea = document.getElementById('story');
if (storyArea) {
  storyArea.addEventListener('input', () => {
    const c = storyArea.value.length;
    document.getElementById('char-count').textContent = c;
    if (c > 2000) storyArea.value = storyArea.value.slice(0, 2000);
  });
}

/* submit */
document.getElementById('apply-form').addEventListener('submit', e => {
  e.preventDefault();
  const checks = ['c1','c2','c3','c4'];
  for (const id of checks) {
    if (!document.getElementById(id).checked) {
      showError('Tafadhali kubali masharti yote ya idhini.');
      return;
    }
  }
  const whyTV = document.getElementById('why-tv').value.trim();
  if (whyTV.length < 20) {
    showError('Tafadhali eleza kwa nini unataka kufanya hivi kwenye runinga.');
    return;
  }
  // In a real app this would POST to an API
  document.getElementById('apply-form').style.display = 'none';
  const s = document.getElementById('apply-success');
  s.style.display = 'block';
  // confetti burst
  triggerSuccessConfetti();
  window.scrollTo({ top: document.querySelector('.form-wrapper').offsetTop - 80, behavior: 'smooth' });
});

function triggerSuccessConfetti() {
  const colors = ['#f5c518','#ff2d6b','#00d4ff','#00ff88','#7c3aed'];
  const emojis = ['🧬','💥','😱','🎉','🔬','🎭'];
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;';
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const pieces = Array.from({length:120}, () => ({
    x: Math.random() * canvas.width, y: -20 - Math.random() * 200,
    vx: (Math.random()-.5)*5, vy: 2+Math.random()*4,
    rot: Math.random()*360, vrot: (Math.random()-.5)*10,
    size: 8+Math.random()*14, color: colors[Math.floor(Math.random()*colors.length)],
    emoji: Math.random()<.3 ? emojis[Math.floor(Math.random()*emojis.length)] : null,
    alpha: 1
  }));
  let f = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vrot;
      if(f>80) p.alpha=Math.max(0,p.alpha-.012);
      ctx.save(); ctx.globalAlpha=p.alpha;
      ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      if(p.emoji) { ctx.font=p.size*1.5+'px serif'; ctx.fillText(p.emoji,-p.size/2,p.size/2); }
      else { ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.4); }
      ctx.restore();
    });
    f++;
    if(f<200) requestAnimationFrame(draw);
    else { canvas.remove(); }
  }
  draw();
}
