/* ══════════════════════════════════════════════════════════
   SPLASH SCREEN ULTRA — تجربة سينمائية أسطورية
   ✅ Canvas Particles + Energy Waves
   ✅ 3D Rotating Emblem
   ✅ Holographic Grid
   ✅ Multi-Stage Animation
   ✅ Impact Explosion at 100%
   ✅ لا تعطل أي شيء
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var KEY = 'mod_splash_ultra_v1';
var DURATION = 6000;

try {
  if(sessionStorage.getItem(KEY) === '1') return;
} catch(e){}

/* ═══ النصوص ═══ */
var TEXTS = {
  ar: {
    system: 'النظام العسكري',
    elite: 'نخبة',
    welcome: 'مرحباً بك في',
    center: 'المركز الإعلامي',
    defense: 'وزارة الدفاع',
    country: 'الجمهورية العربية السورية',
    loading: 'جارٍ التحميل',
    encrypted: 'مشفر',
    secure: 'آمن',
    online: 'متصل',
    ready: 'جاهز',
    skip: 'تخطي',
    initializing: 'تهيئة الأنظمة',
    authenticating: 'التحقق من الهوية',
    encrypting: 'تشفير الاتصال',
    arming: 'تحضير الدفاعات',
    welcome2: 'مرحباً بك'
  },
  en: {
    system: 'Military System',
    elite: 'ELITE',
    welcome: 'Welcome to',
    center: 'Media Center',
    defense: 'Ministry of Defense',
    country: 'Syrian Arab Republic',
    loading: 'Loading',
    encrypted: 'Encrypted',
    secure: 'Secure',
    online: 'Online',
    ready: 'Ready',
    skip: 'Skip',
    initializing: 'Initializing Systems',
    authenticating: 'Authenticating',
    encrypting: 'Encrypting Connection',
    arming: 'Arming Defenses',
    welcome2: 'Welcome'
  }
};

function getLang(){
  try { return (document.documentElement.getAttribute('lang') === 'en') ? 'en' : 'ar'; }
  catch(e){ return 'ar'; }
}
function t(k){ var d = TEXTS[getLang()] || TEXTS.ar; return d[k] || TEXTS.ar[k] || k; }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

/* ══════════════════════════════════════════════════════════
   CSS — تصميم أسطوري متقدم
   ══════════════════════════════════════════════════════════ */
function injectCSS(){
  if(document.getElementById('splashUltraStyles')) return;
  var css = ''

    /* ═══ الحاوية ═══ */
    + '.spl{position:fixed;inset:0;z-index:99999;'
    + 'background:radial-gradient(ellipse 100% 80% at 50% 50%,#0a0d05 0%,#05060a 50%,#000 100%);'
    + 'display:flex;align-items:center;justify-content:center;flex-direction:column;'
    + 'overflow:hidden;opacity:1;transition:opacity 1s cubic-bezier(.16,1,.3,1)}'
    + '.spl.is-hiding{opacity:0;pointer-events:none;transform:scale(1.05)}'

    /* ═══ Canvas Particles ═══ */
    + '.spl__canvas{position:absolute;inset:0;z-index:1;pointer-events:none}'

    /* ═══ Holographic Grid ═══ */
    + '.spl__grid{position:absolute;inset:-20%;z-index:0;'
    + 'background-image:'
    + 'linear-gradient(rgba(201,163,78,.06) 1px,transparent 1px),'
    + 'linear-gradient(90deg,rgba(201,163,78,.06) 1px,transparent 1px),'
    + 'linear-gradient(rgba(201,163,78,.03) 1px,transparent 1px),'
    + 'linear-gradient(90deg,rgba(201,163,78,.03) 1px,transparent 1px);'
    + 'background-size:100px 100px,100px 100px,20px 20px,20px 20px;'
    + 'transform:perspective(1000px) rotateX(60deg);'
    + 'transform-origin:50% 100%;'
    + 'animation:splGridMove 8s linear infinite;'
    + 'opacity:.8}'
    + '@keyframes splGridMove{from{background-position:0 0,0 0,0 0,0 0}to{background-position:0 100px,100px 0,0 20px,20px 0}}'

    /* ═══ Vignette ═══ */
    + '.spl__vignette{position:absolute;inset:0;z-index:2;pointer-events:none;'
    + 'background:radial-gradient(ellipse 70% 70% at 50% 50%,transparent 30%,rgba(0,0,0,.85) 100%)}'

    /* ═══ Scanlines ═══ */
    + '.spl__scan{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:.15;'
    + 'background:repeating-linear-gradient(to bottom,transparent 0,transparent 2px,rgba(0,0,0,.5) 3px,transparent 4px);'
    + 'mix-blend-mode:overlay}'

    /* ═══ Shockwave Effect ═══ */
    + '.spl__shock{position:absolute;top:50%;left:50%;z-index:4;pointer-events:none;'
    + 'width:200px;height:200px;margin:-100px 0 0 -100px;'
    + 'border:2px solid rgba(201,163,78,.8);border-radius:50%;'
    + 'animation:splShock 3s ease-out infinite;opacity:0}'
    + '@keyframes splShock{0%{transform:scale(0);opacity:1}100%{transform:scale(8);opacity:0}}'
    + '.spl__shock:nth-of-type(2){animation-delay:1s}'
    + '.spl__shock:nth-of-type(3){animation-delay:2s}'

    /* ═══ Radial Rings ═══ */
    + '.spl__rings{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);'
    + 'z-index:3;pointer-events:none}'
    + '.spl__ring{position:absolute;top:50%;left:50%;border:1px solid rgba(201,163,78,.15);border-radius:50%;'
    + 'transform:translate(-50%,-50%)}'
    + '.spl__ring:nth-child(1){width:280px;height:280px;animation:splRingPulse 3s ease-in-out infinite}'
    + '.spl__ring:nth-child(2){width:420px;height:420px;animation:splRingPulse 3s ease-in-out .5s infinite}'
    + '.spl__ring:nth-child(3){width:560px;height:560px;animation:splRingPulse 3s ease-in-out 1s infinite}'
    + '.spl__ring:nth-child(4){width:700px;height:700px;animation:splRingPulse 3s ease-in-out 1.5s infinite}'
    + '@keyframes splRingPulse{0%,100%{opacity:.2;transform:translate(-50%,-50%) scale(1)}50%{opacity:.6;transform:translate(-50%,-50%) scale(1.05)}}'

    /* ═══ Radar Sweep ═══ */
    + '.spl__radar{position:absolute;top:50%;left:50%;z-index:3;pointer-events:none}'
    + '.spl__radar-line{position:absolute;top:0;left:0;transform-origin:0 0;'
    + 'width:250px;height:2px;background:linear-gradient(90deg,rgba(201,163,78,.9),transparent);'
    + 'animation:splRadarSweep 2.4s linear infinite;box-shadow:0 0 20px rgba(201,163,78,.6)}'
    + '@keyframes splRadarSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'

    /* ═══ Content ═══ */
    + '.spl__content{position:relative;z-index:10;text-align:center;padding:20px;max-width:560px;width:100%;display:flex;flex-direction:column;align-items:center}'

    /* ═══ ELITE Badge ═══ */
    + '.spl__elite{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;'
    + 'background:linear-gradient(135deg,rgba(185,28,28,.9),rgba(225,29,46,.8));'
    + 'border:1px solid rgba(255,255,255,.3);color:#fff;'
    + 'font-family:"Black Ops One",monospace;font-size:11px;font-weight:400;letter-spacing:3px;'
    + 'margin-bottom:24px;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);'
    + 'box-shadow:0 0 30px -5px rgba(225,29,46,.8);'
    + 'animation:splFadeIn .8s ease-out both}'
    + '.spl__elite::before{content:"";width:8px;height:8px;background:#fff;border-radius:50%;'
    + 'animation:splBlink 1.2s ease-in-out infinite}'
    + '@keyframes splBlink{0%,100%{opacity:1}50%{opacity:.3}}'

    /* ═══ Emblem Ultra ═══ */
    + '.spl__emblem{position:relative;width:160px;height:160px;margin-bottom:28px;'
    + 'animation:splEmblemIn 1.2s cubic-bezier(.16,1,.3,1) both}'
    + '@keyframes splEmblemIn{from{opacity:0;transform:scale(.2) rotate(-180deg)}to{opacity:1;transform:none}}'

    /* حلقات Emblem */
    + '.spl__emblem-ring{position:absolute;inset:0;border-radius:50%;pointer-events:none}'
    + '.spl__emblem-ring--1{border:2px solid rgba(201,163,78,.4);'
    + 'border-top-color:var(--gold-2,#e8c878);border-right-color:var(--gold-2,#e8c878);'
    + 'animation:splEmblemSpin 2s linear infinite;'
    + 'box-shadow:0 0 30px rgba(201,163,78,.3),inset 0 0 30px rgba(201,163,78,.1)}'
    + '.spl__emblem-ring--2{inset:-14px;border:1px dashed rgba(201,163,78,.3);'
    + 'animation:splEmblemSpinReverse 4s linear infinite}'
    + '.spl__emblem-ring--3{inset:-28px;border:1px solid rgba(201,163,78,.15);'
    + 'animation:splEmblemSpin 8s linear infinite}'
    + '@keyframes splEmblemSpin{to{transform:rotate(360deg)}}'
    + '@keyframes splEmblemSpinReverse{to{transform:rotate(-360deg)}}'

    /* نقاط على الحلقة */
    + '.spl__emblem-dots{position:absolute;inset:-14px;pointer-events:none}'
    + '.spl__emblem-dot{position:absolute;width:6px;height:6px;background:var(--gold-2,#e8c878);'
    + 'border-radius:50%;box-shadow:0 0 12px var(--gold,#c9a34e);'
    + 'animation:splDotOrbit 4s linear infinite}'
    + '.spl__emblem-dot:nth-child(2){animation-delay:-1s}'
    + '.spl__emblem-dot:nth-child(3){animation-delay:-2s}'
    + '.spl__emblem-dot:nth-child(4){animation-delay:-3s}'
    + '@keyframes splDotOrbit{from{transform:rotate(0deg) translateX(94px) rotate(0deg)}to{transform:rotate(360deg) translateX(94px) rotate(-360deg)}}'

    /* القلب */
    + '.spl__emblem-core{position:absolute;inset:14px;display:grid;place-items:center;'
    + 'background:radial-gradient(circle,rgba(201,163,78,.15),rgba(13,17,8,.9) 70%);'
    + 'border:1.5px solid rgba(201,163,78,.5);border-radius:50%;'
    + 'box-shadow:inset 0 0 40px rgba(201,163,78,.15),0 0 60px -10px rgba(201,163,78,.5);'
    + 'animation:splCoreGlow 2s ease-in-out infinite}'
    + '@keyframes splCoreGlow{0%,100%{box-shadow:inset 0 0 40px rgba(201,163,78,.15),0 0 60px -10px rgba(201,163,78,.5)}50%{box-shadow:inset 0 0 60px rgba(201,163,78,.3),0 0 100px -10px rgba(201,163,78,.8)}}'

    + '.spl__emblem-core svg{width:70%;height:70%;filter:drop-shadow(0 0 20px rgba(201,163,78,.9))}'

    /* ═══ Title Group ═══ */
    + '.spl__title-group{margin-bottom:32px;animation:splFadeIn 1s ease-out .6s both}'
    + '.spl__welcome{font-family:"Noto Kufi Arabic",sans-serif;font-size:13px;'
    + 'color:var(--gold-2,#e8c878);letter-spacing:4px;margin-bottom:8px;opacity:.7;font-weight:600}'
    + '.spl__title{font-family:"Noto Kufi Arabic",sans-serif;font-weight:900;'
    + 'font-size:clamp(24px,5vw,40px);color:#fff;line-height:1.15;letter-spacing:-.5px;'
    + 'margin-bottom:6px;text-shadow:0 4px 30px rgba(0,0,0,.9),0 0 40px rgba(201,163,78,.4)}'
    + '.spl__title .gold{background:linear-gradient(135deg,var(--gold-3,#f5e0a5),var(--gold-2,#e8c878) 50%,var(--gold,#c9a34e));'
    + 'background-size:200% 100%;-webkit-background-clip:text;background-clip:text;'
    + '-webkit-text-fill-color:transparent;animation:splGoldFlow 3s ease-in-out infinite}'
    + '@keyframes splGoldFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}'

    + '.spl__subtitle{font-family:"Noto Kufi Arabic",sans-serif;font-size:13px;'
    + 'color:rgba(232,228,213,.6);letter-spacing:2px;font-weight:600}'

    /* ═══ Country Strip ═══ */
    + '.spl__country{display:flex;align-items:center;gap:12px;margin-bottom:36px;'
    + 'animation:splFadeIn 1s ease-out .8s both}'
    + '.spl__country-line{width:40px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,163,78,.6))}'
    + '.spl__country-line:last-child{background:linear-gradient(90deg,rgba(201,163,78,.6),transparent)}'
    + '.spl__country-text{font-family:"Noto Kufi Arabic",sans-serif;font-size:11px;'
    + 'color:var(--gold,#c9a34e);letter-spacing:3px;font-weight:700}'

    /* ═══ Progress Ultra ═══ */
    + '.spl__progress-wrap{width:100%;max-width:400px;margin-bottom:16px;'
    + 'animation:splFadeIn 1s ease-out 1s both}'

    /* النسبة */
    + '.spl__percent-row{display:flex;align-items:center;justify-content:space-between;'
    + 'margin-bottom:10px;font-family:"Noto Kufi Arabic",sans-serif}'
    + '.spl__percent-label{font-size:10.5px;color:rgba(201,163,78,.6);letter-spacing:2px;font-weight:700}'
    + '.spl__percent{font-family:"Black Ops One",monospace;font-size:24px;'
    + 'color:var(--gold-2,#e8c878);letter-spacing:3px;text-shadow:0 0 30px rgba(201,163,78,.7);'
    + 'transition:color .2s}'
    + '.spl__percent.is-complete{color:#4ade80;text-shadow:0 0 30px #4ade80}'

    /* الشريط */
    + '.spl__progress{position:relative;width:100%;height:6px;background:rgba(201,163,78,.08);'
    + 'border-radius:6px;overflow:hidden;box-shadow:inset 0 0 12px rgba(0,0,0,.6)}'
    + '.spl__progress-bar{height:100%;width:0;position:relative;'
    + 'background:linear-gradient(90deg,var(--gold,#c9a34e),var(--gold-2,#e8c878),var(--gold-3,#f5e0a5));'
    + 'box-shadow:0 0 20px rgba(201,163,78,.9),0 0 40px rgba(201,163,78,.5);'
    + 'border-radius:6px;transition:width .1s linear}'
    + '.spl__progress-bar::after{content:"";position:absolute;inset:0;'
    + 'background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);'
    + 'animation:splShimmer 1.5s linear infinite}'
    + '@keyframes splShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}'

    /* علامات */
    + '.spl__progress-marks{position:absolute;inset:0;display:flex;justify-content:space-between;padding:0 2px;pointer-events:none}'
    + '.spl__mark{width:1px;background:rgba(0,0,0,.4);height:100%}'

    /* ═══ Status ═══ */
    + '.spl__status{display:inline-flex;align-items:center;gap:10px;'
    + 'padding:10px 18px;background:rgba(0,0,0,.5);border:1px solid rgba(201,163,78,.25);'
    + 'border-radius:20px;font-family:"Noto Kufi Arabic",sans-serif;font-size:11.5px;'
    + 'color:var(--text-2,#b0ac95);letter-spacing:1px;font-weight:600;'
    + 'clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);'
    + 'animation:splFadeIn 1s ease-out 1.2s both;min-height:38px;transition:all .3s}'
    + '.spl__status-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;'
    + 'box-shadow:0 0 10px #4ade80;animation:splPulse 1.5s ease-in-out infinite;flex:none}'
    + '@keyframes splPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}'

    /* ═══ HUD Top ═══ */
    + '.spl__hud-top{position:absolute;top:0;inset-inline:0;z-index:20;padding:20px 24px;'
    + 'display:flex;justify-content:space-between;align-items:center;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:10px;'
    + 'color:rgba(201,163,78,.55);letter-spacing:2px;font-weight:700;'
    + 'animation:splFadeIn 1s ease-out both}'
    + '.spl__hud-group{display:flex;align-items:center;gap:16px}'
    + '.spl__hud-item{display:flex;align-items:center;gap:6px}'
    + '.spl__hud-dot{width:5px;height:5px;border-radius:50%;background:#4ade80;'
    + 'box-shadow:0 0 8px #4ade80;animation:splPulse 1.5s ease-in-out infinite}'

    /* ═══ HUD Bottom ═══ */
    + '.spl__hud-bottom{position:absolute;bottom:0;inset-inline:0;z-index:20;padding:20px 24px;'
    + 'display:flex;justify-content:space-between;align-items:center;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:10px;'
    + 'color:rgba(201,163,78,.5);letter-spacing:2px;font-weight:700;'
    + 'animation:splFadeIn 1s ease-out both}'

    /* ═══ Corners ═══ */
    + '.spl__corner{position:absolute;width:60px;height:60px;pointer-events:none;z-index:15}'
    + '.spl__corner svg{width:100%;height:100%;stroke:var(--gold,#c9a34e);fill:none;stroke-width:2;opacity:.8}'
    + '.spl__corner--tl{top:16px;inset-inline-start:16px}'
    + '.spl__corner--tr{top:16px;inset-inline-end:16px;transform:scaleX(-1)}'
    + '.spl__corner--bl{bottom:16px;inset-inline-start:16px;transform:scaleY(-1)}'
    + '.spl__corner--br{bottom:16px;inset-inline-end:16px;transform:scale(-1,-1)}'

    /* ═══ Skip Button ═══ */
    + '.spl__skip{position:absolute;bottom:24px;inset-inline-end:24px;z-index:30;'
    + 'padding:12px 22px;background:rgba(201,163,78,.08);border:1px solid rgba(201,163,78,.4);'
    + 'color:var(--gold-2,#e8c878);font-family:"Noto Kufi Arabic",sans-serif;'
    + 'font-size:12px;font-weight:800;cursor:pointer;letter-spacing:1px;'
    + 'clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);'
    + 'transition:all .3s ease;animation:splFadeIn 1s ease-out 1.5s both;'
    + 'display:flex;align-items:center;gap:8px;backdrop-filter:blur(10px)}'
    + '.spl__skip:hover{background:rgba(201,163,78,.2);border-color:var(--gold,#c9a34e);'
    + 'transform:translateY(-2px);box-shadow:0 8px 24px -6px rgba(201,163,78,.6)}'
    + '.spl__skip:active{transform:scale(.96)}'
    + '.spl__skip svg{width:14px;height:14px}'

    /* ═══ Flash Effect ═══ */
    + '.spl__flash{position:absolute;inset:0;z-index:25;background:radial-gradient(circle,rgba(245,224,165,.9),transparent 60%);'
    + 'opacity:0;pointer-events:none}'
    + '.spl__flash.is-active{animation:splFlash .6s ease-out}'
    + '@keyframes splFlash{0%{opacity:0}50%{opacity:1}100%{opacity:0}}'

    /* ═══ FadeIn Animation ═══ */
    + '@keyframes splFadeIn{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:none}}'

    /* ═══ Mobile ═══ */
    + '@media (max-width: 480px){'
    + '.spl__emblem{width:120px;height:120px;margin-bottom:22px}'
    + '.spl__emblem-ring--2{inset:-10px}'
    + '.spl__emblem-ring--3{inset:-20px}'
    + '.spl__emblem-dot{animation-name:splDotOrbitSm}'
    + '@keyframes splDotOrbitSm{from{transform:rotate(0deg) translateX(70px) rotate(0deg)}to{transform:rotate(360deg) translateX(70px) rotate(-360deg)}}'
    + '.spl__title{font-size:24px}'
    + '.spl__welcome{font-size:11px;letter-spacing:3px}'
    + '.spl__subtitle{font-size:11px}'
    + '.spl__percent{font-size:20px}'
    + '.spl__progress-wrap{max-width:280px}'
    + '.spl__corner{width:40px;height:40px}'
    + '.spl__hud-top,.spl__hud-bottom{padding:14px 16px;font-size:9px;letter-spacing:1.5px}'
    + '.spl__hud-group{gap:10px}'
    + '.spl__skip{bottom:16px;inset-inline-end:16px;padding:10px 16px;font-size:11px}'
    + '.spl__ring:nth-child(1){width:200px;height:200px}'
    + '.spl__ring:nth-child(2){width:300px;height:300px}'
    + '.spl__ring:nth-child(3){width:400px;height:400px}'
    + '.spl__ring:nth-child(4){width:500px;height:500px}'
    + '}'

    /* ═══ Reduced Motion ═══ */
    + '@media (prefers-reduced-motion: reduce){'
    + '.spl *{animation-duration:.01ms !important;animation-iteration-count:1 !important}'
    + '.spl__canvas{display:none}'
    + '}';

  var s = document.createElement('style');
  s.id = 'splashUltraStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ══════════════════════════════════════════════════════════
   Canvas Particles System
   ══════════════════════════════════════════════════════════ */
function startParticles(canvas){
  try {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W, H;
    var particles = [];
    var running = true;
    var rafId = null;

    function resize(){
      W = canvas.width = window.innerWidth * dpr;
      H = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }

    function createParticle(){
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        vy: (Math.random() - 0.5) * 0.3 * dpr,
        r: (Math.random() * 1.5 + 0.3) * dpr,
        alpha: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.3 ? 'gold' : 'red'
      };
    }

    function init(){
      resize();
      var count = Math.min(120, Math.floor((W * H) / 25000));
      particles = [];
      for(var i = 0; i < count; i++) particles.push(createParticle());
    }

    function animate(){
      if(!running) return;
      ctx.clearRect(0, 0, W, H);

      /* ارسم الخطوط أولاً (خلف البطاقات) */
      ctx.strokeStyle = 'rgba(201,163,78,0.06)';
      ctx.lineWidth = 0.5 * dpr;
      for(var i = 0; i < particles.length; i++){
        for(var j = i + 1; j < particles.length; j++){
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if(dist < 150 * dpr){
            ctx.globalAlpha = (1 - dist / (150 * dpr)) * 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      /* ارسم الجزيئات */
      particles.forEach(function(p){
        p.x += p.vx;
        p.y += p.vy;

        if(p.x < 0){ p.x = W; }
        if(p.x > W){ p.x = 0; }
        if(p.y < 0){ p.y = H; }
        if(p.y > H){ p.y = 0; }

        var color = p.hue === 'gold' ? '201,163,78' : '225,29,46';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + color + ',' + p.alpha + ')';
        ctx.shadowColor = 'rgba(' + color + ',0.8)';
        ctx.shadowBlur = 8 * dpr;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafId = requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', init);

    return {
      stop: function(){
        running = false;
        if(rafId) cancelAnimationFrame(rafId);
        window.removeEventListener('resize', init);
      }
    };
  } catch(e){
    return { stop: function(){} };
  }
}

/* ══════════════════════════════════════════════════════════
   الشعار SVG
   ══════════════════════════════════════════════════════════ */
function getEmblemSVG(){
  return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    + '<linearGradient id="splG" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#f5e0a5"/>'
    + '<stop offset="0.5" stop-color="#c9a34e"/>'
    + '<stop offset="1" stop-color="#8a6620"/>'
    + '</linearGradient>'
    + '</defs>'
    + '<path d="M50 8 L82 22 L82 54 C82 74 68 88 50 94 C32 88 18 74 18 54 L18 22 Z" '
    + 'fill="none" stroke="url(#splG)" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M50 30 L56 44 L71 46 L60 56 L63 71 L50 63 L37 71 L40 56 L29 46 L44 44 Z" '
    + 'fill="url(#splG)"/>'
    + '<circle cx="50" cy="52" r="5" fill="#000" opacity="0.3"/>'
    + '</svg>';
}

/* ══════════════════════════════════════════════════════════
   بناء Splash
   ══════════════════════════════════════════════════════════ */
function buildSplash(){
  var el = document.createElement('div');
  el.className = 'spl';
  el.id = 'splScreen';

  el.innerHTML =
    '<canvas class="spl__canvas" id="splCanvas"></canvas>'
    + '<div class="spl__grid"></div>'
    + '<div class="spl__vignette"></div>'

    /* Shockwaves */
    + '<div class="spl__shock"></div>'
    + '<div class="spl__shock"></div>'
    + '<div class="spl__shock"></div>'

    /* Rings */
    + '<div class="spl__rings">'
    + '<div class="spl__ring"></div>'
    + '<div class="spl__ring"></div>'
    + '<div class="spl__ring"></div>'
    + '<div class="spl__ring"></div>'
    + '</div>'

    /* Radar */
    + '<div class="spl__radar"><div class="spl__radar-line"></div></div>'

    + '<div class="spl__scan"></div>'

    /* Corners */
    + '<div class="spl__corner spl__corner--tl"><svg viewBox="0 0 60 60"><path d="M2 2 L28 2 M2 2 L2 28" stroke-linecap="round"/></svg></div>'
    + '<div class="spl__corner spl__corner--tr"><svg viewBox="0 0 60 60"><path d="M2 2 L28 2 M2 2 L2 28" stroke-linecap="round"/></svg></div>'
    + '<div class="spl__corner spl__corner--bl"><svg viewBox="0 0 60 60"><path d="M2 2 L28 2 M2 2 L2 28" stroke-linecap="round"/></svg></div>'
    + '<div class="spl__corner spl__corner--br"><svg viewBox="0 0 60 60"><path d="M2 2 L28 2 M2 2 L2 28" stroke-linecap="round"/></svg></div>'

    /* HUD Top */
    + '<div class="spl__hud-top">'
    + '<div class="spl__hud-group">'
    + '<div class="spl__hud-item"><span class="spl__hud-dot"></span>' + esc(t('system')) + '</div>'
    + '</div>'
    + '<div class="spl__hud-group">'
    + '<div class="spl__hud-item">v1.0</div>'
    + '<div class="spl__hud-item">ELITE</div>'
    + '</div>'
    + '</div>'

    /* HUD Bottom */
    + '<div class="spl__hud-bottom">'
    + '<div>' + esc(t('encrypted')) + ' ✓</div>'
    + '<div>' + new Date().getFullYear() + '</div>'
    + '</div>'

    /* Content */
    + '<div class="spl__content">'

    /* Badge */
    + '<div class="spl__elite">' + esc(t('elite')) + '</div>'

    /* Emblem */
    + '<div class="spl__emblem">'
    + '<div class="spl__emblem-ring spl__emblem-ring--1"></div>'
    + '<div class="spl__emblem-ring spl__emblem-ring--2"></div>'
    + '<div class="spl__emblem-ring spl__emblem-ring--3"></div>'
    + '<div class="spl__emblem-dots">'
    + '<div class="spl__emblem-dot"></div>'
    + '<div class="spl__emblem-dot"></div>'
    + '<div class="spl__emblem-dot"></div>'
    + '<div class="spl__emblem-dot"></div>'
    + '</div>'
    + '<div class="spl__emblem-core">' + getEmblemSVG() + '</div>'
    + '</div>'

    /* Title */
    + '<div class="spl__title-group">'
    + '<div class="spl__welcome">' + esc(t('welcome')) + '</div>'
    + '<h1 class="spl__title">' + esc(t('center')) + ' <span class="gold">' + esc(t('defense')) + '</span></h1>'
    + '<div class="spl__subtitle">' + esc(t('country')) + '</div>'
    + '</div>'

    /* Country Strip */
    + '<div class="spl__country">'
    + '<span class="spl__country-line"></span>'
    + '<span class="spl__country-text">SYRIAN ARAB REPUBLIC</span>'
    + '<span class="spl__country-line"></span>'
    + '</div>'

    /* Progress */
    + '<div class="spl__progress-wrap">'
    + '<div class="spl__percent-row">'
    + '<span class="spl__percent-label" id="splPhaseLabel">' + esc(t('initializing')) + '</span>'
    + '<span class="spl__percent" id="splPercent">0%</span>'
    + '</div>'
    + '<div class="spl__progress">'
    + '<div class="spl__progress-bar" id="splProgressBar"></div>'
    + '<div class="spl__progress-marks">'
    + '<div class="spl__mark"></div><div class="spl__mark"></div><div class="spl__mark"></div>'
    + '<div class="spl__mark"></div><div class="spl__mark"></div><div class="spl__mark"></div>'
    + '<div class="spl__mark"></div><div class="spl__mark"></div>'
    + '</div>'
    + '</div>'
    + '<div class="spl__status" id="splStatus" style="margin-top:18px">'
    + '<span class="spl__status-dot"></span>'
    + '<span id="splStatusText">' + esc(t('initializing')) + '</span>'
    + '</div>'
    + '</div>'

    + '</div>'

    /* Flash */
    + '<div class="spl__flash" id="splFlash"></div>'

    /* Skip */
    + '<button type="button" class="spl__skip" id="splSkip">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + esc(t('skip'))
    + '</button>';

  document.body.appendChild(el);
  return el;
}

/* ══════════════════════════════════════════════════════════
   Run Splash
   ══════════════════════════════════════════════════════════ */
function runSplash(){
  try {
    try { sessionStorage.setItem(KEY, '1'); } catch(e){}

    document.body.style.overflow = 'hidden';
    document.body.classList.add('no-scroll');

    var el = buildSplash();

    /* Particles */
    var canvas = el.querySelector('#splCanvas');
    var particles = canvas ? startParticles(canvas) : { stop: function(){} };

    var progressBar = el.querySelector('#splProgressBar');
    var percentEl = el.querySelector('#splPercent');
    var statusText = el.querySelector('#splStatusText');
    var phaseLabel = el.querySelector('#splPhaseLabel');
    var flash = el.querySelector('#splFlash');
    var skipBtn = el.querySelector('#splSkip');

    var startTime = Date.now();
    var finished = false;
    var rafId = null;
    var lastPhase = -1;

    /* 4 مراحل */
    var phases = [
      { at: 0,  label: t('initializing'), status: t('initializing') },
      { at: 25, label: t('authenticating'), status: t('authenticating') },
      { at: 55, label: t('encrypting'), status: t('encrypting') },
      { at: 80, label: t('arming'), status: t('arming') },
      { at: 98, label: t('ready'), status: t('ready') }
    ];

    function tick(){
      if(finished) return;
      var elapsed = Date.now() - startTime;
      var pct = Math.min(100, (elapsed / DURATION) * 100);

      /* Bar */
      if(progressBar) progressBar.style.width = pct + '%';
      if(percentEl) percentEl.textContent = Math.floor(pct) + '%';

      /* Phase */
      for(var i = phases.length - 1; i >= 0; i--){
        if(pct >= phases[i].at && lastPhase < i){
          lastPhase = i;
          if(phaseLabel) phaseLabel.textContent = phases[i].label;
          if(statusText) statusText.textContent = phases[i].status;
          break;
        }
      }

      if(pct < 100){
        rafId = requestAnimationFrame(tick);
      } else {
        /* 100% */
        if(percentEl){
          percentEl.textContent = '100%';
          percentEl.classList.add('is-complete');
        }
        if(flash){
          flash.classList.add('is-active');
        }
        setTimeout(finish, 400);
      }
    }

    function finish(){
      if(finished) return;
      finished = true;
      if(rafId) cancelAnimationFrame(rafId);
      if(particles && particles.stop) particles.stop();

      el.classList.add('is-hiding');
      setTimeout(function(){
        el.remove();
        document.body.style.overflow = '';
        document.body.classList.remove('no-scroll');
      }, 1000);
    }

    if(skipBtn){
      skipBtn.addEventListener('click', function(e){
        e.preventDefault();
        finish();
      });
    }

    function onEsc(e){
      if(e.key === 'Escape'){
        finish();
        document.removeEventListener('keydown', onEsc);
      }
    }
    document.addEventListener('keydown', onEsc);

    rafId = requestAnimationFrame(tick);

  } catch(e){
    console.error('[splash ultra]', e);
    try { sessionStorage.setItem(KEY, '1'); } catch(err){}
    document.body.style.overflow = '';
  }
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
function init(){
  try {
    injectCSS();
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){
        setTimeout(runSplash, 100);
      });
    } else {
      setTimeout(runSplash, 100);
    }
  } catch(e){
    console.error('[splash ultra]', e);
  }
}

init();

window.__splash = {
  version: '2.0',
  show: function(){
    try { sessionStorage.removeItem(KEY); } catch(e){}
    runSplash();
  }
};

})();
