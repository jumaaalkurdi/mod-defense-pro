/* ══════════════════════════════════════════════════════════
   FAB MANAGER — إدارة أزرار التحويم
   يجمع ⬆️ to-top و 🤖 AI في مجموعة واحدة
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

function ensureGroup(){
  try {
    /* إذا المجموعة موجودة — تأكد من محتواها */
    var group = document.getElementById('aiFabGroup');
    if(!group){
      group = document.createElement('div');
      group.id = 'aiFabGroup';
      group.className = 'fab-group';
      document.body.appendChild(group);
    }

    /* انقل زر to-top */
    var toTop = document.getElementById('toTop');
    if(toTop && toTop.parentNode !== group){
      group.insertBefore(toTop, group.firstChild);
    }

    /* انقل زر AI */
    var aiFab = document.getElementById('aiFab');
    if(aiFab && aiFab.parentNode !== group){
      group.appendChild(aiFab);
    }

    /* تأكد من أن to-top أول عنصر */
    if(toTop && group.firstChild !== toTop && toTop.parentNode === group){
      group.insertBefore(toTop, group.firstChild);
    }

    return true;
  } catch(e){ return false; }
}

/* تشغيل متكرر لضمان الاستقرار */
function loop(){
  ensureGroup();
}

/* التنفيذ */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', loop);
} else {
  loop();
}

/* محاولات متعددة لضمان التقاط الأزرار */
setTimeout(loop, 300);
setTimeout(loop, 800);
setTimeout(loop, 1500);
setTimeout(loop, 3000);

/* مراقبة مستمرة (في حال أعاد app.js بناء الزر) */
setInterval(loop, 2000);

/* إذا أُضيف عنصر جديد للـ body */
if(window.MutationObserver){
  var mo = new MutationObserver(function(muts){
    /* فقط إذا أُضيف عنصر خارج المجموعة */
    var needCheck = false;
    for(var i = 0; i < muts.length; i++){
      var m = muts[i];
      if(m.type === 'childList' && m.addedNodes.length){
        for(var j = 0; j < m.addedNodes.length; j++){
          var n = m.addedNodes[j];
          if(n.nodeType === 1){
            if(n.id === 'toTop' || n.id === 'aiFab' || n.className === 'ai-fab'){
              needCheck = true;
              break;
            }
          }
        }
      }
      if(needCheck) break;
    }
    if(needCheck) setTimeout(loop, 50);
  });
  mo.observe(document.body, { childList: true, subtree: false });
}

window.__fabManager = { ensure: ensureGroup, refresh: loop };

})();
