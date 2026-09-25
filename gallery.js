(function(){
'use strict';

/* =========================================================
   CINEMATIC GALLERY — معرض سينمائي (ملف واحد)
   ========================================================= */

const KEY = 'mod_gallery_v1';
const G = { images: [], currentIndex: 0, lightbox: null };

/* ============ CSS (يدخل تلقائياً) ============ */
function injectCSS(){
  if(document.getElementById('cg-styles')) return;
  const style = document.createElement('style');
  style.id = 'cg-styles';
  style.textContent = `
    .cg-section{padding:60px 0;border-top:1px solid rgba(201,163,78,.16);position:relative;z-index:1}
    .cg-header{max-width:1400px;margin:0 auto 40px;padding:0 24px;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}
    .cg-eyebrow{display:inline-block;font-family:'Noto Kufi Arabic',sans-serif;font-size:11px;font-weight:800;letter-spacing:4px;color:#c9a34e;text-transform:uppercase;margin-bottom:12px;padding:6px 16px;border:1px solid rgba(201,163,78,.3);border-radius:999px;background:rgba(201,163,78,.06)}
    .cg-title{font-family:'Noto Kufi Arabic',sans-serif;font-size:clamp(22px,4vw,36px);font-weight:900;margin:0 0 12px;line-height:1.2;background:linear-gradient(135deg,#eef1ea 0%,#c9a34e 60%,#8a6620 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
    .cg-desc{font-family:'Noto Kufi Arabic',sans-serif;font-size:13.5px;color:#b8bfae;margin:0;line-height:1.7}
    .cg-expand{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;background:rgba(201,163,78,.08);border:1px solid rgba(201,163,78,.3);color:#e8c878;font-family:'Noto Kufi Arabic',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .3s ease;white-space:nowrap}
    .cg-expand:hover{background:rgba(201,163,78,.18);border-color:rgba(201,163,78,.6);transform:translateY(-2px)}
    .cg-grid{max-width:1400px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:260px;gap:18px}
    .cg-card{position:relative;grid-column:span 1;grid-row:span 1;opacity:0;transform:translateY(30px);transition:opacity .6s ease,transform .6s ease;cursor:pointer;perspective:1200px}
    .cg-card.is-in{opacity:1;transform:translateY(0)}
    .cg-card--big{grid-column:span 2;grid-row:span 2}
    .cg-inner{position:relative;width:100%;height:100%;border-radius:16px;overflow:hidden;background:#0f130d;border:1px solid rgba(201,163,78,.2);transition:transform .15s ease,border-color .3s,box-shadow .4s;transform-style:preserve-3d;will-change:transform}
    .cg-card:hover .cg-inner{border-color:rgba(201,163,78,.55);box-shadow:0 20px 50px -15px rgba(0,0,0,.9),0 0 60px -20px rgba(201,163,78,.4)}
    .cg-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.16,1,.3,1);filter:brightness(.85) contrast(1.05)}
    .cg-card:hover .cg-img{transform:scale(1.08)}
    .cg-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,7,10,.05) 0%,transparent 35%,rgba(6,7,10,.6) 75%,rgba(6,7,10,.95) 100%);pointer-events:none}
    .cg-body{position:absolute;bottom:0;inset-inline:0;padding:20px;z-index:2}
    .cg-cat{display:inline-block;font-family:'Noto Kufi Arabic',sans-serif;font-size:10px;font-weight:800;letter-spacing:1.5px;color:#c9a34e;text-transform:uppercase;margin-bottom:6px;padding:3px 10px;background:rgba(201,163,78,.15);border:1px solid rgba(201,163,78,.4);border-radius:5px;backdrop-filter:blur(10px)}
    .cg-name{font-family:'Noto Kufi Arabic',sans-serif;font-size:16px;font-weight:800;color:#fff;margin:0;line-height:1.4;text-shadow:0 4px 16px rgba(0,0,0,.9)}
    .cg-card--big .cg-name{font-size:22px}
    .cg-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;background:linear-gradient(135deg,#c9a34e,#e8c878);color:#06070a;font-family:'Noto Kufi Arabic',sans-serif;font-size:11.5px;font-weight:800;border:0;cursor:pointer;opacity:0;transform:translateY(10px);transition:all .35s ease;margin-top:10px}
    .cg-card:hover .cg-btn{opacity:1;transform:translateY(0)}
    .cg-btn svg{width:14px;height:14px}
    .cg-corner{position:absolute;width:20px;height:20px;border-color:#c9a34e;border-style:solid;border-width:0;opacity:0;transition:opacity .3s;z-index:3;pointer-events:none}
    .cg-corner-tl{top:10px;inset-inline-start:10px;border-top-width:2px;border-inline-start-width:2px}
    .cg-corner-tr{top:10px;inset-inline-end:10px;border-top-width:2px;border-inline-end-width:2px}
    .cg-corner-bl{bottom:10px;inset-inline-start:10px;border-bottom-width:2px;border-inline-start-width:2px}
    .cg-corner-br{bottom:10px;inset-inline-end:10px;border-bottom-width:2px;border-inline-end-width:2px}
    .cg-card:hover .cg-corner{opacity:1}
    
    /* Lightbox */
    .cg-lb{position:fixed;inset:0;z-index:3000;opacity:0;pointer-events:none;transition:opacity .35s ease}
    .cg-lb.on{opacity:1;pointer-events:auto}
    .cg-lb-bg{position:absolute;inset:0;background:rgba(4,6,4,.97);backdrop-filter:blur(24px)}
    .cg-lb-stage{position:absolute;inset:80px 100px 130px;display:grid;place-items:center;transform:scale(.95);transition:transform .4s}
    .cg-lb.on .cg-lb-stage{transform:scale(1)}
    .cg-lb-img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:12px;border:1px solid rgba(201,163,78,.35);box-shadow:0 40px 100px rgba(0,0,0,.9);opacity:0;transition:opacity .4s}
    .cg-lb-close,.cg-lb-nav{position:absolute;z-index:3;width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:rgba(13,17,8,.9);color:#eef1ea;border:1px solid rgba(201,163,78,.35);cursor:pointer;transition:all .3s}
    .cg-lb-close:hover,.cg-lb-nav:hover{background:rgba(201,163,78,.2);color:#f5e0a5;transform:scale(1.08)}
    .cg-lb-close{top:20px;inset-inline-end:20px}
    .cg-lb-close:hover{transform:rotate(90deg)}
    .cg-lb-nav{top:50%;transform:translateY(-50%)}
    .cg-lb-nav:hover{transform:translateY(-50%) scale(1.08)}
    .cg-lb-prev{inset-inline-start:20px}
    .cg-lb-next{inset-inline-end:20px}
    .cg-lb-close svg,.cg-lb-nav svg{width:22px;height:22px}
    .cg-lb-info{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);z-index:3;display:flex;gap:14px;padding:10px 20px;background:rgba(13,17,8,.92);border:1px solid rgba(201,163,78,.32);border-radius:999px;backdrop-filter:blur(12px);max-width:80vw}
    .cg-lb-title{font-family:'Noto Kufi Arabic',sans-serif;font-size:13px;font-weight:700;color:#eef1ea;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .cg-lb-count{font-family:'SF Mono',monospace;font-size:11.5px;color:#c9a34e;padding-inline-start:14px;border-inline-start:1px solid rgba(201,163,78,.32);letter-spacing:1px;white-space:nowrap}
    
    @media (max-width:1080px){.cg-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:230px}.cg-card--big{grid-column:span 2;grid-row:span 2}}
    @media (max-width:720px){
      .cg-section{padding:40px 0}
      .cg-header{padding:0 16px;margin-bottom:24px}
      .cg-grid{grid-template-columns:1fr;grid-auto-rows:280px;padding:0 16px;gap:14px}
      .cg-card--big{grid-column:span 1;grid-row:span 1;height:340px}
      .cg-body{padding:16px}
      .cg-name{font-size:15px}
      .cg-card--big .cg-name{font-size:18px}
      .cg-btn{opacity:1;transform:none}
      .cg-lb-stage{inset:70px 12px 130px}
      .cg-lb-close{top:12px;inset-inline-end:12px;width:42px;height:42px}
      .cg-lb-nav{width:44px;height:44px;top:auto;bottom:20px;transform:none}
      .cg-lb-nav:hover{transform:scale(1.08)}
      .cg-lb-prev{inset-inline-start:calc(50% + 30px)}
      .cg-lb-next{inset-inline-end:calc(50% + 30px)}
      .cg-lb-info{bottom:78px;font-size:12px}
    }
  `;
  document.head.appendChild(style);
}

/* ============ الصور الافتراضية (SVG) ============ */
function defaultImages(){
  const S = (n, c) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
    '<defs><linearGradient id="g' + n + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#1a2210"/><stop offset="1" stop-color="#06070a"/>' +
    '</linearGradient></defs>' +
    '<rect width="800" height="600" fill="url(#g' + n + ')"/>' +
    '<g fill="none" stroke="#c9a34e" stroke-width="2" opacity="0.4">' +
    '<circle cx="400" cy="300" r="120"/><circle cx="400" cy="300" r="180"/>' +
    '<path d="M400 180 L500 240 L500 360 L400 420 L300 360 L300 240 Z"/>' +
    '</g>' +
    '<text x="400" y="500" text-anchor="middle" fill="#c9a34e" font-family="sans-serif" font-size="28" font-weight="bold">' + c + '</text>' +
    '</svg>'
  );
  return [
    { id:'g1', src:S(1,'عرض عسكري'), title:'عرض عسكري رسمي', cat:'عرض' },
    { id:'g2', src:S(2,'الفرسان'), title:'وحدة الفرسان', cat:'تقليد' },
    { id:'g3', src:S(3,'تدريبات'), title:'تدريبات متقدمة', cat:'تدريب' },
    { id:'g4', src:S(4,'ميدان'), title:'إنجازات ميدانية', cat:'ميدان' },
    { id:'g5', src:S(5,'إعمار'), title:'مشاريع إعمار', cat:'إعمار' },
    { id:'g6', src:S(6,'ذاكرة'), title:'لحظات خالدة', cat:'ذاكرة' }
  ];
}

/* ============ تحميل الصور ============ */
function loadImages(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw){
      const p = JSON.parse(raw);
      if(Array.isArray(p) && p.length) return p;
    }
  }catch(e){}
  return defaultImages();
}
function saveImages(imgs){
  try{ localStorage.setItem(KEY, JSON.stringify(imgs)); }catch(e){}
}

/* ============ إنشاء القسم ============ */
function createSection(){
  if(document.getElementById('cg-section')) return;
  const sec = document.createElement('section');
  sec.id = 'cg-section';
  sec.className = 'cg-section';
  sec.innerHTML =
    '<div class="cg-header">' +
      '<div>' +
        '<span class="cg-eyebrow">الأرشيف البصري</span>' +
        '<h2 class="cg-title">الـمـعـرض الـبـصـري الـرسـمـي</h2>' +
        '<p class="cg-desc">صور حصرية من الميدان — بجودة عالية</p>' +
      '</div>' +
      '<button type="button" class="cg-expand" id="cg-expand">' +
        '<span>عرض الكل</span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:14px;height:14px"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="cg-grid" id="cg-grid"></div>';

  const footer = document.querySelector('.footer');
  if(footer && footer.parentNode){
    footer.parentNode.insertBefore(sec, footer);
  } else {
    document.body.appendChild(sec);
  }
}

/* ============ رسم البطاقات ============ */
function renderGrid(expanded){
  const grid = document.getElementById('cg-grid');
  if(!grid) return;
  grid.innerHTML = '';
  const all = loadImages();
  G.images = all;
  const list = expanded ? all : all.slice(0, 4);

  if(!list.length){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#7e8674;font-family:Noto Kufi Arabic,sans-serif">لا توجد صور. أضف من اللوحة.</div>';
    return;
  }

  list.forEach(function(img, i){
    const card = document.createElement('article');
    card.className = 'cg-card' + (i === 0 ? ' cg-card--big' : '');
    card.innerHTML =
      '<div class="cg-inner">' +
        '<img class="cg-img" src="' + img.src + '" alt="' + (img.title || '') + '" loading="lazy" referrerpolicy="no-referrer">' +
        '<div class="cg-grad"></div>' +
        '<div class="cg-body">' +
          '<span class="cg-cat">' + (img.cat || 'صورة') + '</span>' +
          '<h3 class="cg-name">' + (img.title || '') + '</h3>' +
          '<button type="button" class="cg-btn">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke-linecap="round"/></svg>' +
            'عرض' +
          '</button>' +
        '</div>' +
        '<div class="cg-corner cg-corner-tl"></div>' +
        '<div class="cg-corner cg-corner-tr"></div>' +
        '<div class="cg-corner cg-corner-bl"></div>' +
        '<div class="cg-corner cg-corner-br"></div>' +
      '</div>';

    /* 3D Tilt */
    const inner = card.querySelector('.cg-inner');
    card.addEventListener('mousemove', function(e){
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      inner.style.transform = 'perspective(1200px) rotateX(' + ((y - .5) * -8) + 'deg) rotateY(' + ((x - .5) * 8) + 'deg)';
    });
    card.addEventListener('mouseleave', function(){
      inner.style.transform = '';
    });

    card.addEventListener('click', function(){
      openLightbox(list, i);
    });

    grid.appendChild(card);
  });

  /* Reveal */
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.cg-card').forEach(function(c){ io.observe(c); });
  } else {
    grid.querySelectorAll('.cg-card').forEach(function(c){ c.classList.add('is-in'); });
  }
}

/* ============ Lightbox ============ */
function openLightbox(images, idx){
  if(G.lightbox) return;
  G.images = images;
  G.currentIndex = idx;

  const lb = document.createElement('div');
  lb.className = 'cg-lb';
  lb.innerHTML =
    '<div class="cg-lb-bg"></div>' +
    '<button class="cg-lb-close" aria-label="إغلاق"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6l-12 12" stroke-linecap="round"/></svg></button>' +
    '<button class="cg-lb-nav cg-lb-prev" aria-label="السابق"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<button class="cg-lb-nav cg-lb-next" aria-label="التالي"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<div class="cg-lb-stage"><img class="cg-lb-img" src="" alt=""></div>' +
    '<div class="cg-lb-info"><span class="cg-lb-title"></span><span class="cg-lb-count"></span></div>';

  document.body.appendChild(lb);
  document.body.classList.add('no-scroll');
  G.lightbox = lb;

  lb.querySelector('.cg-lb-close').onclick = closeLB;
  lb.querySelector('.cg-lb-bg').onclick = closeLB;
  lb.querySelector('.cg-lb-prev').onclick = function(e){ e.stopPropagation(); navLB(1); };
  lb.querySelector('.cg-lb-next').onclick = function(e){ e.stopPropagation(); navLB(-1); };
  document.addEventListener('keydown', onKey);

  requestAnimationFrame(function(){ lb.classList.add('on'); });
  showLB();
}

function showLB(){
  if(!G.lightbox) return;
  const img = G.images[G.currentIndex];
  const el = G.lightbox.querySelector('.cg-lb-img');
  const t = G.lightbox.querySelector('.cg-lb-title');
  const c = G.lightbox.querySelector('.cg-lb-count');
  el.style.opacity = '0';
  el.src = img.src;
  el.alt = img.title || '';
  el.onload = function(){ el.style.opacity = '1'; };
  t.textContent = img.title || '';
  c.textContent = (G.currentIndex + 1) + ' / ' + G.images.length;
}

function navLB(d){
  if(!G.images.length) return;
  G.currentIndex = (G.currentIndex + d + G.images.length) % G.images.length;
  showLB();
}

function closeLB(){
  if(!G.lightbox) return;
  const lb = G.lightbox;
  lb.classList.remove('on');
  document.removeEventListener('keydown', onKey);
  setTimeout(function(){
    lb.remove();
    document.body.classList.remove('no-scroll');
    G.lightbox = null;
  }, 300);
}

function onKey(e){
  if(!G.lightbox) return;
  if(e.key === 'Escape') closeLB();
  else if(e.key === 'ArrowRight') navLB(1);
  else if(e.key === 'ArrowLeft') navLB(-1);
}

/* ============ توسيع ============ */
function toggleExpand(){
  const btn = document.getElementById('cg-expand');
  if(!btn) return;
  const isOpen = btn.dataset.open === 'true';
  btn.dataset.open = String(!isOpen);
  btn.querySelector('span').textContent = isOpen ? 'عرض الكل' : 'عرض أقل';
  renderGrid(!isOpen);
}

/* ============ INIT ============ */
function init(){
  injectCSS();
  createSection();
  renderGrid(false);

  const btn = document.getElementById('cg-expand');
  if(btn) btn.onclick = toggleExpand;
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(init, 300); });
} else {
  setTimeout(init, 300);
}

/* ============ API خارجي ============ */
window.__gallery = {
  refresh: function(){ renderGrid(false); },
  add: function(img){
    const list = loadImages();
    list.push({
      id: img.id || ('g_' + Date.now()),
      src: img.src,
      title: img.title || '',
      cat: img.cat || 'صورة'
    });
    saveImages(list);
    renderGrid(false);
  },
  get: function(){ return loadImages(); },
  save: saveImages
};

})();
