(function(){
'use strict';

/* ═══════ CONFIG ═══════ */
var REPO = { owner:'jumaaalkurdi', repo:'mod-defense-pro', branch:'main', path:'content' };
var TOKEN_KEY = 'mod_gh_token';
var GKEY = 'mod_gallery_v4';
var TKEY = 'mod_theme_v4';

/* ═══════ SVG DATA URI HELPER ═══════ */
function svgImg(inner, color, bg){
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">'
    + '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="' + bg + '"/>'
    + '<stop offset="1" stop-color="#06070a"/></linearGradient></defs>'
    + '<rect width="800" height="600" fill="url(#g)"/>'
    + '<g stroke="' + color + '" stroke-width="2" fill="none" opacity="0.18">'
    + '<circle cx="400" cy="300" r="220"/><circle cx="400" cy="300" r="170"/>'
    + '<circle cx="400" cy="300" r="120"/></g>'
    + '<g transform="translate(400,300)" fill="none" stroke="' + color + '" stroke-width="4" stroke-linejoin="round">'
    + inner + '</g></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
}

/* ═══════ DEFAULT PHOTOS ═══════ */
var now = Date.now();
var DEFAULTS = [
  { id:'g_d1', title:'عرض عسكري رسمي', description:'عرض مهيب لوحدات القوات المسلحة في الساحة الرئيسية', category:'فعاليات رسمية', addedAt: now - 86400000,
    image: svgImg('<path d="M-100 60 L-100 -40 L-40 -40 L0 -100 L40 -40 L100 -40 L100 60 Z"/><path d="M-30 60 L-30 -20 L30 -20 L30 60"/><circle cx="0" cy="-10" r="18"/>', '#c9a34e', '#1e2a15') },
  { id:'g_d2', title:'وحدة الفرسان', description:'وحدة الفرسان في عرض رسمي مهيب', category:'وحدات قتالية', addedAt: now - 86400000*2,
    image: svgImg('<path d="M-90 40 Q-90 -40 0 -60 Q90 -40 90 40 M-50 40 L-50 -20 M50 40 L50 -20 M0 -90 L0 -60"/><circle cx="-50" cy="-30" r="8"/><circle cx="50" cy="-30" r="8"/>', '#e8c878', '#1a2210') },
  { id:'g_d3', title:'مراسم رفع العلم', description:'مراسم رفع العلم في المناسبات الوطنية', category:'مراسم رسمية', addedAt: now - 86400000*3,
    image: svgImg('<rect x="-100" y="-60" width="200" height="120"/><path d="M-100 -60 L100 -60 M-100 -20 L100 -20 M-100 20 L100 20 M-100 60 L100 60 M-35 -60 L-35 60 M35 -60 L35 60"/>', '#f5e0a5', '#0d1108') },
  { id:'g_d4', title:'تدريبات ميدانية', description:'تدريبات القوات الخاصة في الميدان', category:'تدريبات', addedAt: now - 86400000*4,
    image: svgImg('<circle cx="-60" cy="0" r="30"/><circle cx="60" cy="0" r="30"/><path d="M-30 0 L30 0 M-80 -60 L-40 -60 M40 -60 L80 -60 M-80 60 L-40 60 M40 60 L80 60"/>', '#c9a34e', '#1e2a15') },
  { id:'g_d5', title:'الوحدات المدرعة', description:'عرض للوحدات المدرعة بأحدث التجهيزات', category:'مدرعات', addedAt: now - 86400000*5,
    image: svgImg('<rect x="-110" y="-30" width="220" height="60" rx="8"/><circle cx="-60" cy="50" r="20"/><circle cx="0" cy="50" r="20"/><circle cx="60" cy="50" r="20"/><rect x="-30" y="-60" width="60" height="30"/>', '#e8c878', '#1a2210') },
  { id:'g_d6', title:'شعار الوزارة', description:'شعار رسمي للمركز الإعلامي', category:'هوية رسمية', addedAt: now - 86400000*6,
    image: svgImg('<path d="M-80 -80 L-80 0 Q-80 70 0 100 Q80 70 80 0 L80 -80 Z"/><path d="M0 -40 L14 -10 L46 -6 L22 16 L28 48 L0 32 L-28 48 L-22 16 L-46 -6 L-14 -10 Z"/>', '#c9a34e', '#0d1108') }
];

/* ═══════ THEMES ═══════ */
var THEMES = {
  gold:      { n:'ذهبي كلاسيكي', g:'#c9a34e', g2:'#e8c878', g3:'#f5e0a5', gd:'#8a6620', sh:'0 0 30px -6px rgba(201,163,78,.35)' },
  royal:     { n:'أزرق ملكي',     g:'#4a7ec9', g2:'#7fb0e8', g3:'#a5caf5', gd:'#20508a', sh:'0 0 30px -6px rgba(74,126,201,.35)' },
  crimson:   { n:'أحمر قرمزي',    g:'#c94a4a', g2:'#e87f7f', g3:'#f5a5a5', gd:'#8a2020', sh:'0 0 30px -6px rgba(201,74,74,.35)' },
  emerald:   { n:'أخضر زمردي',    g:'#4ac97e', g2:'#7fe8b0', g3:'#a5f5ca', gd:'#208a50', sh:'0 0 30px -6px rgba(74,201,126,.35)' },
  purple:    { n:'بنفسجي ملكي',   g:'#9a4ac9', g2:'#c87fe8', g3:'#e0a5f5', gd:'#5a208a', sh:'0 0 30px -6px rgba(154,74,201,.35)' },
  turquoise: { n:'فيروزي',         g:'#4ac9c9', g2:'#7fe8e8', g3:'#a5f5f5', gd:'#208a8a', sh:'0 0 30px -6px rgba(74,201,201,.35)' }
};

/* ═══════ HELPERS ═══════ */
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function uid(){ return 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function getToken(){ try { return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''; } catch(e){ return ''; } }

function loadG(){
  try {
    var r = localStorage.getItem(GKEY);
    if(!r) return DEFAULTS.slice();
    var p = JSON.parse(r);
    if(!p || !p.length) return DEFAULTS.slice();
    return p;
  } catch(e){ return DEFAULTS.slice(); }
}
function saveG(d){ try { localStorage.setItem(GKEY, JSON.stringify(d)); } catch(e){} }

function toast(msg, type){
  type = type || 'info';
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var el = document.createElement('div');
  el.className = 'toast toast--' + type;
  var ic = {
    success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  el.innerHTML = '<span class="toast__icon">' + (ic[type] || ic.info) + '</span><span>' + esc(msg) + '</span>';
  c.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('is-show'); });
  setTimeout(function(){ el.classList.remove('is-show'); setTimeout(function(){ el.remove(); }, 400); }, 3400);
}

/* ═══════ CSS ═══════ */
function injectCSS(){
  if(document.getElementById('gpxStyles')) return;
  var css = [
    '.theme-btn{width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--line-2);background:rgba(201,163,78,.05);color:var(--gold-2);clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);transition:all .25s ease;cursor:pointer}',
    '.theme-btn svg{width:18px;height:18px;transition:transform .5s cubic-bezier(.16,1,.3,1)}',
    '.theme-btn:hover{background:rgba(201,163,78,.15);border-color:var(--gold);color:var(--gold-3)}',
    '.theme-btn:hover svg{transform:rotate(120deg)}',
    '.theme-panel{position:fixed;top:150px;inset-inline-end:20px;z-index:1500;width:320px;max-width:calc(100vw - 40px);background:linear-gradient(160deg,#0d1108,#06070a);border:1px solid var(--line-2);clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));box-shadow:0 30px 80px -20px rgba(0,0,0,.95);opacity:0;transform:translateY(-10px) scale(.96);pointer-events:none;transition:opacity .3s cubic-bezier(.16,1,.3,1),transform .3s cubic-bezier(.16,1,.3,1)}',
    '.theme-panel.is-open{opacity:1;transform:none;pointer-events:auto}',
    '.theme-panel::before{content:"";position:absolute;top:0;inset-inline:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold-2),var(--gold),transparent)}',
    '.theme-panel__head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--line);font-family:"Noto Kufi Arabic",sans-serif;font-size:14px;color:#fff}',
    '.theme-panel__head strong{font-weight:800}',
    '.theme-panel__close{width:32px;height:32px;display:grid;place-items:center;border:1px solid var(--line);background:rgba(255,255,255,.02);color:var(--text-2);border-radius:50%;cursor:pointer;font-size:14px;font-family:inherit;transition:all .25s}',
    '.theme-panel__close:hover{border-color:#e11d2e;color:#ff7d89}',
    '.theme-panel__grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:16px}',
    '.theme-choice{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 10px;background:rgba(0,0,0,.35);border:1px solid var(--line);cursor:pointer;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:all .3s cubic-bezier(.16,1,.3,1);font-family:inherit}',
    '.theme-choice:hover{border-color:var(--line-3);transform:translateY(-2px)}',
    '.theme-choice.is-active{border-color:var(--gold);background:linear-gradient(135deg,rgba(201,163,78,.14),rgba(201,163,78,.03))}',
    '.theme-choice__sw{width:34px;height:34px;border-radius:50%;box-shadow:0 4px 14px -4px rgba(0,0,0,.7),inset 0 0 0 2px rgba(255,255,255,.12)}',
    '.theme-choice__n{font-family:"Noto Kufi Arabic",sans-serif;font-size:11.5px;font-weight:700;color:var(--text-2);letter-spacing:.3px}',
    '.theme-choice.is-active .theme-choice__n{color:var(--gold-3)}',
    '.gpx-section{position:relative;z-index:1}',
    '.gpx-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--line);flex-wrap:wrap;position:relative}',
    '.gpx-head::after{content:"";position:absolute;bottom:-1px;inset-inline-start:0;width:120px;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}',
    '.gpx-filters{display:flex;flex-wrap:wrap;gap:8px;width:100%;margin-top:14px}',
    '.gpx-f{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border:1px solid var(--line-2);background:rgba(201,163,78,.04);font-size:13px;font-weight:600;color:var(--text-2);font-family:"Noto Kufi Arabic",sans-serif;transition:all .25s ease;white-space:nowrap;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);cursor:pointer}',
    '.gpx-f:hover{color:#fff;border-color:var(--gold);background:rgba(201,163,78,.12)}',
    '.gpx-f.is-active{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-color:var(--gold);font-weight:800}',
    '.gpx-f__c{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:18px;padding:0 6px;font-size:10.5px;font-weight:700;background:rgba(0,0,0,.3);color:var(--gold-2);border-radius:99px}',
    '.gpx-f.is-active .gpx-f__c{background:rgba(0,0,0,.22);color:#06070a}',
    '.gpx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}',
    '.gpx-card{position:relative;background:rgba(19,26,13,.9);backdrop-filter:blur(18px);border:1px solid var(--line);overflow:hidden;cursor:pointer;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));transition:transform .5s cubic-bezier(.16,1,.3,1),border-color .3s,box-shadow .5s}',
    '.gpx-card:hover{transform:translateY(-6px);border-color:var(--line-3);box-shadow:0 30px 70px -25px rgba(0,0,0,.95),0 0 40px -15px rgba(201,163,78,.4)}',
    '.gpx-card__m{position:relative;aspect-ratio:4/3;overflow:hidden;background:linear-gradient(140deg,#1e2a15,#0d1108)}',
    '.gpx-card__m img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform .9s cubic-bezier(.16,1,.3,1)}',
    '.gpx-card:hover .gpx-card__m img{transform:scale(1.1)}',
    '.gpx-card__m::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(6,8,10,.92));pointer-events:none}',
    '.gpx-card__z{position:absolute;top:50%;inset-inline-start:50%;transform:translate(-50%,-50%) scale(.5);width:64px;height:64px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-radius:50%;opacity:0;transition:all .5s cubic-bezier(.16,1,.3,1);box-shadow:0 12px 40px -8px rgba(201,163,78,.9);z-index:2;pointer-events:none}',
    '.gpx-card__z svg{width:28px;height:28px}',
    '.gpx-card:hover .gpx-card__z{opacity:1;transform:translate(-50%,-50%) scale(1)}',
    '.gpx-card__cat{position:absolute;top:12px;inset-inline-start:12px;z-index:2;padding:5px 11px;font-size:10.5px;font-weight:800;font-family:"Noto Kufi Arabic",sans-serif;letter-spacing:.5px;background:rgba(6,8,10,.85);backdrop-filter:blur(8px);border:1px solid var(--line-2);color:var(--gold-2);clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}',
    '.gpx-card__b{padding:16px 18px 18px;position:relative;z-index:2}',
    '.gpx-card__t{font-family:"Noto Kufi Arabic",sans-serif;font-weight:700;font-size:15px;line-height:1.5;color:#fff;margin-bottom:6px;transition:color .25s}',
    '.gpx-card:hover .gpx-card__t{color:var(--gold-2)}',
    '.gpx-card__d{font-size:12.5px;line-height:1.7;color:var(--text-2)}',
    '.gpx-lb{position:fixed;inset:0;z-index:2000;background:rgba(3,4,6,.97);backdrop-filter:blur(24px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.16,1,.3,1)}',
    '.gpx-lb.is-open{opacity:1;pointer-events:auto}',
    '.gpx-lb__x{position:absolute;top:18px;inset-inline-end:18px;width:48px;height:48px;display:grid;place-items:center;background:rgba(201,163,78,.1);border:1px solid var(--line-2);color:var(--gold-2);border-radius:50%;cursor:pointer;font-size:20px;font-family:inherit;transition:all .25s;z-index:10}',
    '.gpx-lb__x:hover{background:rgba(185,28,28,.25);border-color:#e11d2e;color:#ff7d89;transform:rotate(90deg)}',
    '.gpx-lb__nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;display:grid;place-items:center;background:rgba(6,8,10,.7);backdrop-filter:blur(12px);border:1px solid var(--line-2);color:var(--gold-2);border-radius:50%;cursor:pointer;transition:all .25s;z-index:10;font-family:inherit}',
    '.gpx-lb__nav:hover{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-color:var(--gold);transform:translateY(-50%) scale(1.1)}',
    '.gpx-lb__nav svg{width:24px;height:24px}',
    '.gpx-lb__nav--p{inset-inline-start:18px}',
    '.gpx-lb__nav--n{inset-inline-end:18px}',
    '.gpx-lb__s{max-width:min(94vw,1300px);max-height:68vh;display:flex;align-items:center;justify-content:center;clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px));border:1px solid var(--line-2);background:#0a0d05;box-shadow:0 40px 100px -30px rgba(0,0,0,1),0 0 80px -30px rgba(201,163,78,.35);position:relative}',
    '.gpx-lb__s img{max-width:100%;max-height:68vh;width:auto;height:auto;display:block;object-fit:contain;animation:gpxFade .4s cubic-bezier(.16,1,.3,1)}',
    '@keyframes gpxFade{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}',
    '.gpx-lb__i{margin-top:18px;text-align:center;max-width:720px;padding:0 20px}',
    '.gpx-lb__i h3{font-family:"Noto Kufi Arabic",sans-serif;font-weight:800;font-size:19px;color:#fff;margin-bottom:8px;line-height:1.5}',
    '.gpx-lb__i p{font-size:13.5px;line-height:1.85;color:var(--text-2)}',
    '.gpx-lb__c{position:absolute;top:24px;inset-inline-start:24px;padding:7px 14px;background:rgba(6,8,10,.85);backdrop-filter:blur(12px);border:1px solid var(--line-2);color:var(--gold-2);font-family:"Black Ops One",monospace;font-size:13px;letter-spacing:1.5px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);z-index:10}',
    '.gpx-lb__c strong{color:var(--gold-3)}',
    '.admin-item__thumb{flex:none;width:56px;height:56px;overflow:hidden;border:1px solid var(--line-2);background:#0a0d05;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}',
    '.admin-item__thumb img{width:100%;height:100%;object-fit:cover}',
    '@media (max-width:768px){',
    '.theme-btn{width:36px;height:36px}',
    '.theme-btn svg{width:16px;height:16px}',
    '.theme-panel{top:auto;bottom:20px;inset-inline:14px;width:auto}',
    '.gpx-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}',
    '.gpx-card__b{padding:12px 14px 14px}',
    '.gpx-card__t{font-size:13px}',
    '.gpx-card__d{font-size:11.5px}',
    '.gpx-lb{padding:60px 10px 14px}',
    '.gpx-lb__x{top:10px;inset-inline-end:10px;width:42px;height:42px;font-size:18px}',
    '.gpx-lb__nav{width:44px;height:44px}',
    '.gpx-lb__nav svg{width:20px;height:20px}',
    '.gpx-lb__nav--p{inset-inline-start:8px}',
    '.gpx-lb__nav--n{inset-inline-end:8px}',
    '.gpx-lb__s{max-height:56vh}',
    '.gpx-lb__s img{max-height:56vh}',
    '.gpx-lb__i h3{font-size:15px}',
    '.gpx-lb__i p{font-size:12px}',
    '.gpx-lb__c{top:14px;inset-inline-start:14px;font-size:11px;padding:5px 10px}',
    '.admin-item__thumb{width:44px;height:44px}',
    '}'
  ].join('');
  var s = document.createElement('style');
  s.id = 'gpxStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══════ THEME ═══════ */
function getMode(){ try { return localStorage.getItem('mod_mode_v1') || 'dark'; } catch(e){ return 'dark'; } }
function applyMode(m){
  if(m !== 'light') m = 'dark';
  document.documentElement.setAttribute('data-mode', m);
  try { localStorage.setItem('mod_mode_v1', m); } catch(e){}
  var els = document.querySelectorAll('[data-mode-choice]');
  for(var i=0; i<els.length; i++){
    els[i].classList.toggle('is-active', els[i].getAttribute('data-mode-choice') === m);
  }
}
function applyTheme(k){
  var t = THEMES[k] || THEMES.gold;
  var r = document.documentElement;
  r.style.setProperty('--gold', t.g);
  r.style.setProperty('--gold-2', t.g2);
  r.style.setProperty('--gold-3', t.g3);
  r.style.setProperty('--gold-deep', t.gd);
  r.style.setProperty('--shadow-gold', t.sh);
  try { localStorage.setItem(TKEY, k); } catch(e){}
  var els = document.querySelectorAll('[data-theme-choice]');
  for(var i=0; i<els.length; i++){
    els[i].classList.toggle('is-active', els[i].getAttribute('data-theme-choice') === k);
  }
}
function getTheme(){ try { return localStorage.getItem(TKEY) || 'gold'; } catch(e){ return 'gold'; } }

function injectThemeBtn(){
  var ha = document.querySelector('.header__actions');
  if(!ha || document.getElementById('themeBtn')) return;
  var b = document.createElement('button');
  b.id = 'themeBtn';
  b.type = 'button';
  b.className = 'theme-btn';
  b.setAttribute('aria-label', 'تغيير الألوان');
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/></svg>';
  var nb = document.getElementById('notifyBtn');
  if(nb && nb.parentNode === ha) ha.insertBefore(b, nb);
  else ha.appendChild(b);
  b.addEventListener('click', function(e){ e.stopPropagation(); toggleThemePanel(); });
}

function toggleThemePanel(){
  var p = document.getElementById('themePanel');
  if(p){ p.classList.toggle('is-open'); return; }
  p = document.createElement('div');
  p.id = 'themePanel';
  p.className = 'theme-panel';
  var keys = Object.keys(THEMES);
  var cur = getTheme();
  var _mode = getMode();
  var modeSec = '<div class="theme-panel__mode">'
    + '<div class="theme-panel__mode-label">الوضع</div>'
    + '<div class="theme-panel__mode-btns">'
    + '<button type="button" class="theme-mode' + (_mode==='light'?' is-active':'') + '" data-mode-choice="light">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/></svg>'
    + '<span>نهاري</span></button>'
    + '<button type="button" class="theme-mode' + (_mode==='dark'?' is-active':'') + '" data-mode-choice="dark">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + '<span>ليلي</span></button>'
    + '</div></div>';
  var html = '<div class="theme-panel__head"><strong>المظهر</strong><button type="button" class="theme-panel__close">✕</button></div>'
    + modeSec
    + '<div class="theme-panel__grid">';
  for(var i=0; i<keys.length; i++){
    var k = keys[i], t = THEMES[k];
    html += '<button type="button" class="theme-choice' + (k===cur?' is-active':'') + '" data-theme-choice="' + k + '"><span class="theme-choice__sw" style="background:linear-gradient(135deg,' + t.g + ',' + t.g2 + ')"></span><span class="theme-choice__n">' + t.n + '</span></button>';
  }
  html += '</div>';
  p.innerHTML = html;
  document.body.appendChild(p);
  p.querySelector('.theme-panel__close').addEventListener('click', function(){ p.classList.remove('is-open'); });
  var modeBtns = p.querySelectorAll('[data-mode-choice]');
  for(var mb=0; mb<modeBtns.length; mb++){
    (function(el){
      el.addEventListener('click', function(){
        var m = el.getAttribute('data-mode-choice');
        applyMode(m);
        toast(m === 'light' ? 'الوضع النهاري' : 'الوضع الليلي', 'success');
      });
    })(modeBtns[mb]);
  }
  var ch = p.querySelectorAll('[data-theme-choice]');
  for(var j=0; j<ch.length; j++){
    (function(el){
      el.addEventListener('click', function(){
        applyTheme(el.getAttribute('data-theme-choice'));
        toast('تم تطبيق اللون', 'success');
      });
    })(ch[j]);
  }
  requestAnimationFrame(function(){ p.classList.add('is-open'); });
}

/* ═══════ GALLERY DATA ═══════ */
var GDATA = loadG();

/* ═══════ GALLERY PAGE ═══════ */
function injectGallery(){
  var home = document.getElementById('pageHome');
  if(!home) return false;
  if(document.getElementById('gpxSection')) return true;

  var sec = document.createElement('section');
  sec.id = 'gpxSection';
  sec.className = 'section gpx-section';
  sec.innerHTML = '<div class="container">'
    + '<header class="gpx-head reveal">'
      + '<div><span class="section__eyebrow">الأرشيف المرئي</span><h2 class="section__title">معرض الصور الرسمي</h2></div>'
      + '<div class="gpx-filters" id="gpxFilters"></div>'
    + '</header>'
    + '<div class="gpx-grid" id="gpxGrid"></div>'
    + '</div>';

  var news = document.getElementById('news');
  if(news && news.parentNode === home){
    news.parentNode.insertBefore(sec, news.nextSibling);
  } else {
    home.appendChild(sec);
  }
  return true;
}


function gpxPlaceholder(){
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">'
    + '<defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#1e2a15"/><stop offset="1" stop-color="#06070a"/></linearGradient></defs>'
    + '<rect width="800" height="600" fill="url(#pg)"/>'
    + '<g stroke="#c9a34e" stroke-width="1.5" fill="none" opacity="0.15">'
    + '<circle cx="400" cy="300" r="200"/><circle cx="400" cy="300" r="140"/><circle cx="400" cy="300" r="80"/></g>'
    + '<g transform="translate(400,300)" fill="none" stroke="#c9a34e" stroke-width="3" stroke-linejoin="round">'
    + '<rect x="-60" y="-45" width="120" height="90" rx="6"/>'
    + '<circle cx="-20" cy="-15" r="10"/>'
    + '<path d="M-60 30 L-10 -10 L30 30 L60 10 L60 45 L-60 45 Z"/></g>'
    + '<g transform="translate(400,490)" text-anchor="middle" fill="#7a7864" font-family="sans-serif" font-size="20" font-weight="700">'
    + '<text>لا توجد صورة</text></g></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
}

function renderGallery(){
  var grid = document.getElementById('gpxGrid');
  var filters = document.getElementById('gpxFilters');
  if(!grid) return;
  var items = GDATA.slice().sort(function(a,b){ return (b.addedAt||0) - (a.addedAt||0); });

  if(filters){
    var cats = { 'all': { n:'الكل', c: items.length } };
    for(var i=0; i<items.length; i++){
      var c = (items[i].category || '').trim() || 'عام';
      if(!cats[c]) cats[c] = { n:c, c:0 };
      cats[c].c++;
    }
    var keys = Object.keys(cats);
    var fh = '';
    for(var k=0; k<keys.length; k++){
      var key = keys[k], v = cats[key];
      fh += '<button type="button" class="gpx-f' + (k===0?' is-active':'') + '" data-gf="' + esc(key) + '">' + esc(v.n) + ' <span class="gpx-f__c">' + v.c + '</span></button>';
    }
    filters.innerHTML = fh;
    var fbs = filters.querySelectorAll('[data-gf]');
    for(var f=0; f<fbs.length; f++){
      (function(b){
        b.addEventListener('click', function(){
          var all = filters.querySelectorAll('.gpx-f');
          for(var x=0; x<all.length; x++) all[x].classList.remove('is-active');
          b.classList.add('is-active');
          var fv = b.getAttribute('data-gf');
          var cards = grid.querySelectorAll('.gpx-card');
          for(var y=0; y<cards.length; y++){
            var cat = cards[y].getAttribute('data-gcat');
            cards[y].style.display = (fv === 'all' || cat === fv) ? '' : 'none';
          }
        });
      })(fbs[f]);
    }
  }

  if(!items.length){
    grid.innerHTML = '<div class="gpx-empty" style="padding:60px 20px;text-align:center;font-family:\'Noto Kufi Arabic\',sans-serif;color:var(--text-3);border:1px dashed var(--line-2);grid-column:1/-1">لا توجد صور</div>';
    return;
  }
  var html = '';
  for(var j=0; j<items.length; j++){
    var it = items[j];
    var cat = (it.category || '').trim() || 'عام';
    html += '<figure class="gpx-card reveal" data-gid="' + esc(it.id) + '" data-gcat="' + esc(cat) + '" style="--d:' + Math.min(j*0.04, 0.4) + 's">'
      + '<div class="gpx-card__m">'
        + '<img src="' + esc(it.image || gpxPlaceholder()) + '" alt="' + esc(it.title) + '" loading="lazy" referrerpolicy="no-referrer">'
        + '<span class="gpx-card__cat">' + esc(cat) + '</span>'
        + '<span class="gpx-card__z"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6" stroke-linecap="round"/></svg></span>'
      + '</div>'
      + '<figcaption class="gpx-card__b">'
        + '<h3 class="gpx-card__t">' + esc(it.title) + '</h3>'
        + (it.description ? '<p class="gpx-card__d">' + esc(it.description) + '</p>' : '')
      + '</figcaption>'
    + '</figure>';
  }
  grid.innerHTML = html;

  var cards = grid.querySelectorAll('[data-gid]');
  for(var m=0; m<cards.length; m++){
    (function(el){
      el.addEventListener('click', function(){ openLB(el.getAttribute('data-gid')); });
    })(cards[m]);
  }
  var rv = grid.querySelectorAll('.reveal:not(.is-in)');
  for(var r=0; r<rv.length; r++) rv[r].classList.add('is-in');
}

/* ═══════ LIGHTBOX ═══════ */
var LB = { i:0, list:[] };

function openLB(id){
  var sorted = GDATA.slice().sort(function(a,b){ return (b.addedAt||0) - (a.addedAt||0); });
  var idx = -1;
  for(var i=0; i<sorted.length; i++){ if(sorted[i].id === id){ idx = i; break; } }
  if(idx < 0) return;
  LB.list = sorted;
  LB.i = idx;
  renderLB();
}

function renderLB(){
  var item = LB.list[LB.i];
  if(!item) return;
  var lb = document.getElementById('gpxLb');
  if(!lb){
    lb = document.createElement('div');
    lb.id = 'gpxLb';
    lb.className = 'gpx-lb';
    document.body.appendChild(lb);
  }
  lb.innerHTML =
    '<div class="gpx-lb__c"><strong>' + (LB.i+1) + '</strong> / ' + LB.list.length + '</div>'
    + '<button type="button" class="gpx-lb__x">✕</button>'
    + (LB.list.length > 1 ? '<button type="button" class="gpx-lb__nav gpx-lb__nav--p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '')
    + (LB.list.length > 1 ? '<button type="button" class="gpx-lb__nav gpx-lb__nav--n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '')
    + '<div class="gpx-lb__s"><img src="' + esc(item.image) + '" alt="' + esc(item.title) + '" referrerpolicy="no-referrer"></div>'
    + '<div class="gpx-lb__i"><h3>' + esc(item.title) + '</h3>' + (item.description ? '<p>' + esc(item.description) + '</p>' : '') + '</div>';

  document.body.classList.add('no-scroll');
  requestAnimationFrame(function(){ lb.classList.add('is-open'); });

  lb.querySelector('.gpx-lb__x').addEventListener('click', closeLB);
  var p = lb.querySelector('.gpx-lb__nav--p');
  var n = lb.querySelector('.gpx-lb__nav--n');
  if(p) p.addEventListener('click', function(e){ e.stopPropagation(); prevLB(); });
  if(n) n.addEventListener('click', function(e){ e.stopPropagation(); nextLB(); });
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', lbKey);
}

function closeLB(){
  var lb = document.getElementById('gpxLb');
  if(!lb) return;
  lb.classList.remove('is-open');
  document.removeEventListener('keydown', lbKey);
  setTimeout(function(){ lb.remove(); document.body.classList.remove('no-scroll'); }, 350);
}
function prevLB(){ if(LB.list.length < 2) return; LB.i = (LB.i - 1 + LB.list.length) % LB.list.length; renderLB(); }
function nextLB(){ if(LB.list.length < 2) return; LB.i = (LB.i + 1) % LB.list.length; renderLB(); }
function lbKey(e){
  if(e.key === 'Escape') closeLB();
  else if(e.key === 'ArrowRight') prevLB();
  else if(e.key === 'ArrowLeft') nextLB();
}

/* ═══════ GITHUB SYNC ═══════ */
function rawUrl(f){ return 'https://raw.githubusercontent.com/' + REPO.owner + '/' + REPO.repo + '/' + REPO.branch + '/' + REPO.path + '/' + f + '?t=' + Date.now(); }
function apiUrl(f){ return 'https://api.github.com/repos/' + REPO.owner + '/' + REPO.repo + '/contents/' + REPO.path + '/' + f; }
function b64(s){ return btoa(unescape(encodeURIComponent(s))); }

function fetchRemote(){
  return fetch(rawUrl('gallery.json'), { cache:'no-store' })
    .then(function(r){ if(!r.ok) return null; return r.json(); })
    .catch(function(){ return null; });
}
function getSha(f){
  var tk = getToken();
  if(!tk) return Promise.resolve(null);
  return fetch(apiUrl(f) + '?ref=' + REPO.branch, {
    headers:{ 'Authorization':'token ' + tk, 'Accept':'application/vnd.github+json' }
  })
    .then(function(r){ if(!r.ok) return null; return r.json(); })
    .then(function(d){ return d ? d.sha : null; })
    .catch(function(){ return null; });
}
function writeRemote(f, data, msg){
  var tk = getToken();
  if(!tk) return Promise.reject(new Error('أدخل GitHub Token في تبويب الإعدادات'));
  return getSha(f).then(function(sha){
    var body = { message: msg || 'تحديث ' + f, content: b64(JSON.stringify(data, null, 2) + '\n'), branch: REPO.branch };
    if(sha) body.sha = sha;
    return fetch(apiUrl(f), {
      method:'PUT',
      headers:{ 'Authorization':'token ' + tk, 'Accept':'application/vnd.github+json', 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    }).then(function(r){
      if(!r.ok){ return r.json().catch(function(){ return {}; }).then(function(e){ throw new Error(e.message || 'فشل الرفع'); }); }
      return r.json();
    });
  });
}

/* ═══════ ADMIN TAB ═══════ */
function injectAdminTab(){
  var tabs = document.querySelector('.admin-tabs');
  var body = document.querySelector('.admin-panel__body');
  if(!tabs || !body) return false;
  if(document.getElementById('gpxAdminTab')) return true;

  var tab = document.createElement('button');
  tab.className = 'admin-tab';
  tab.id = 'gpxAdminTab';
  tab.setAttribute('data-tab', 'gpx-gallery');
  tab.textContent = 'المعرض';
  tabs.appendChild(tab);

  var content = document.createElement('div');
  content.className = 'admin-tab-content';
  content.setAttribute('data-tab-content', 'gpx-gallery');
  content.innerHTML = '<div class="admin-grid">'
    + '<div class="admin-section">'
      + '<div class="admin-section__title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg><span id="gpxFT">إضافة صورة</span></div>'
      + '<form class="admin-form" id="gpxForm">'
        + '<input type="hidden" id="gpxEid" value="">'
        + '<div class="admin-form__row"><label for="gpxTitle">العنوان *</label><input type="text" id="gpxTitle" required></div>'
        + '<div class="admin-form__row"><label for="gpxCat">التصنيف</label><input type="text" id="gpxCat" placeholder="مثال: فعاليات"></div>'
        + '<div class="admin-form__row"><label for="gpxImg">رابط الصورة (اختياري)</label><input type="text" id="gpxImg" placeholder="اترك فارغاً للتصميم الافتراضي"></div>'
        + '<div class="admin-form__row"><label for="gpxDesc">الوصف</label><textarea id="gpxDesc" placeholder="وصف مختصر"></textarea></div>'
        + '<div class="admin-form__actions">'
          + '<button class="btn btn--gold" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg><span id="gpxSL">حفظ</span></button>'
          + '<button class="btn btn--outline" type="button" id="gpxCancel" style="display:none;">إلغاء</button>'
        + '</div>'
        + '<div class="admin-form__actions" style="margin-top:14px;">'
          + '<button class="btn btn--gold" type="button" id="gpxPublish"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>نشر المعرض</button>'
          + '<button class="btn btn--outline" type="button" id="gpxPull">📥 تحميل</button>'
        + '</div>'
        + '<div id="gpxHint" style="margin-top:8px;font-family:\'Noto Kufi Arabic\',sans-serif;font-size:11.5px;color:var(--text-3);"></div>'
      + '</form>'
    + '</div>'
    + '<div class="admin-section">'
      + '<div class="admin-section__title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round"/></svg>الصور (<span id="gpxCount">0</span>)</div>'
      + '<div class="admin-list" id="gpxAdminList"></div>'
    + '</div>'
  + '</div>';
  body.appendChild(content);

  tab.addEventListener('click', function(){
    var at = document.querySelectorAll('.admin-tab');
    var ac = document.querySelectorAll('.admin-tab-content');
    for(var i=0; i<at.length; i++) at[i].classList.remove('is-active');
    for(var j=0; j<ac.length; j++) ac[j].classList.remove('is-active');
    tab.classList.add('is-active');
    content.classList.add('is-active');
    renderAdminList();
  });

  bindAdmin();
  return true;
}

function bindAdmin(){
  var form = document.getElementById('gpxForm');
  if(!form || form.getAttribute('data-b') === '1') return;
  form.setAttribute('data-b', '1');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var id = document.getElementById('gpxEid').value;
    var data = {
      id: id || uid(),
      title: document.getElementById('gpxTitle').value.trim(),
      category: document.getElementById('gpxCat').value.trim(),
      image: document.getElementById('gpxImg').value.trim(),
      description: document.getElementById('gpxDesc').value.trim(),
      addedAt: Date.now()
    };
    if(!data.title){ toast('العنوان مطلوب', 'error'); return; }
    if(id){
      for(var i=0; i<GDATA.length; i++){
        if(GDATA[i].id === id){ data.addedAt = GDATA[i].addedAt || Date.now(); GDATA[i] = data; break; }
      }
    } else {
      GDATA.unshift(data);
    }
    saveG(GDATA);
    renderAdminList();
    resetForm();
    renderGallery();
    toast('تم الحفظ — اضغط "نشر المعرض"', 'success');
  });

  document.getElementById('gpxCancel').addEventListener('click', resetForm);
  document.getElementById('gpxPublish').addEventListener('click', function(){
    toast('جارٍ النشر...', 'info');
    writeRemote('gallery.json', GDATA, 'تحديث معرض الصور')
      .then(function(){ toast('تم نشر المعرض', 'success'); updateHint(); })
      .catch(function(err){ toast('فشل: ' + err.message, 'error'); });
  });
  document.getElementById('gpxPull').addEventListener('click', function(){
    toast('جارٍ التحميل...', 'info');
    fetchRemote().then(function(remote){
      if(!remote || !remote.length){ toast('لا توجد بيانات', 'info'); return; }
      GDATA = remote;
      saveG(GDATA);
      renderAdminList();
      renderGallery();
      toast('تم التحميل', 'success');
      updateHint();
    });
  });
  updateHint();
}

function resetForm(){
  var f = document.getElementById('gpxForm');
  if(!f) return;
  f.reset();
  document.getElementById('gpxEid').value = '';
  document.getElementById('gpxFT').textContent = 'إضافة صورة';
  document.getElementById('gpxSL').textContent = 'حفظ';
  document.getElementById('gpxCancel').style.display = 'none';
}

function renderAdminList(){
  var c = document.getElementById('gpxAdminList');
  var cnt = document.getElementById('gpxCount');
  if(cnt) cnt.textContent = GDATA.length;
  if(!c) return;
  if(!GDATA.length){ c.innerHTML = '<div class="admin-empty">لا توجد صور</div>'; return; }
  var html = '';
  for(var i=0; i<GDATA.length; i++){
    var it = GDATA[i];
    html += '<div class="admin-item">'
      + '<div class="admin-item__thumb"><img src="' + esc(it.image || gpxPlaceholder()) + '" alt=""></div>'
      + '<div class="admin-item__content">'
        + (it.category ? '<span class="admin-item__cat">' + esc(it.category) + '</span>' : '')
        + '<div class="admin-item__title">' + esc(it.title) + '</div>'
      + '</div>'
      + '<div class="admin-item__actions">'
        + '<button class="admin-item__btn" data-ged="' + esc(it.id) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
        + '<button class="admin-item__btn admin-item__btn--danger" data-gdl="' + esc(it.id) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
      + '</div>'
    + '</div>';
  }
  c.innerHTML = html;

  var eds = c.querySelectorAll('[data-ged]');
  for(var k=0; k<eds.length; k++){
    (function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-ged');
        var item = null;
        for(var x=0; x<GDATA.length; x++){ if(GDATA[x].id === id){ item = GDATA[x]; break; } }
        if(!item) return;
        document.getElementById('gpxEid').value = item.id;
        document.getElementById('gpxTitle').value = item.title;
        document.getElementById('gpxCat').value = item.category || '';
        document.getElementById('gpxImg').value = item.image;
        document.getElementById('gpxDesc').value = item.description || '';
        document.getElementById('gpxFT').textContent = 'تعديل';
        document.getElementById('gpxSL').textContent = 'حفظ';
        document.getElementById('gpxCancel').style.display = 'inline-flex';
        var pb = document.querySelector('.admin-panel__body');
        if(pb) pb.scrollTop = 0;
      });
    })(eds[k]);
  }

  var dls = c.querySelectorAll('[data-gdl]');
  for(var m=0; m<dls.length; m++){
    (function(b){
      b.addEventListener('click', function(){
        if(!confirm('حذف هذه الصورة؟')) return;
        var id = b.getAttribute('data-gdl');
        GDATA = GDATA.filter(function(g){ return g.id !== id; });
        saveG(GDATA);
        renderAdminList();
        renderGallery();
        toast('تم الحذف', 'success');
      });
    })(dls[m]);
  }
}

function updateHint(){
  var h = document.getElementById('gpxHint');
  if(!h) return;
  var tk = getToken();
  h.textContent = tk ? ('جاهز للنشر (' + GDATA.length + ')') : 'أدخل GitHub Token في الإعدادات';
  h.style.color = tk ? 'var(--signal-green)' : 'var(--signal-amber)';
}

/* ═══════ PWA BUTTON ═══════ */
function ensurePwa(){
  if(document.getElementById('pwaInstallBtn')) return;
  var isSA = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  if(isSA) return;

  var b = document.createElement('button');
  b.id = 'pwaInstallBtn';
  b.type = 'button';
  b.setAttribute('aria-label', 'تثبيت التطبيق');
  b.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:1500;display:grid;place-items:center;width:44px;height:44px;padding:0;background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border:0;cursor:pointer;border-radius:50%;box-shadow:0 8px 24px -6px rgba(201,163,78,.7)';
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:20px;height:20px"><path d="M12 3v12M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 21h14" stroke-linecap="round"/></svg>';

  var def = null;
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); def = e; });
  b.addEventListener('click', function(){
    if(def){ def.prompt(); def = null; return; }
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if(isIOS){ toast('للتثبيت: اضغط المشاركة ثم "إضافة إلى الشاشة"', 'info'); return; }
    toast('للتثبيت: افتح قائمة المتصفح ثم "تثبيت"', 'info');
  });
  window.addEventListener('appinstalled', function(){ b.remove(); });
  document.body.appendChild(b);
}

/* ═══════ INIT ═══════ */
function init(){
  injectCSS();
  applyMode(getMode());
  applyTheme(getTheme());
  injectThemeBtn();

  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(injectGallery()){ clearInterval(iv); renderGallery(); }
    else if(tries >= 40){ clearInterval(iv); }
  }, 150);

  var atries = 0;
  var aiv = setInterval(function(){
    atries++;
    if(injectAdminTab()){ clearInterval(aiv); }
    else if(atries >= 60){ clearInterval(aiv); }
  }, 500);

  setTimeout(ensurePwa, 1500);

  /* Fetch remote — only replace if remote has data AND local is empty or default */
  fetchRemote().then(function(r){
    if(r && r.length){
      var cur = loadG();
      var isDefault = cur.length === DEFAULTS.length && cur[0] && cur[0].id === 'g_d1';
      if(isDefault || !cur.length){
        GDATA = r;
        saveG(GDATA);
        renderGallery();
      }
    }
  });
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.__gpx = { gallery: function(){ return GDATA; }, refresh: renderGallery, theme: applyTheme };

})();
