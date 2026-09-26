/* ══════════════════════════════════════════════════════════
   SEO HELPER — تحسين محركات البحث
   ✅ Meta Tags ديناميكية
   ✅ Schema.org (NewsArticle)
   ✅ Open Graph + Twitter Cards
   ✅ Canonical URLs
   ✅ لا تعطل أي شيء
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var SITE_URL = 'https://mod-defense-sy.netlify.app';
var SITE_NAME = 'المركز الإعلامي — وزارة الدفاع';
var DEFAULT_DESC = 'البوابة الإعلامية الرسمية لوزارة الدفاع في الجمهورية العربية السورية — آخر الأخبار والبيانات الرسمية';
var DEFAULT_IMAGE = SITE_URL + '/icon-512.png';

/* ═══ Helpers ═══ */
function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function setMeta(attr, key, content){
  if(!content) return;
  var selector = 'meta[' + attr + '="' + key + '"]';
  var el = document.querySelector(selector);
  if(!el){
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href){
  if(!href) return;
  var selector = 'link[rel="' + rel + '"]';
  var el = document.querySelector(selector);
  if(!el){
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJSONLD(id, data){
  var el = document.getElementById(id);
  if(!el){
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/* ══════════════════════════════════════════════════════════
   1) Meta Tags الأساسية (مرة واحدة عند التحميل)
   ══════════════════════════════════════════════════════════ */
function injectBaseMeta(){
  setLink('canonical', SITE_URL + '/');
  setLink('alternate', SITE_URL + '/rss.xml');
  var rss = document.querySelector('link[rel="alternate"]');
  if(rss) rss.setAttribute('type', 'application/rss+xml');

  /* Index/Follow */
  setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMeta('name', 'googlebot', 'index, follow');

  /* Language */
  setMeta('http-equiv', 'content-language', 'ar');
  setMeta('name', 'language', 'Arabic');

  /* Geo Tags */
  setMeta('name', 'geo.region', 'SY');
  setMeta('name', 'geo.placename', 'Damascus');
  setMeta('name', 'geo.position', '33.5138;36.2765');
  setMeta('name', 'ICBM', '33.5138, 36.2765');

  /* Mobile */
  setMeta('name', 'mobile-web-app-capable', 'yes');
  setMeta('name', 'apple-mobile-web-app-capable', 'yes');
  setMeta('name', 'apple-mobile-web-app-status-bar-style', 'black-translucent');

  /* Theme */
  setMeta('name', 'theme-color', '#06070a');
  setMeta('name', 'msapplication-TileColor', '#06070a');

  /* Verification (placeholder — ضعها لاحقاً من Google Search Console) */
  /* setMeta('name', 'google-site-verification', 'YOUR_CODE_HERE'); */

  /* Open Graph */
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:locale', 'ar_SY');
  setMeta('property', 'og:locale:alternate', 'en_US');
  setMeta('property', 'og:url', SITE_URL + '/');
  setMeta('property', 'og:title', SITE_NAME);
  setMeta('property', 'og:description', DEFAULT_DESC);
  setMeta('property', 'og:image', DEFAULT_IMAGE);
  setMeta('property', 'og:image:width', '512');
  setMeta('property', 'og:image:height', '512');
  setMeta('property', 'og:image:alt', SITE_NAME);

  /* Twitter */
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:site', '@mod_defense_sy');
  setMeta('name', 'twitter:creator', '@mod_defense_sy');
  setMeta('name', 'twitter:title', SITE_NAME);
  setMeta('name', 'twitter:description', DEFAULT_DESC);
  setMeta('name', 'twitter:image', DEFAULT_IMAGE);

  /* PWA */
  setMeta('name', 'application-name', SITE_NAME);
}

/* ══════════════════════════════════════════════════════════
   2) Schema.org — منظمة إعلامية
   ══════════════════════════════════════════════════════════ */
function injectOrganizationSchema(){
  setJSONLD('schema-org', {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    'name': 'المركز الإعلامي — وزارة الدفاع',
    'alternateName': 'Ministry of Defense Media Center',
    'url': SITE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': DEFAULT_IMAGE,
      'width': 512,
      'height': 512
    },
    'description': DEFAULT_DESC,
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'SY',
      'addressLocality': 'دمشق',
      'addressRegion': 'دمشق'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+963-11-000-0000',
      'contactType': 'customer service',
      'email': 'info@mod.gov.sy',
      'availableLanguage': ['Arabic', 'English']
    },
    'sameAs': [
      'https://t.me/mod_defense_sy',
      'https://x.com/mod_defense_sy'
    ],
    'foundingDate': '2026',
    'knowsLanguage': ['ar', 'en']
  });

  /* Website Schema مع SearchAction */
  setJSONLD('schema-website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': SITE_NAME,
    'url': SITE_URL,
    'inLanguage': 'ar',
    'publisher': {
      '@type': 'NewsMediaOrganization',
      'name': SITE_NAME
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': SITE_URL + '/?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  });

  /* BreadcrumbList */
  setJSONLD('schema-breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'الرئيسية',
        'item': SITE_URL + '/'
      }
    ]
  });
}

/* ══════════════════════════════════════════════════════════
   3) تحديث Meta عند فتح خبر
   ══════════════════════════════════════════════════════════ */
function updateArticleMeta(articleId){
  try {
    var news = [];
    try {
      var raw = localStorage.getItem('mod_news_v7');
      if(raw) news = JSON.parse(raw) || [];
    } catch(e){}

    var item = null;
    for(var i = 0; i < news.length; i++){
      if(news[i].id === articleId){ item = news[i]; break; }
    }
    if(!item){ return; }

    var url = SITE_URL + '/#article/' + encodeURIComponent(articleId);
    var title = (item.title || '') + ' — ' + SITE_NAME;
    var desc = (item.excerpt || item.details || DEFAULT_DESC).substring(0, 160);
    var image = item.image || DEFAULT_IMAGE;

    /* Meta */
    document.title = title;
    setMeta('name', 'description', desc);
    setLink('canonical', url);

    /* Open Graph */
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', image);
    if(item.published_at) setMeta('property', 'article:published_time', item.published_at);
    if(item.source) setMeta('property', 'article:author', item.source);
    if(item.cat) setMeta('property', 'article:section', item.cat);

    /* Twitter */
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', image);

    /* Schema.org — NewsArticle */
    setJSONLD('schema-article', {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': item.title || '',
      'description': desc,
      'image': [image],
      'datePublished': item.published_at || new Date().toISOString(),
      'dateModified': item.updated_at || item.published_at || new Date().toISOString(),
      'author': {
        '@type': 'Organization',
        'name': item.source || 'المركز الإعلامي'
      },
      'publisher': {
        '@type': 'Organization',
        'name': SITE_NAME,
        'logo': {
          '@type': 'ImageObject',
          'url': DEFAULT_IMAGE
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': url
      },
      'inLanguage': 'ar',
      'articleSection': item.cat || 'أخبار',
      'url': url
    });
  } catch(e){}
}

/* ══════════════════════════════════════════════════════════
   4) تحديث Meta عند العودة للرئيسية
   ══════════════════════════════════════════════════════════ */
function resetHomeMeta(){
  document.title = 'وزارة الدفاع — المركز الإعلامي الرسمي | PRO';
  setMeta('name', 'description', DEFAULT_DESC);
  setLink('canonical', SITE_URL + '/');
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', SITE_URL + '/');
  setMeta('property', 'og:title', SITE_NAME);
  setMeta('property', 'og:description', DEFAULT_DESC);
  setMeta('property', 'og:image', DEFAULT_IMAGE);
  setMeta('name', 'twitter:title', SITE_NAME);
  setMeta('name', 'twitter:description', DEFAULT_DESC);
  setMeta('name', 'twitter:image', DEFAULT_IMAGE);

  var articleSchema = document.getElementById('schema-article');
  if(articleSchema) articleSchema.remove();
}

/* ══════════════════════════════════════════════════════════
   5) مراقبة تغييرات الـ Hash
   ══════════════════════════════════════════════════════════ */
function watchHash(){
  function onHashChange(){
    var hash = (location.hash || '').replace('#', '');
    if(hash.indexOf('article/') === 0){
      var id = hash.split('/')[1];
      if(id) setTimeout(function(){ updateArticleMeta(id); }, 200);
    } else {
      resetHomeMeta();
    }
  }
  window.addEventListener('hashchange', onHashChange);
  onHashChange();
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
function init(){
  try {
    injectBaseMeta();
    injectOrganizationSchema();
    watchHash();

    console.log('[SEO Helper] ✅ Ready — Meta + Schema.org + RSS');
  } catch(e){
    console.error('[SEO Helper]', e);
  }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__seo = {
  version: '1.0',
  updateArticle: updateArticleMeta,
  resetHome: resetHomeMeta,
  siteUrl: SITE_URL
};

})();
