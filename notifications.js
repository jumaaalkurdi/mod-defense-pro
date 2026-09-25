/* ══════════════════════════════════════════════════════════
   NOTIFICATIONS — النسخة النهائية الأخيرة
   🔴 شارة حمراء → ضغط → انتقال + 🟢 نقطة خضراء
   ⚪ بدون شارة → ضغط → تفعيل
   ✅ بدون رسائل مزعجة
   ══════════════════════════════════════════════════════════ */

(function(){
'use strict';

var KEY_ON = 'mod_notif_enabled';
var KEY_LAST = 'mod_notif_last_news_id';
var KEY_SUB = 'mod_notif_subscribed_at';

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function getOn(){ try { return localStorage.getItem(KEY_ON) === 'true'; } catch(e){ return false; } }
function setOn(v){ try { localStorage.setItem(KEY_ON, v ? 'true' : 'false'); } catch(e){} }
function getLast(){ try { return localStorage.getItem(KEY_LAST) || ''; } catch(e){ return ''; } }
function setLast(id){ try { localStorage.setItem(KEY_LAST, id || ''); } catch(e){} }

function toast(msg, type){
  try {
    var c = document.getElementById('toastContainer');
    if(!c) return;
    var el = document.createElement('div');
    el.className = 'toast toast--' + (type || 'info');
    el.innerHTML = '<span>' + esc(msg) + '</span>';
    c.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('is-show'); });
    setTimeout(function(){
      el.classList.remove('is-show');
      setTimeout(function(){ if(el.parentNode) el.remove(); }, 400);
    }, 2500);
  } catch(e){}
}

function getNews(){
  try {
    var raw = localStorage.getItem('mod_news_v7');
    if(raw){
      var arr = JSON.parse(raw);
      if(arr && arr.length) return arr;
    }
  } catch(e){}
  return [];
}
function getSorted(){
  return getNews().slice().sort(function(a, b){
    var ta = new Date(a.published_at || a.addedAt || 0).getTime();
    var tb = new Date(b.published_at || b.addedAt || 0).getTime();
    return tb - ta;
  });
}

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('notifStyles')) return;
  var css = ''
    + '.notify-wrap{position:relative !important;display:inline-flex !important;'
    + 'align-items:center !important;justify-content:center !important;'
    + 'width:40px !important;height:40px !important;flex:none !important}'
    + '.notify-wrap > .notify-btn{width:100% !important;height:100% !important;'
    + 'padding:0 !important;margin:0 !important;position:relative !important}'
    + '.notify-wrap .notify-btn.is-active::after{display:none !important}'
    /* الشارة الحمراء */
    + '.notify-wrap > .notif-badge{position:absolute !important;'
    + 'top:-2px !important;inset-inline-end:-2px !important;'
    + 'min-width:17px !important;height:17px !important;padding:0 4px !important;'
    + 'background:linear-gradient(135deg,#e11d2e,#b91c1c) !important;'
    + 'color:#fff !important;font-family:"Noto Kufi Arabic",sans-serif !important;'
    + 'font-size:10px !important;font-weight:800 !important;line-height:17px !important;'
    + 'text-align:center !important;border-radius:99px !important;'
    + 'border:2px solid #06070a !important;'
    + 'box-shadow:0 0 12px rgba(225,29,46,.9) !important;'
    + 'z-index:999 !important;pointer-events:none !important;'
    + 'box-sizing:border-box !important;'
    + 'animation:badgePulse 2s ease-in-out infinite !important}'
    + '@keyframes badgePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}'
    /* النقطة الخضراء */
    + '.notify-wrap > .notif-dot{position:absolute !important;'
    + 'top:6px !important;left:50% !important;transform:translateX(-50%) !important;'
    + 'width:6px !important;height:6px !important;background:#4ade80 !important;'
    + 'border-radius:50% !important;border:1px solid #06070a !important;'
    + 'box-shadow:0 0 5px rgba(74,222,128,.9),0 0 10px rgba(74,222,128,.4) !important;'
    + 'z-index:998 !important;pointer-events:none !important;'
    + 'box-sizing:border-box !important;'
    + 'animation:dotPulse 2.4s ease-in-out infinite !important}'
    + '@keyframes dotPulse{0%,100%{opacity:1;transform:translateX(-50%) scale(1)}'
    + '50%{opacity:.7;transform:translateX(-50%) scale(1.2)}}'
    + '@media (max-width:480px){'
    + '.notify-wrap{width:36px !important;height:36px !important}'
    + '.notify-wrap > .notif-badge{min-width:16px !important;height:16px !important;'
    + 'font-size:9.5px !important;line-height:16px !important}'
    + '.notify-wrap > .notif-dot{top:5px !important;width:5px !important;height:5px !important}}';
  var s = document.createElement('style');
  s.id = 'notifStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ الحالة الحالية ═══ */
function getState(){
  if(!getOn()) return 'off';
  var sorted = getSorted();
  if(!sorted.length) return 'off';
  var last = getLast();
  if(!last) return 'red';
  if(sorted[0].id === last) return 'green';
  return 'red';
}

/* ═══ RENDER ═══ */
function render(){
  try {
    var wrap = document.querySelector('.notify-wrap');
    if(!wrap) return;

    /* احذف القديم */
    var old = wrap.querySelectorAll('.notif-badge, .notif-dot');
    for(var i = 0; i < old.length; i++) old[i].remove();

    var state = getState();

    /* ⚪ موقوف → لا شيء */
    if(state === 'off') return;

    /* 🟢 كل شيء مقروء → نقطة خضراء */
    if(state === 'green'){
      var dot = document.createElement('span');
      dot.className = 'notif-dot';
      wrap.appendChild(dot);
      return;
    }

    /* 🔴 يوجد جديد → شارة حمراء */
    var sorted = getSorted();
    var last = getLast();
    var count = 0;
    if(!last){
      count = 1;
    } else {
      for(var j = 0; j < sorted.length; j++){
        if(sorted[j].id === last) break;
        count++;
      }
    }
    if(count === 0) count = 1;

    var badge = document.createElement('span');
    badge.className = 'notif-badge';
    badge.textContent = count > 9 ? '9+' : String(count);
    wrap.appendChild(badge);
  } catch(e){}
}

/* ═══ الانتقال للخبر ═══ */
function goToLatest(){
  try {
    var sorted = getSorted();
    if(!sorted.length) return false;
    var latest = sorted[0];

    /* احفظ كـ "مقروء" */
    setLast(latest.id);

    /* انتقل */
    if(window.__router && typeof window.__router.showPage === 'function'){
      window.__router.showPage('article', latest.id);
    } else {
      window.location.hash = 'article/' + latest.id;
    }

    /* حدّث الجرس بعد الانتقال */
    setTimeout(render, 300);
    return true;
  } catch(e){ return false; }
}

/* ═══ CLICK — بدون رسائل مزعجة ═══ */
function onClick(e){
  try {
    if(e){ e.preventDefault(); if(e.stopPropagation) e.stopPropagation(); }

    var state = getState();

    /* ⚪ موقوف → فعّل */
    if(state === 'off'){
      setOn(true);
      try { localStorage.setItem(KEY_SUB, String(Date.now())); } catch(e){}
      var btn = document.querySelector('.notify-btn');
      if(btn) btn.classList.add('is-active');
      render();
      toast('✅ تم تفعيل الإشعارات', 'success');
      return;
    }

    /* 🔴 جديد → انتقل للخبر */
    if(state === 'red'){
      goToLatest();
      /* ✅ بدون رسالة — الانتقال نفسه يكفي */
      return;
    }

    /* 🟢 كل شيء مقروء → افتح قائمة الخيارات */
    if(state === 'green'){
      openMenu();
      return;
    }
  } catch(err){ console.error('[notif]', err); }
}

/* ═══ HOOK ═══ */
function hook(){
  try {
    var wrap = document.querySelector('.notify-wrap');
    if(!wrap){
      var btn = document.getElementById('notifyBtn');
      if(btn && btn.parentNode && !btn.parentNode.classList.contains('notify-wrap')){
        var w = document.createElement('div');
        w.className = 'notify-wrap';
        btn.parentNode.insertBefore(w, btn);
        w.appendChild(btn);
        wrap = w;
      } else if(!btn){ return false; }
      else { wrap = btn.parentNode; }
    }
    if(!wrap) return false;

    var btn = wrap.querySelector('.notify-btn') || document.getElementById('notifyBtn');
    if(!btn) return false;
    if(btn.__hooked) return true;
    btn.__hooked = true;

    var clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    clone.addEventListener('click', onClick);

    if(getOn()) clone.classList.add('is-active');
    render();
    return true;
  } catch(e){ return false; }
}

/* ═══ AUTO CHECK — يراقب فقط ═══ */
function autoCheck(){
  try {
    if(!getOn()) return;
    var sorted = getSorted();
    if(!sorted.length) return;

    var last = getLast();
    var newest = sorted[0];

    if(!last){ render(); return; }

    if(newest.id !== last){
      render();
      var newItems = [];
      for(var i = 0; i < sorted.length; i++){
        if(sorted[i].id === last) break;
        newItems.push(sorted[i]);
      }
      if(newItems.length) showBanner(newItems);
    } else {
      render();
    }
  } catch(e){}
}

/* ═══ BANNER ═══ */
function showBanner(items){
  try {
    if(!items || !items.length) return;
    var old = document.getElementById('notifBanner');
    if(old) old.remove();

    var b = document.createElement('div');
    b.id = 'notifBanner';
    b.style.cssText = 'position:fixed;top:70px;inset-inline:16px;max-width:640px;margin-inline:auto;z-index:9999;padding:16px 18px;background:linear-gradient(135deg,rgba(201,163,78,.18),rgba(19,26,13,.98));backdrop-filter:blur(20px);border:1.5px solid #c9a34e;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));box-shadow:0 30px 80px -20px rgba(0,0,0,.95);display:flex;align-items:center;gap:14px;transform:translateY(-30px);opacity:0;transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .4s;';

    var count = items.length;
    var first = items[0];
    var title = count === 1
      ? (first.cat === 'breaking' ? '🚨 خبر عاجل' : '📰 خبر جديد')
      : '📢 ' + count + ' أخبار جديدة';

    b.innerHTML =
      '<div style="flex:none;width:44px;height:44px;display:grid;place-items:center;background:linear-gradient(135deg,#c9a34e,#e8c878);color:#06070a;border-radius:50%">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:22px;height:22px">'
      + '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>'
      + '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></div>'
      + '<div style="flex:1;min-width:0">'
      + '<div style="font-family:\'Noto Kufi Arabic\',sans-serif;font-weight:800;font-size:14px;color:#e8c878;margin-bottom:4px">' + esc(title) + '</div>'
      + '<div style="font-family:\'Noto Kufi Arabic\',sans-serif;font-size:12.5px;color:#b0ac95;line-height:1.6;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(first.title || '') + '</div>'
      + '</div>'
      + '<button type="button" id="notifBannerClose" style="flex:none;width:34px;height:34px;display:grid;place-items:center;background:rgba(0,0,0,.4);border:1px solid rgba(201,163,78,.3);color:#b0ac95;cursor:pointer">✕</button>';

    document.body.appendChild(b);
    requestAnimationFrame(function(){ b.style.transform = 'translateY(0)'; b.style.opacity = '1'; });

    b.querySelector('#notifBannerClose').addEventListener('click', function(){
      b.style.transform = 'translateY(-30px)';
      b.style.opacity = '0';
      setTimeout(function(){ if(b.parentNode) b.remove(); }, 400);
    });
    setTimeout(function(){
      if(b.parentNode){
        b.style.transform = 'translateY(-30px)';
        b.style.opacity = '0';
        setTimeout(function(){ if(b.parentNode) b.remove(); }, 400);
      }
    }, 12000);
  } catch(e){}
}

/* ═══ ACTIVATE BANNER ═══ */
function showActivate(){
  try {
    if(getOn()) return;
    if(sessionStorage.getItem('activate_hidden') === '1') return;
    if(document.getElementById('activateNotif')) return;

    var b = document.createElement('div');
    b.id = 'activateNotif';
    b.style.cssText = 'position:fixed;bottom:20px;inset-inline:20px;max-width:520px;margin-inline:auto;z-index:1580;padding:14px 16px;background:linear-gradient(135deg,rgba(201,163,78,.2),rgba(13,17,8,.97));backdrop-filter:blur(20px);border:1.5px solid #c9a34e;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));box-shadow:0 20px 60px -20px rgba(0,0,0,.95);display:flex;align-items:center;gap:12px';

    b.innerHTML =
      '<div style="flex:none;width:42px;height:42px;display:grid;place-items:center;background:linear-gradient(135deg,#c9a34e,#e8c878);color:#06070a;border-radius:50%">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" style="width:22px;height:22px"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'
      + '</div>'
      + '<div style="flex:1;min-width:0">'
      + '<div style="font-family:\'Noto Kufi Arabic\',sans-serif;font-weight:800;font-size:13.5px;color:#e8c878;margin-bottom:3px">🔔 فعّل الإشعارات</div>'
      + '<div style="font-family:\'Noto Kufi Arabic\',sans-serif;font-size:11.5px;color:#b0ac95">ليصلك كل خبر جديد فوراً</div>'
      + '</div>'
      + '<button type="button" id="activateBtn" style="padding:10px 16px;font-family:\'Noto Kufi Arabic\',sans-serif;font-weight:800;font-size:12.5px;background:linear-gradient(135deg,#c9a34e,#e8c878);color:#06070a;border:0;cursor:pointer">تفعيل</button>'
      + '<button type="button" id="activateClose" style="flex:none;width:32px;height:32px;display:grid;place-items:center;background:rgba(0,0,0,.4);border:1px solid rgba(201,163,78,.3);color:#b0ac95;cursor:pointer">✕</button>';

    document.body.appendChild(b);

    b.querySelector('#activateBtn').addEventListener('click', function(){
      setOn(true);
      try { localStorage.setItem(KEY_SUB, String(Date.now())); } catch(e){}
      b.remove();
      var btn = document.querySelector('.notify-btn');
      if(btn) btn.classList.add('is-active');
      render();
      toast('✅ تم تفعيل الإشعارات', 'success');
    });
    b.querySelector('#activateClose').addEventListener('click', function(){
      b.remove();
      sessionStorage.setItem('activate_hidden', '1');
    });
    setTimeout(function(){ if(b.parentNode) b.remove(); }, 20000);
  } catch(e){}
}


/* ═══ قائمة الخيارات ═══ */
function openMenu(){
  try {
    /* احذف القائمة القديمة */
    var old = document.getElementById('notifMenu');
    if(old) old.remove();

    /* أبعاد الزر */
    var wrap = document.querySelector('.notify-wrap');
    if(!wrap) return;
    var rect = wrap.getBoundingClientRect();

    var menu = document.createElement('div');
    menu.id = 'notifMenu';

    /* موضع القائمة */
    var menuWidth = 240;
    var left = rect.right - menuWidth;
    if(left < 10) left = 10;

    menu.style.cssText = 'position:fixed;'
      + 'top:' + (rect.bottom + 8) + 'px;'
      + 'left:' + left + 'px;'
      + 'width:' + menuWidth + 'px;'
      + 'background:linear-gradient(160deg,#131a0d,#0a0d05);'
      + 'border:1.5px solid #c9a34e;'
      + 'clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));'
      + 'box-shadow:0 20px 60px -15px rgba(0,0,0,.98);'
      + 'z-index:99999;'
      + 'padding:6px;'
      + 'opacity:0;'
      + 'transform:translateY(-8px);'
      + 'transition:opacity .2s,transform .2s;';

    menu.innerHTML = ''
      + '<button type="button" id="notifMenuCancel" style="width:100%;display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(185,28,28,.1);border:1px solid rgba(225,29,46,.35);color:#ff7d89;font-family:\'Noto Kufi Arabic\',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-align:start;margin-bottom:6px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:16px;height:16px;flex:none">'
      + '<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>'
      + '<span>إلغاء تفعيل الإشعارات</span>'
      + '</button>'
      + '<button type="button" id="notifMenuClose" style="width:100%;display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(0,0,0,.4);border:1px solid rgba(201,163,78,.2);color:#b0ac95;font-family:\'Noto Kufi Arabic\',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-align:start;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:16px;height:16px;flex:none">'
      + '<path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '<span>إغلاق</span>'
      + '</button>';

    document.body.appendChild(menu);

    /* إظهار */
    requestAnimationFrame(function(){
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0)';
    });

    /* زر إلغاء التفعيل */
    menu.querySelector('#notifMenuCancel').addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      if(confirm('هل تريد إلغاء تفعيل الإشعارات؟')){
        setOn(false);
        var btn = document.querySelector('.notify-btn');
        if(btn) btn.classList.remove('is-active');
        render();
        toast('🔕 تم إلغاء تفعيل الإشعارات', 'info');
      }
      closeMenu();
    });

    /* زر إغلاق */
    menu.querySelector('#notifMenuClose').addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });

    /* إغلاق عند الضغط خارج القائمة */
    setTimeout(function(){
      function outside(ev){
        var m = document.getElementById('notifMenu');
        var w = document.querySelector('.notify-wrap');
        if(!m){ document.removeEventListener('click', outside); return; }
        if(m.contains(ev.target)) return;
        if(w && w.contains(ev.target)) return;
        closeMenu();
        document.removeEventListener('click', outside);
      }
      document.addEventListener('click', outside);
    }, 100);

  } catch(e){ console.error('[menu]', e); }
}

function closeMenu(){
  try {
    var m = document.getElementById('notifMenu');
    if(!m) return;
    m.style.opacity = '0';
    m.style.transform = 'translateY(-8px)';
    setTimeout(function(){ if(m.parentNode) m.remove(); }, 200);
  } catch(e){}
}

/* ═══ INIT ═══ */
function init(){
  try {
    injectCSS();
    var t = 0;
    var iv = setInterval(function(){
      t++;
      if(hook() || t >= 60) clearInterval(iv);
    }, 250);

    setTimeout(function(){
      var btn = document.querySelector('.notify-btn');
      if(btn && getOn()) btn.classList.add('is-active');
      render();
    }, 500);

    setTimeout(autoCheck, 1500);
    setTimeout(render, 2000);
    setInterval(autoCheck, 5000);
    setInterval(render, 3000);

    window.addEventListener('storage', function(e){
      if(e.key === 'mod_news_v7' || e.key === 'mod_notif_last_news_id'){
        setTimeout(autoCheck, 200);
      }
    });

    document.addEventListener('visibilitychange', function(){
      if(!document.hidden) setTimeout(autoCheck, 500);
    });

    setTimeout(showActivate, 4000);
  } catch(e){}
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__notif = {
  _ready: true,
  isEnabled: getOn,
  enable: function(){ setOn(true); render(); return true; },
  disable: function(){ setOn(false); render(); return true; },
  check: autoCheck,
  showBanner: showBanner,
  render: render,
  getState: getState,
  reset: function(){
    try {
      localStorage.removeItem(KEY_LAST);
      localStorage.removeItem(KEY_SUB);
    } catch(e){}
    render();
    return true;
  }
};

})();
