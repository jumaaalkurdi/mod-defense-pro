(function(){
'use strict';

if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

function initCursor(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mx = 0, my = 0, dotX = 0, dotY = 0, ringX = 0, ringY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('mousedown', () => ring.classList.add('is-click'));
  document.addEventListener('mouseup', () => ring.classList.remove('is-click'));

  const hoverables = 'a, button, .filter, .stack-card, .news-card, .elite-card, .mostread__item, input, textarea, select, [data-nav], [data-article], [data-mostread]';
  document.addEventListener('mouseover', (e) => { if(e.target.closest(hoverables)) ring.classList.add('is-hover'); });
  document.addEventListener('mouseout', (e) => { if(e.target.closest(hoverables)) ring.classList.remove('is-hover'); });

  function loop(){
    dotX += (mx - dotX) * 0.35;
    dotY += (my - dotY) * 0.35;
    ringX += (mx - ringX) * 0.15;
    ringY += (my - ringY) * 0.15;
    glowX += (mx - glowX) * 0.08;
    glowY += (my - glowY) * 0.08;
    dot.style.transform = 'translate(' + dotX + 'px,' + dotY + 'px) translate(-50%,-50%)';
    ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
    glow.style.transform = 'translate(' + glowX + 'px,' + glowY + 'px) translate(-50%,-50%)';
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; glow.style.opacity = '1'; });
}

function initTilt(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const cards = document.querySelectorAll('.featured, .news-card, .elite-card, .stack-card, .widget');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (y - 0.5) * -8;
      const ry = (x - 0.5) * 8;
      card.classList.add('tilt-active');
      card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(0)';
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-active');
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}

function initMagnetic(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const targets = document.querySelectorAll('.btn, .filter, .social-link, .drawer__quick-btn');
  targets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.25) + 'px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

function initParticles(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  const wrap = document.createElement('div');
  wrap.className = 'hero-particles';
  const canvas = document.createElement('canvas');
  wrap.appendChild(canvas);
  hero.insertBefore(wrap, hero.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;

  function resize(){
    const rect = hero.getBoundingClientRect();
    W = canvas.width = rect.width * (window.devicePixelRatio || 1);
    H = canvas.height = rect.height * (window.devicePixelRatio || 1);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }
  function createParticle(){
    return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.4, vx: (Math.random() - 0.5) * 0.35, vy: -Math.random() * 0.4 - 0.1, alpha: Math.random() * 0.5 + 0.15, life: 1, gold: Math.random() > 0.3 };
  }
  function init(){ particles = []; const count = Math.min(60, Math.floor(W * H / 40000)); for(let i = 0; i < count; i++) particles.push(createParticle()); }
  function animate(){
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.life -= 0.002;
      if(p.life <= 0 || p.y < -10 || p.x < -10 || p.x > W + 10){
        particles[i] = createParticle();
        particles[i].y = H + 10;
        particles[i].x = Math.random() * W;
        return;
      }
      const opacity = p.alpha * p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (window.devicePixelRatio || 1), 0, Math.PI * 2);
      if(p.gold){ ctx.fillStyle = 'rgba(201,163,78,' + opacity + ')'; ctx.shadowColor = 'rgba(201,163,78,.8)'; ctx.shadowBlur = 8; }
      else { ctx.fillStyle = 'rgba(245,224,165,' + opacity * 0.6 + ')'; ctx.shadowColor = 'rgba(245,224,165,.6)'; ctx.shadowBlur = 6; }
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    raf = requestAnimationFrame(animate);
  }
  resize(); init(); animate();
  window.addEventListener('resize', () => { resize(); init(); });
  document.addEventListener('visibilitychange', () => { if(document.hidden){ cancelAnimationFrame(raf); } else { raf = requestAnimationFrame(animate); } });
}

function initCounters(){
  const counters = document.querySelectorAll('.intro-banner__stat strong, [data-count]');
  if(!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      if(el.dataset.counted === 'true') return;
      el.dataset.counted = 'true';
      const original = el.textContent.trim();
      const match = original.match(/^([+\-]?)(\d+)(.*)$/);
      if(!match) return;
      const prefix = match[1] || '';
      const target = parseInt(match[2], 10);
      const suffix = match[3] || '';
      const duration = 1800;
      const start = performance.now();
      el.classList.add('stat-number', 'is-counting');
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = prefix + current + suffix;
        if(progress < 1){ requestAnimationFrame(tick); }
        else { el.textContent = original; el.classList.remove('is-counting'); }
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
}

function initScrollIndicator(){
  const ind = document.createElement('div');
  ind.className = 'scroll-indicator';
  ind.innerHTML = '<div class="scroll-indicator__mouse"><div class="scroll-indicator__wheel"></div></div>';
  document.body.appendChild(ind);
  function update(){
    if(window.scrollY < 200 && window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 200){
      ind.classList.add('is-visible');
    } else { ind.classList.remove('is-visible'); }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function enhanceReveals(){
  document.querySelectorAll('.news-card, .elite-card, .stack-card').forEach(el => {
    if(el.classList.contains('reveal') && !el.classList.contains('reveal-scale')){ el.classList.add('reveal-scale'); }
  });
  document.querySelectorAll('.widget').forEach(el => {
    if(!el.classList.contains('reveal-blur')) el.classList.add('reveal-blur');
  });
}

function init(){
  initCursor();
  initTilt();
  initMagnetic();
  initParticles();
  initCounters();
  initScrollIndicator();
  enhanceReveals();
}

if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); }
else { init(); }

window.addEventListener('load', () => { setTimeout(() => { initTilt(); initMagnetic(); enhanceReveals(); }, 500); });

})();
