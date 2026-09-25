/* ══════════════════════════════════════════════════════════
   AI ASSISTANT — النسخة النظيفة النهائية
   محرك محلي فقط — بدون API — يعمل لكل الزوار
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var KEY_HISTORY = 'mod_ai_history';
var MAX_HISTORY = 20;

var state = {
  open: false,
  busy: false,
  messages: [],
  lang: 'ar',
  speaking: false,
  listening: false
};

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

function loadHistory(){
  try {
    var raw = localStorage.getItem(KEY_HISTORY);
    if(raw){ var arr = JSON.parse(raw); if(Array.isArray(arr)) return arr.slice(-MAX_HISTORY); }
  } catch(e){}
  return [];
}
function saveHistory(){
  try { localStorage.setItem(KEY_HISTORY, JSON.stringify(state.messages.slice(-MAX_HISTORY))); } catch(e){}
}

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('aiStyles')) return;
  var css = ''
    /* Floating Button */
    + '.ai-fab{position:fixed;bottom:20px;inset-inline-start:20px;z-index:1500;'
    + 'width:56px;height:56px;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,var(--gold),var(--gold-2));'
    + 'color:var(--combat-black);border:0;border-radius:50%;cursor:pointer;'
    + 'box-shadow:0 10px 30px -8px rgba(201,163,78,.9),0 0 0 0 rgba(201,163,78,.6);'
    + 'transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s;'
    + 'animation:aiFabPulse 3s ease-in-out infinite}'
    + '.ai-fab:hover{transform:scale(1.1)}'
    + '.ai-fab:active{transform:scale(.95)}'
    + '.ai-fab svg{width:26px;height:26px;transition:transform .3s}'
    + '.ai-fab.is-open svg{transform:rotate(45deg)}'
    + '@keyframes aiFabPulse{'
    + '0%,100%{box-shadow:0 10px 30px -8px rgba(201,163,78,.9),0 0 0 0 rgba(201,163,78,.6)}'
    + '50%{box-shadow:0 10px 30px -8px rgba(201,163,78,.9),0 0 0 12px rgba(201,163,78,0)}}'

    /* Panel */
    + '.ai-panel{position:fixed;bottom:90px;inset-inline-start:20px;z-index:1501;'
    + 'width:420px;max-width:calc(100vw - 40px);max-height:min(80vh,700px);'
    + 'background:linear-gradient(160deg,#131a0d,#0a0d05);'
    + 'border:1.5px solid var(--gold);'
    + 'clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px));'
    + 'box-shadow:0 30px 80px -20px rgba(0,0,0,.98),0 0 60px -20px rgba(201,163,78,.4);'
    + 'display:flex;flex-direction:column;overflow:hidden;'
    + 'opacity:0;transform:translateY(20px) scale(.95);pointer-events:none;'
    + 'transition:opacity .35s cubic-bezier(.16,1,.3,1),transform .35s cubic-bezier(.16,1,.3,1)}'
    + '.ai-panel.is-open{opacity:1;transform:none;pointer-events:auto}'
    + '.ai-panel::before{content:"";position:absolute;top:0;inset-inline:0;height:2px;'
    + 'background:linear-gradient(90deg,transparent,var(--gold),var(--gold-2),var(--gold),transparent);z-index:1}'

    /* Header */
    + '.ai-head{flex:none;padding:14px 18px;border-bottom:1px solid var(--line);'
    + 'display:flex;align-items:center;gap:12px;position:relative}'
    + '.ai-head__icon{width:36px;height:36px;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,rgba(201,163,78,.2),rgba(201,163,78,.05));'
    + 'border:1px solid var(--line-2);color:var(--gold-2);'
    + 'clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}'
    + '.ai-head__icon svg{width:20px;height:20px}'
    + '.ai-head__text{flex:1;min-width:0}'
    + '.ai-head__title{font-family:"Noto Kufi Arabic",sans-serif;font-weight:800;'
    + 'font-size:14px;color:#fff;margin-bottom:2px}'
    + '.ai-head__status{font-family:"Noto Kufi Arabic",sans-serif;font-size:10.5px;'
    + 'color:var(--signal-green);display:flex;align-items:center;gap:5px}'
    + '.ai-head__status::before{content:"";width:6px;height:6px;border-radius:50%;'
    + 'background:var(--signal-green);box-shadow:0 0 8px var(--signal-green);'
    + 'animation:statusPulse 2s ease-in-out infinite}'
    + '.ai-head__actions{display:flex;gap:6px}'
    + '.ai-head__btn{width:32px;height:32px;display:grid;place-items:center;'
    + 'border:1px solid var(--line);background:rgba(255,255,255,.03);'
    + 'color:var(--text-2);cursor:pointer;'
    + 'clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);'
    + 'transition:all .25s}'
    + '.ai-head__btn:hover{border-color:var(--gold);color:var(--gold-2)}'
    + '.ai-head__btn svg{width:15px;height:15px}'
    + '.ai-head__btn.is-active{background:rgba(201,163,78,.15);color:var(--gold-2)}'

    /* Chat Body */
    + '.ai-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;'
    + 'scrollbar-width:thin;scrollbar-color:var(--line-2) transparent}'
    + '.ai-body::-webkit-scrollbar{width:6px}'
    + '.ai-body::-webkit-scrollbar-thumb{background:var(--line-2);border-radius:3px}'

    /* Messages */
    + '.ai-msg{display:flex;gap:10px;max-width:88%;animation:aiMsgIn .3s cubic-bezier(.16,1,.3,1)}'
    + '.ai-msg--user{align-self:flex-end;flex-direction:row-reverse}'
    + '.ai-msg--ai{align-self:flex-start}'
    + '@keyframes aiMsgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'
    + '.ai-msg__avatar{flex:none;width:32px;height:32px;display:grid;place-items:center;'
    + 'border-radius:50%;font-size:13px;font-weight:800}'
    + '.ai-msg--ai .ai-msg__avatar{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:var(--combat-black)}'
    + '.ai-msg--user .ai-msg__avatar{background:rgba(201,163,78,.15);color:var(--gold-2);border:1px solid var(--line-2)}'
    + '.ai-msg__bubble{padding:12px 15px;border-radius:14px;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:13.5px;line-height:1.7;'
    + 'word-wrap:break-word;position:relative}'
    + '.ai-msg--ai .ai-msg__bubble{background:rgba(201,163,78,.08);border:1px solid var(--line);'
    + 'color:var(--text);border-start-start-radius:4px}'
    + '.ai-msg--user .ai-msg__bubble{background:linear-gradient(135deg,rgba(201,163,78,.18),rgba(201,163,78,.08));'
    + 'border:1px solid var(--line-2);color:var(--text);border-start-end-radius:4px}'
    + '.ai-msg__bubble b,.ai-msg__bubble strong{color:var(--gold-2);font-weight:800}'
    + '.ai-msg__bubble p{margin-bottom:8px}'
    + '.ai-msg__bubble p:last-child{margin-bottom:0}'
    + '.ai-msg__bubble ul,.ai-msg__bubble ol{padding-inline-start:20px;margin:6px 0}'
    + '.ai-msg__bubble li{margin-bottom:4px}'

    /* Typing */
    + '.ai-typing{display:flex;gap:5px;padding:14px 18px}'
    + '.ai-typing span{width:8px;height:8px;background:var(--gold-2);border-radius:50%;'
    + 'animation:aiTyping 1.4s ease-in-out infinite}'
    + '.ai-typing span:nth-child(2){animation-delay:.2s}'
    + '.ai-typing span:nth-child(3){animation-delay:.4s}'
    + '@keyframes aiTyping{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}'

    /* Suggestions */
    + '.ai-suggestions{display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 12px}'
    + '.ai-chip{padding:8px 14px;background:rgba(201,163,78,.06);'
    + 'border:1px solid var(--line-2);color:var(--text-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:12px;font-weight:600;'
    + 'cursor:pointer;transition:all .25s;'
    + 'clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}'
    + '.ai-chip:hover{background:rgba(201,163,78,.14);border-color:var(--gold);color:var(--gold-2)}'

    /* Input */
    + '.ai-input{flex:none;padding:14px 18px;border-top:1px solid var(--line);'
    + 'background:rgba(0,0,0,.3);display:flex;gap:8px;align-items:flex-end}'
    + '.ai-input__field{flex:1;min-width:0;padding:11px 14px;'
    + 'background:rgba(0,0,0,.5);border:1px solid var(--line-2);'
    + 'color:var(--text);font-family:"Noto Kufi Arabic",sans-serif;font-size:13px;'
    + 'resize:none;max-height:120px;min-height:42px;line-height:1.5;'
    + 'clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);'
    + 'outline:none;transition:border-color .25s}'
    + '.ai-input__field:focus{border-color:var(--gold)}'
    + '.ai-input__field::placeholder{color:var(--text-3)}'
    + '.ai-input__btn{flex:none;width:44px;height:44px;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,var(--gold),var(--gold-2));'
    + 'color:var(--combat-black);border:0;cursor:pointer;'
    + 'clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);'
    + 'transition:transform .2s}'
    + '.ai-input__btn:hover{transform:scale(1.05)}'
    + '.ai-input__btn:active{transform:scale(.95)}'
    + '.ai-input__btn:disabled{opacity:.5;cursor:not-allowed;transform:none}'
    + '.ai-input__btn svg{width:20px;height:20px}'
    + '.ai-input__btn--voice{background:rgba(201,163,78,.15);color:var(--gold-2);'
    + 'border:1px solid var(--line-2);width:42px}'
    + '.ai-input__btn--voice.is-listening{background:linear-gradient(135deg,#e11d2e,#b91c1c);color:#fff;'
    + 'animation:aiVoicePulse 1s ease-in-out infinite}'
    + '@keyframes aiVoicePulse{0%,100%{box-shadow:0 0 0 0 rgba(225,29,46,.6)}50%{box-shadow:0 0 0 10px rgba(225,29,46,0)}}'

    /* Mobile */
    + '@media (max-width:768px){'
    + '.ai-fab{width:50px;height:50px;bottom:16px;inset-inline-start:14px}'
    + '.ai-fab svg{width:22px;height:22px}'
    + '.ai-panel{bottom:76px;inset-inline-start:14px;inset-inline-end:14px;width:auto;max-width:none;max-height:calc(100vh - 100px)}'
    + '.ai-head{padding:12px 14px}'
    + '.ai-head__title{font-size:13px}'
    + '.ai-body{padding:14px}'
    + '.ai-msg{max-width:92%}'
    + '.ai-msg__bubble{font-size:13px;padding:10px 13px}'
    + '.ai-input{padding:12px 14px}'
    + '.ai-input__field{font-size:12.5px}'
    + '.ai-input__btn{width:40px;height:40px}'
    + '}';
  var s = document.createElement('style');
  s.id = 'aiStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ RENDER MESSAGES ═══ */
function renderMarkdown(text){
  var html = esc(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:var(--gold-2)">$1</a>');
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,.4);padding:2px 6px;border-radius:4px">$1</code>');
  html = html.split(/\n\n+/).map(function(p){ return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  return html;
}

function renderMessages(){
  var body = document.querySelector('.ai-body');
  if(!body) return;
  body.innerHTML = '';

  if(!state.messages.length){
    body.innerHTML =
      '<div style="text-align:center;padding:20px 10px;font-family:\'Noto Kufi Arabic\',sans-serif;color:var(--text-2);font-size:13px;line-height:1.8">'
      + '<div style="font-size:32px;margin-bottom:12px">🎖️</div>'
      + '<strong style="color:var(--gold-2);font-size:14px">مرحباً! أنا المساعد العسكري الذكي</strong><br>'
      + 'اسألني عن الرتب، الفرق القتالية، التعليمات، الآيات، أو أي شيء عسكري'
      + '</div>';
    renderSuggestions();
    return;
  }

  state.messages.forEach(function(m){
    var el = document.createElement('div');
    el.className = 'ai-msg ai-msg--' + (m.role === 'assistant' ? 'ai' : 'user');
    var avatar = m.role === 'assistant' ? '🎖️' : '👤';
    var content = m.role === 'assistant' ? renderMarkdown(m.content) : '<p>' + esc(m.content) + '</p>';
    el.innerHTML = '<div class="ai-msg__avatar">' + avatar + '</div>'
      + '<div class="ai-msg__bubble">' + content + '</div>';
    body.appendChild(el);
  });

  body.scrollTop = body.scrollHeight;
}

function renderSuggestions(){
  var body = document.querySelector('.ai-body');
  if(!body || state.messages.length) return;

  var chips = [];
  if(window.__aiLocal && window.__aiLocal.suggestions){
    var sugg = window.__aiLocal.suggestions(state.lang);
    chips = sugg.map(function(s){ return s.text; });
  }
  if(!chips.length){
    chips = ['ما رتب الضباط؟', 'فرق قتالية', 'واجبات الجندي', 'آيات الجهاد', 'التواصل', 'الحرس الجمهوري'];
  }

  var div = document.createElement('div');
  div.className = 'ai-suggestions';
  chips.forEach(function(c){
    var chip = document.createElement('button');
    chip.className = 'ai-chip';
    chip.textContent = c;
    chip.addEventListener('click', function(){
      var input = document.querySelector('.ai-input__field');
      if(input){ input.value = c; send(); }
    });
    div.appendChild(chip);
  });
  body.appendChild(div);
}

function showTyping(){
  var body = document.querySelector('.ai-body');
  if(!body) return;
  var old = document.getElementById('aiTyping');
  if(old) old.remove();
  var el = document.createElement('div');
  el.id = 'aiTyping';
  el.className = 'ai-msg ai-msg--ai';
  el.innerHTML = '<div class="ai-msg__avatar">🎖️</div>'
    + '<div class="ai-msg__bubble" style="padding:0"><div class="ai-typing"><span></span><span></span><span></span></div></div>';
  body.appendChild(el);
  body.scrollTop = body.scrollHeight;
}
function hideTyping(){
  var el = document.getElementById('aiTyping');
  if(el) el.remove();
}

/* ═══ VOICE ═══ */
function speak(text){
  if(!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    var clean = text.replace(/[*`#_]/g, '').replace(/https?:\/\/\S+/g, '').substring(0, 500);
    var u = new SpeechSynthesisUtterance(clean);
    u.lang = state.lang === 'en' ? 'en-US' : 'ar-SA';
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  } catch(e){}
}

function startVoice(){
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
    toast('الإدخال الصوتي غير مدعوم على هذا المتصفح', 'error');
    return;
  }
  try {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = new SR();
    rec.lang = state.lang === 'en' ? 'en-US' : 'ar-SA';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    state.listening = true;

    var voiceBtn = document.querySelector('.ai-input__btn--voice');
    if(voiceBtn) voiceBtn.classList.add('is-listening');

    rec.onresult = function(e){
      var text = e.results[0][0].transcript;
      var input = document.querySelector('.ai-input__field');
      if(input){ input.value = text; send(); }
    };
    rec.onerror = function(){ state.listening = false; if(voiceBtn) voiceBtn.classList.remove('is-listening'); };
    rec.onend = function(){ state.listening = false; if(voiceBtn) voiceBtn.classList.remove('is-listening'); };
    rec.start();
  } catch(e){
    toast('فشل بدء الإدخال الصوتي', 'error');
  }
}

/* ═══ SEND — يستخدم المحرك المحلي فقط ═══ */
function send(){
  if(state.busy) return;
  var input = document.querySelector('.ai-input__field');
  if(!input) return;
  var text = (input.value || '').trim();
  if(!text) return;

  state.messages.push({ role: 'user', content: text, time: Date.now() });
  saveHistory();
  input.value = '';
  input.style.height = 'auto';
  renderMessages();
  state.busy = true;
  showTyping();

  /* ═══ استخدم المحرك المحلي ═══ */
  setTimeout(function(){
    try {
      var reply = '';
      if(window.__aiLocal && typeof window.__aiLocal.answer === 'function'){
        reply = window.__aiLocal.answer(text);
      } else {
        reply = '⚠️ قاعدة المعرفة غير محمّلة. يُرجى إعادة تحميل الصفحة.';
      }

      hideTyping();
      state.messages.push({ role: 'assistant', content: reply, time: Date.now() });
      saveHistory();
      renderMessages();
      speak(reply);
      state.busy = false;
    } catch(err){
      hideTyping();
      var msg = 'حدث خطأ: ' + (err.message || '');
      state.messages.push({ role: 'assistant', content: '❌ ' + msg, time: Date.now() });
      renderMessages();
      state.busy = false;
    }
  }, 400); /* تأخير صغير ليبدو أكثر واقعية */
}

/* ═══ TOAST ═══ */
function toast(msg, type){
  try {
    var c = document.getElementById('toastContainer');
    if(!c) return;
    var el = document.createElement('div');
    el.className = 'toast toast--' + (type || 'info');
    el.innerHTML = '<span>' + esc(msg) + '</span>';
    c.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('is-show'); });
    setTimeout(function(){ el.classList.remove('is-show'); setTimeout(function(){ if(el.parentNode) el.remove(); }, 400); }, 3000);
  } catch(e){}
}

/* ═══ PANEL BUILD ═══ */
function buildPanel(){
  if(document.getElementById('aiPanel')) return;

  var fab = document.createElement('button');
  fab.id = 'aiFab';
  fab.className = 'ai-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'المساعد العسكري الذكي');
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">'
    + '<path d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a3 3 0 0 0 3 3h1v2h2v-2h1a3 3 0 0 0 3-3v-1h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Z" stroke-linejoin="round"/>'
    + '<circle cx="9" cy="12" r="1" fill="currentColor"/>'
    + '<circle cx="15" cy="12" r="1" fill="currentColor"/>'
    + '</svg>';

  var panel = document.createElement('div');
  panel.id = 'aiPanel';
  panel.className = 'ai-panel';
  panel.innerHTML =
    '<div class="ai-head">'
    + '<div class="ai-head__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a3 3 0 0 0 3 3h1v2h2v-2h1a3 3 0 0 0 3-3v-1h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Z" stroke-linejoin="round"/></svg></div>'
    + '<div class="ai-head__text">'
    + '<div class="ai-head__title">المساعد العسكري الذكي</div>'
    + '<div class="ai-head__status" id="aiStatus">جاهز</div>'
    + '</div>'
    + '<div class="ai-head__actions">'
    + '<button type="button" class="ai-head__btn" id="aiClear" title="مسح"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
    + '<button type="button" class="ai-head__btn" id="aiClose" title="إغلاق"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg></button>'
    + '</div>'
    + '</div>'
    + '<div class="ai-body" id="aiBody"></div>'
    + '<div class="ai-input">'
    + '<button type="button" class="ai-input__btn ai-input__btn--voice" id="aiVoice" title="إدخال صوتي"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" stroke-linecap="round"/></svg></button>'
    + '<textarea class="ai-input__field" id="aiInput" placeholder="اكتب سؤالك..." rows="1"></textarea>'
    + '<button type="button" class="ai-input__btn" id="aiSend" title="إرسال"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
    + '</div>';

  /* ═══ إنشاء المجموعة ═══ */
  var group = document.getElementById('aiFabGroup');
  if(!group){
    group = document.createElement('div');
    group.id = 'aiFabGroup';
    group.className = 'fab-group';
    document.body.appendChild(group);
  }

  /* ═══ نقل to-top إذا وُجد ═══ */
  var toTop = document.getElementById('toTop');
  if(toTop && toTop.parentNode !== group){
    group.insertBefore(toTop, group.firstChild);
  }

  /* ═══ إضافة زر AI ═══ */
  group.appendChild(fab);

  /* ═══ إضافة اللوحة للـ body ═══ */
  document.body.appendChild(panel);

  /* ═══ Events ═══ */
  fab.addEventListener('click', togglePanel);
  document.getElementById('aiClose').addEventListener('click', closePanel);
  document.getElementById('aiSend').addEventListener('click', send);
  document.getElementById('aiClear').addEventListener('click', function(){
    if(!confirm('مسح المحادثة؟')) return;
    state.messages = [];
    saveHistory();
    renderMessages();
    toast('تم مسح المحادثة', 'success');
  });
  document.getElementById('aiVoice').addEventListener('click', startVoice);

  var input = document.getElementById('aiInput');
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }
  });
  input.addEventListener('input', function(){
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  updateStatus();
}


function updateStatus(){
  try {
    var s = document.getElementById('aiStatus');
    if(!s) return;
    if(window.__aiLocal){
      var count = window.__aiLocal.count();
      s.textContent = 'ذكي • ' + count + ' موضوع';
    } else {
      s.textContent = 'جاهز';
    }
  } catch(e){}
}

function togglePanel(){
  if(state.open) closePanel(); else openPanel();
}
function openPanel(){
  state.open = true;
  var panel = document.getElementById('aiPanel');
  var fab = document.getElementById('aiFab');
  if(panel) panel.classList.add('is-open');
  if(fab) fab.classList.add('is-open');
  updateStatus();
  setTimeout(function(){
    var input = document.getElementById('aiInput');
    if(input && window.innerWidth > 768) input.focus();
  }, 300);
}
function closePanel(){
  state.open = false;
  var panel = document.getElementById('aiPanel');
  var fab = document.getElementById('aiFab');
  if(panel) panel.classList.remove('is-open');
  if(fab) fab.classList.remove('is-open');
  if('speechSynthesis' in window) try { window.speechSynthesis.cancel(); } catch(e){}
}

/* ═══ INIT ═══ */
function init(){
  try {
    state.messages = loadHistory();
    state.lang = 'ar';
    try {
      var l = localStorage.getItem('mod_lang_v1');
      if(l === 'en') state.lang = 'en';
    } catch(e){}

    injectCSS();
    buildPanel();
    renderMessages();

    /* تكيف مع تغيير اللغة */
    var mo = new MutationObserver(function(){
      try {
        var l = document.documentElement.getAttribute('lang') || 'ar';
        state.lang = l === 'en' ? 'en' : 'ar';
      } catch(e){}
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  } catch(e){ console.error('[AI] init', e); }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__ai = {
  open: openPanel,
  close: closePanel,
  send: send,
  clear: function(){ state.messages = []; saveHistory(); renderMessages(); }
};

})();
