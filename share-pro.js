/* ══════════════════════════════════════════════════════════
   SHARE PRO v5 — تصميم أسطوري + إصلاح X
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var TEXTS = {
  ar: {
    share: 'مشاركة', shareOn: 'شارك الخبر', whatsapp: 'واتساب',
    telegram: 'تيليجرام', twitter: 'X (تويتر)', facebook: 'فيسبوك',
    copy: 'نسخ الرابط', copied: '✅ تم نسخ الرابط', copyFailed: '❌ تعذّر النسخ',
    cancel: 'إلغاء', via: 'عبر المركز الإعلامي', choose: 'اختر منصة المشاركة'
  },
  en: {
    share: 'Share', shareOn: 'Share this news', whatsapp: 'WhatsApp',
    telegram: 'Telegram', twitter: 'X (Twitter)', facebook: 'Facebook',
    copy: 'Copy Link', copied: '✅ Link copied', copyFailed: '❌ Copy failed',
    cancel: 'Cancel', via: 'via Media Center', choose: 'Choose platform'
  }
};

function getLang(){ try { return (document.documentElement.getAttribute('lang') === 'en') ? 'en' : 'ar'; } catch(e){ return 'ar'; } }
function t(k){ var d = TEXTS[getLang()] || TEXTS.ar; return d[k] || TEXTS.ar[k] || k; }

function esc(s){
  return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function toast(msg, type){
  try {
    var c = document.getElementById('toastContainer');
    if(!c){ c = document.createElement('div'); c.id = 'toastContainer'; c.style.cssText = 'position:fixed;top:80px;inset-inline-start:20px;z-index:99999'; document.body.appendChild(c); }
    var el = document.createElement('div');
    el.className = 'toast toast--' + (type || 'info');
    el.innerHTML = '<span>' + esc(msg) + '</span>';
    c.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('is-show'); });
    setTimeout(function(){ el.classList.remove('is-show'); setTimeout(function(){ if(el.parentNode) el.remove(); }, 400); }, 3000);
  } catch(e){}
}

/* ══════════════════════════════════════════════════════════
   CSS — التصميم الأسطوري
   ══════════════════════════════════════════════════════════ */
function injectCSS(){
  if(document.getElementById('shareProStyles')) return;
  var css = ''

    /* ═══ الزر في الفوتر ═══ */
    + '.news-card__media > .share-btn{display:none !important}'
    + '.news-card__foot{display:flex !important;align-items:center !important;justify-content:space-between !important;gap:10px !important}'
    + '.share-btn-foot{flex:none !important;width:34px !important;height:34px !important;display:grid !important;place-items:center !important;background:rgba(201,163,78,.08) !important;border:1px solid rgba(201,163,78,.3) !important;border-radius:50% !important;color:var(--gold-2,#e8c878) !important;cursor:pointer !important;padding:0 !important;transition:all .3s cubic-bezier(.16,1,.3,1) !important;margin-inline-start:auto !important}'
    + '.share-btn-foot svg{width:16px !important;height:16px !important}'
    + '.share-btn-foot:hover{background:linear-gradient(135deg,var(--gold,#c9a34e),var(--gold-2,#e8c878)) !important;color:#06070a !important;border-color:var(--gold,#c9a34e) !important;transform:scale(1.1) !important}'
    + '.share-btn-foot:active{transform:scale(.92) !important}'

    /* ═══ نافذة المشاركة — تصميم أسطوري ═══ */
    + '.share-modal{position:fixed;inset:0;z-index:9999;background:rgba(3,4,6,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:none;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .3s}'
    + '.share-modal.is-open{display:flex;opacity:1}'

    /* الصندوق الرئيسي */
    + '.share-modal__box{position:relative;width:100%;max-width:420px;background:linear-gradient(160deg,#131a0d,#0a0d05 60%,#06070a);border:1px solid rgba(201,163,78,.4);border-radius:24px;padding:0;overflow:hidden;box-shadow:0 40px 100px -30px rgba(0,0,0,1),0 0 80px -30px rgba(201,163,78,.5),inset 0 0 60px rgba(201,163,78,.04);transform:scale(.9);transition:transform .35s cubic-bezier(.16,1,.3,1)}'
    + '.share-modal.is-open .share-modal__box{transform:scale(1)}'

    /* إطار علوي ذهبي */
    + '.share-modal__box::before{content:"";position:absolute;top:0;inset-inline:0;height:2px;background:linear-gradient(90deg,transparent,rgba(201,163,78,.9) 20%,rgba(245,224,165,1) 50%,rgba(201,163,78,.9) 80%,transparent);z-index:1;pointer-events:none}'
    /* إطار سفلي */
    + '.share-modal__box::after{content:"";position:absolute;bottom:0;inset-inline:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,163,78,.4),transparent);pointer-events:none}'

    /* توهج خلفي */
    + '.share-modal__box::before, .share-modal__glow::before{content:""}'
    + '.share-modal__glow{position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:300px;height:300px;background:radial-gradient(circle,rgba(201,163,78,.15),transparent 70%);pointer-events:none;z-index:0}'

    /* الرأس */
    + '.share-modal__head{position:relative;z-index:2;padding:24px 24px 18px;text-align:center}'

    /* أيقونة كبيرة */
    + '.share-modal__icon{width:60px;height:60px;margin:0 auto 14px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(201,163,78,.18),rgba(201,163,78,.05));border:1.5px solid rgba(201,163,78,.4);border-radius:50%;color:var(--gold-2,#e8c878);position:relative;box-shadow:0 0 40px -8px rgba(201,163,78,.5)}'
    + '.share-modal__icon::before{content:"";position:absolute;inset:-4px;border:1px solid rgba(201,163,78,.2);border-radius:50%;animation:shareIconPulse 2.5s ease-in-out infinite}'
    + '@keyframes shareIconPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.08);opacity:.2}}'
    + '.share-modal__icon svg{width:28px;height:28px;position:relative;z-index:1}'

    /* العنوان */
    + '.share-modal__title{font-family:"Noto Kufi Arabic",sans-serif;font-weight:800;font-size:15.5px;color:#fff;margin-bottom:6px;line-height:1.45;padding:0 8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 2px 12px rgba(0,0,0,.7)}'
    + '.share-modal__sub{font-family:"Noto Kufi Arabic",sans-serif;font-size:11.5px;color:rgba(201,163,78,.7);letter-spacing:1.5px;text-transform:uppercase;font-weight:700}'

    /* زر الإغلاق — تم إصلاحه */
    + '.share-modal__close{position:absolute;top:16px;inset-inline-end:16px;z-index:10;width:36px;height:36px;display:grid;place-items:center;background:rgba(0,0,0,.5);border:1px solid rgba(201,163,78,.3);color:#e8c878;border-radius:50%;cursor:pointer;padding:0;transition:all .3s cubic-bezier(.16,1,.3,1);-webkit-tap-highlight-color:transparent}'
    + '.share-modal__close svg{width:16px;height:16px;display:block;stroke:currentColor;pointer-events:none}'
    + '.share-modal__close:hover{background:rgba(225,29,46,.2);border-color:rgba(225,29,46,.6);color:#ff7d89;transform:rotate(90deg)}'
    + '.share-modal__close:active{transform:rotate(90deg) scale(.9)}'

    /* فاصل */
    + '.share-modal__divider{height:1px;margin:0 24px 18px;background:linear-gradient(90deg,transparent,rgba(201,163,78,.3) 30%,rgba(201,163,78,.3) 70%,transparent);position:relative;z-index:2}'

    /* الشبكة */
    + '.share-modal__body{position:relative;z-index:2;padding:0 22px 24px}'
    + '.share-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}'

    /* بطاقة منصة */
    + '.share-option{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 10px;background:linear-gradient(145deg,rgba(19,26,13,.9),rgba(6,7,10,.95));border:1px solid rgba(201,163,78,.18);border-radius:14px;cursor:pointer;text-decoration:none;font-family:"Noto Kufi Arabic",sans-serif;font-size:12px;font-weight:700;color:var(--text,#e8e4d5);transition:all .3s cubic-bezier(.16,1,.3,1);overflow:hidden;border:0;padding:16px 10px;min-height:82px;justify-content:center}'
    + '.share-option::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.1),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none}'
    + '.share-option:hover{transform:translateY(-3px);border-color:var(--gold,#c9a34e)}'
    + '.share-option:hover::before{opacity:1}'
    + '.share-option:active{transform:translateY(-1px) scale(.98)}'

    /* أيقونة المنصة */
    + '.share-option__icon{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.08);transition:all .3s;position:relative;z-index:1}'
    + '.share-option__icon svg{width:22px;height:22px;transition:transform .3s}'
    + '.share-option:hover .share-option__icon svg{transform:scale(1.15)}'
    + '.share-option span{position:relative;z-index:1;letter-spacing:.3px}'

    /* ألوان المنصات */
    + '.share-option--whatsapp .share-option__icon{background:linear-gradient(135deg,rgba(37,211,102,.15),rgba(37,211,102,.03));border-color:rgba(37,211,102,.3)}'
    + '.share-option--whatsapp .share-option__icon svg{color:#25d366}'
    + '.share-option--whatsapp:hover{background:linear-gradient(145deg,rgba(37,211,102,.15),rgba(6,7,10,.95));border-color:#25d366;box-shadow:0 8px 24px -8px rgba(37,211,102,.5)}'
    + '.share-option--whatsapp span{color:#5eff9a}'

    + '.share-option--telegram .share-option__icon{background:linear-gradient(135deg,rgba(0,136,204,.15),rgba(0,136,204,.03));border-color:rgba(0,136,204,.3)}'
    + '.share-option--telegram .share-option__icon svg{color:#0088cc}'
    + '.share-option--telegram:hover{background:linear-gradient(145deg,rgba(0,136,204,.15),rgba(6,7,10,.95));border-color:#0088cc;box-shadow:0 8px 24px -8px rgba(0,136,204,.5)}'
    + '.share-option--telegram span{color:#4db8ff}'

    + '.share-option--twitter .share-option__icon{background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.02));border-color:rgba(255,255,255,.2)}'
    + '.share-option--twitter .share-option__icon svg{color:#fff}'
    + '.share-option--twitter:hover{background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(6,7,10,.95));border-color:rgba(255,255,255,.5);box-shadow:0 8px 24px -8px rgba(255,255,255,.3)}'
    + '.share-option--twitter span{color:#fff}'

    + '.share-option--facebook .share-option__icon{background:linear-gradient(135deg,rgba(24,119,242,.15),rgba(24,119,242,.03));border-color:rgba(24,119,242,.3)}'
    + '.share-option--facebook .share-option__icon svg{color:#1877f2}'
    + '.share-option--facebook:hover{background:linear-gradient(145deg,rgba(24,119,242,.15),rgba(6,7,10,.95));border-color:#1877f2;box-shadow:0 8px 24px -8px rgba(24,119,242,.5)}'
    + '.share-option--facebook span{color:#5ea5ff}'

    /* زر Native — واسع */
    + '.share-option--native{grid-column:1/-1;flex-direction:row;justify-content:center;min-height:auto;padding:14px 20px;background:linear-gradient(135deg,var(--gold,#c9a34e),var(--gold-2,#e8c878));color:#06070a;border:1px solid var(--gold,#c9a34e)}'
    + '.share-option--native .share-option__icon{background:rgba(0,0,0,.15);border-color:rgba(0,0,0,.1);width:auto;height:auto;padding:0;border:0}'
    + '.share-option--native .share-option__icon svg{width:18px;height:18px;color:#06070a}'
    + '.share-option--native span{font-size:13.5px;font-weight:800}'
    + '.share-option--native:hover{transform:translateY(-2px);box-shadow:0 12px 30px -8px rgba(201,163,78,.8);background:linear-gradient(135deg,var(--gold-2,#e8c878),var(--gold-3,#f5e0a5))}'

    /* زر Copy — واسع */
    + '.share-option--copy{grid-column:1/-1;flex-direction:row;justify-content:center;min-height:auto;padding:14px 20px;background:linear-gradient(145deg,rgba(19,26,13,.9),rgba(6,7,10,.95));border:1px solid rgba(201,163,78,.35)}'
    + '.share-option--copy .share-option__icon{background:linear-gradient(135deg,rgba(201,163,78,.15),rgba(201,163,78,.03));border-color:rgba(201,163,78,.3);width:auto;height:auto;padding:6px 8px;border-radius:8px}'
    + '.share-option--copy .share-option__icon svg{width:16px;height:16px;color:var(--gold-2,#e8c878)}'
    + '.share-option--copy span{color:var(--gold-2,#e8c878);font-size:13px;font-weight:800}'
    + '.share-option--copy:hover{border-color:var(--gold,#c9a34e);background:linear-gradient(145deg,rgba(201,163,78,.12),rgba(6,7,10,.95));box-shadow:0 8px 24px -8px rgba(201,163,78,.4)}'

    /* ═══ جوال ═══ */
    + '@media (max-width:480px){'
    + '.share-modal__box{max-width:100%;border-radius:20px}'
    + '.share-modal__head{padding:20px 18px 14px}'
    + '.share-modal__icon{width:52px;height:52px;margin-bottom:10px}'
    + '.share-modal__icon svg{width:24px;height:24px}'
    + '.share-modal__title{font-size:14px}'
    + '.share-modal__divider{margin:0 18px 14px}'
    + '.share-modal__body{padding:0 16px 20px}'
    + '.share-grid{gap:8px}'
    + '.share-option{padding:12px 8px;min-height:76px;font-size:11.5px}'
    + '.share-option__icon{width:38px;height:38px}'
    + '.share-option__icon svg{width:20px;height:20px}'
    + '.share-modal__close{top:12px;inset-inline-end:12px;width:32px;height:32px}'
    + '.share-modal__close svg{width:14px;height:14px}'
    + '}'

    + '@media (prefers-reduced-motion: reduce){'
    + '.share-modal,.share-modal__box,.share-option,.share-btn-foot,.share-modal__close{transition:none !important}'
    + '.share-modal__icon::before{animation:none !important}'
    + '}';

  var s = document.createElement('style');
  s.id = 'shareProStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ الأيقونات ═══ */
var ICONS = {
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 3.9M15.4 6.6 8.6 10.5" stroke-linecap="round"/></svg>',
  shareBig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 3.9M15.4 6.6 8.6 10.5" stroke-linecap="round"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.04-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.2-.24-.6-.48-.5-.67-.5-.17 0-.37-.03-.57-.03-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.07 4.49.7.3 1.26.49 1.7.62.7.23 1.35.2 1.86.12.57-.09 1.75-.72 2-1.4.25-.7.25-1.3.17-1.4-.07-.12-.27-.19-.57-.34Z"/><path d="M12 2a10 10 0 0 0-8.5 15.3l-1.34 4.9 5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.66 0-3.28-.45-4.7-1.3l-.34-.2-3.36.87.9-3.28-.22-.34A8.2 8.2 0 1 1 12 20.2Z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 3 2 11l5.6 2.3L20 6 9.5 15.4 10 20l3-3.3L18.5 20 22 3Z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 3H21l-6.6 7.6L22 21h-6.3l-4.6-6-5.3 6H3l7-8L2.3 3H8.7l4.2 5.5L18.2 3Zm-1.1 16h1.7L7 4.9H5.1L17.1 19Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-linecap="round"/></svg>',
  native: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>'
};

/* ═══ بناء النافذة ═══ */
function buildShareModal(){
  var old = document.getElementById('shareProModal');
  if(old) old.remove();

  var modal = document.createElement('div');
  modal.className = 'share-modal';
  modal.id = 'shareProModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div class="share-modal__box">'
    + '<div class="share-modal__glow"></div>'
    + '<button type="button" class="share-modal__close" aria-label="' + esc(t('cancel')) + '">' + ICONS.close + '</button>'
    + '<div class="share-modal__head">'
    + '<div class="share-modal__icon">' + ICONS.shareBig + '</div>'
    + '<h3 class="share-modal__title" id="shareProTitle"></h3>'
    + '<p class="share-modal__sub">' + esc(t('via')) + '</p>'
    + '</div>'
    + '<div class="share-modal__divider"></div>'
    + '<div class="share-modal__body">'
    + '<div class="share-grid" id="shareProGrid"></div>'
    + '</div>'
    + '</div>';

  document.body.appendChild(modal);
  return modal;
}

function renderShareOptions(url, title, modal){
  var grid = modal.querySelector('#shareProGrid');
  if(!grid) return;

  var safeUrl = encodeURIComponent(url);
  var safeTitle = encodeURIComponent(title + ' — ' + t('via'));
  var currentUrl = window.location.href;

  var options = [];

  if(navigator.share){
    options.push({ cls: 'share-option--native', icon: ICONS.native, text: t('share'), action: function(){ navigator.share({ title: title, text: t('via'), url: currentUrl }).catch(function(){}); } });
  }

  options.push({ cls: 'share-option--whatsapp', icon: ICONS.whatsapp, text: t('whatsapp'), href: 'https://wa.me/?text=' + safeTitle + '%20' + safeUrl, target: '_blank' });
  options.push({ cls: 'share-option--telegram', icon: ICONS.telegram, text: t('telegram'), href: 'https://t.me/share/url?url=' + safeUrl + '&text=' + safeTitle, target: '_blank' });
  options.push({ cls: 'share-option--twitter', icon: ICONS.twitter, text: t('twitter'), href: 'https://twitter.com/intent/tweet?url=' + safeUrl + '&text=' + safeTitle, target: '_blank' });
  options.push({ cls: 'share-option--facebook', icon: ICONS.facebook, text: t('facebook'), href: 'https://www.facebook.com/sharer/sharer.php?u=' + safeUrl, target: '_blank' });
  options.push({ cls: 'share-option--copy', icon: ICONS.copy, text: t('copy'), action: function(){ copyToClipboard(currentUrl); } });

  var html = '';
  options.forEach(function(opt, i){
    var inner = '<span class="share-option__icon">' + opt.icon + '</span><span>' + esc(opt.text) + '</span>';
    if(opt.href){
      html += '<a class="share-option ' + opt.cls + '" data-share-idx="' + i + '" href="' + opt.href + '"' + (opt.target ? ' target="' + opt.target + '" rel="noopener"' : '') + '>' + inner + '</a>';
    } else {
      html += '<button type="button" class="share-option ' + opt.cls + '" data-share-idx="' + i + '">' + inner + '</button>';
    }
  });
  grid.innerHTML = html;

  var btns = grid.querySelectorAll('button[data-share-idx]');
  for(var j = 0; j < btns.length; j++){
    (function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var opt = options[parseInt(btn.getAttribute('data-share-idx'), 10)];
        if(opt && typeof opt.action === 'function') opt.action();
      });
    })(btns[j]);
  }
}

function copyToClipboard(text){
  try {
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ toast(t('copied'), 'success'); }).catch(function(){ legacyCopy(text); });
    } else { legacyCopy(text); }
  } catch(e){ legacyCopy(text); }
}

function legacyCopy(text){
  try {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = document.execCommand('copy');
    ta.remove();
    toast(ok ? t('copied') : t('copyFailed'), ok ? 'success' : 'error');
  } catch(e){ toast(t('copyFailed'), 'error'); }
}

function openShare(url, title){
  var modal = buildShareModal();
  renderShareOptions(url, title, modal);
  var titleEl = modal.querySelector('#shareProTitle');
  if(titleEl) titleEl.textContent = title;

  requestAnimationFrame(function(){ modal.classList.add('is-open'); });
  document.body.classList.add('no-scroll');

  function close(){
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function(){ if(modal.parentNode) modal.remove(); }, 300);
    document.removeEventListener('keydown', onEsc);
  }
  function onEsc(e){ if(e.key === 'Escape') close(); }

  modal.querySelector('.share-modal__close').addEventListener('click', close);
  modal.addEventListener('click', function(e){ if(e.target === modal) close(); });
  document.addEventListener('keydown', onEsc);
}

/* ═══ إضافة الأزرار للبطاقات ═══ */
function addShareButtons(){
  try {
    /* احذف الأزرار القديمة */
    document.querySelectorAll('.news-card__media > .share-btn, .news-card > .share-btn').forEach(function(b){ b.remove(); });

    /* احذف التكرار في الفوتر */
    document.querySelectorAll('.news-card__foot').forEach(function(foot){
      var btns = foot.querySelectorAll('.share-btn-foot');
      for(var i = 1; i < btns.length; i++) btns[i].remove();
    });

    /* أضف الأزرار الجديدة */
    var cards = document.querySelectorAll('.news-card');
    for(var i = 0; i < cards.length; i++){
      (function(card){
        if(card.querySelector('.news-card__foot > .share-btn-foot')) return;

        var titleEl = card.querySelector('.news-card__title');
        var linkEl = card.querySelector('a[data-article]');
        if(!linkEl) return;

        var articleId = linkEl.getAttribute('data-article');
        var title = titleEl ? titleEl.textContent.trim() : '';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'share-btn-foot';
        btn.setAttribute('aria-label', t('share'));
        btn.setAttribute('title', t('share'));
        btn.innerHTML = ICONS.share;

        var foot = card.querySelector('.news-card__foot');
        if(foot) foot.appendChild(btn);

        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var url = window.location.origin + window.location.pathname + '#article/' + encodeURIComponent(articleId);
          openShare(url, title);
        });
      })(cards[i]);
    }
  } catch(e){ console.error('[share-pro]', e); }
}

function watchChanges(){
  if(!window.MutationObserver) return;
  var mo = new MutationObserver(function(){ setTimeout(addShareButtons, 200); });
  mo.observe(document.body, { childList: true, subtree: true });
}

function init(){
  try {
    injectCSS();
    console.log('[Share PRO v5] ✅ Ready');

    setTimeout(addShareButtons, 500);
    setTimeout(addShareButtons, 1500);
    setTimeout(addShareButtons, 3000);
    setInterval(addShareButtons, 5000);

    window.addEventListener('hashchange', function(){
      setTimeout(addShareButtons, 300);
      setTimeout(addShareButtons, 1000);
    });

    watchChanges();
  } catch(e){ console.error('[Share PRO v5]', e); }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__sharePro = {
  version: '5.0',
  open: openShare,
  refresh: addShareButtons,
  clean: function(){
    document.querySelectorAll('.share-btn, .share-btn-foot').forEach(function(b){ b.remove(); });
    addShareButtons();
  }
};

})();
