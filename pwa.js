/* =========================================================
   PWA — Service Worker + Install + iOS + Online/Offline
   ========================================================= */
(function(){
'use strict';

/* ============ SERVICE WORKER REGISTER ============ */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {

    /* امسح SW القديمة */
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister());
    });

    /* امسح Caches القديمة */
    caches.keys().then(keys => {
      keys.forEach(k => caches.delete(k));
    });

    /* سجّل SW جديد بدون banner */
    setTimeout(() => {
      navigator.serviceWorker.register('sw.js?v=' + Date.now(), { scope: '/' })
        .then(reg => {
          /* لا يُظهر أي banner عند التحديث */
        })
        .catch(() => {});
    }, 500);
  });
}

/* ============ INSTALL PROMPT (Android / Desktop) ============ */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

window.addEventListener('appinstalled', () => {
  hideInstallButton();
  deferredPrompt = null;
});

function isStandalone(){
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         (document.referrer && document.referrer.indexOf('android-app://') === 0);
}

function showInstallButton(){
  if(isStandalone()) return;
  if(document.getElementById('pwaInstallBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'pwaInstallBtn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'تثبيت التطبيق');
  btn.title = 'تثبيت التطبيق';
  btn.style.cssText = 'position:fixed;bottom:30px;left:20px;z-index:1500;display:flex;align-items:center;justify-content:center;width:42px;height:42px;padding:0;background:linear-gradient(135deg,#c9a34e,#e8c878);color:#06070a;border:0;cursor:pointer;border-radius:50%;box-shadow:0 8px 24px -6px rgba(201,163,78,.7);transition:transform .3s;';

  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:20px;height:20px;"><path d="M12 3v12M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 21h14" stroke-linecap="round"/></svg>';

  btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

  btn.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    try{
      const c = await deferredPrompt.userChoice;
      if(c.outcome === 'accepted') hideInstallButton();
    }catch(e){}
    deferredPrompt = null;
  });

  document.body.appendChild(btn);
}

function hideInstallButton(){
  const b = document.getElementById('pwaInstallBtn');
  if(b) b.remove();
}

/* ============ iOS HINT ============ */
document.addEventListener('DOMContentLoaded', () => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if(isIOS && !isStandalone()){
    const dismissed = sessionStorage.getItem('ios_install_dismissed');
    if(!dismissed && !deferredPrompt){
      setTimeout(showIOSHint, 8000);
    }
  }
});

function showIOSHint(){
  if(document.getElementById('pwaIOSHint')) return;
  const b = document.createElement('div');
  b.id = 'pwaIOSHint';
  b.style.cssText = 'position:fixed;bottom:20px;inset-inline:20px;z-index:1500;padding:14px 16px;background:linear-gradient(135deg,#0d1108,#06070a);border:1px solid rgba(201,163,78,.5);color:#fff;font-family:"Noto Kufi Arabic",sans-serif;font-size:12.5px;line-height:1.6;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));display:flex;gap:10px;box-shadow:0 20px 50px -15px rgba(0,0,0,.9);';
  b.innerHTML = '<div style="flex:1;"><strong style="color:#e8c878;">📱 ثبّت التطبيق</strong><br>اضغط زر المشاركة <strong>↗</strong> ثم <strong>"إضافة إلى الشاشة الرئيسية"</strong></div><button id="pwaIOSClose" style="padding:4px 10px;background:rgba(201,163,78,.15);color:#e8c878;border:1px solid rgba(201,163,78,.4);font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;height:28px;align-self:flex-start;border-radius:6px;">✕</button>';
  document.body.appendChild(b);
  document.getElementById('pwaIOSClose').addEventListener('click', () => {
    b.remove();
    sessionStorage.setItem('ios_install_dismissed', 'true');
  });
}

/* ============ ONLINE / OFFLINE ============ */
window.addEventListener('online', () => {
  if(window.__app && window.__app.toast) window.__app.toast('✅ عاد الاتصال بالإنترنت', 'success');
});
window.addEventListener('offline', () => {
  if(window.__app && window.__app.toast) window.__app.toast('⚠️ انقطع الاتصال — أنت في وضع Offline', 'info');
});

})();
