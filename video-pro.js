(function(){
'use strict';

var REPO = { owner:'jumaaalkurdi', repo:'mod-defense-pro', branch:'main', path:'content' };
var TOKEN_KEY = 'mod_gh_token';
var VKEY = 'mod_videos_v1';

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function uid(){ return 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function getToken(){ try { return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''; } catch(e){ return ''; } }

function getYouTubeId(url){
  if(!url || typeof url !== 'string') return null;
  var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
function getVimeoId(url){
  if(!url || typeof url !== 'string') return null;
  var m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}
function isDirectVideo(url){
  return url && /\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(url);
}
function getAutoThumb(url){
  var yt = getYouTubeId(url);
  if(yt) return 'https://img.youtube.com/vi/' + yt + '/hqdefault.jpg';
  var vm = getVimeoId(url);
  if(vm) return 'https://vumbnail.com/' + vm + '_large.jpg';
  return '';
}

function svgThumb(seed){
  var colors = ['#c9a34e','#e8c878','#8a6620','#f5e0a5'];
  var c = colors[Math.abs(seed) % colors.length];
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">'
    + '<defs>'
    + '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#1a2210"/>'
    + '<stop offset="0.5" stop-color="#0f1408"/>'
    + '<stop offset="1" stop-color="#06070a"/>'
    + '</linearGradient>'
    + '<radialGradient id="glow" cx="50%" cy="50%" r="50%">'
    + '<stop offset="0" stop-color="' + c + '" stop-opacity="0.12"/>'
    + '<stop offset="1" stop-color="' + c + '" stop-opacity="0"/>'
    + '</radialGradient>'
    + '</defs>'
    + '<rect width="800" height="450" fill="url(#g)"/>'
    + '<rect width="800" height="450" fill="url(#glow)"/>'
    + '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
}

var now = Date.now();
var DEFAULTS = [
  { id:'v_d1', title:'عرض عسكري رسمي', description:'عرض مهيب لوحدات القوات المسلحة في الساحة الرئيسية', category:'فعاليات رسمية', url:'', thumb:'', addedAt: now - 86400000 },
  { id:'v_d2', title:'تدريبات ميدانية', description:'تدريبات القوات الخاصة في الميدان بأحدث التجهيزات', category:'تدريبات', url:'', thumb:'', addedAt: now - 86400000*2 },
  { id:'v_d3', title:'مراسم رفع العلم', description:'مراسم رفع العلم في المناسبات الوطنية الرسمية', category:'مراسم رسمية', url:'', thumb:'', addedAt: now - 86400000*3 }
];

function loadV(){
  try {
    var r = localStorage.getItem(VKEY);
    if(!r) return DEFAULTS.slice();
    var p = JSON.parse(r);
    if(!p || !p.length) return DEFAULTS.slice();
    return p;
  } catch(e){ return DEFAULTS.slice(); }
}
function saveV(d){ try { localStorage.setItem(VKEY, JSON.stringify(d)); } catch(e){} }

function toast(msg, type){
  type = type || 'info';
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var el = document.createElement('div');
  el.className = 'toast toast--' + type;
  el.innerHTML = '<span>' + esc(msg) + '</span>';
  c.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('is-show'); });
  setTimeout(function(){ el.classList.remove('is-show'); setTimeout(function(){ el.remove(); }, 400); }, 3400);
}

function injectCSS(){
  if(document.getElementById('vpxStyles')) return;
  var css = [
    '.vpx-section{position:relative;z-index:1}',
    '.vpx-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:32px;padding-bottom:22px;border-bottom:1px solid var(--line);flex-wrap:wrap;position:relative}',
    '.vpx-head::after{content:"";position:absolute;bottom:-1px;inset-inline-start:0;width:120px;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}',
    '.vpx-filters{display:flex;flex-wrap:wrap;gap:8px;width:100%;margin-top:14px}',
    '.vpx-f{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border:1px solid var(--line-2);background:rgba(201,163,78,.04);font-size:13px;font-weight:600;color:var(--text-2);font-family:"Noto Kufi Arabic",sans-serif;transition:all .25s ease;white-space:nowrap;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);cursor:pointer}',
    '.vpx-f:hover{color:#fff;border-color:var(--gold);background:rgba(201,163,78,.12)}',
    '.vpx-f.is-active{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-color:var(--gold);font-weight:800}',
    '.vpx-f__c{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:18px;padding:0 6px;font-size:10.5px;font-weight:700;background:rgba(0,0,0,.3);color:var(--gold-2);border-radius:99px}',
    '.vpx-f.is-active .vpx-f__c{background:rgba(0,0,0,.22);color:#06070a}',
    '.vpx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}',
    '.vpx-card{position:relative;background:rgba(19,26,13,.9);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--line);overflow:hidden;cursor:pointer;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));transition:transform .5s cubic-bezier(.16,1,.3,1),border-color .3s,box-shadow .5s}',
    '.vpx-card:hover{transform:translateY(-6px);border-color:var(--line-3);box-shadow:0 30px 70px -25px rgba(0,0,0,.95),0 0 40px -15px rgba(201,163,78,.4)}',
    '.vpx-card__m{position:relative;aspect-ratio:16/9;overflow:hidden;background:linear-gradient(140deg,#1e2a15,#0d1108)}',
    '.vpx-card__m img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(.16,1,.3,1)}',
    '.vpx-card:hover .vpx-card__m img{transform:scale(1.08)}',
    '.vpx-card__m::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(6,8,10,.85));pointer-events:none}',
    '.vpx-card__play{position:absolute;top:50%;inset-inline-start:50%;transform:translate(-50%,-50%) scale(.7);width:72px;height:72px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-radius:50%;opacity:.95;transition:all .5s cubic-bezier(.16,1,.3,1);box-shadow:0 12px 40px -8px rgba(201,163,78,.9),0 0 0 8px rgba(201,163,78,.15);z-index:2;pointer-events:none}',
    
    '@keyframes vpxPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:.2}}',
    '.vpx-card__play svg{width:28px;height:28px;margin-inline-start:4px;fill:#06070a}',
    '.vpx-card:hover .vpx-card__play{transform:translate(-50%,-50%) scale(1.1);box-shadow:0 16px 50px -8px rgba(201,163,78,1),0 0 0 12px rgba(201,163,78,.2)}',
    '.vpx-card__cat{position:absolute;top:12px;inset-inline-start:12px;z-index:2;padding:5px 11px;font-size:10.5px;font-weight:800;font-family:"Noto Kufi Arabic",sans-serif;letter-spacing:.5px;background:rgba(6,8,10,.85);backdrop-filter:blur(8px);border:1px solid var(--line-2);color:var(--gold-2);clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}',
    '.vpx-card__b{padding:16px 18px 18px;position:relative;z-index:2}',
    '.vpx-card__t{font-family:"Noto Kufi Arabic",sans-serif;font-weight:700;font-size:15.5px;line-height:1.5;color:#fff;margin-bottom:6px;transition:color .25s}',
    '.vpx-card:hover .vpx-card__t{color:var(--gold-2)}',
    '.vpx-card__d{font-size:12.5px;line-height:1.7;color:var(--text-2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.vpx-lb{position:fixed;inset:0;z-index:2000;background:rgba(3,4,6,.98);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.16,1,.3,1)}',
    '.vpx-lb.is-open{opacity:1;pointer-events:auto}',
    '.vpx-lb__x{position:absolute;top:18px;inset-inline-end:18px;width:48px;height:48px;display:grid;place-items:center;background:rgba(201,163,78,.1);border:1px solid var(--line-2);color:var(--gold-2);border-radius:50%;cursor:pointer;font-size:20px;font-family:inherit;transition:all .25s;z-index:10}',
    '.vpx-lb__x:hover{background:rgba(185,28,28,.25);border-color:#e11d2e;color:#ff7d89;transform:rotate(90deg)}',
    '.vpx-lb__nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;display:grid;place-items:center;background:rgba(6,8,10,.7);backdrop-filter:blur(12px);border:1px solid var(--line-2);color:var(--gold-2);border-radius:50%;cursor:pointer;transition:all .25s;z-index:10;font-family:inherit}',
    '.vpx-lb__nav:hover{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-color:var(--gold);transform:translateY(-50%) scale(1.1)}',
    '.vpx-lb__nav svg{width:24px;height:24px}',
    '.vpx-lb__nav--p{inset-inline-start:18px}',
    '.vpx-lb__nav--n{inset-inline-end:18px}',
    '.vpx-lb__s{width:min(94vw,1100px);aspect-ratio:16/9;clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px));border:1px solid var(--line-2);background:#000;box-shadow:0 40px 100px -30px rgba(0,0,0,1),0 0 80px -30px rgba(201,163,78,.35);position:relative;overflow:hidden}',
    '.vpx-lb__s iframe,.vpx-lb__s video{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}',
    '.vpx-lb__i{margin-top:18px;text-align:center;max-width:720px;padding:0 20px}',
    '.vpx-lb__i h3{font-family:"Noto Kufi Arabic",sans-serif;font-weight:800;font-size:19px;color:#fff;margin-bottom:8px;line-height:1.5}',
    '.vpx-lb__i p{font-size:13.5px;line-height:1.85;color:var(--text-2)}',
    '.vpx-lb__c{position:absolute;top:24px;inset-inline-start:24px;padding:7px 14px;background:rgba(6,8,10,.85);backdrop-filter:blur(12px);border:1px solid var(--line-2);color:var(--gold-2);font-family:"Black Ops One",monospace;font-size:13px;letter-spacing:1.5px;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);z-index:10}',
    '.vpx-lb__c strong{color:var(--gold-3)}',
    '.vpx-empty{padding:60px 20px;text-align:center;font-family:"Noto Kufi Arabic",sans-serif;color:var(--text-3);border:1px dashed var(--line-2);grid-column:1/-1}',
    '@media (max-width:768px){',
    '.vpx-grid{grid-template-columns:1fr;gap:14px}',
    '.vpx-card__play{width:56px;height:56px}',
    '.vpx-card__play svg{width:22px;height:22px}',
    '.vpx-card__b{padding:12px 14px 14px}',
    '.vpx-card__t{font-size:13.5px}',
    '.vpx-card__d{font-size:11.5px}',
    '.vpx-lb{padding:60px 10px 14px}',
    '.vpx-lb__x{top:10px;inset-inline-end:10px;width:42px;height:42px;font-size:18px}',
    '.vpx-lb__nav{width:42px;height:42px}',
    '.vpx-lb__nav svg{width:18px;height:18px}',
    '.vpx-lb__nav--p{inset-inline-start:6px}',
    '.vpx-lb__nav--n{inset-inline-end:6px}',
    '.vpx-lb__i h3{font-size:15px}',
    '.vpx-lb__i p{font-size:12px}',
    '.vpx-lb__c{top:14px;inset-inline-start:14px;font-size:11px;padding:5px 10px}',
    '}'
  ].join('');
  var s = document.createElement('style');
  s.id = 'vpxStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

var VDATA = loadV();

function injectSection(){
  var home = document.getElementById('pageHome');
  if(!home) return false;
  if(document.getElementById('vpxSection')) return true;

  var sec = document.createElement('section');
  sec.id = 'vpxSection';
  sec.className = 'section vpx-section';
  sec.innerHTML = '<div class="container">'
    + '<header class="vpx-head reveal">'
      + '<div><span class="section__eyebrow">الأرشيف المرئي</span><h2 class="section__title">معرض الفيديو الرسمي</h2></div>'
      + '<div class="vpx-filters" id="vpxFilters"></div>'
    + '</header>'
    + '<div class="vpx-grid" id="vpxGrid"></div>'
    + '</div>';

  var gpx = document.getElementById('gpxSection');
  if(gpx && gpx.parentNode === home){
    home.insertBefore(sec, gpx);
  } else {
    var news = document.getElementById('news');
    if(news && news.parentNode === home) home.insertBefore(sec, news.nextSibling);
    else home.appendChild(sec);
  }
  return true;
}

function renderGallery(){
  var grid = document.getElementById('vpxGrid');
  var filters = document.getElementById('vpxFilters');
  if(!grid) return;
  var items = VDATA.slice().sort(function(a,b){ return (b.addedAt||0) - (a.addedAt||0); });

  if(filters){
    var cats = { 'all': { n:'الكل', c: items.length } };
    for(var i=0; i<items.length; i++){
      var c = (items[i].category || '').trim() || 'عام';
      if(!cats[c]) cats[c] = { n:c, c:0 };
      cats[c].c++;
    }
    var keys = Object.keys(cats);
    var fh = '';
    for(var k=0; k<keys.length; k++){
      var key = keys[k], v = cats[key];
      fh += '<button type="button" class="vpx-f' + (k===0?' is-active':'') + '" data-vf="' + esc(key) + '">' + esc(v.n) + ' <span class="vpx-f__c">' + v.c + '</span></button>';
    }
    filters.innerHTML = fh;
    var fbs = filters.querySelectorAll('[data-vf]');
    for(var f=0; f<fbs.length; f++){
      (function(b){
        b.addEventListener('click', function(){
          var all = filters.querySelectorAll('.vpx-f');
          for(var x=0; x<all.length; x++) all[x].classList.remove('is-active');
          b.classList.add('is-active');
          var fv = b.getAttribute('data-vf');
          var cards = grid.querySelectorAll('.vpx-card');
          for(var y=0; y<cards.length; y++){
            var cat = cards[y].getAttribute('data-vcat');
            cards[y].style.display = (fv === 'all' || cat === fv) ? '' : 'none';
          }
        });
      })(fbs[f]);
    }
  }

  if(!items.length){
    grid.innerHTML = '<div class="vpx-empty">لا توجد فيديوهات في المعرض حالياً</div>';
    return;
  }
  var html = '';
  for(var j=0; j<items.length; j++){
    var it = items[j];
    var cat = (it.category || '').trim() || 'عام';
    var thumb = it.thumb || getAutoThumb(it.url) || svgThumb(j);
    html += '<article class="vpx-card reveal" data-vid="' + esc(it.id) + '" data-vcat="' + esc(cat) + '" style="--d:' + Math.min(j*0.04, 0.4) + 's">'
      + '<div class="vpx-card__m">'
        + '<img src="' + esc(thumb) + '" alt="' + esc(it.title) + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.src=\'' + svgThumb(j) + '\'">'
        + '<span class="vpx-card__cat">' + esc(cat) + '</span>'
        + '<span class="vpx-card__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>'
      + '</div>'
      + '<div class="vpx-card__b">'
        + '<h3 class="vpx-card__t">' + esc(it.title) + '</h3>'
        + (it.description ? '<p class="vpx-card__d">' + esc(it.description) + '</p>' : '')
      + '</div>'
    + '</article>';
  }
  grid.innerHTML = html;

  var cards = grid.querySelectorAll('[data-vid]');
  for(var m=0; m<cards.length; m++){
    (function(el){
      el.addEventListener('click', function(){ openLB(el.getAttribute('data-vid')); });
    })(cards[m]);
  }
  var rv = grid.querySelectorAll('.reveal:not(.is-in)');
  for(var r=0; r<rv.length; r++) rv[r].classList.add('is-in');
}

var LB = { i:0, list:[] };

function openLB(id){
  var sorted = VDATA.slice().sort(function(a,b){ return (b.addedAt||0) - (a.addedAt||0); });
  var idx = -1;
  for(var i=0; i<sorted.length; i++){ if(sorted[i].id === id){ idx = i; break; } }
  if(idx < 0) return;
  LB.list = sorted;
  LB.i = idx;
  renderLB();
}

function getEmbedHtml(url){
  if(!url) return '<div style="display:grid;place-items:center;height:100%;color:#c9a34e;font-family:\'Noto Kufi Arabic\',sans-serif;text-align:center;padding:40px;"><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:64px;height:64px;margin-bottom:16px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" stroke-linecap="round"/></svg><p style="font-size:16px;font-weight:700;margin:0;">لا يوجد فيديو مُعيَّن</p><p style="font-size:13px;opacity:.7;margin-top:8px;">أضف رابط يوتيوب أو فيميو من لوحة التحكم</p></div></div>';
  var yt = getYouTubeId(url);
  if(yt) return '<iframe src="https://www.youtube-nocookie.com/embed/' + yt + '?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  var vm = getVimeoId(url);
  if(vm) return '<iframe src="https://player.vimeo.com/video/' + vm + '?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  if(isDirectVideo(url)) return '<video src="' + esc(url) + '" controls autoplay playsinline></video>';
  return '<iframe src="' + esc(url) + '" allow="autoplay; fullscreen" allowfullscreen></iframe>';
}

function renderLB(){
  var item = LB.list[LB.i];
  if(!item) return;
  var lb = document.getElementById('vpxLb');
  if(!lb){
    lb = document.createElement('div');
    lb.id = 'vpxLb';
    lb.className = 'vpx-lb';
    document.body.appendChild(lb);
  }
  lb.innerHTML =
    '<div class="vpx-lb__c"><strong>' + (LB.i+1) + '</strong> / ' + LB.list.length + '</div>'
    + '<button type="button" class="vpx-lb__x">✕</button>'
    + (LB.list.length > 1 ? '<button type="button" class="vpx-lb__nav vpx-lb__nav--p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '')
    + (LB.list.length > 1 ? '<button type="button" class="vpx-lb__nav vpx-lb__nav--n"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '')
    + '<div class="vpx-lb__s">' + getEmbedHtml(item.url) + '</div>'
    + '<div class="vpx-lb__i"><h3>' + esc(item.title) + '</h3>' + (item.description ? '<p>' + esc(item.description) + '</p>' : '') + '</div>';

  document.body.classList.add('no-scroll');
  requestAnimationFrame(function(){ lb.classList.add('is-open'); });

  lb.querySelector('.vpx-lb__x').addEventListener('click', closeLB);
  var p = lb.querySelector('.vpx-lb__nav--p');
  var n = lb.querySelector('.vpx-lb__nav--n');
  if(p) p.addEventListener('click', function(e){ e.stopPropagation(); prevLB(); });
  if(n) n.addEventListener('click', function(e){ e.stopPropagation(); nextLB(); });
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', lbKey);
}

function closeLB(){
  var lb = document.getElementById('vpxLb');
  if(!lb) return;
  var v = lb.querySelector('video'); if(v){ try{ v.pause(); }catch(_){} }
  lb.classList.remove('is-open');
  document.removeEventListener('keydown', lbKey);
  setTimeout(function(){ lb.remove(); document.body.classList.remove('no-scroll'); }, 350);
}
function prevLB(){ if(LB.list.length < 2) return; LB.i = (LB.i - 1 + LB.list.length) % LB.list.length; renderLB(); }
function nextLB(){ if(LB.list.length < 2) return; LB.i = (LB.i + 1) % LB.list.length; renderLB(); }
function lbKey(e){
  if(e.key === 'Escape') closeLB();
  else if(e.key === 'ArrowRight') prevLB();
  else if(e.key === 'ArrowLeft') nextLB();
}

/* ═══════ GitHub ═══════ */
function rawUrl(f){ return 'https://raw.githubusercontent.com/' + REPO.owner + '/' + REPO.repo + '/' + REPO.branch + '/' + REPO.path + '/' + f + '?t=' + Date.now(); }
function apiUrl(f){ return 'https://api.github.com/repos/' + REPO.owner + '/' + REPO.repo + '/contents/' + REPO.path + '/' + f; }
function b64(s){ return btoa(unescape(encodeURIComponent(s))); }

function fetchRemote(){
  return fetch(rawUrl('videos.json'), { cache:'no-store' })
    .then(function(r){ if(!r.ok) return null; return r.json(); })
    .catch(function(){ return null; });
}
function getSha(f){
  var tk = getToken();
  if(!tk) return Promise.resolve(null);
  return fetch(apiUrl(f) + '?ref=' + REPO.branch, { headers:{ 'Authorization':'token ' + tk, 'Accept':'application/vnd.github+json' } })
    .then(function(r){ if(!r.ok) return null; return r.json(); })
    .then(function(d){ return d ? d.sha : null; })
    .catch(function(){ return null; });
}
function writeRemote(f, data, msg){
  var tk = getToken();
  if(!tk) return Promise.reject(new Error('أدخل GitHub Token في تبويب الإعدادات'));
  return getSha(f).then(function(sha){
    var body = { message: msg || 'تحديث ' + f, content: b64(JSON.stringify(data, null, 2) + '\n'), branch: REPO.branch };
    if(sha) body.sha = sha;
    return fetch(apiUrl(f), {
      method:'PUT',
      headers:{ 'Authorization':'token ' + tk, 'Accept':'application/vnd.github+json', 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    }).then(function(r){
      if(!r.ok){ return r.json().catch(function(){ return {}; }).then(function(e){ throw new Error(e.message || 'فشل الرفع'); }); }
      return r.json();
    });
  });
}

/* ═══════ ADMIN TAB ═══════ */
function injectAdminTab(){
  var tabs = document.querySelector('.admin-tabs');
  var body = document.querySelector('.admin-panel__body');
  if(!tabs || !body) return false;
  if(document.getElementById('vpxAdminTab')) return true;

  var tab = document.createElement('button');
  tab.className = 'admin-tab';
  tab.id = 'vpxAdminTab';
  tab.setAttribute('data-tab', 'vpx-videos');
  tab.textContent = 'الفيديو';
  tabs.appendChild(tab);

  var content = document.createElement('div');
  content.className = 'admin-tab-content';
  content.setAttribute('data-tab-content', 'vpx-videos');
  content.innerHTML = '<div class="admin-grid">'
    + '<div class="admin-section">'
      + '<div class="admin-section__title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg><span id="vpxFT">إضافة فيديو</span></div>'
      + '<form class="admin-form" id="vpxForm">'
        + '<input type="hidden" id="vpxEid" value="">'
        + '<div class="admin-form__row"><label for="vpxTitle">العنوان *</label><input type="text" id="vpxTitle" required></div>'
        + '<div class="admin-form__row"><label for="vpxCat">التصنيف</label><input type="text" id="vpxCat" placeholder="مثال: فعاليات رسمية"></div>'
        + '<div class="admin-form__row"><label for="vpxUrl">رابط الفيديو *</label><input type="url" id="vpxUrl" placeholder="https://youtube.com/watch?v=..." required></div>'
        + '<div class="admin-form__row"><label for="vpxThumb">صورة الغلاف (اختياري — تُستخرج تلقائياً من يوتيوب)</label><input type="url" id="vpxThumb" placeholder="https://..."></div>'
        + '<div class="admin-form__row"><label for="vpxDesc">الوصف</label><textarea id="vpxDesc" placeholder="وصف مختصر"></textarea></div>'
        + '<div class="admin-form__actions">'
          + '<button class="btn btn--gold" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg><span id="vpxSL">حفظ</span></button>'
          + '<button class="btn btn--outline" type="button" id="vpxCancel" style="display:none;">إلغاء</button>'
        + '</div>'
        + '<div class="admin-form__actions" style="margin-top:14px;">'
          + '<button class="btn btn--gold" type="button" id="vpxPublish"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>نشر الفيديوهات</button>'
          + '<button class="btn btn--outline" type="button" id="vpxPull">📥 تحميل</button>'
        + '</div>'
        + '<div id="vpxHint" style="margin-top:8px;font-family:\'Noto Kufi Arabic\',sans-serif;font-size:11.5px;color:var(--text-3);"></div>'
      + '</form>'
    + '</div>'
    + '<div class="admin-section">'
      + '<div class="admin-section__title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round"/></svg>الفيديوهات (<span id="vpxCount">0</span>)</div>'
      + '<div class="admin-list" id="vpxAdminList"></div>'
    + '</div>'
  + '</div>';
  body.appendChild(content);

  tab.addEventListener('click', function(){
    var at = document.querySelectorAll('.admin-tab');
    var ac = document.querySelectorAll('.admin-tab-content');
    for(var i=0; i<at.length; i++) at[i].classList.remove('is-active');
    for(var j=0; j<ac.length; j++) ac[j].classList.remove('is-active');
    tab.classList.add('is-active');
    content.classList.add('is-active');
    renderAdminList();
  });

  bindAdmin();
  return true;
}

function bindAdmin(){
  var form = document.getElementById('vpxForm');
  if(!form || form.getAttribute('data-b') === '1') return;
  form.setAttribute('data-b', '1');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var id = document.getElementById('vpxEid').value;
    var data = {
      id: id || uid(),
      title: document.getElementById('vpxTitle').value.trim(),
      category: document.getElementById('vpxCat').value.trim(),
      url: document.getElementById('vpxUrl').value.trim(),
      thumb: document.getElementById('vpxThumb').value.trim(),
      description: document.getElementById('vpxDesc').value.trim(),
      addedAt: Date.now()
    };
    if(!data.title || !data.url){ toast('املأ الحقول المطلوبة', 'error'); return; }
    if(id){
      for(var i=0; i<VDATA.length; i++){
        if(VDATA[i].id === id){ data.addedAt = VDATA[i].addedAt || Date.now(); VDATA[i] = data; break; }
      }
    } else {
      VDATA.unshift(data);
    }
    saveV(VDATA);
    renderAdminList();
    resetForm();
    renderGallery();
    toast('تم الحفظ — اضغط "نشر الفيديوهات"', 'success');
  });

  document.getElementById('vpxCancel').addEventListener('click', resetForm);
  document.getElementById('vpxPublish').addEventListener('click', function(){
    toast('جارٍ النشر...', 'info');
    writeRemote('videos.json', VDATA, 'تحديث معرض الفيديو')
      .then(function(){ toast('تم نشر الفيديوهات', 'success'); updateHint(); })
      .catch(function(err){ toast('فشل: ' + err.message, 'error'); });
  });
  document.getElementById('vpxPull').addEventListener('click', function(){
    toast('جارٍ التحميل...', 'info');
    fetchRemote().then(function(remote){
      if(!remote || !remote.length){ toast('لا توجد بيانات', 'info'); return; }
      VDATA = remote;
      saveV(VDATA);
      renderAdminList();
      renderGallery();
      toast('تم التحميل', 'success');
      updateHint();
    });
  });
  updateHint();
}

function resetForm(){
  var f = document.getElementById('vpxForm');
  if(!f) return;
  f.reset();
  document.getElementById('vpxEid').value = '';
  document.getElementById('vpxFT').textContent = 'إضافة فيديو';
  document.getElementById('vpxSL').textContent = 'حفظ';
  document.getElementById('vpxCancel').style.display = 'none';
}

function renderAdminList(){
  var c = document.getElementById('vpxAdminList');
  var cnt = document.getElementById('vpxCount');
  if(cnt) cnt.textContent = VDATA.length;
  if(!c) return;
  if(!VDATA.length){ c.innerHTML = '<div class="admin-empty">لا توجد فيديوهات</div>'; return; }
  var html = '';
  for(var i=0; i<VDATA.length; i++){
    var it = VDATA[i];
    var thumb = it.thumb || getAutoThumb(it.url) || svgThumb(i);
    html += '<div class="admin-item">'
      + '<div class="admin-item__thumb"><img src="' + esc(thumb) + '" alt=""></div>'
      + '<div class="admin-item__content">'
        + (it.category ? '<span class="admin-item__cat">' + esc(it.category) + '</span>' : '')
        + '<div class="admin-item__title">' + esc(it.title) + '</div>'
      + '</div>'
      + '<div class="admin-item__actions">'
        + '<button class="admin-item__btn" data-ved="' + esc(it.id) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
        + '<button class="admin-item__btn admin-item__btn--danger" data-vdl="' + esc(it.id) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
      + '</div>'
    + '</div>';
  }
  c.innerHTML = html;

  var eds = c.querySelectorAll('[data-ved]');
  for(var k=0; k<eds.length; k++){
    (function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-ved');
        var item = null;
        for(var x=0; x<VDATA.length; x++){ if(VDATA[x].id === id){ item = VDATA[x]; break; } }
        if(!item) return;
        document.getElementById('vpxEid').value = item.id;
        document.getElementById('vpxTitle').value = item.title;
        document.getElementById('vpxCat').value = item.category || '';
        document.getElementById('vpxUrl').value = item.url || '';
        document.getElementById('vpxThumb').value = item.thumb || '';
        document.getElementById('vpxDesc').value = item.description || '';
        document.getElementById('vpxFT').textContent = 'تعديل الفيديو';
        document.getElementById('vpxSL').textContent = 'حفظ';
        document.getElementById('vpxCancel').style.display = 'inline-flex';
        var pb = document.querySelector('.admin-panel__body');
        if(pb) pb.scrollTop = 0;
      });
    })(eds[k]);
  }

  var dls = c.querySelectorAll('[data-vdl]');
  for(var m=0; m<dls.length; m++){
    (function(b){
      b.addEventListener('click', function(){
        if(!confirm('حذف هذا الفيديو؟')) return;
        var id = b.getAttribute('data-vdl');
        VDATA = VDATA.filter(function(v){ return v.id !== id; });
        saveV(VDATA);
        renderAdminList();
        renderGallery();
        toast('تم الحذف', 'success');
      });
    })(dls[m]);
  }
}

function updateHint(){
  var h = document.getElementById('vpxHint');
  if(!h) return;
  var tk = getToken();
  h.textContent = tk ? ('جاهز للنشر (' + VDATA.length + ')') : 'أدخل GitHub Token في الإعدادات';
  h.style.color = tk ? 'var(--signal-green)' : 'var(--signal-amber)';
}

function init(){
  injectCSS();

  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(injectSection()){ clearInterval(iv); renderGallery(); }
    else if(tries >= 60){ clearInterval(iv); }
  }, 150);

  var atries = 0;
  var aiv = setInterval(function(){
    atries++;
    if(injectAdminTab()){ clearInterval(aiv); }
    else if(atries >= 80){ clearInterval(aiv); }
  }, 400);

  fetchRemote().then(function(r){
    if(r && r.length){
      var cur = loadV();
      var isDefault = cur.length === DEFAULTS.length && cur[0] && cur[0].id === 'v_d1';
      if(isDefault || !cur.length){
        VDATA = r;
        saveV(VDATA);
        renderGallery();
      }
    }
  });
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__vpx = { videos: function(){ return VDATA; }, refresh: renderGallery };

})();
