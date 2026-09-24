(function(){
'use strict';

/* ============ SHA-256 HASHES ============ */
/* يتم استبدالها تلقائياً بالخطوة التالية */
const _PWD = 'de9dbfbecc22ef1fc8692551d8df593c99a2a4be1eb6d9c0fc3dcc0773be6d4e';
const _PIN = '8ba5ef4e282bf7bc5cf13f731a1b9f525bd3b1f69cbfa24c1c69c303c0ac7019';

/* ============ PASSWORD CHECK (SHA-256) ============ */
window.__security = {
  checkPassword: function(inp){
    if(typeof inp !== 'string' || inp.length === 0) return false;
    if(typeof sha256 !== 'function'){
      console.error('SHA-256 library not loaded');
      return false;
    }
    return sha256(inp) === _PWD;
  }
};

/* ============ PIN CHECK (SHA-256) ============ */
window.__pin = {
  check: function(inp){
    if(typeof inp !== 'string' || inp.length === 0) return false;
    if(typeof sha256 !== 'function') return false;
    return sha256(inp) === _PIN;
  }
};

/* ============ RATE LIMITING ============ */
const RL_KEY = 'mod_rl_v7';
const RL_MAX = 5;
const RL_LOCK_MS = 15 * 60 * 1000;
function loadRL(){ try{ return JSON.parse(localStorage.getItem(RL_KEY)) || { att:0, lockUntil:0 }; }catch(e){ return { att:0, lockUntil:0 }; } }
function saveRL(data){ try{ localStorage.setItem(RL_KEY, JSON.stringify(data)); }catch(e){} }

window.__ratelimit = {
  isLocked: function(){ const d = loadRL(); return Date.now() < d.lockUntil; },
  getRemaining: function(){ const d = loadRL(); return Math.ceil((d.lockUntil - Date.now()) / 1000); },
  recordFail: function(){ const d = loadRL(); d.att++; if(d.att >= RL_MAX){ d.lockUntil = Date.now() + RL_LOCK_MS; d.att = 0; } saveRL(d); return d.att; },
  getAttempts: function(){ return loadRL().att; },
  reset: function(){ saveRL({ att:0, lockUntil:0 }); }
};

/* ============ MUQATTAAT ============ */
const MUQATTAAT = [
  { n:1, surah:'البقرة', letters:'الم' },
  { n:2, surah:'آل عمران', letters:'الم' },
  { n:3, surah:'الأعراف', letters:'المص' },
  { n:4, surah:'يونس', letters:'الر' },
  { n:5, surah:'هود', letters:'الر' },
  { n:6, surah:'يوسف', letters:'الر' },
  { n:7, surah:'الرعد', letters:'المر' },
  { n:8, surah:'إبراهيم', letters:'الر' },
  { n:9, surah:'الحجر', letters:'الر' },
  { n:10, surah:'مريم', letters:'كهيعص' },
  { n:11, surah:'طه', letters:'طه' },
  { n:12, surah:'الشعراء', letters:'طسم' },
  { n:13, surah:'النمل', letters:'طس' },
  { n:14, surah:'القصص', letters:'طسم' },
  { n:15, surah:'العنكبوت', letters:'الم' },
  { n:16, surah:'الروم', letters:'الم' },
  { n:17, surah:'لقمان', letters:'الم' },
  { n:18, surah:'السجدة', letters:'الم' },
  { n:19, surah:'يس', letters:'يس' },
  { n:20, surah:'ص', letters:'ص' },
  { n:21, surah:'غافر', letters:'حم' },
  { n:22, surah:'فصلت', letters:'حم' },
  { n:23, surah:'الشورى', letters:'حم عسق' },
  { n:24, surah:'الزخرف', letters:'حم' },
  { n:25, surah:'الدخان', letters:'حم' },
  { n:26, surah:'الجاثية', letters:'حم' },
  { n:27, surah:'الأحقاف', letters:'حم' },
  { n:28, surah:'ق', letters:'ق' },
  { n:29, surah:'القلم', letters:'ن' }
];

const ALL_MQ = ['الم','المص','الر','المر','كهيعص','طه','طسم','طس','يس','ص','حم','حم عسق','ق','ن'];

function cleanMq(s){
  return String(s||'').trim().replace(/\s+/g, '').replace(/[أإآٱ]/g, 'ا').replace(/[ىي]/g, 'ي').replace(/[ةه]/g, 'ه').toLowerCase();
}

window.__muqattaat = {
  getToday: function(){
    const d = new Date();
    let day = d.getDate();
    if(day > 29) day = day - 29;
    const entry = MUQATTAAT.find(m => m.n === day);
    return entry ? { surah: entry.surah, letters: entry.letters, day: day } : null;
  },
  check: function(input){ const today = this.getToday(); if(!today) return false; return cleanMq(input) === cleanMq(today.letters); },
  isAny: function(input){ const c = cleanMq(input); if(c.length < 1 || c.length > 8) return false; return ALL_MQ.some(m => cleanMq(m) === c); },
  list: MUQATTAAT
};

/* ============ SUSPICIOUS LOG ============ */
const SUSPECTS_KEY = 'mod_suspects_v7';
function loadSuspects(){ try{ return JSON.parse(sessionStorage.getItem(SUSPECTS_KEY)) || []; }catch(e){ return []; } }
function saveSuspects(arr){ try{ if(arr.length > 50) arr = arr.slice(-50); sessionStorage.setItem(SUSPECTS_KEY, JSON.stringify(arr)); }catch(e){} }

window.__decoy = {
  log: function(entry){ try{ const log = loadSuspects(); log.push({ ...entry, time: new Date().toISOString(), ua: navigator.userAgent.substring(0, 120), lang: navigator.language, tz: Intl.DateTimeFormat().resolvedOptions().timeZone }); saveSuspects(log); }catch(e){} },
  getAll: loadSuspects,
  clear: function(){ saveSuspects([]); }
};

/* ============ STATE ============ */
window.__mqState = { validated: false, validatedAt: 0, correctAttempts: 0, wrongAttempts: 0 };

})();
