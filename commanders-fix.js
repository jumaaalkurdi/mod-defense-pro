/* ══════════════════════════════════════════════════════════
   COMMANDERS FIX v2 — إخفاء الشعار عند وجود صورة
   ✅ يعمل في الرئيسية + صفحة التفاصيل
   ✅ لا يلمس commanders.js
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('cmdrFixStyles')) return;
  var css = ''

    /* ═══ بطاقات القادة (الرئيسية) ═══ */
    + '.cmdr-card__media:has(> img) .cmdr-card__placeholder{'
    + 'display:none !important;visibility:hidden !important;opacity:0 !important;}'
    + '.cmdr-card__media.has-image .cmdr-card__placeholder{'
    + 'display:none !important;visibility:hidden !important;opacity:0 !important;}'
    + '.cmdr-card__media img{'
    + 'z-index:2 !important;position:absolute !important;inset:0 !important;'
    + 'width:100% !important;height:100% !important;object-fit:cover !important;'
    + 'object-position:center top !important;}'

    /* ═══ صفحة التفاصيل ═══ */
    + '.cmdr-detail__photo:has(> img) > div:first-child{'
    + 'display:none !important;visibility:hidden !important;opacity:0 !important;}'
    + '.cmdr-detail__photo.has-image > div:first-child{'
    + 'display:none !important;visibility:hidden !important;opacity:0 !important;}'
    + '.cmdr-detail__photo > img{'
    + 'z-index:2 !important;position:relative !important;'
    + 'width:100% !important;height:100% !important;object-fit:cover !important;'
    + 'border-radius:50% !important;}'
    + '.cmdr-detail__photo > div:first-child{'
    + 'z-index:1 !important;}';
  var s = document.createElement('style');
  s.id = 'cmdrFixStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ الرئيسية — بطاقات القادة ═══ */
function fixCards(){
  try {
    var medias = document.querySelectorAll('.cmdr-card__media');
    for(var i = 0; i < medias.length; i++){
      var media = medias[i];
      var img = media.querySelector('img');
      var placeholder = media.querySelector('.cmdr-card__placeholder');
      if(!img || !placeholder) continue;
      if(img.complete && img.naturalWidth > 0 && img.style.display !== 'none'){
        media.classList.add('has-image');
        placeholder.style.display = 'none';
      } else if(img.complete && img.naturalWidth > 0){
        media.classList.add('has-image');
        placeholder.style.display = 'none';
      } else {
        img.addEventListener('load', function(){
          media.classList.add('has-image');
          if(placeholder) placeholder.style.display = 'none';
        }, { once: true });
        img.addEventListener('error', function(){
          media.classList.remove('has-image');
          if(placeholder) placeholder.style.display = '';
        }, { once: true });
      }
    }
  } catch(e){}
}

/* ═══ صفحة التفاصيل — القائد ═══ */
function fixDetailPage(){
  try {
    var photos = document.querySelectorAll('.cmdr-detail__photo');
    for(var i = 0; i < photos.length; i++){
      var photoDiv = photos[i];
      var img = photoDiv.querySelector('img');
      var fallback = photoDiv.querySelector('div:first-child');
      if(!img || !fallback) continue;

      /* في حالة الصورة محمّلة */
      if(img.complete && img.naturalWidth > 0 && img.style.display !== 'none'){
        photoDiv.classList.add('has-image');
        fallback.style.display = 'none';
      } else {
        /* مراقبة التحميل */
        img.addEventListener('load', function(){
          photoDiv.classList.add('has-image');
          if(fallback) fallback.style.display = 'none';
        }, { once: true });

        img.addEventListener('error', function(){
          photoDiv.classList.remove('has-image');
          if(fallback) fallback.style.display = '';
        }, { once: true });

        /* في حالة كانت محمّلة بالفعل */
        if(img.complete && img.naturalWidth > 0){
          photoDiv.classList.add('has-image');
          fallback.style.display = 'none';
        }
      }
    }
  } catch(e){}
}

/* ═══ التطبيق الشامل ═══ */
function applyFix(){
  fixCards();
  fixDetailPage();
}

/* ═══ المراقب ═══ */
function startObserver(){
  if(!window.MutationObserver) return;
  var mo = new MutationObserver(function(muts){
    var needsFix = false;
    for(var i = 0; i < muts.length; i++){
      var m = muts[i];
      if(m.type === 'childList' && m.addedNodes.length){
        for(var j = 0; j < m.addedNodes.length; j++){
          var n = m.addedNodes[j];
          if(n.nodeType === 1){
            if(n.classList && (n.classList.contains('cmdr-card') || 
               n.classList.contains('cmdr-detail') ||
               n.classList.contains('cmdr-grid') ||
               n.classList.contains('cmdr-detail__photo'))){
              needsFix = true;
              break;
            }
            if(n.querySelector && (n.querySelector('.cmdr-card') || n.querySelector('.cmdr-detail__photo'))){
              needsFix = true;
              break;
            }
          }
        }
      }
      if(needsFix) break;
    }
    if(needsFix) setTimeout(applyFix, 100);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* ═══ Hash change — لصفحة التفاصيل ═══ */
function watchHash(){
  window.addEventListener('hashchange', function(){
    setTimeout(applyFix, 300);
    setTimeout(applyFix, 800);
    setTimeout(applyFix, 1500);
  });
}

/* ═══ INIT ═══ */
function init(){
  injectCSS();

  setTimeout(applyFix, 500);
  setTimeout(applyFix, 1500);
  setTimeout(applyFix, 3000);
  setInterval(applyFix, 2000);

  startObserver();
  watchHash();
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__cmdrFix = {
  apply: applyFix,
  cards: fixCards,
  detail: fixDetailPage,
  reinject: injectCSS
};

})();
