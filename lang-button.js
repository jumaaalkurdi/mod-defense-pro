/* ══════════════════════════════════════════════════════════
   LANGUAGE BUTTON v3 — استجابة فورية بدون قفل
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var cachedBtn = null;

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('langBtnStyles')) return;
  var css = [
    '.lang-btn{width:40px;height:40px;display:grid;place-items:center;',
    'border:1px solid var(--line-2);background:rgba(201,163,78,.05);',
    'color:var(--gold-2);clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);',
    'transition:background .2s,border-color .2s,color .2s,transform .1s;cursor:pointer;',
    'font-family:"Noto Kufi Arabic","IBM Plex Sans Arabic",sans-serif;',
    'font-weight:800;font-size:14px;line-height:1;position:relative;flex:none;padding:0;',
    '-webkit-tap-highlight-color:transparent;user-select:none;touch-action:manipulation;',
    'z-index:10;pointer-events:auto}',
    '.lang-btn:hover{background:rgba(201,163,78,.15);border-color:var(--gold);color:var(--gold-3)}',
    '.lang-btn:active{transform:scale(.92)}',
    '.lang-btn__code{display:block;letter-spacing:.5px;pointer-events:none}',
    '.lang-btn::after{content:"";position:absolute;bottom:3px;right:3px;width:5px;height:5px;',
    'border-radius:50%;background:var(--gold);opacity:.55;transition:opacity .2s,transform .2s;pointer-events:none}',
    '.lang-btn:hover::after{opacity:1;transform:scale(1.3)}',
    '.lang-btn .lang-btn__ring{position:absolute;inset:-4px;border-radius:50%;',
    'border:1.5px solid var(--gold);opacity:0;pointer-events:none}',
    '.lang-btn.is-pulse .lang-btn__ring{animation:langRing .8s ease-out}',
    '@keyframes langRing{0%{opacity:.8;transform:scale(.6)}100%{opacity:0;transform:scale(1.4)}}',
    '.lang-btn.is-en{background:linear-gradient(135deg,rgba(201,163,78,.18),rgba(201,163,78,.05));border-color:var(--gold)}',
    '@media (max-width:768px){.lang-btn{width:36px;height:36px;font-size:13px}',
    '.lang-btn::after{width:4px;height:4px;bottom:2px;right:2px}}',
    '@media (max-width:480px){.lang-btn{width:34px;height:34px;font-size:12px}}'
  ].join('');
  var s = document.createElement('style');
  s.id = 'langBtnStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ GET LANG ═══ */
function getLang(){
  try {
    if(window.__i18n && window.__i18n.getLang) return window.__i18n.getLang();
  } catch(e){}
  try { return localStorage.getItem('mod_lang_v1') || 'ar'; } catch(e){ return 'ar'; }
}

/* ═══ RENDER ═══ */
function render(btn){
  if(!btn) return;
  var code = btn.querySelector('.lang-btn__code');
  if(!code) return;
  var l = getLang();
  var want = (l === 'en') ? 'EN' : '\u0639';
  if(code.textContent !== want) code.textContent = want;
  var isEn = (l === 'en');
  if(btn.classList.contains('is-en') !== isEn) btn.classList.toggle('is-en', isEn);
}

/* ═══ TOAST ═══ */
function showToast(msg, isEn){
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var el = document.createElement('div');
  el.className = 'toast toast--success';
  el.setAttribute('dir', isEn ? 'ltr' : 'rtl');
  el.innerHTML = '<span>' + msg + '</span>';
  c.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('is-show'); });
  setTimeout(function(){
    el.classList.remove('is-show');
    setTimeout(function(){ el.remove(); }, 400);
  }, 2000);
}

/* ═══ APPLY TOGGLE — fire and forget ═══ */
function toggle(){
  var cur = getLang();
  var next = (cur === 'en') ? 'ar' : 'en';

  /* Update button state immediately */
  var btn = cachedBtn || document.getElementById('langBtn');
  if(btn){
    var code = btn.querySelector('.lang-btn__code');
    if(code) code.textContent = (next === 'en') ? 'EN' : '\u0639';
    if(next === 'en') btn.classList.add('is-en');
    else btn.classList.remove('is-en');
    btn.classList.add('is-pulse');
    setTimeout(function(){ btn.classList.remove('is-pulse'); }, 800);
  }

  /* Fire i18n change - non-blocking */
  try {
    if(window.__i18n && window.__i18n.setLang){
      window.__i18n.setLang(next);
    } else {
      try { localStorage.setItem('mod_lang_v1', next); } catch(e){}
    }
  } catch(e){}

  /* Toast */
  showToast(next === 'en' ? 'Language: English' : '\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629', next === 'en');

  /* Confirm visual after i18n finishes */
  setTimeout(function(){ render(cachedBtn); }, 150);
}

/* ═══ CLICK HANDLER ═══ */
function onPress(e){
  if(e){
    if(e.cancelable) e.preventDefault();
    if(e.stopPropagation) e.stopPropagation();
  }
  toggle();
}

/* ═══ INJECT BUTTON ═══ */
function inject(){
  var ha = document.querySelector('.header__actions');
  if(!ha) return false;
  if(cachedBtn && cachedBtn.parentNode === ha) return true;

  var existing = document.getElementById('langBtn');
  if(existing){
    cachedBtn = existing;
    render(existing);
    return true;
  }

  var btn = document.createElement('button');
  btn.id = 'langBtn';
  btn.type = 'button';
  btn.className = 'lang-btn';
  btn.setAttribute('aria-label', 'Toggle language');

  /* Build inner structure */
  var code = document.createElement('span');
  code.className = 'lang-btn__code';
  code.textContent = '\u0639';
  var ring = document.createElement('span');
  ring.className = 'lang-btn__ring';
  btn.appendChild(code);
  btn.appendChild(ring);

  /* Use pointerdown for instant response on mobile */
  var supportsPointer = ('onpointerdown' in window);
  if(supportsPointer){
    btn.addEventListener('pointerdown', onPress);
  } else {
    /* Fallback for old browsers */
    btn.addEventListener('touchstart', onPress, { passive: false });
    btn.addEventListener('mousedown', onPress);
  }
  /* Prevent 300ms delay on iOS */
  btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); });

  /* Insert before notifyBtn (bell) */
  var nb = document.getElementById('notifyBtn');
  if(nb && nb.parentNode === ha){
    ha.insertBefore(btn, nb);
  } else if(ha.firstChild){
    ha.insertBefore(btn, ha.firstChild);
  } else {
    ha.appendChild(btn);
  }
  cachedBtn = btn;
  render(btn);
  return true;
}

/* ═══ INIT ═══ */
function init(){
  injectCSS();
  if(!inject()){
    var tries = 0;
    var iv = setInterval(function(){
      tries++;
      if(inject() || tries >= 40) clearInterval(iv);
    }, 150);
  }

  /* Sync when user clicks language buttons in theme panel */
  document.addEventListener('click', function(e){
    if(e.target && e.target.closest && e.target.closest('[data-lang-choice]')){
      setTimeout(function(){ render(cachedBtn); }, 200);
    }
  }, true);

  /* Sync on page show */
  window.addEventListener('pageshow', function(){
    setTimeout(function(){ render(cachedBtn); }, 100);
  });

  /* Periodic sync every 3 seconds — safety net */
  setInterval(function(){ render(cachedBtn); }, 3000);
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__langBtn = { refresh: function(){ render(cachedBtn); } };

})();
