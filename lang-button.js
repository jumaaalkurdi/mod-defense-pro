/* ══════════════════════════════════════════════════════════
   LANGUAGE BUTTON v2 — استجابة فورية بدون إعادة بناء
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var busy = false;
var cachedBtn = null;

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('langBtnStyles')) return;
  var css = [
    '.lang-btn{width:40px;height:40px;display:grid;place-items:center;',
    'border:1px solid var(--line-2);background:rgba(201,163,78,.05);',
    'color:var(--gold-2);clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);',
    'transition:background .25s,border-color .25s,color .25s;cursor:pointer;',
    'font-family:"Noto Kufi Arabic","IBM Plex Sans Arabic",sans-serif;',
    'font-weight:800;font-size:14px;line-height:1;position:relative;flex:none;padding:0;',
    '-webkit-tap-highlight-color:transparent;user-select:none}',
    '.lang-btn:hover{background:rgba(201,163,78,.15);border-color:var(--gold);color:var(--gold-3)}',
    '.lang-btn:active{transform:scale(.94)}',
    '.lang-btn__code{display:block;letter-spacing:.5px;pointer-events:none;will-change:contents}',
    '.lang-btn::after{content:"";position:absolute;bottom:3px;right:3px;width:5px;height:5px;',
    'border-radius:50%;background:var(--gold);opacity:.55;transition:opacity .25s,transform .25s}',
    '.lang-btn:hover::after{opacity:1;transform:scale(1.3)}',
    '.lang-btn .lang-btn__ring{position:absolute;inset:-4px;border-radius:50%;',
    'border:1.5px solid var(--gold);opacity:0;pointer-events:none}',
    '.lang-btn.is-pulse .lang-btn__ring{animation:langRing 1s ease-out}',
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

/* ═══ GET CURRENT LANG ═══ */
function getLang(){
  try {
    if(window.__i18n && typeof window.__i18n.getLang === 'function'){
      return window.__i18n.getLang();
    }
  } catch(e){}
  return 'ar';
}

/* ═══ ENSURE STRUCTURE (once) ═══ */
function ensureStructure(btn){
  if(!btn) return null;
  var codeEl = btn.querySelector('.lang-btn__code');
  if(!codeEl){
    /* Build structure once */
    while(btn.firstChild) btn.removeChild(btn.firstChild);
    var c = document.createElement('span');
    c.className = 'lang-btn__code';
    c.textContent = '\u0639'; /* ع */
    var r = document.createElement('span');
    r.className = 'lang-btn__ring';
    btn.appendChild(c);
    btn.appendChild(r);
    codeEl = c;
  }
  return codeEl;
}

/* ═══ RENDER (fast: only textContent + class) ═══ */
function render(btn){
  if(!btn) return;
  var codeEl = ensureStructure(btn);
  if(!codeEl) return;
  var lang = getLang();
  var newText = (lang === 'en') ? 'EN' : '\u0639';
  /* Only touch textContent if different — avoids DOM churn */
  if(codeEl.textContent !== newText) codeEl.textContent = newText;
  var isEn = (lang === 'en');
  if(btn.classList.contains('is-en') !== isEn){
    btn.classList.toggle('is-en', isEn);
  }
  var label = isEn ? 'Switch to Arabic / \u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0639\u0631\u0628\u064a\u0629' : 'Switch to English / \u0627\u0644\u062a\u0628\u062f\u064a\u0644 \u0644\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629';
  if(btn.getAttribute('aria-label') !== label){
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }
}

/* ═══ TOAST ═══ */
function showToast(msg, lang){
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var el = document.createElement('div');
  el.className = 'toast toast--success';
  el.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  el.innerHTML = '<span>' + msg + '</span>';
  c.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('is-show'); });
  setTimeout(function(){
    el.classList.remove('is-show');
    setTimeout(function(){ el.remove(); }, 400);
  }, 2200);
}

/* ═══ CLICK HANDLER ═══ */
function handleClick(e, btn){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  if(busy){ return; }
  busy = true;

  /* Immediate visual feedback */
  btn.classList.add('is-pulse');
  setTimeout(function(){ btn.classList.remove('is-pulse'); }, 1000);

  if(!window.__i18n){ busy = false; return; }

  var cur = getLang();
  var next = (cur === 'en') ? 'ar' : 'en';

  /* Optimistic update: show new state immediately */
  var codeEl = btn.querySelector('.lang-btn__code');
  if(codeEl) codeEl.textContent = (next === 'en') ? 'EN' : '\u0639';
  if(next === 'en') btn.classList.add('is-en');
  else btn.classList.remove('is-en');

  /* Now actually set the lang (this may take a moment) */
  try {
    window.__i18n.setLang(next);
  } catch(err){}

  /* Confirm final state after i18n finishes */
  setTimeout(function(){
    render(btn);
    showToast(next === 'en' ? 'Language: English' : '\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629', next);
  }, 120);

  /* Release lock */
  setTimeout(function(){ busy = false; }, 500);
}

/* ═══ INJECT ═══ */
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
  btn.addEventListener('click', function(e){ handleClick(e, btn); });

  var nb = document.getElementById('notifyBtn');
  if(nb && nb.parentNode === ha){
    ha.insertBefore(btn, nb);
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
    var t = e.target;
    if(!t || !t.closest) return;
    if(t.closest('[data-lang-choice]')){
      setTimeout(function(){
        var btn = document.getElementById('langBtn');
        if(btn) render(btn);
      }, 200);
    }
  }, true);

  /* Sync on page show (mobile back/forward) */
  window.addEventListener('pageshow', function(){
    setTimeout(function(){
      var btn = document.getElementById('langBtn');
      if(btn) render(btn);
    }, 100);
  });
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__langBtn = { refresh: function(){ var b = document.getElementById('langBtn'); if(b) render(b); } };

})();
