(function(){
'use strict';

var STYLE_ID = 'enhanceFixStyles';
var SECTION_ID = 'channelsSection';

/* ═══ CSS — قواعد ثابتة ومتسقة ═══ */
function injectCSS(){
  if(document.getElementById(STYLE_ID)) return;
  var css = ''
    /* فرض ظهور العناوين */
    + '.gpx-section .gpx-head,.vpx-section .vpx-head,'
    + '.gpx-section .section__eyebrow,.vpx-section .section__eyebrow,'
    + '.gpx-section .section__title,.vpx-section .section__title{'
    +   'opacity:1 !important;transform:none !important;visibility:visible !important;'
    + '}'

    /* إخفاء widget القنوات القديم من الـ sidebar — على كل المقاسات */
    + '.sidebar .widget:has(.official){display:none !important}'
    + '.sidebar .widget.hide-channels-widget{display:none !important}'

    /* قسم القنوات */
    + '.channels-section{position:relative;z-index:1}'
    + '.channels-grid{display:grid;grid-template-columns:1fr;gap:16px}'

    /* سطح المكتب: 4 أعمدة */
    + '@media (min-width:900px){.channels-grid{grid-template-columns:repeat(4,1fr);gap:18px}}'
    /* تابلت: عمودان */
    + '@media (min-width:600px) and (max-width:899px){.channels-grid{grid-template-columns:repeat(2,1fr)}}'

    /* بطاقة القناة */
    + '.channel-card{display:flex;align-items:center;gap:16px;padding:20px 22px;'
    +   'background:rgba(19,26,13,.9);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);'
    +   'border:1px solid var(--line);text-decoration:none;color:inherit;'
    +   'clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));'
    +   'transition:all .4s cubic-bezier(.16,1,.3,1)}'
    + '.channel-card:hover{transform:translateY(-4px);border-color:var(--line-3);'
    +   'box-shadow:0 20px 50px -20px rgba(0,0,0,.9),0 0 30px -10px rgba(201,163,78,.4)}'
    + '.channel-card__icon{flex:none;width:52px;height:52px;display:grid;place-items:center;'
    +   'background:linear-gradient(135deg,rgba(201,163,78,.18),rgba(201,163,78,.05));'
    +   'border:1.5px solid var(--line-2);color:var(--gold-2);'
    +   'clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);transition:transform .4s}'
    + '.channel-card:hover .channel-card__icon{transform:scale(1.1) rotate(-3deg)}'
    + '.channel-card__icon svg{width:24px;height:24px}'
    + '.channel-card__body{flex:1;min-width:0}'
    + '.channel-card__label{font-family:"Noto Kufi Arabic",sans-serif;font-size:12.5px;'
    +   'color:var(--text-3);margin-bottom:4px;font-weight:600}'
    + '.channel-card__value{font-family:"Noto Kufi Arabic",sans-serif;font-size:14.5px;'
    +   'color:var(--gold-2);font-weight:800;letter-spacing:.3px;direction:ltr;text-align:right;word-break:break-all}'
    + '.channel-card--tg .channel-card__icon{color:#4db8ff;border-color:rgba(0,136,204,.4);'
    +   'background:linear-gradient(135deg,rgba(0,136,204,.2),rgba(0,136,204,.05))}'
    + '.channel-card--tg .channel-card__value{color:#4db8ff}'
    + '.channel-card--x .channel-card__icon{color:#fff;border-color:rgba(255,255,255,.3);'
    +   'background:linear-gradient(135deg,rgba(255,255,255,.15),rgba(255,255,255,.03))}'

    /* جوال — تقليل الحشو */
    + '@media (max-width:768px){'
    +   '.channels-grid{gap:12px}'
    +   '.channel-card{padding:16px 18px;gap:14px}'
    +   '.channel-card__icon{width:46px;height:46px}'
    +   '.channel-card__icon svg{width:20px;height:20px}'
    +   '.channel-card__value{font-size:13.5px}'
    + '}';
  var s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ فرض ظهور العناوين ═══ */
function forceTitles(){
  var sels = ['.gpx-section .gpx-head','.vpx-section .vpx-head',
              '.gpx-section .section__eyebrow','.vpx-section .section__eyebrow',
              '.gpx-section .section__title','.vpx-section .section__title'];
  for(var s=0; s<sels.length; s++){
    var els = document.querySelectorAll(sels[s]);
    for(var i=0; i<els.length; i++){
      els[i].classList.add('is-in');
      els[i].style.setProperty('opacity','1','important');
      els[i].style.setProperty('transform','none','important');
      els[i].style.setProperty('visibility','visible','important');
    }
  }
}

/* ═══ إخفاء widget القنوات من الشريط الجانبي ═══ */
function hideSidebarChannels(){
  var widgets = document.querySelectorAll('.sidebar .widget');
  for(var i=0; i<widgets.length; i++){
    var w = widgets[i];
    if(w.textContent.indexOf('قنوات رسمية') > -1 ||
       w.querySelector('.official')){
      w.classList.add('hide-channels-widget');
      w.style.setProperty('display','none','important');
    }
  }
}

/* ═══ بناء قسم القنوات ═══ */
function buildChannels(){
  var existing = document.getElementById(SECTION_ID);
  if(existing){
    // موجود مسبقاً — تأكد أن grids يتم
    return;
  }
  var gpx = document.getElementById('gpxSection');
  if(!gpx) return;
  var sec = document.createElement('section');
  sec.id = SECTION_ID;
  sec.className = 'section channels-section';
  sec.innerHTML = ''
    + '<div class="container">'
    +   '<header class="section__bar reveal is-in" style="opacity:1;transform:none">'
    +     '<div>'
    +       '<span class="section__eyebrow">تواصل معنا</span>'
    +       '<h2 class="section__title">القنوات الرسمية</h2>'
    +     '</div>'
    +   '</header>'
    +   '<div class="channels-grid">'
    +     '<a class="channel-card" href="tel:+963110000000">'
    +       '<div class="channel-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" stroke-linejoin="round"/></svg></div>'
    +       '<div class="channel-card__body"><div class="channel-card__label">الخط الساخن</div><div class="channel-card__value">+963 11 000 0000</div></div>'
    +     '</a>'
    +     '<a class="channel-card" href="mailto:info@mod.gov.sy">'
    +       '<div class="channel-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
    +       '<div class="channel-card__body"><div class="channel-card__label">البريد الرسمي</div><div class="channel-card__value">info@mod.gov.sy</div></div>'
    +     '</a>'
    +     '<a class="channel-card channel-card--tg" href="https://t.me/mod_defense_sy" target="_blank" rel="noopener">'
    +       '<div class="channel-card__icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 3 2 11l5.6 2.3L20 6 9.5 15.4 10 20l3-3.3L18.5 20 22 3Z"/></svg></div>'
    +       '<div class="channel-card__body"><div class="channel-card__label">Telegram</div><div class="channel-card__value">@mod_defense_sy</div></div>'
    +     '</a>'
    +     '<a class="channel-card channel-card--x" href="https://x.com/mod_defense_sy" target="_blank" rel="noopener">'
    +       '<div class="channel-card__icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 3H21l-6.6 7.6L22 21h-6.3l-4.6-6-5.3 6H3l7-8L2.3 3H8.7l4.2 5.5L18.2 3Zm-1.1 16h1.7L7 4.9H5.1L17.1 19Z"/></svg></div>'
    +       '<div class="channel-card__body"><div class="channel-card__label">X (Twitter)</div><div class="channel-card__value">@mod_defense_sy</div></div>'
    +     '</a>'
    +   '</div>'
    + '</div>';
  gpx.parentNode.insertBefore(sec, gpx.nextSibling);
}

/* ═══ INIT ═══ */
function run(){
  injectCSS();
  forceTitles();
  hideSidebarChannels();
  buildChannels();
}

var tries = 0;
var iv = setInterval(function(){
  tries++;
  run();
  if(tries >= 25) clearInterval(iv);
}, 400);

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
else run();

window.addEventListener('load', function(){
  setTimeout(run, 300);
  setTimeout(run, 1200);
  setTimeout(run, 3000);
});

/* مراقبة الإضافات الديناميكية */
if(window.MutationObserver){
  var obs = new MutationObserver(function(){ hideSidebarChannels(); });
  obs.observe(document.body, { childList:true, subtree:true });
}

window.__enhance = { refresh: run };
})();
