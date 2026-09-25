/* ══════════════════════════════════════════════════════════
   SMART SEARCH PRO — بحث ذكي شامل
   ✅ يبحث في: الأخبار + الشريط + الأكثر قراءة + الفرق
              + معرض الصور + معرض الفيديو + القادة
   ✅ حماية XSS كاملة
   ✅ تطبيع عربي (يتجاهل التشكيل والهمزات)
   ✅ تطابق ضبابي (Fuzzy)
   ✅ نتائج مصنّفة
   ✅ يعمل مع أي محتوى جديد تلقائياً
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ═══ نصوص ثنائية اللغة ═══ */
var TEXTS = {
  ar: {
    placeholder: 'ابحث في كل المحتوى...',
    results: 'نتيجة',
    resultsFor: 'نتائج البحث عن:',
    noResults: 'لا توجد نتائج',
    clear: 'مسح',
    clearSearch: 'إلغاء البحث',
    searchIn: 'البحث في:',
    categories: {
      news: 'الأخبار',
      video: 'الفيديو',
      gallery: 'الصور',
      commanders: 'القادة',
      elite: 'الفرق القتالية',
      ticker: 'الشريط العاجل',
      mostread: 'الأكثر قراءة'
    },
    noContent: 'لم يُعثر على محتوى',
    viewItem: 'عرض',
    noCatResults: 'لا نتائج في هذه الفئة'
  },
  en: {
    placeholder: 'Search all content...',
    results: 'results',
    resultsFor: 'Results for:',
    noResults: 'No results found',
    clear: 'Clear',
    clearSearch: 'Cancel Search',
    searchIn: 'Search in:',
    categories: {
      news: 'News',
      video: 'Videos',
      gallery: 'Photos',
      commanders: 'Commanders',
      elite: 'Elite Units',
      ticker: 'Breaking Ticker',
      mostread: 'Most Read'
    },
    noContent: 'No content found',
    viewItem: 'View',
    noCatResults: 'No results in this category'
  }
};

function getLang(){
  try {
    var l = document.documentElement.getAttribute('lang') || 'ar';
    return l === 'en' ? 'en' : 'ar';
  } catch(e){ return 'ar'; }
}
function t(key){
  var lang = getLang();
  var dict = TEXTS[lang] || TEXTS.ar;
  return dict[key] || TEXTS.ar[key] || key;
}
function tCat(key){
  var lang = getLang();
  var dict = TEXTS[lang] || TEXTS.ar;
  return (dict.categories && dict.categories[key]) || (TEXTS.ar.categories && TEXTS.ar.categories[key]) || key;
}

/* ═══ 🛡️ حماية XSS كاملة ═══ */
function escapeHtml(s){
  if(s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/=/g, '&#x3D;');
}

/* ✅ حماية السمة */
function safeAttr(s){
  if(s == null) return '';
  /* اقبل فقط الروابط التي تبدأ بـ https:// أو http:// أو data:image/ */
  var str = String(s).trim();
  if(/^(https?:\/\/|data:image\/|\/)/i.test(str) === false){
    /* ارفض أي شيء مشبوه (javascript:، data:text، إلخ) */
    return '';
  }
  return escapeHtml(str);
}

/* ═══ تطبيع العربية (للتوحيد) ═══ */
function normalizeAr(s){
  if(!s) return '';
  s = String(s).toLowerCase();
  s = s.replace(/[\u064B-\u065F\u0670]/g, '');
  s = s.replace(/\u0640/g, '');
  s = s.replace(/[أإآٱ]/g, 'ا');
  s = s.replace(/[ىئ]/g, 'ي');
  s = s.replace(/ة/g, 'ه');
  s = s.replace(/ؤ/g, 'و');
  s = s.replace(/[.,!?،؛:؟«»""''()\[\]{}]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/* ═══ تشابه Levenshtein (للتطابق الضبابي) ═══ */
function levenshtein(a, b){
  if(a === b) return 0;
  if(!a.length) return b.length;
  if(!b.length) return a.length;
  var m = [];
  for(var i = 0; i <= b.length; i++) m[i] = [i];
  for(var j = 0; j <= a.length; j++) m[0][j] = j;
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) === a.charAt(j-1)) m[i][j] = m[i-1][j-1];
      else m[i][j] = Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
    }
  }
  return m[b.length][a.length];
}
function similarity(a, b){
  if(!a || !b) return 0;
  var max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - (levenshtein(a, b) / max);
}

/* ═══ 💾 قراءة كل مصادر البيانات ═══ */
function safeRead(key){
  try {
    var raw = localStorage.getItem(key);
    if(!raw) return [];
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch(e){ return []; }
}

function getAllContent(){
  return {
    news: safeRead('mod_news_v7').map(function(n){
      return {
        id: n.id,
        cat: 'news',
        title: n.title || '',
        excerpt: n.excerpt || '',
        details: n.details || '',
        source: n.source || '',
        image: n.image || '',
        date: n.published_at || n.addedAt || 0,
        type: n.cat || 'news',
        original: n
      };
    }),
    video: safeRead('mod_videos_v1').map(function(v){
      return {
        id: v.id,
        cat: 'video',
        title: v.title || '',
        excerpt: v.description || '',
        source: v.category || 'فيديو',
        image: v.thumb || '',
        url: v.url || '',
        date: v.addedAt || 0,
        original: v
      };
    }),
    gallery: (safeRead('mod_gallery_v4').length ? safeRead('mod_gallery_v4') : safeRead('mod_gallery_pro_v3')).map(function(g){
      return {
        id: g.id,
        cat: 'gallery',
        title: g.title || '',
        excerpt: g.description || '',
        source: g.category || 'صورة',
        image: g.image || '',
        date: g.addedAt || 0,
        original: g
      };
    }),
    commanders: safeRead('mod_commanders_v2').map(function(c){
      return {
        id: c.id,
        cat: 'commanders',
        title: c.name || '',
        excerpt: c.rank || '',
        details: c.bio || '',
        source: c.title || 'قائد',
        image: c.photo || '',
        date: c.addedAt || 0,
        original: c
      };
    }),
    elite: safeRead('mod_elite_v7').map(function(e){
      return {
        id: e.id,
        cat: 'elite',
        title: e.name || '',
        excerpt: e.desc || e.description || '',
        source: e.motto || 'فرقة',
        image: '',
        date: 0,
        original: e
      };
    }),
    ticker: safeRead('mod_ticker_v7').map(function(item, idx){
      var text = typeof item === 'string' ? item : (item.text || '');
      return {
        id: 'tk_' + idx,
        cat: 'ticker',
        title: text,
        excerpt: '',
        source: 'الشريط العاجل',
        image: '',
        date: 0,
        original: item
      };
    }),
    mostread: safeRead('mod_mostread_v7').map(function(m){
      return {
        id: m.id,
        cat: 'mostread',
        title: m.title || '',
        excerpt: m.views || '',
        source: 'الأكثر قراءة',
        image: m.image || '',
        date: 0,
        original: m
      };
    })
  };
}

/* ═══ 🔍 محرك البحث الذكي ═══ */
function searchAll(query){
  var qNorm = normalizeAr(query);
  if(qNorm.length < 2) return { items: [], query: query, totals: {} };

  var content = getAllContent();
  var results = [];
  var totals = {};

  Object.keys(content).forEach(function(cat){
    var items = content[cat] || [];
    var catResults = [];

    items.forEach(function(item){
      /* نص البحث: العنوان + المقتطف + التفاصيل + المصدر */
      var searchText = normalizeAr(
        (item.title || '') + ' ' +
        (item.excerpt || '') + ' ' +
        (item.details || '') + ' ' +
        (item.source || '')
      );

      /* مطابقة مباشرة */
      var directMatch = searchText.indexOf(qNorm) !== -1;

      /* مطابقة ضبابية (كل كلمة من الاستعلام) */
      var fuzzyScore = 0;
      if(!directMatch){
        var qWords = qNorm.split(' ').filter(function(w){ return w.length > 2; });
        if(qWords.length > 0){
          var matchCount = 0;
          qWords.forEach(function(qw){
            var sWords = searchText.split(' ');
            var bestSim = 0;
            sWords.forEach(function(sw){
              var sim = similarity(qw, sw);
              if(sim > bestSim) bestSim = sim;
            });
            if(bestSim > 0.75) matchCount++;
          });
          fuzzyScore = matchCount / qWords.length;
        }
      }

      if(directMatch || fuzzyScore > 0.6){
        catResults.push({
          item: item,
          score: directMatch ? 10 : fuzzyScore * 5
        });
      }
    });

    /* رتب نتائج الفئة */
    catResults.sort(function(a, b){ return b.score - a.score; });
    totals[cat] = catResults.length;
    catResults.forEach(function(r){ results.push(r.item); });
  });

  return { items: results, query: query, totals: totals };
}

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('searchProStyles')) return;
  var css = ''
    /* ═══ القسم ═══ */
    + '.search-pro{position:relative;z-index:3;padding:24px 0 28px}'
    + '.search-pro__inner{max-width:720px;margin-inline:auto}'

    /* ═══ الصندوق ═══ */
    + '.search-pro__box{position:relative;display:flex;align-items:center;gap:12px;'
    + 'padding:14px 20px;background:linear-gradient(145deg,rgba(13,17,8,.95),rgba(6,7,10,.98));'
    + 'border:1.5px solid var(--line-2);border-radius:50px;'
    + 'box-shadow:0 16px 44px -16px rgba(0,0,0,.9),0 0 40px -15px rgba(201,163,78,.25);'
    + 'transition:all .35s cubic-bezier(.16,1,.3,1)}'
    + '.search-pro__box:focus-within{border-color:var(--gold);'
    + 'box-shadow:0 16px 44px -16px rgba(0,0,0,.9),0 0 60px -12px rgba(201,163,78,.5)}'
    + '.search-pro__icon{flex:none;width:22px;height:22px;color:var(--gold-2);opacity:.75}'
    + '.search-pro__box:focus-within .search-pro__icon{opacity:1}'
    + '.search-pro__icon svg{width:100%;height:100%}'
    + '.search-pro__input{flex:1;min-width:0;padding:4px 0;background:transparent;border:0;outline:0;'
    + 'color:var(--text);font-family:"Noto Kufi Arabic",sans-serif;font-size:15px;line-height:1.5}'
    + '.search-pro__input::placeholder{color:var(--text-3);font-size:14px}'
    + '.search-pro__clear{flex:none;width:34px;height:34px;display:grid;place-items:center;'
    + 'background:rgba(201,163,78,.08);border:1px solid var(--line-2);border-radius:50%;'
    + 'color:var(--text-2);cursor:pointer;opacity:0;visibility:hidden;'
    + 'transition:all .25s;padding:0}'
    + '.search-pro__clear.is-visible{opacity:1;visibility:visible}'
    + '.search-pro__clear:hover{background:rgba(185,28,28,.2);border-color:var(--alert-red-2);color:#ff7d89}'
    + '.search-pro__clear svg{width:14px;height:14px}'
    + '.search-pro__go{flex:none;width:42px;height:42px;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;'
    + 'border:0;border-radius:50%;cursor:pointer;'
    + 'box-shadow:0 6px 20px -6px rgba(201,163,78,.7);'
    + 'transition:all .3s cubic-bezier(.16,1,.3,1)}'
    + '.search-pro__go:hover{transform:scale(1.08)}'
    + '.search-pro__go:active{transform:scale(.94)}'
    + '.search-pro__go svg{width:18px;height:18px}'

    /* ═══ النتائج ═══ */
    + '.search-results-overlay{position:fixed;inset:0;z-index:2000;background:rgba(3,4,6,.97);'
    + 'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);'
    + 'display:none;flex-direction:column;overflow:hidden;opacity:0;'
    + 'transition:opacity .3s}'
    + '.search-results-overlay.is-open{display:flex;opacity:1}'

    + '.search-results__header{flex:none;padding:16px 20px;border-bottom:1px solid var(--line-2);'
    + 'background:linear-gradient(180deg,rgba(13,17,8,.98),rgba(6,7,10,.95));'
    + 'position:relative;z-index:2}'
    + '.search-results__header-inner{max-width:1100px;margin-inline:auto;display:flex;align-items:center;gap:14px;flex-wrap:wrap}'
    + '.search-results__title{flex:1;min-width:200px;font-family:"Noto Kufi Arabic",sans-serif;font-size:15px;color:#fff;font-weight:800}'
    + '.search-results__title strong{color:var(--gold-2);font-size:16px}'
    + '.search-results__count{font-family:"Noto Kufi Arabic",sans-serif;font-size:12px;color:var(--text-3);padding:5px 12px;background:rgba(0,0,0,.4);border:1px solid var(--line);border-radius:20px}'
    + '.search-results__close{flex:none;width:42px;height:42px;display:grid;place-items:center;'
    + 'background:rgba(185,28,28,.15);border:1px solid rgba(225,29,46,.4);color:#ff7d89;'
    + 'border-radius:50%;cursor:pointer;transition:all .25s;padding:0}'
    + '.search-results__close:hover{background:rgba(185,28,28,.3);transform:rotate(90deg)}'
    + '.search-results__close svg{width:20px;height:20px}'

    /* تصنيفات */
    + '.search-results__cats{flex:none;padding:12px 20px;border-bottom:1px solid var(--line);'
    + 'background:rgba(0,0,0,.3);overflow-x:auto;scrollbar-width:none}'
    + '.search-results__cats::-webkit-scrollbar{display:none}'
    + '.search-results__cats-inner{max-width:1100px;margin-inline:auto;display:flex;gap:8px;white-space:nowrap}'
    + '.search-cat-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;'
    + 'background:rgba(201,163,78,.05);border:1px solid var(--line-2);color:var(--text-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:12.5px;font-weight:700;'
    + 'border-radius:20px;cursor:pointer;transition:all .25s;flex:none}'
    + '.search-cat-btn:hover{background:rgba(201,163,78,.12);border-color:var(--gold);color:var(--gold-2)}'
    + '.search-cat-btn.is-active{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-color:var(--gold)}'
    + '.search-cat-btn__count{display:inline-flex;align-items:center;justify-content:center;'
    + 'min-width:20px;height:18px;padding:0 6px;font-size:10.5px;font-weight:800;'
    + 'background:rgba(0,0,0,.3);color:var(--gold-2);border-radius:99px}'
    + '.search-cat-btn.is-active .search-cat-btn__count{background:rgba(0,0,0,.22);color:#06070a}'

    /* القائمة */
    + '.search-results__body{flex:1;overflow-y:auto;padding:20px}'
    + '.search-results__inner{max-width:1100px;margin-inline:auto}'

    + '.search-group{margin-bottom:28px}'
    + '.search-group__title{display:flex;align-items:center;gap:10px;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:15px;font-weight:800;'
    + 'color:var(--gold-2);margin-bottom:14px;padding-bottom:10px;'
    + 'border-bottom:1px solid var(--line);position:relative}'
    + '.search-group__title::after{content:"";position:absolute;bottom:-1px;inset-inline-start:0;'
    + 'width:50px;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}'
    + '.search-group__title svg{width:18px;height:18px}'
    + '.search-group__count{font-size:11.5px;color:var(--text-3);font-weight:600;padding:3px 10px;background:rgba(0,0,0,.3);border-radius:20px}'

    + '.search-items{display:flex;flex-direction:column;gap:10px}'
    + '.search-item{display:flex;align-items:center;gap:14px;padding:14px 16px;'
    + 'background:linear-gradient(145deg,rgba(13,17,8,.7),rgba(6,7,10,.85));'
    + 'border:1px solid var(--line-2);border-radius:12px;cursor:pointer;'
    + 'transition:all .3s cubic-bezier(.16,1,.3,1);'
    + 'text-decoration:none;color:inherit}'
    + '.search-item:hover{transform:translateX(-4px);border-color:var(--gold);'
    + 'background:linear-gradient(145deg,rgba(30,42,21,.85),rgba(13,17,8,.9))}'

    + '.search-item__thumb{flex:none;width:64px;height:64px;border-radius:10px;overflow:hidden;'
    + 'background:linear-gradient(145deg,#1a2210,#06070a);display:grid;place-items:center;'
    + 'border:1px solid var(--line-2)}'
    + '.search-item__thumb img{width:100%;height:100%;object-fit:cover}'
    + '.search-item__thumb svg{width:32px;height:32px;color:var(--gold-2);opacity:.6}'
    + '.search-item__body{flex:1;min-width:0}'
    + '.search-item__title{font-family:"Noto Kufi Arabic",sans-serif;font-size:14.5px;font-weight:800;'
    + 'color:#fff;margin-bottom:6px;line-height:1.45;'
    + 'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
    + '.search-item:hover .search-item__title{color:var(--gold-2)}'
    + '.search-item__excerpt{font-family:"Noto Kufi Arabic",sans-serif;font-size:12px;'
    + 'color:var(--text-3);line-height:1.6;margin-bottom:4px;'
    + 'display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}'
    + '.search-item__meta{font-family:"Noto Kufi Arabic",sans-serif;font-size:11px;color:var(--text-3);'
    + 'display:flex;align-items:center;gap:8px}'
    + '.search-item__meta span{display:inline-flex;align-items:center;gap:4px}'
    + '.search-item__arrow{flex:none;color:var(--gold-2);opacity:.5;transition:all .3s}'
    + '.search-item:hover .search-item__arrow{opacity:1;transform:translateX(-4px)}'
    + '.search-item__arrow svg{width:18px;height:18px}'

    /* لا نتائج */
    + '.search-no-results{text-align:center;padding:80px 20px;font-family:"Noto Kufi Arabic",sans-serif}'
    + '.search-no-results__icon{width:80px;height:80px;margin:0 auto 20px;display:grid;place-items:center;'
    + 'background:rgba(201,163,78,.08);border:2px solid var(--line-2);border-radius:50%;'
    + 'color:var(--text-3)}'
    + '.search-no-results__icon svg{width:40px;height:40px}'
    + '.search-no-results__title{font-size:18px;font-weight:800;color:#fff;margin-bottom:8px}'
    + '.search-no-results__text{font-size:13px;color:var(--text-3);line-height:1.8}'

    /* الجوال */
    + '@media (max-width:768px){'
    + '.search-pro{padding:16px 0 22px}'
    + '.search-pro__box{padding:11px 16px;gap:10px;border-radius:40px}'
    + '.search-pro__input{font-size:14px}'
    + '.search-pro__input::placeholder{font-size:12.5px}'
    + '.search-pro__icon{width:20px;height:20px}'
    + '.search-pro__go{width:38px;height:38px}'
    + '.search-pro__go svg{width:16px;height:16px}'
    + '.search-pro__clear{width:30px;height:30px}'
    + '.search-results__header{padding:12px 14px}'
    + '.search-results__title{font-size:13px}'
    + '.search-results__title strong{font-size:14px}'
    + '.search-results__cats{padding:10px 14px}'
    + '.search-results__body{padding:14px}'
    + '.search-item{padding:12px 14px;gap:10px}'
    + '.search-item__thumb{width:52px;height:52px}'
    + '.search-item__thumb svg{width:26px;height:26px}'
    + '.search-item__title{font-size:13px}'
    + '.search-item__excerpt{font-size:11.5px}'
    + '.search-results__close{width:38px;height:38px}'
    + '}';
  var s = document.createElement('style');
  s.id = 'searchProStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ بناء شريط البحث ═══ */
function buildSearchBar(){
  return '<div class="container"><div class="search-pro__inner">'
    + '<div class="search-pro__box">'
    + '<span class="search-pro__icon">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" stroke-linecap="round"/></svg>'
    + '</span>'
    + '<input type="search" class="search-pro__input" id="searchProInput" placeholder="' + escapeHtml(t('placeholder')) + '" autocomplete="off" spellcheck="false" maxlength="100">'
    + '<button type="button" class="search-pro__clear" id="searchProClear" aria-label="' + escapeHtml(t('clear')) + '" style="display:none">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>'
    + '</button>'
    + '<button type="button" class="search-pro__go" id="searchProGo" aria-label="search">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + '</button>'
    + '</div></div></div>';
}

/* ═══ حقن شريط البحث ═══ */
function injectSection(){
  var home = document.getElementById('pageHome');
  if(!home) return false;
  var existing = document.getElementById('searchProSection');
  if(existing){
    if(existing.dataset.lang !== getLang()){
      existing.dataset.lang = getLang();
      existing.innerHTML = buildSearchBar();
      bindEvents();
    }
    return true;
  }

  var sec = document.createElement('section');
  sec.id = 'searchProSection';
  sec.className = 'search-pro';
  sec.dataset.lang = getLang();
  sec.innerHTML = buildSearchBar();

  var quran = document.querySelector('.quran-section');
  if(quran && quran.parentNode === home){
    quran.parentNode.insertBefore(sec, quran);
  } else if(home.firstChild){
    home.insertBefore(sec, home.firstChild);
  } else {
    home.appendChild(sec);
  }

  return true;
}

/* ═══ فتح نافذة النتائج ═══ */
var searchState = { results: null, activeCat: 'all' };

function openResults(results){
  searchState.results = results;

  /* احذف النافذة القديمة إن وُجدت */
  var old = document.getElementById('searchResultsOverlay');
  if(old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'searchResultsOverlay';
  overlay.className = 'search-results-overlay';

  var total = results.items.length;
  var totals = results.totals || {};

  /* الفئات التي فيها نتائج */
  var activeCats = Object.keys(totals).filter(function(k){ return totals[k] > 0; });

  var catButtonsHtml = '<button type="button" class="search-cat-btn is-active" data-search-cat="all">'
    + 'الكل <span class="search-cat-btn__count">' + total + '</span>'
    + '</button>';
  activeCats.forEach(function(cat){
    catButtonsHtml += '<button type="button" class="search-cat-btn" data-search-cat="' + escapeHtml(cat) + '">'
      + escapeHtml(tCat(cat))
      + ' <span class="search-cat-btn__count">' + totals[cat] + '</span>'
      + '</button>';
  });

  overlay.innerHTML = '<div class="search-results__header">'
    + '<div class="search-results__header-inner">'
    + '<div class="search-results__title">'
    + '<strong>' + total + '</strong> ' + escapeHtml(t('results')) + ' — ' + escapeHtml(t('resultsFor')) + ' "<span style="color:var(--gold-3)">' + escapeHtml(results.query) + '</span>"'
    + '</div>'
    + '<button type="button" class="search-results__close" id="searchResultsClose">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>'
    + '</button>'
    + '</div>'
    + '</div>'
    + '<div class="search-results__cats">'
    + '<div class="search-results__cats-inner">'
    + catButtonsHtml
    + '</div>'
    + '</div>'
    + '<div class="search-results__body">'
    + '<div class="search-results__inner" id="searchResultsInner"></div>'
    + '</div>';

  document.body.appendChild(overlay);
  document.body.classList.add('no-scroll');

  requestAnimationFrame(function(){ overlay.classList.add('is-open'); });

  /* ارسم النتائج */
  renderResultsList(results, 'all');

  /* ربط الأحداث */
  document.getElementById('searchResultsClose').addEventListener('click', closeResults);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeResults(); });
  document.addEventListener('keydown', escHandler);

  /* أزرار الفئات */
  var catBtns = overlay.querySelectorAll('[data-search-cat]');
  for(var i = 0; i < catBtns.length; i++){
    (function(btn){
      btn.addEventListener('click', function(){
        catBtns.forEach(function(b){ b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.getAttribute('data-search-cat');
        renderResultsList(results, cat);
      });
    })(catBtns[i]);
  }
}

function escHandler(e){
  if(e.key === 'Escape') closeResults();
}

function closeResults(){
  var overlay = document.getElementById('searchResultsOverlay');
  if(overlay){
    overlay.classList.remove('is-open');
    setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 300);
  }
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', escHandler);
}

/* ═══ رسم النتائج ═══ */
function renderResultsList(results, filterCat){
  var inner = document.getElementById('searchResultsInner');
  if(!inner) return;

  var items = results.items;
  if(filterCat && filterCat !== 'all'){
    items = items.filter(function(item){ return item.cat === filterCat; });
  }

  if(!items.length){
    inner.innerHTML = '<div class="search-no-results">'
      + '<div class="search-no-results__icon">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6" stroke-linecap="round"/></svg>'
      + '</div>'
      + '<div class="search-no-results__title">' + escapeHtml(t('noResults')) + '</div>'
      + '<div class="search-no-results__text">حاول استخدام كلمات أخرى أو تحقق من الإملاء</div>'
      + '</div>';
    return;
  }

  /* جمّع حسب الفئة */
  var grouped = {};
  items.forEach(function(item){
    if(!grouped[item.cat]) grouped[item.cat] = [];
    grouped[item.cat].push(item);
  });

  var html = '';
  var catOrder = ['news', 'commanders', 'elite', 'video', 'gallery', 'mostread', 'ticker'];

  catOrder.forEach(function(cat){
    var catItems = grouped[cat];
    if(!catItems || !catItems.length) return;

    html += '<div class="search-group">'
      + '<h3 class="search-group__title">'
      + getCatIcon(cat)
      + escapeHtml(tCat(cat))
      + '<span class="search-group__count">' + catItems.length + '</span>'
      + '</h3>'
      + '<div class="search-items">';

    catItems.forEach(function(item){
      html += buildResultItem(item);
    });

    html += '</div></div>';
  });

  /* أي فئات أخرى */
  Object.keys(grouped).forEach(function(cat){
    if(catOrder.indexOf(cat) !== -1) return;
    var catItems = grouped[cat];
    if(!catItems || !catItems.length) return;
    html += '<div class="search-group">'
      + '<h3 class="search-group__title">' + escapeHtml(tCat(cat)) + '<span class="search-group__count">' + catItems.length + '</span></h3>'
      + '<div class="search-items">';
    catItems.forEach(function(item){ html += buildResultItem(item); });
    html += '</div></div>';
  });

  inner.innerHTML = html;

  /* ربط النقر */
  var items_els = inner.querySelectorAll('[data-search-item]');
  for(var i = 0; i < items_els.length; i++){
    (function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        handleItemClick(el.getAttribute('data-search-item'), el.getAttribute('data-search-cat'));
      });
    })(items_els[i]);
  }
}

/* ═══ بناء عنصر نتيجة — 🛡️ XSS Safe ═══ */
function buildResultItem(item){
  var title = escapeHtml(item.title || '');
  var excerpt = escapeHtml((item.excerpt || '').substring(0, 160));
  var source = escapeHtml(item.source || '');
  var imgUrl = item.image ? safeAttr(item.image) : '';
  var itemId = escapeHtml(item.id || '');
  var itemCat = escapeHtml(item.cat || '');

  var thumbInner = imgUrl
    ? '<img src="' + imgUrl + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'">'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' + getCatIconPath(item.cat) + '</svg>';

  return '<a class="search-item" href="#" data-search-item="' + itemId + '" data-search-cat="' + itemCat + '">'
    + '<div class="search-item__thumb">' + thumbInner + '</div>'
    + '<div class="search-item__body">'
    + '<div class="search-item__title">' + title + '</div>'
    + (excerpt ? '<div class="search-item__excerpt">' + excerpt + '</div>' : '')
    + '<div class="search-item__meta">'
    + (source ? '<span>📌 ' + source + '</span>' : '')
    + '</div>'
    + '</div>'
    + '<div class="search-item__arrow">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M14 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + '</div>'
    + '</a>';
}

function getCatIcon(cat){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + getCatIconPath(cat) + '</svg>';
}

function getCatIconPath(cat){
  switch(cat){
    case 'news': return '<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5" stroke-linecap="round"/>';
    case 'video': return '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="m10 11 5 3-5 3z" fill="currentColor"/>';
    case 'gallery': return '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="m21 15-5-5-9 9" stroke-linecap="round"/>';
    case 'commanders': return '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" stroke-linecap="round"/>';
    case 'elite': return '<path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/><path d="M12 7l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" stroke-linejoin="round"/>';
    case 'ticker': return '<path d="M12 5v14M5 12h14" stroke-linecap="round"/>';
    case 'mostread': return '<path d="M3 17l6-6 4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 7h7v7" stroke-linecap="round" stroke-linejoin="round"/>';
    default: return '<circle cx="12" cy="12" r="9"/>';
  }
}

/* ═══ عند النقر على نتيجة ═══ */
function handleItemClick(itemId, itemCat){
  closeResults();

  try {
    if(itemCat === 'news'){
      /* افتح صفحة الخبر */
      if(window.__app && typeof window.__app.openArticle === 'function'){
        window.__app.openArticle(itemId);
      } else {
        window.location.hash = 'article/' + itemId;
        /* أو استدعاء الراوتر */
        if(window.showPage) window.showPage('article', itemId);
      }
    } else if(itemCat === 'commanders'){
      if(window.__cmdr && typeof window.__cmdr.open === 'function'){
        window.__cmdr.open(itemId);
      }
    } else if(itemCat === 'video'){
      /* انتقل لقسم الفيديوهات */
      var videosSection = document.getElementById('vpxSection');
      if(videosSection) videosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if(itemCat === 'gallery'){
      var gallerySection = document.getElementById('gpxSection');
      if(gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if(itemCat === 'elite'){
      window.location.hash = 'elite-units';
      if(window.showPage) window.showPage('elite-units');
    } else if(itemCat === 'ticker'){
      var newsSection = document.getElementById('news');
      if(newsSection) newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if(itemCat === 'mostread'){
      if(window.showPage) window.showPage('mostread-article', itemId);
    }
  } catch(e){ console.error('[search click]', e); }
}

/* ═══ تنفيذ البحث ═══ */
function runSearch(){
  try {
    var input = document.getElementById('searchProInput');
    if(!input) return;

    var q = (input.value || '').trim();
    if(q.length < 2){
      /* كلمة قصيرة جداً */
      if(q.length > 0){
        /* تنبيه قصير */
        input.style.borderColor = 'rgba(225,29,46,.5)';
        setTimeout(function(){ input.style.borderColor = ''; }, 800);
      }
      return;
    }

    /* سجّل البحث */
    console.log('[search] query:', q);

    var results = searchAll(q);
    openResults(results);

  } catch(e){ console.error('[search]', e); }
}

/* ═══ إعادة البناء عند تغيير اللغة ═══ */
function rebuildSearchBar(){
  var sec = document.getElementById('searchProSection');
  if(!sec) return;
  sec.innerHTML = buildSearchBar();
  bindEvents();
}

/* ═══ ربط الأحداث ═══ */
function bindEvents(){
  var input = document.getElementById('searchProInput');
  var clearBtn = document.getElementById('searchProClear');
  var goBtn = document.getElementById('searchProGo');

  if(input){
    input.addEventListener('input', function(){
      var v = input.value.trim();
      if(clearBtn){
        if(v.length > 0){ clearBtn.classList.add('is-visible'); clearBtn.style.display = ''; }
        else { clearBtn.classList.remove('is-visible'); clearBtn.style.display = 'none'; }
      }
    });

    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        var v = input.value.trim();
        if(v.length >= 2) runSearch();
      }
      if(e.key === 'Escape'){
        input.value = '';
        if(clearBtn){ clearBtn.classList.remove('is-visible'); clearBtn.style.display = 'none'; }
      }
    });
  }

  if(clearBtn){
    clearBtn.addEventListener('click', function(){
      if(input){
        input.value = '';
        input.focus();
      }
      clearBtn.classList.remove('is-visible');
      clearBtn.style.display = 'none';
    });
  }

  if(goBtn){
    goBtn.addEventListener('click', function(){
      if(input){
        var v = input.value.trim();
        if(v.length >= 2) runSearch();
        else input.focus();
      }
    });
  }
}

/* ═══ INIT ═══ */
function init(){
  injectCSS();

  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(injectSection()){
      clearInterval(iv);
      bindEvents();
    }
    if(tries >= 40) clearInterval(iv);
  }, 200);

  /* استمع لتغيير اللغة */
  if(window.MutationObserver){
    var mo = new MutationObserver(function(){
      var sec = document.getElementById('searchProSection');
      if(sec && sec.dataset.lang !== getLang()){
        sec.dataset.lang = getLang();
        rebuildSearchBar();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__searchPro = {
  search: runSearch,
  searchQuery: function(q){
    if(!q || q.length < 2) return null;
    return searchAll(q);
  },
  openResults: openResults,
  closeResults: closeResults,
  allContent: function(){ return getAllContent(); }
};

})();
