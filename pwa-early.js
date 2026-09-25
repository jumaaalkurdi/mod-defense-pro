/* ══════════════════════════════════════════════════════════
   PWA EARLY CAPTURE — التقاط حدث التثبيت مبكراً
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

window.__deferredInstallPrompt = null;
window.__installEventFired = false;

window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault();
  window.__deferredInstallPrompt = e;
  window.__installEventFired = true;
  if(typeof window.__onInstallReady === 'function'){
    try { window.__onInstallReady(e); } catch(_){}
  }
});

window.addEventListener('appinstalled', function(){
  window.__deferredInstallPrompt = null;
  window.__installEventFired = false;
  var b = document.getElementById('pwaInstallBtn');
  if(b) b.remove();
});

})();
