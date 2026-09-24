(function(){
'use strict';

if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: '/' })
      .then(reg => {
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if(!nw) return;
          nw.addEventListener('statechange', () => {
            if(nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner();
          });
        });
      }).catch(() => {});
  });
}

function showUpdateBanner(){
  if(document.getElementById('pwaUpdateBanner')) return;
  const b = document.createElement('div');
  b.id = 'pwaUpdateBanner';
  b.style.cssText = 'position:fixed;bottom:80px;inset-inline-start:20px;z-index:2000;padding:14px 18px;background:linear-gradient(135deg,#0d1108,#06070a);border:1px solid rgba(201,163,78,.5);color:#fff;font-family:"Noto Kufi Arabic",sans-serif;font-size:13px;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));display:flex;align-items:center;gap:12px;box-shadow:0 20px 50px -15px rgba(0,0,0,.9);max-width:320px;';
  b.innerHTML = '<span>🔄 إصدار جديد متوفر</span><button id="pwaUpdateBtn" style="padding:7px 14px;background:linear-gradient(135deg,#c9a34e,#e8c878);color:#06070a;border:0;font-family:inherit;font-weight:800;font-size:12px;cursor:pointer;">تحديث</button>';
  document.body.appendChild(b);
  document.getElementById('pwaUpdateBtn').addEventListener('click', () => {
    if(navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  });
}

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; showInstallButton(); });
window.addEventListener('appinstalled', () => { hideInstallButton(); deferredPrompt = null; });

function isStandalone(){ return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; }

function showInstallButton(){
  if(isStandalone()) return;
  if(document.getElementById('pwaInstallBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'pwaInstallBtn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'تثبيت التطبيق');
  btn.style.cssText = 'position:fixed;bottom:26px;inset-inline-start:26px;z-index:1500;display:flex;align-items:center;gap:10px;padding:14px 22px;background:linear-gradient(135deg,#c9a34e,#e8c878);color:#06070a;border:0;font-family:"Noto Kufi Arabic",sans-serif;font-weight:800;font-size:14px;cursor:pointer;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);box-shadow:0 15px 40px -10px rgba(201,163,78,.7);transition:transform .3s;';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:20px;height:20px;"><path d="M12 3v12M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 21h14" stroke-linecap="round"/></svg><span>تثبيت التطبيق</span>';
  btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
  btn.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    try { const c = await deferredPrompt.userChoice; if(c.outcome === 'accepted') hideInstallButton(); } catch(e){}
    deferredPrompt = null;
  });
  document.body.appendChild(btn);
}

function hideInstallButton(){ const b = document.getElementById('pwaInstallBtn'); if(b) b.remove(); }

document.addEventListener('DOMContentLoaded', () => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if(isIOS && !isStandalone()){
    const dismissed = sessionStorage.getItem('ios_install_dismissed');
    if(!dismissed && !deferredPrompt) setTimeout(showIOSHint, 8000);
  }
});

function showIOSHint(){
  if(document.getElementById('pwaIOSHint')) return;
  const b = document.createElement('div');
  b.id = 'pwaIOSHint';
  b.style.cssText = 'position:fixed;bottom:26px;inset-inline:20px;z-index:1500;padding:16px 18px;background:linear-gradient(135deg,#0d1108,#06070a);border:1px solid rgba(201,163,78,.5);color:#fff;font-family:"Noto Kufi Arabic",sans-serif;font-size:13px;line-height:1.7;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));display:flex;gap:12px;box-shadow:0 20px 50px -15px rgba(0,0,0,.9);';
  b.innerHTML = '<div style="flex:1;"><strong style="color:#e8c878;">📱 ثبّت التطبيق</strong><br>اضغط زر المشاركة <strong>↗</strong> ثم اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></div><button id="pwaIOSClose" style="padding:6px 12px;background:rgba(201,163,78,.15);color:#e8c878;border:1px solid rgba(201,163,78,.4);font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;height:32px;align-self:flex-start;">✕</button>';
  document.body.appendChild(b);
  document.getElementById('pwaIOSClose').addEventListener('click', () => { b.remove(); sessionStorage.setItem('ios_install_dismissed', 'true'); });
}

window.addEventListener('online', () => { if(window.__app && window.__app.toast) window.__app.toast('✅ عاد الاتصال بالإنترنت', 'success'); });
window.addEventListener('offline', () => { if(window.__app && window.__app.toast) window.__app.toast('⚠️ انقطع الاتصال — أنت في وضع Offline', 'info'); });

})();
