/* ══════════════════════════════════════════════════════════
   VIDEO HERO ULTRA — تصميم سينمائي عالمي
   🎬 HUD عسكري + تأثيرات سينمائية + شاشة قيادة
   ✅ تحت العلم مباشرة
   ✅ لا يعطل أي شيء
   ✅ AR/EN تلقائي
   ✅ XSS آمن
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var KEY = 'mod_hero_video_v2';
var TOKEN_KEY = 'mod_gh_token';
var REPO = { owner:'jumaaalkurdi', repo:'mod-defense-pro', branch:'main', path:'content' };

/* ═══ النصوص ═══ */
var TEXTS = {
  ar: {
    badge: 'البث الرسمي المباشر',
    badgeLive: 'مباشر',
    title1: 'المركز الإعلامي',
    title2: 'الرسمي',
    subtitle: 'صوت المؤسسة العسكرية السورية',
    desc: 'منصة إعلامية موحّدة تنقل الأخبار العاجلة والبيانات الرسمية لوزارة الدفاع في الجمهورية العربية السورية',
    cta1: 'تصفح الأخبار',
    cta2: 'عن الوزارة',
    stat1: 'تغطية إخبارية',
    stat2: 'معدل الرضا',
    stat3: 'خدمة إلكترونية',
    stat4: 'ساعة استجابة',
    statusSystem: 'النظام',
    statusActive: 'يعمل',
    statusEncrypted: 'مشفّر',
    statusSecure: 'آمن',
    scan: 'جارٍ المسح',
    scanDone: 'تم التحقق',
    time: 'التوقيت المحلي',
    date: 'التاريخ',
    sector: 'القطاع',
    sectorVal: 'المركز الإعلامي',
    classification: 'التصنيف',
    classVal: 'للعرض العام'
  },
  en: {
    badge: 'Official Live Stream',
    badgeLive: 'LIVE',
    title1: 'Official Media',
    title2: 'Center',
    subtitle: 'Voice of the Syrian Military Institution',
    desc: 'Unified media platform delivering breaking news and official statements from the Ministry of Defense',
    cta1: 'Browse News',
    cta2: 'About',
    stat1: 'News Coverage',
    stat2: 'Satisfaction',
    stat3: 'E-Services',
    stat4: 'Response Time',
    statusSystem: 'System',
    statusActive: 'Online',
    statusEncrypted: 'Encrypted',
    statusSecure: 'Secure',
    scan: 'Scanning',
    scanDone: 'Verified',
    time: 'Local Time',
    date: 'Date',
    sector: 'Sector',
    sectorVal: 'Media Center',
    classification: 'Class',
    classVal: 'Public'
  }
};

function getLang(){
  try { return (document.documentElement.getAttribute('lang') === 'en') ? 'en' : 'ar'; }
  catch(e){ return 'ar'; }
}
function t(k){ var d = TEXTS[getLang()] || TEXTS.ar; return d[k] || TEXTS.ar[k] || k; }

function esc(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function safeUrl(u){
  if(!u) return '';
  var s = String(u).trim();
  if(/^(https?:\/\/|data:image\/)/i.test(s)) return esc(s);
  return '';
}

/* ═══ الإعدادات ═══ */
var DEFAULTS = {
  enabled: true,
  videoUrl: '',
  posterUrl: '',
  titleAr: 'المركز الإعلامي',
  titleEn: 'Official Media',
  subtitleAr: 'صوت المؤسسة العسكرية السورية',
  subtitleEn: 'Voice of the Syrian Military Institution',
  badgeAr: 'البث الرسمي المباشر',
  badgeEn: 'Official Live Stream',
  overlay: 0.65,
  showStats: true,
  showCtas: true,
  showHud: true,
  addedAt: Date.now()
};

function load(){ try { var r = localStorage.getItem(KEY); if(r){ var o = JSON.parse(r); if(o && typeof o==='object') return Object.assign({}, DEFAULTS, o); } } catch(e){} return Object.assign({}, DEFAULTS); }
function save(c){ try { localStorage.setItem(KEY, JSON.stringify(c)); } catch(e){} }

var CFG = load();

/* ═══ Toast ═══ */
function toast(msg, type){
  try {
    var c = document.getElementById('toastContainer');
    if(!c) return;
    var el = document.createElement('div');
    el.className = 'toast toast--' + (type||'info');
    el.innerHTML = '<span>' + esc(msg) + '</span>';
    c.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('is-show'); });
    setTimeout(function(){ el.classList.remove('is-show'); setTimeout(function(){ if(el.parentNode) el.remove(); }, 400); }, 3000);
  } catch(e){}
}

/* ═══ CSS — التصميم الأسطوري ═══ */
function injectCSS(){
  if(document.getElementById('vhStyles')) return;
  var css = ''

    /* ═══════ الحاوية الرئيسية ═══════ */
    + '.vh-wrap{position:relative;z-index:1;padding:40px 0 50px}'
    + '.vh-card{position:relative;border-radius:24px;overflow:hidden;'
    + 'background:#06070a;border:1.5px solid rgba(201,163,78,.35);'
    + 'box-shadow:0 40px 100px -30px rgba(0,0,0,.98),'
    + '0 0 80px -25px rgba(201,163,78,.4),'
    + 'inset 0 0 60px rgba(201,163,78,.05);'
    + 'transform-style:preserve-3d;perspective:2000px}'

    /* إطارات ذهبية علوية وسفلية */
    + '.vh-card::before,.vh-card::after{content:"";position:absolute;inset-inline:0;height:2px;z-index:20;'
    + 'background:linear-gradient(90deg,transparent,rgba(201,163,78,.9) 20%,rgba(245,224,165,1) 50%,rgba(201,163,78,.9) 80%,transparent);'
    + 'pointer-events:none}'
    + '.vh-card::before{top:0;animation:vhGlowTop 4s ease-in-out infinite}'
    + '.vh-card::after{bottom:0;animation:vhGlowBot 4s ease-in-out infinite}'
    + '@keyframes vhGlowTop{0%,100%{opacity:.6}50%{opacity:1}}'
    + '@keyframes vhGlowBot{0%,100%{opacity:1}50%{opacity:.6}}'

    /* الحاوية الداخلية */
    + '.vh-inner{position:relative;width:100%;aspect-ratio:21/9;overflow:hidden;background:#06070a}'
    + '.vh-media{position:absolute;inset:0;width:100%;height:100%;z-index:1;background:#06070a}'
    + '.vh-media video,.vh-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}'
    + '.vh-media video{opacity:0;transition:opacity 1.2s ease}'
    + '.vh-media video.is-ready{opacity:1}'

    /* خلفية SVG نمط عسكري */
    + '.vh-bg{position:absolute;inset:0;'
    + 'background:radial-gradient(ellipse 80% 60% at 30% 40%,rgba(201,163,78,.15),transparent 60%),'
    + 'radial-gradient(ellipse 70% 50% at 75% 60%,rgba(185,28,28,.1),transparent 60%),'
    + 'linear-gradient(145deg,#1a2210,#0d1108 45%,#06070a)}'
    + '.vh-bg::before{content:"";position:absolute;inset:0;'
    + 'background-image:linear-gradient(rgba(201,163,78,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,163,78,.06) 1px,transparent 1px);'
    + 'background-size:64px 64px;'
    + '-webkit-mask-image:radial-gradient(ellipse at 50% 50%,#000 20%,transparent 80%);'
    + 'mask-image:radial-gradient(ellipse at 50% 50%,#000 20%,transparent 80%)}'

    /* طبقة تعتيق */
    + '.vh-overlay{position:absolute;inset:0;z-index:2;pointer-events:none;'
    + 'background:linear-gradient(180deg,rgba(6,7,10,.4) 0%,rgba(6,7,10,.55) 35%,rgba(6,7,10,.9) 100%);'
    + 'transition:opacity .5s}'

    /* Scanlines سينمائية */
    + '.vh-scan{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:.35;'
    + 'background:repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,.2) 4px,transparent 5px);'
    + 'mix-blend-mode:overlay}'

    /* ═══════ HUD — الشاشة العسكرية ═══════ */
    + '.vh-hud{position:absolute;inset:0;z-index:15;pointer-events:none;padding:20px}'
    + '.vh-hud > *{pointer-events:auto}'

    /* الركن العلوي الأيسر — شارة LIVE */
    + '.vh-hud__live{position:absolute;top:20px;inset-inline-start:20px;'
    + 'display:inline-flex;align-items:center;gap:8px;padding:7px 14px;'
    + 'background:linear-gradient(135deg,rgba(185,28,28,.95),rgba(225,29,46,.9));'
    + 'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);'
    + 'border:1px solid rgba(255,255,255,.25);color:#fff;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:11px;font-weight:900;letter-spacing:1.5px;'
    + 'clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);'
    + 'box-shadow:0 8px 24px -6px rgba(225,29,46,.8);'
    + 'text-decoration:none;cursor:pointer;pointer-events:auto !important;'
    + 'transition:all .35s cubic-bezier(.16,1,.3,1)}'
    + '.vh-hud__live--clickable:hover{'
    + 'transform:scale(1.05) translateY(-1px);'
    + 'box-shadow:0 12px 32px -6px rgba(225,29,46,1);'
    + 'background:linear-gradient(135deg,rgba(225,29,46,1),rgba(255,80,90,.95))}'
    + '.vh-hud__live--clickable:active{transform:scale(.96)}'
    + '.vh-hud__live--clickable svg{transition:transform .3s}'
    + '.vh-hud__live--clickable:hover svg{transform:translateX(-3px)}'
    + '.vh-hud__live .dot{width:8px;height:8px;border-radius:50%;background:#fff;'
    + 'animation:vhLivePulse 1.4s ease-in-out infinite}'
    + '@keyframes vhLivePulse{0%{box-shadow:0 0 0 0 rgba(255,255,255,.9)}70%{box-shadow:0 0 0 8px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}'

    /* الركن العلوي الأيمن — الساعة */
    + '.vh-hud__clock{position:absolute;top:20px;inset-inline-end:20px;'
    + 'padding:7px 14px;background:rgba(6,7,10,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);'
    + 'border:1px solid rgba(201,163,78,.4);color:var(--gold-2);'
    + 'font-family:"Black Ops One",monospace;font-size:13px;letter-spacing:2px;direction:ltr;'
    + 'clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)}'

    /* الركن السفلي الأيسر — التصنيف */
    + '.vh-hud__class{position:absolute;bottom:20px;inset-inline-start:20px;'
    + 'display:flex;flex-direction:column;gap:3px;'
    + 'padding:8px 14px;background:rgba(6,7,10,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);'
    + 'border:1px solid rgba(201,163,78,.4);color:var(--gold-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;'
    + 'clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);direction:ltr;text-align:left}'
    + '.vh-hud__class strong{color:#fff;font-size:11.5px;letter-spacing:.5px}'

    /* الركن السفلي الأيمن — حالة النظام */
    + '.vh-hud__status{position:absolute;bottom:20px;inset-inline-end:20px;'
    + 'display:flex;gap:10px;padding:8px 14px;background:rgba(6,7,10,.85);'
    + 'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);'
    + 'border:1px solid rgba(201,163,78,.4);color:var(--text-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:10.5px;font-weight:700;'
    + 'clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)}'
    + '.vh-hud__status-item{display:flex;align-items:center;gap:5px}'
    + '.vh-hud__status-item .sdot{width:6px;height:6px;border-radius:50%;'
    + 'box-shadow:0 0 6px currentColor}'
    + '.vh-hud__status-item--green{color:#4ade80}'
    + '.vh-hud__status-item--gold{color:var(--gold-2)}'

    /* زوايا عسكرية */
    + '.vh-corner{position:absolute;width:40px;height:40px;pointer-events:none;z-index:16;opacity:.9}'
    + '.vh-corner svg{width:100%;height:100%;stroke:var(--gold);fill:none;stroke-width:2}'
    + '.vh-corner--tl{top:60px;inset-inline-start:14px}'
    + '.vh-corner--tr{top:60px;inset-inline-end:14px;transform:scaleX(-1)}'
    + '.vh-corner--bl{bottom:60px;inset-inline-start:14px;transform:scaleY(-1)}'
    + '.vh-corner--br{bottom:60px;inset-inline-end:14px;transform:scale(-1,-1)}'

    /* خطوط زخرفية علوية */
    + '.vh-deco{position:absolute;top:44px;inset-inline:60px;height:1px;z-index:15;'
    + 'background:linear-gradient(90deg,transparent,rgba(201,163,78,.4),transparent);pointer-events:none}'

    /* ═══════ المحتوى ═══════ */
    + '.vh-content{position:absolute;inset:0;z-index:10;'
    + 'display:flex;flex-direction:column;justify-content:flex-end;'
    + 'padding:60px 70px 80px;pointer-events:none;text-align:start}'
    + '.vh-content > *{pointer-events:auto}'

    /* العنوان الرئيسي */
    + '.vh-title{font-family:"Noto Kufi Arabic",sans-serif;font-weight:900;'
    + 'font-size:clamp(28px,4.5vw,64px);line-height:1.1;letter-spacing:-1.5px;color:#fff;'
    + 'margin-bottom:6px;max-width:820px;'
    + 'text-shadow:0 8px 50px rgba(0,0,0,.95),0 2px 15px rgba(0,0,0,.75);'
    + 'animation:vhTitleIn .9s cubic-bezier(.16,1,.3,1) both}'
    + '.vh-title__line{display:block}'
    + '.vh-title__line--gold{'
    + 'background:linear-gradient(135deg,var(--gold-3),var(--gold-2) 30%,var(--gold) 60%,var(--gold-deep));'
    + 'background-size:200% 100%;'
    + '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;'
    + 'animation:vhGold 4s ease-in-out infinite}'
    + '@keyframes vhGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}'
    + '@keyframes vhTitleIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}'

    /* الشارة العلوية */
    + '.vh-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 18px;'
    + 'background:rgba(201,163,78,.12);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);'
    + 'border:1px solid rgba(201,163,78,.4);color:var(--gold-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:11.5px;font-weight:800;letter-spacing:2px;'
    + 'margin-bottom:22px;width:fit-content;'
    + 'clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);'
    + 'animation:vhBadgeIn .7s cubic-bezier(.16,1,.3,1) both}'
    + '.vh-badge svg{width:14px;height:14px}'
    + '@keyframes vhBadgeIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}'

    /* الوصف */
    + '.vh-desc{font-family:"Noto Kufi Arabic",sans-serif;font-size:clamp(13px,1.4vw,16.5px);'
    + 'line-height:1.85;color:rgba(232,228,213,.92);max-width:640px;margin-bottom:28px;'
    + 'text-shadow:0 2px 15px rgba(0,0,0,.8);'
    + 'animation:vhDescIn 1s .15s cubic-bezier(.16,1,.3,1) both}'
    + '@keyframes vhDescIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}'

    /* الأزرار */
    + '.vh-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:26px;'
    + 'animation:vhCtasIn 1s .3s cubic-bezier(.16,1,.3,1) both}'
    + '@keyframes vhCtasIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}'
    + '.vh-btn{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-weight:800;font-size:14px;'
    + 'cursor:pointer;border:1.5px solid transparent;text-decoration:none;'
    + 'clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);'
    + 'transition:all .4s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}'
    + '.vh-btn svg{width:16px;height:16px;transition:transform .35s;flex:none}'
    + '.vh-btn::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;'
    + 'background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);'
    + 'transition:left .6s}'
    + '.vh-btn:hover::before{left:100%}'
    + '.vh-btn--primary{background:linear-gradient(135deg,var(--gold),var(--gold-2));'
    + 'color:#06070a;border-color:var(--gold);'
    + 'box-shadow:0 10px 30px -8px rgba(201,163,78,.7)}'
    + '.vh-btn--primary:hover{transform:translateY(-3px);'
    + 'box-shadow:0 16px 40px -8px rgba(201,163,78,1)}'
    + '.vh-btn--primary:hover svg{transform:translateX(-5px)}'
    + '.vh-btn--ghost{background:rgba(6,7,10,.6);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);'
    + 'color:#fff;border-color:rgba(255,255,255,.35)}'
    + '.vh-btn--ghost:hover{background:rgba(6,7,10,.85);border-color:var(--gold);color:var(--gold-2);transform:translateY(-3px)}'

    /* الإحصائيات */
    + '.vh-stats{display:flex;flex-wrap:wrap;gap:12px;'
    + 'animation:vhStatsIn 1s .45s cubic-bezier(.16,1,.3,1) both}'
    + '@keyframes vhStatsIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}'
    + '.vh-stat{display:flex;flex-direction:column;align-items:center;gap:5px;padding:14px 24px;'
    + 'background:rgba(6,7,10,.75);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);'
    + 'border:1px solid rgba(201,163,78,.3);min-width:120px;'
    + 'clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);'
    + 'transition:all .35s cubic-bezier(.16,1,.3,1)}'
    + '.vh-stat:hover{transform:translateY(-3px);border-color:var(--gold)}'
    + '.vh-stat__num{font-family:"Black Ops One",monospace;font-size:24px;color:var(--gold-2);'
    + 'line-height:1;letter-spacing:1px;text-shadow:0 2px 12px rgba(201,163,78,.5)}'
    + '.vh-stat__label{font-family:"Noto Kufi Arabic",sans-serif;font-size:11px;'
    + 'color:rgba(232,228,213,.7);font-weight:600}'

    /* أزرار التحكم */
    + '.vh-controls{position:absolute;bottom:20px;inset-inline-end:20px;z-index:18;display:flex;gap:8px}'
    + '.vh-control{width:44px;height:44px;display:grid;place-items:center;'
    + 'background:rgba(6,7,10,.7);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);'
    + 'border:1px solid rgba(201,163,78,.4);color:var(--gold-2);border-radius:50%;cursor:pointer;'
    + 'transition:all .3s cubic-bezier(.16,1,.3,1);padding:0}'
    + '.vh-control:hover{background:rgba(201,163,78,.2);border-color:var(--gold);transform:scale(1.1)}'
    + '.vh-control:active{transform:scale(.94)}'
    + '.vh-control svg{width:18px;height:18px}'

    /* شريط تقدم الفيديو */
    + '.vh-progress{position:absolute;bottom:0;inset-inline:0;height:3px;z-index:19;'
    + 'background:rgba(0,0,0,.4);overflow:hidden}'
    + '.vh-progress__bar{height:100%;width:0;'
    + 'background:linear-gradient(90deg,var(--gold),var(--gold-2),var(--gold-3));'
    + 'box-shadow:0 0 12px rgba(201,163,78,.9);transition:width .15s linear}'

    /* ═══ الجوال ═══ */
    + '@media (max-width:900px){'
    + '.vh-wrap{padding:24px 0 30px}'
    + '.vh-inner{aspect-ratio:auto;min-height:420px}'
    + '.vh-content{padding:80px 20px 60px;justify-content:flex-end;position:relative;min-height:420px}'
    + '.vh-title{font-size:clamp(20px,5.5vw,30px);margin-bottom:6px;line-height:1.25}'
    + '.vh-desc{font-size:12.5px;margin-bottom:18px;'
    + 'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
    + '.vh-badge{font-size:10px;padding:6px 12px;margin-bottom:14px;letter-spacing:1.5px}'
    + '.vh-ctas{gap:8px;margin-bottom:16px}'
    + '.vh-btn{padding:10px 18px;font-size:12.5px;gap:7px}'
    + '.vh-btn svg{width:14px;height:14px}'
    + '.vh-stats{gap:6px}'
    + '.vh-stat{padding:9px 14px;min-width:88px}'
    + '.vh-stat__num{font-size:17px}'
    + '.vh-stat__label{font-size:9.5px}'
    + '.vh-hud{padding:12px}'
    + '.vh-hud__live{top:10px;inset-inline-start:10px;font-size:9px;padding:4px 9px;gap:4px}'
    + '.vh-hud__live .dot{width:5px;height:5px}'
    + '.vh-hud__clock{top:10px;inset-inline-end:10px;font-size:10px;padding:4px 8px;letter-spacing:1px}'
    + '.vh-hud__class{bottom:12px;inset-inline-start:12px;font-size:9px;padding:6px 10px}'
    + '.vh-hud__class strong{font-size:10px}'
    + '.vh-hud__status{bottom:12px;inset-inline-end:12px;font-size:9px;padding:6px 10px;gap:8px}'
    + '.vh-corner{width:28px;height:28px}'
    + '.vh-corner--tl,.vh-corner--tr{top:40px}'
    + '.vh-corner--bl,.vh-corner--br{bottom:40px}'
    + '.vh-deco{top:34px;inset-inline:40px}'
    + '.vh-controls{bottom:12px;inset-inline-end:12px}'
    + '.vh-control{width:38px;height:38px}'
    + '.vh-control svg{width:16px;height:16px}'
    + '}'

    + '@media (max-width:480px){'
    + '.vh-title{font-size:clamp(18px,6vw,24px);letter-spacing:-.5px}'
    + '.vh-desc{display:none}'
    + '.vh-badge{font-size:9px;padding:4px 10px;margin-bottom:10px}'
    + '.vh-hud__class{display:none}'
    + '.vh-hud__status{display:none}'
    + '.vh-hud__clock{display:none}'
    + '.vh-inner{min-height:340px}'
    + '.vh-content{min-height:340px;padding:60px 16px 40px}'
    + '.vh-stat{padding:7px 11px;min-width:72px}'
    + '.vh-stat__num{font-size:14px}'
    + '.vh-stat__label{font-size:8.5px}'
    + '.vh-btn--ghost{display:none}'
    + '}'

    /* تقليل الحركة */
    + '@media (prefers-reduced-motion: reduce){'
    + '.vh-title,.vh-desc,.vh-ctas,.vh-stats,.vh-badge{animation:none !important}'
    + '.vh-media video{display:none !important}'
    + '.vh-title__line--gold{animation:none !important}'
    + '}';
  var s = document.createElement('style');
  s.id = 'vhStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ بناء القسم ═══ */
function buildHTML(){
  if(!CFG.enabled) return '';
  var lang = getLang();
  var title = lang === 'en' ? CFG.titleEn : CFG.titleAr;
  var subtitle = lang === 'en' ? CFG.subtitleEn : CFG.subtitleAr;
  var badge = lang === 'en' ? CFG.badgeEn : CFG.badgeAr;
  var videoUrl = safeUrl(CFG.videoUrl);
  var posterUrl = safeUrl(CFG.posterUrl);

  /* الفيديو/الصورة */
  var mediaHtml = '';
  if(videoUrl){
    mediaHtml += '<video id="vhVideo" muted loop playsinline preload="metadata"'
      + (posterUrl ? ' poster="' + posterUrl + '"' : '')
      + '><source src="' + videoUrl + '" type="video/mp4"></video>';
  } else if(posterUrl){
    mediaHtml += '<img src="' + posterUrl + '" alt="' + esc(title) + '" loading="lazy">';
  }

  /* العنوان (مع جزء ذهبي) */
  var titleHtml = esc(title);
  if(lang === 'ar'){
    titleHtml = esc(CFG.titleAr) + '<span class="vh-title__line vh-title__line--gold">' + esc('الرسمي') + '</span>';
  } else {
    titleHtml = esc(CFG.titleEn) + '<span class="vh-title__line vh-title__line--gold">' + esc('Center') + '</span>';
  }

  /* الأزرار */
  var ctasHtml = CFG.showCtas
    ? '<div class="vh-ctas">'
      + '<a class="vh-btn vh-btn--primary" data-nav="news-archive">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + esc(t('cta1'))
      + '</a>'
      + '<a class="vh-btn vh-btn--ghost" data-nav="about">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1" stroke-linecap="round"/></svg>'
      + esc(t('cta2'))
      + '</a>'
      + '</div>'
    : '';

  /* الإحصائيات */
  var statsHtml = CFG.showStats
    ? '<div class="vh-stats">'
      + '<div class="vh-stat"><span class="vh-stat__num">+48</span><span class="vh-stat__label">' + esc(t('stat3')) + '</span></div>'
      + '<div class="vh-stat"><span class="vh-stat__num">96%</span><span class="vh-stat__label">' + esc(t('stat2')) + '</span></div>'
      + '<div class="vh-stat"><span class="vh-stat__num">24/7</span><span class="vh-stat__label">' + esc(t('stat1')) + '</span></div>'
      + '<div class="vh-stat"><span class="vh-stat__num">&lt;15m</span><span class="vh-stat__label">' + esc(t('stat4')) + '</span></div>'
      + '</div>'
    : '';

  /* أزرار التحكم */
  var controlsHtml = videoUrl
    ? '<div class="vh-controls">'
      + '<button type="button" class="vh-control" id="vhPlayBtn" aria-label="play"><svg id="vhPlayIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg></button>'
      + '<button type="button" class="vh-control" id="vhMuteBtn" aria-label="mute"><svg id="vhMuteIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5Z" stroke-linejoin="round"/><path d="m22 9-6 6M16 9l6 6" stroke-linecap="round"/></svg></button>'
      + '</div>'
    : '';

  /* شريط التقدم */
  var progressHtml = videoUrl
    ? '<div class="vh-progress"><div class="vh-progress__bar" id="vhProgressBar"></div></div>'
    : '';

  /* HUD */
  var hudHtml = CFG.showHud
    ? '<div class="vh-hud">'
      /* LIVE — قابل للنقر ينقل لصفحة البث */
      + '<a class="vh-hud__live vh-hud__live--clickable" href="#live-broadcast" data-nav="live-broadcast" role="button" aria-label="' + esc(t('badge')) + '">'
      + '<span class="dot"></span>'
      + '<span>' + esc(t('badgeLive')) + '</span>'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;opacity:.85">'
      + '<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>'
      + '</svg>'
      + '</a>'
      /* الساعة */
      + '<div class="vh-hud__clock" id="vhClock">00:00:00</div>'
      /* التصنيف */
      + '<div class="vh-hud__class">'
      + '<span>' + esc(t('classification')) + '</span>'
      + '<strong>' + esc(t('classVal')) + '</strong>'
      + '</div>'
      /* الحالة */
      + '<div class="vh-hud__status">'
      + '<span class="vh-hud__status-item vh-hud__status-item--green"><span class="sdot"></span>' + esc(t('statusActive')) + '</span>'
      + '<span class="vh-hud__status-item vh-hud__status-item--gold"><span class="sdot"></span>' + esc(t('statusEncrypted')) + '</span>'
      + '</div>'
      + '</div>'
    : '';

  /* الزوايا العسكرية */
  var cornersHtml = CFG.showHud
    ? '<div class="vh-corner vh-corner--tl"><svg viewBox="0 0 40 40"><path d="M2 2 L18 2 M2 2 L2 18" stroke-linecap="round"/></svg></div>'
    + '<div class="vh-corner vh-corner--tr"><svg viewBox="0 0 40 40"><path d="M2 2 L18 2 M2 2 L2 18" stroke-linecap="round"/></svg></div>'
    + '<div class="vh-corner vh-corner--bl"><svg viewBox="0 0 40 40"><path d="M2 2 L18 2 M2 2 L2 18" stroke-linecap="round"/></svg></div>'
    + '<div class="vh-corner vh-corner--br"><svg viewBox="0 0 40 40"><path d="M2 2 L18 2 M2 2 L2 18" stroke-linecap="round"/></svg></div>'
    + '<div class="vh-deco"></div>'
    : '';

  return '<div class="container">'
    + '<div class="vh-card" id="vhCard">'

    + '<div class="vh-inner">'
    /* الميديا */
    + '<div class="vh-media">'
    + '<div class="vh-bg"></div>'
    + mediaHtml
    + '</div>'
    /* Overlay */
    + '<div class="vh-overlay" style="opacity:' + (CFG.overlay || 0.65) + '"></div>'
    /* Scanlines */
    + '<div class="vh-scan"></div>'
    /* HUD */
    + hudHtml
    + cornersHtml
    /* أزرار التحكم */
    + controlsHtml
    /* شريط التقدم */
    + progressHtml
    /* المحتوى */
    + '<div class="vh-content">'
    + '<span class="vh-badge">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + esc(badge)
    + '</span>'
    + '<h2 class="vh-title">' + titleHtml + '</h2>'
    + '<p class="vh-desc">' + esc(t('desc')) + '</p>'
    + ctasHtml
    + statsHtml
    + '</div>'

    + '</div>'
    + '</div>'
    + '</div>';
}

/* ═══ حقن القسم (تحت العلم) ═══ */
function inject(){
  var home = document.getElementById('pageHome');
  if(!home) return false;

  /* إذا القسم موجود */
  var existing = document.getElementById('vhSection');
  if(existing){
    if(existing.dataset.lang !== getLang() || existing.dataset.cfg !== JSON.stringify(CFG)){
      existing.dataset.lang = getLang();
      existing.dataset.cfg = JSON.stringify(CFG);
      existing.innerHTML = buildHTML();
      bind();
    }
    return true;
  }

  if(!CFG.enabled) return true;

  var sec = document.createElement('section');
  sec.id = 'vhSection';
  sec.className = 'vh-wrap';
  sec.dataset.lang = getLang();
  sec.dataset.cfg = JSON.stringify(CFG);
  sec.innerHTML = buildHTML();

  /* ✅ المكان الجديد: تحت العلم مباشرة */
  var flag = document.querySelector('.flag-section');
  if(flag && flag.parentNode === home){
    flag.parentNode.insertBefore(sec, flag.nextSibling);
  } else {
    /* احتياطي: بعد الآية */
    var quran = document.querySelector('.quran-section');
    if(quran && quran.parentNode === home){
      quran.parentNode.insertBefore(sec, quran.nextSibling);
    } else {
      home.appendChild(sec);
    }
  }

  return true;
}

/* ═══ إعادة بناء ═══ */
function rebuild(){
  var sec = document.getElementById('vhSection');
  if(sec) sec.remove();
  inject();
}

/* ═══ ربط الأحداث ═══ */
function bind(){
  try {
    var video = document.getElementById('vhVideo');
    var playBtn = document.getElementById('vhPlayBtn');
    var muteBtn = document.getElementById('vhMuteBtn');
    var progressBar = document.getElementById('vhProgressBar');

    /* الساعة */
    var clock = document.getElementById('vhClock');
    if(clock){
      var tick = function(){
        var d = new Date();
        var p = function(n){ return String(n).padStart(2, '0'); };
        clock.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
      };
      tick();
      if(clock._iv) clearInterval(clock._iv);
      clock._iv = setInterval(tick, 1000);
    }

    /* الفيديو */
    if(video){
      video.addEventListener('loadeddata', function(){ video.classList.add('is-ready'); });
      video.addEventListener('error', function(){ video.style.display = 'none'; });

      /* تشغيل تلقائي آمن */
      var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var conn = navigator.connection;
      var saveData = conn && (conn.saveData || /2g/i.test(conn.effectiveType || ''));
      if(!prefersReduced && !saveData){
        video.autoplay = true;
        var p = video.play();
        if(p && p.catch) p.catch(function(){ updatePlayIcon(video); });
      }

      /* شريط التقدم */
      if(progressBar){
        video.addEventListener('timeupdate', function(){
          if(video.duration && isFinite(video.duration)){
            progressBar.style.width = ((video.currentTime / video.duration) * 100) + '%';
          }
        });
      }

      /* IntersectionObserver — إيقاف عند الخروج */
      if('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(!entry.isIntersecting && !video.paused) video.pause();
            else if(entry.isIntersecting && !video.paused){ var pp = video.play(); if(pp && pp.catch) pp.catch(function(){}); }
          });
        }, { threshold: 0.2 });
        io.observe(video);
      }
    }

    /* زر التشغيل */
    if(playBtn && video){
      playBtn.addEventListener('click', function(){
        if(video.paused){ var p = video.play(); if(p && p.catch) p.catch(function(){}); }
        else video.pause();
        setTimeout(function(){ updatePlayIcon(video); }, 50);
      });
    }

    /* زر الصوت */
    if(muteBtn && video){
      muteBtn.addEventListener('click', function(){
        video.muted = !video.muted;
        updateMuteIcon(video);
      });
    }

  } catch(e){ console.error('[vh]', e); }
}

function updatePlayIcon(video){
  var icon = document.getElementById('vhPlayIcon');
  if(!icon || !video) return;
  icon.innerHTML = video.paused
    ? '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';
}
function updateMuteIcon(video){
  var icon = document.getElementById('vhMuteIcon');
  if(!icon || !video) return;
  if(video.muted){
    icon.innerHTML = '<path d="M11 5 6 9H2v6h4l5 4V5Z" stroke-linejoin="round"/><path d="m22 9-6 6M16 9l6 6" stroke-linecap="round"/>';
  } else {
    icon.innerHTML = '<path d="M11 5 6 9H2v6h4l5 4V5Z" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" stroke-linecap="round"/>';
  }
}

/* ═══ GitHub ═══ */
function rawUrl(f){ return 'https://raw.githubusercontent.com/' + REPO.owner + '/' + REPO.repo + '/' + REPO.branch + '/' + REPO.path + '/' + f + '?t=' + Date.now(); }
function apiUrl(f){ return 'https://api.github.com/repos/' + REPO.owner + '/' + REPO.repo + '/contents/' + REPO.path + '/' + f; }
function b64(s){ return btoa(unescape(encodeURIComponent(s))); }
function getToken(){ try { return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''; } catch(e){ return ''; } }

function fetchRemote(){ return fetch(rawUrl('hero.json'), { cache:'no-store' }).then(function(r){ if(!r.ok) return null; return r.json(); }).catch(function(){ return null; }); }
function getSha(f){
  var tk = getToken(); if(!tk) return Promise.resolve(null);
  return fetch(apiUrl(f) + '?ref=' + REPO.branch, { headers:{ 'Authorization':'token ' + tk, 'Accept':'application/vnd.github+json' } })
    .then(function(r){ if(!r.ok) return null; return r.json(); }).then(function(d){ return d ? d.sha : null; }).catch(function(){ return null; });
}
function writeRemote(f, data, msg){
  var tk = getToken();
  if(!tk) return Promise.reject(new Error('أدخل GitHub Token'));
  return getSha(f).then(function(sha){
    var body = { message: msg || 'تحديث', content: b64(JSON.stringify(data, null, 2) + '\n'), branch: REPO.branch };
    if(sha) body.sha = sha;
    return fetch(apiUrl(f), { method:'PUT', headers:{ 'Authorization':'token ' + tk, 'Accept':'application/vnd.github+json', 'Content-Type':'application/json' }, body: JSON.stringify(body) })
      .then(function(r){ if(!r.ok){ return r.json().catch(function(){ return {}; }).then(function(e){ throw new Error(e.message || 'فشل'); }); } return r.json(); });
  });
}

/* ═══ تبويب الإدارة ═══ */
function injectAdmin(){
  var tabs = document.querySelector('.admin-tabs');
  var body = document.querySelector('.admin-panel__body');
  if(!tabs || !body) return false;
  if(document.getElementById('vhAdminTab')) return true;

  var tab = document.createElement('button');
  tab.className = 'admin-tab';
  tab.id = 'vhAdminTab';
  tab.setAttribute('data-tab', 'video-hero');
  tab.textContent = '🎬 الفيديو الرئيسي';
  tabs.appendChild(tab);

  var content = document.createElement('div');
  content.className = 'admin-tab-content';
  content.setAttribute('data-tab-content', 'video-hero');
  content.innerHTML = '<div class="admin-section" style="max-width:900px;margin:0 auto">'
    + '<div class="admin-section__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="m10 11 5 3-5 3z" fill="currentColor"/></svg>'
    + 'إعدادات الفيديو الرئيسي'
    + '</div>'
    + '<form class="admin-form" id="vhForm">'

    + '<div class="admin-form__row">'
    + '<label><input type="checkbox" id="vhEnabled" ' + (CFG.enabled ? 'checked' : '') + '> <strong>تفعيل القسم</strong></label>'
    + '</div>'

    + '<div class="admin-form__row">'
    + '<label for="vhVideoUrl">🎬 رابط الفيديو (MP4)</label>'
    + '<input type="url" id="vhVideoUrl" dir="ltr" placeholder="https://..." value="' + esc(CFG.videoUrl || '') + '">'
    + '</div>'

    + '<div class="admin-form__row">'
    + '<label for="vhPosterUrl">🖼️ صورة الغلاف (اختياري)</label>'
    + '<input type="url" id="vhPosterUrl" dir="ltr" placeholder="https://..." value="' + esc(CFG.posterUrl || '') + '">'
    + '</div>'

    + '<div class="admin-form__row--split">'
    + '<div><label for="vhTitleAr">العنوان (عربي)</label><input type="text" id="vhTitleAr" value="' + esc(CFG.titleAr || '') + '"></div>'
    + '<div><label for="vhTitleEn">Title (EN)</label><input type="text" id="vhTitleEn" dir="ltr" value="' + esc(CFG.titleEn || '') + '"></div>'
    + '</div>'

    + '<div class="admin-form__row--split">'
    + '<div><label for="vhSubAr">النص الفرعي (عربي)</label><input type="text" id="vhSubAr" value="' + esc(CFG.subtitleAr || '') + '"></div>'
    + '<div><label for="vhSubEn">Subtitle (EN)</label><input type="text" id="vhSubEn" dir="ltr" value="' + esc(CFG.subtitleEn || '') + '"></div>'
    + '</div>'

    + '<div class="admin-form__row--split">'
    + '<div><label for="vhBadgeAr">الشارة (عربي)</label><input type="text" id="vhBadgeAr" value="' + esc(CFG.badgeAr || '') + '"></div>'
    + '<div><label for="vhBadgeEn">Badge (EN)</label><input type="text" id="vhBadgeEn" dir="ltr" value="' + esc(CFG.badgeEn || '') + '"></div>'
    + '</div>'

    + '<div class="admin-form__row--split">'
    + '<div><label for="vhOverlay">شدة التعتيق (0.3 - 0.9)</label><input type="number" id="vhOverlay" min="0.3" max="0.9" step="0.05" value="' + (CFG.overlay || 0.65) + '"></div>'
    + '<div><label>الخيارات</label><div style="margin-top:8px;display:flex;gap:12px;flex-wrap:wrap"><label><input type="checkbox" id="vhStats" ' + (CFG.showStats?'checked':'') + '> الإحصائيات</label><label><input type="checkbox" id="vhCtas" ' + (CFG.showCtas?'checked':'') + '> الأزرار</label><label><input type="checkbox" id="vhHud" ' + (CFG.showHud?'checked':'') + '> HUD</label></div></div>'
    + '</div>'

    + '<div class="admin-form__actions">'
    + '<button class="btn btn--gold" type="button" id="vhSave">💾 حفظ</button>'
    + '<button class="btn btn--outline" type="button" id="vhReset">↺ استعادة</button>'
    + '</div>'

    + '<div class="admin-form__actions" style="margin-top:14px">'
    + '<button class="btn btn--gold" type="button" id="vhPublish">📤 نشر</button>'
    + '<button class="btn btn--outline" type="button" id="vhPull">📥 تحميل</button>'
    + '</div>'

    + '<div id="vhHint" style="margin-top:8px;font-size:11.5px;color:var(--text-3)"></div>'

    + '</form></div>';
  body.appendChild(content);

  tab.addEventListener('click', function(){
    document.querySelectorAll('.admin-tab').forEach(function(x){ x.classList.remove('is-active'); });
    document.querySelectorAll('.admin-tab-content').forEach(function(x){ x.classList.remove('is-active'); });
    tab.classList.add('is-active');
    content.classList.add('is-active');
  });

  bindAdmin();
  return true;
}

function bindAdmin(){
  var f = document.getElementById('vhForm');
  if(!f || f.getAttribute('data-b') === '1') return;
  f.setAttribute('data-b', '1');

  document.getElementById('vhSave').addEventListener('click', function(){
    CFG.enabled = document.getElementById('vhEnabled').checked;
    CFG.videoUrl = document.getElementById('vhVideoUrl').value.trim();
    CFG.posterUrl = document.getElementById('vhPosterUrl').value.trim();
    CFG.titleAr = document.getElementById('vhTitleAr').value.trim();
    CFG.titleEn = document.getElementById('vhTitleEn').value.trim();
    CFG.subtitleAr = document.getElementById('vhSubAr').value.trim();
    CFG.subtitleEn = document.getElementById('vhSubEn').value.trim();
    CFG.badgeAr = document.getElementById('vhBadgeAr').value.trim();
    CFG.badgeEn = document.getElementById('vhBadgeEn').value.trim();
    CFG.overlay = parseFloat(document.getElementById('vhOverlay').value) || 0.65;
    CFG.showStats = document.getElementById('vhStats').checked;
    CFG.showCtas = document.getElementById('vhCtas').checked;
    CFG.showHud = document.getElementById('vhHud').checked;
    save(CFG);
    rebuild();
    toast('✅ تم الحفظ', 'success');
    updateHint();
  });

  document.getElementById('vhReset').addEventListener('click', function(){
    if(!confirm('استعادة الإعدادات الافتراضية؟')) return;
    CFG = Object.assign({}, DEFAULTS);
    save(CFG);
    rebuild();
    location.reload();
  });

  document.getElementById('vhPublish').addEventListener('click', function(){
    toast('جارٍ النشر...', 'info');
    writeRemote('hero.json', CFG, 'تحديث الفيديو الرئيسي')
      .then(function(){ toast('✅ تم النشر', 'success'); updateHint(); })
      .catch(function(e){ toast('فشل: ' + e.message, 'error'); });
  });

  document.getElementById('vhPull').addEventListener('click', function(){
    toast('جارٍ التحميل...', 'info');
    fetchRemote().then(function(r){
      if(!r){ toast('لا توجد بيانات', 'info'); return; }
      CFG = Object.assign({}, DEFAULTS, r);
      save(CFG);
      rebuild();
      toast('✅ تم التحميل', 'success');
      location.reload();
    });
  });

  updateHint();
}

function updateHint(){
  var h = document.getElementById('vhHint');
  if(!h) return;
  var tk = getToken();
  h.textContent = tk ? '✅ جاهز للنشر' : '🔑 أدخل GitHub Token';
  h.style.color = tk ? 'var(--signal-green)' : 'var(--signal-amber)';
}

/* ═══ INIT ═══ */
function init(){
  injectCSS();

  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(inject()){ clearInterval(iv); bind(); }
    if(tries >= 40) clearInterval(iv);
  }, 200);

  var atries = 0;
  var aiv = setInterval(function(){
    atries++;
    if(injectAdmin()) clearInterval(aiv);
    if(atries >= 80) clearInterval(aiv);
  }, 400);

  /* استمع لتغيير اللغة */
  if(window.MutationObserver){
    var mo = new MutationObserver(function(){
      var sec = document.getElementById('vhSection');
      if(sec && sec.dataset.lang !== getLang()){
        sec.dataset.lang = getLang();
        sec.innerHTML = buildHTML();
        bind();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__vh = {
  config: function(){ return CFG; },
  rebuild: rebuild,
  setVideo: function(url){ CFG.videoUrl = url; save(CFG); rebuild(); }
};

})();
