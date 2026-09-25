/* ══════════════════════════════════════════════════════════
   I18N — نظام الترجمة (عربي ↔ إنجليزي)
   يترجم الواجهة فقط — المحتوى يبقى عربي
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

var KEY = 'mod_lang_v1';
var HTML = document.documentElement;
var currentLang = loadLang();
var ORIG = new WeakMap();

/* ═══ قاموس الترجمة ═══ */
var DICT = {
  /* Header */
  'وزارة الدفاع': 'Ministry of Defense',
  'الجمهورية العربية السورية': 'Syrian Arab Republic',
  'المركز الإعلامي الرسمي': 'Official Media Center',
  'وزارة الدفاع — سوريا': 'Ministry of Defense — Syria',
  'المركز الإعلامي': 'Media Center',

  /* Command bar */
  'النظام:': 'System:',
  'يعمل': 'Operational',
  'مستوى الاستعداد:': 'Readiness:',
  'مرتفع': 'High',

  /* Ticker */
  'عــاجــل الآن': 'BREAKING NOW',
  'عاجل الآن': 'Breaking Now',

  /* Header actions */
  'تثبيت التطبيق': 'Install App',
  'بث مباشر': 'Live',
  'تغيير ألوان الموقع': 'Change theme',
  'تفعيل الإشعارات': 'Enable notifications',
  'إيقاف الإشعارات': 'Disable notifications',
  'فتح القائمة': 'Open menu',
  'إغلاق': 'Close',
  'العودة إلى الأعلى': 'Back to top',
  'تخطَّ إلى المحتوى الرئيسي': 'Skip to main content',
  'الوقت الحالي': 'Current time',

  /* Drawer */
  'ابحث في الأخبار والبيانات...': 'Search news and statements...',
  'بحث': 'Search',
  'إجراءات سريعة': 'Quick Actions',
  'آخر الأخبار': 'Latest News',
  'البيانات الرسمية': 'Official Statements',
  'الفرق القتالية': 'Elite Units',
  'الجيش الإلكتروني': 'Electronic Army',
  'الأقسام الرئيسية': 'Main Sections',
  'تابعنا رسمياً': 'Follow Us',
  'قنوات الطوارئ': 'Emergency Channels',
  'الخط الساخن': 'Hotline',
  'البريد الرسمي': 'Official Email',
  'الإصدار': 'Version',

  /* Navigation */
  'الرئيسية': 'Home',
  'الأخبار العاجلة': 'Breaking News',
  'الفرق القتالية المتميزة': 'Elite Combat Units',
  'تطوير الأسلحة': 'Weapons Development',
  'أهم المشاريع': 'Major Projects',
  'التقارير': 'Reports',
  'الخدمات': 'Services',
  'البث المباشر': 'Live Broadcast',
  'عن الوزارة': 'About',
  'الهيكل التنظيمي': 'Organizational Structure',
  'القيادة': 'Leadership',
  'الوظائف': 'Careers',
  'الركن الإعلامي': 'Media Center',
  'معرض الصور': 'Photo Gallery',
  'الفيديو': 'Videos',

  /* Sections */
  'من كتاب الله تعالى': 'From the Book of Allah',
  'سورة الأنفال — الآية ٦٠': 'Surah Al-Anfal — Verse 60',
  'رمز السيادة الوطنية': 'Symbol of National Sovereignty',
  'علم الجمهورية العربية السورية': 'Flag of the Syrian Arab Republic',
  'رمز الوطن — درع السيادة — فخر الأجيال': 'Symbol of the Homeland — Shield of Sovereignty — Pride of Generations',

  /* Intro banner */
  'البوابة الإعلامية الرسمية': 'Official Media Portal',
  'صوت المؤسسة العسكرية': 'The Voice of the Military',
  'الرسمي': 'Official',
  'منصة إعلامية موحّدة تنقل الأخبار العاجلة والبيانات الرسمية لوزارة الدفاع في الجمهورية العربية السورية.': 'A unified media platform delivering breaking news and official statements from the Ministry of Defense of the Syrian Arab Republic.',
  'خدمة إلكترونية': 'E-Services',
  'معدل الرضا': 'Satisfaction Rate',
  'تغطية إخبارية': 'News Coverage',
  'القوات المسلحة — في الميدان': 'Armed Forces — In the Field',
  'غلاف الفيديو': 'Video cover',

  /* News section */
  'آخر الأخبار والبيانات': 'Latest News & Statements',
  'الكل': 'All',
  'عاجل': 'Breaking',
  'رسمي': 'Official',
  'تقارير': 'Reports',
  'تعازي': 'Condolences',
  'التفاصيل': 'Details',
  'لا يوجد خبر مميز': 'No featured news',
  'لا توجد أخبار منشورة حالياً.': 'No news published yet.',

  /* Sidebar */
  'الأكثر قراءة': 'Most Read',
  'اليوم': 'Today',
  'قنوات رسمية': 'Official Channels',
  'لا يوجد محتوى': 'No content',

  /* Galleries */
  'الأرشيف المرئي': 'Visual Archive',
  'معرض الفيديو الرسمي': 'Official Video Gallery',
  'معرض الصور الرسمي': 'Official Photo Gallery',
  'لا توجد صور في المعرض حالياً': 'No photos in the gallery yet',
  'لا توجد فيديوهات في المعرض حالياً': 'No videos in the gallery yet',
  'عرض': 'View',

  /* Channels */
  'تواصل معنا': 'Contact Us',
  'القنوات الرسمية': 'Official Channels',

  /* Footer */
  'المركز الإعلامي الرسمي — جميع الأخبار والبيانات المنشورة هنا معتمدة ورسمية.': 'Official Media Center — All news and statements published here are official and authorized.',
  'الوزارة': 'Ministry',
  'الأقسام المتخصصة': 'Specialized Sections',
  'تواصل': 'Contact',
  'تابعنا': 'Follow Us',
  'دمشق — الجمهورية العربية السورية': 'Damascus — Syrian Arab Republic',
  'وزارة الدفاع — الجمهورية العربية السورية. جميع الحقوق محفوظة.': 'Ministry of Defense — Syrian Arab Republic. All rights reserved.',
  'سياسة الخصوصية': 'Privacy Policy',
  'شروط الاستخدام': 'Terms of Use',
  'إمكانية الوصول': 'Accessibility',

  /* Theme panel */
  'المظهر': 'Appearance',
  'الوضع': 'Mode',
  'نهاري': 'Light',
  'ليلي': 'Dark',
  'اختر لون الموقع': 'Choose Site Color',
  'ذهبي كلاسيكي': 'Classic Gold',
  'أزرق ملكي': 'Royal Blue',
  'أحمر قرمزي': 'Crimson Red',
  'أخضر زمردي': 'Emerald Green',
  'بنفسجي ملكي': 'Royal Purple',
  'فيروزي': 'Turquoise',
  'اللغة': 'Language',

  /* Buttons */
  'العودة': 'Back',
  'حفظ': 'Save',
  'إلغاء': 'Cancel',
  'حذف': 'Delete',
  'تعديل': 'Edit',
  'دخول': 'Login',
  'خروج': 'Logout',
  'استعادة': 'Restore',
  'تحقق': 'Verify',
  'المزيد': 'More',

  /* Admin */
  'لوحة التحكم': 'Control Panel',
  'لوحة الإدارة الشاملة — PRO': 'Comprehensive Admin Panel — PRO',
  'منطقة مقيدة — الدخول للمخوّلين فقط': 'Restricted Area — Authorized Access Only',
  'كلمة المرور': 'Password',
  'الرقم السري (PIN)': 'PIN Code',
  'الأخبار': 'News',
  'الشريط العاجل': 'Breaking Ticker',
  'الفرق القتالية': 'Elite Units',
  'الإعدادات': 'Settings',
  'المعرض': 'Gallery',

  /* Toast messages */
  'تم تطبيق اللون': 'Color applied',
  'الوضع النهاري': 'Light mode',
  'الوضع الليلي': 'Dark mode',
  'تم حفظ الإعدادات': 'Settings saved',
  'تم نشر المعرض للزوار': 'Gallery published to visitors',
  'تم نشر المعرض': 'Gallery published',
  'تم نشر الفيديوهات': 'Videos published',
  'تم الحذف': 'Deleted',
  'تمت الإضافة': 'Added',
  'تم التحديث': 'Updated',

  /* Misc */
  'لا توجد صورة': 'No image',
  'جارٍ التحميل...': 'Loading...'
};

/* Build reverse dictionary (English → Arabic) for restoration */
var REVERSE = {};
(function(){
  for (var k in DICT) {
    if (DICT.hasOwnProperty(k)) {
      REVERSE[DICT[k]] = k;
    }
  }
})();

/* ═══ HELPERS ═══ */
function loadLang(){
  try { return localStorage.getItem(KEY) || 'ar'; } catch(e){ return 'ar'; }
}
function saveLang(l){
  try { localStorage.setItem(KEY, l); } catch(e){}
}

var _i18nBusy = false;
function isSkipped(el){
  if (!el) return true;
  if (el.id === 'langBtn') return true;
  if (el.closest && el.closest('#langBtn')) return true;
  if (el.classList && el.classList.contains('lang-btn')) return true;
  if (el.classList && el.classList.contains('lang-btn__code')) return true;
  var tag = el.nodeName;
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' ||
      tag === 'CODE' || tag === 'PRE' || tag === 'NOSCRIPT') return true;
  if (el.hasAttribute && el.hasAttribute('data-no-i18n')) return true;
  if (el.classList && (el.classList.contains('no-i18n') || el.classList.contains('quran-verse'))) return true;
  return false;
}

/* ═══ TRANSLATE (Arabic → English) ═══ */
function translate(root){
  if (!root) return;
  var walker = document.createTreeWalker(root, 4, null, false);
  var node;
  var updates = [];
  while ((node = walker.nextNode())) {
    var text = node.textContent;
    if (!text || !text.trim()) continue;
    var parent = node.parentNode;
    if (!parent || isSkipped(parent)) continue;
    if (parent.closest && parent.closest('#langBtn')) continue;

    if (!ORIG.has(node)) ORIG.set(node, text);
    var original = ORIG.get(node);
    var trimmed = original.trim();
    var translated = DICT[trimmed];
    if (translated) {
      var newText = original.replace(trimmed, translated);
      if (node.textContent !== newText) updates.push([node, newText]);
    }
  }
  for (var i = 0; i < updates.length; i++) {
    try { updates[i][0].textContent = updates[i][1]; } catch(e){}
  }
}

/* ═══ RESTORE (English → Arabic) ═══ */
function restore(root){
  if (!root) return;
  var walker = document.createTreeWalker(root, 4, null, false);
  var node;
  var updates = [];
  while ((node = walker.nextNode())) {
    if (!ORIG.has(node)) continue;
    var orig = ORIG.get(node);
    if (node.textContent !== orig) updates.push([node, orig]);
  }
  for (var i = 0; i < updates.length; i++) {
    try { updates[i][0].textContent = updates[i][1]; } catch(e){}
  }
}

/* ═══ APPLY LANGUAGE ═══ */
function setLang(lang){
  if (_i18nBusy) return;
  if (lang !== 'ar' && lang !== 'en') lang = 'ar';
  _i18nBusy = true;
  currentLang = lang;
  saveLang(lang);
  HTML.setAttribute('lang', lang);
  HTML.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  if (document.body) {
    document.body.classList.toggle('lang-en', lang === 'en');
    document.body.classList.toggle('lang-ar', lang === 'ar');
  }
  if (lang === 'en') {
    translate(document.body);
  } else {
    restore(document.body);
  }
  updateLangUI();
  setTimeout(function(){ _i18nBusy = false; }, 80);
}

/* ═══ UPDATE UI (buttons inside theme panel) ═══ */
function updateLangUI(){
  var btns = document.querySelectorAll('[data-lang-choice]');
  for (var i = 0; i < btns.length; i++) {
    var el = btns[i];
    el.classList.toggle('is-active', el.getAttribute('data-lang-choice') === currentLang);
  }
}

/* ═══ INJECT LANGUAGE SECTION INTO THEME PANEL ═══ */
function injectLangSection(){
  var panel = document.getElementById('themePanel');
  if (!panel) return false;
  if (panel.querySelector('.theme-panel__lang')) return true;

  var grid = panel.querySelector('.theme-panel__grid');
  if (!grid) return false;

  var sec = document.createElement('div');
  sec.className = 'theme-panel__lang';
  sec.innerHTML =
    '<div class="theme-panel__mode-label">اللغة / Language</div>' +
    '<div class="theme-panel__mode-btns">' +
      '<button type="button" class="theme-mode" data-lang-choice="ar">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:22px;height:22px"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke-linecap="round"/></svg>' +
        '<span>عربي</span>' +
      '</button>' +
      '<button type="button" class="theme-mode" data-lang-choice="en">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:22px;height:22px"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke-linecap="round"/></svg>' +
        '<span>English</span>' +
      '</button>' +
    '</div>';

  grid.parentNode.insertBefore(sec, grid);

  var btns = sec.querySelectorAll('[data-lang-choice]');
  for (var i = 0; i < btns.length; i++) {
    (function(b){
      b.addEventListener('click', function(){
        var l = b.getAttribute('data-lang-choice');
        if (l === currentLang) return;
        setLang(l);
        var t = document.getElementById('toastContainer');
        if (t) {
          var toast = document.createElement('div');
          toast.className = 'toast toast--success';
          toast.innerHTML = '<span>' + (l === 'en' ? 'Language: English' : 'اللغة: العربية') + '</span>';
          t.appendChild(toast);
          requestAnimationFrame(function(){ toast.classList.add('is-show'); });
          setTimeout(function(){ toast.classList.remove('is-show'); setTimeout(function(){ toast.remove(); }, 400); }, 2500);
        }
      });
    })(btns[i]);
  }
  updateLangUI();
  return true;
}

/* ═══ INJECT CSS ═══ */
function injectCSS(){
  if (document.getElementById('i18nStyles')) return;
  var css = ''
    /* Language section in theme panel */
    + '.theme-panel__lang{padding:14px 16px 8px;border-bottom:1px solid var(--line)}'
    + '.theme-panel__lang .theme-panel__mode-label{margin-bottom:10px}'
    /* LTR overrides */
    + 'html[dir="ltr"] body{direction:ltr;text-align:left}'
    + 'html[dir="ltr"] .command-bar,'
    + 'html[dir="ltr"] .ticker,'
    + 'html[dir="ltr"] .header,'
    + 'html[dir="ltr"] .drawer,'
    + 'html[dir="ltr"] .footer,'
    + 'html[dir="ltr"] .admin-panel,'
    + 'html[dir="ltr"] .admin-login,'
    + 'html[dir="ltr"] .theme-panel{direction:ltr;text-align:left}'
    + 'html[dir="ltr"] .ticker__track{animation-name:marqueeLtr}'
    + '@keyframes marqueeLtr{from{transform:translateX(0)}to{transform:translateX(-50%)}}'
    + 'html[dir="ltr"] .drawer__link-arrow,'
    + 'html[dir="ltr"] .drawer__social-arrow{transform:rotate(0deg)}'
    + 'html[dir="ltr"] .page-block ul li{padding-inline-start:0;padding-inline-end:24px}'
    + 'html[dir="ltr"] .page-block ul li::before{inset-inline-start:auto;inset-inline-end:0}'
    + 'html[dir="ltr"] .official__value,'
    + 'html[dir="ltr"] .channel-card__value{text-align:left}'
    + 'html[dir="ltr"] .elite-card__motto::before{content:"\\201C "}'
    + 'html[dir="ltr"] .elite-card__motto::after{content:" \\201D"}'
    /* Font for English */
    + 'body.lang-en{font-family:"IBM Plex Sans Arabic",system-ui,sans-serif}'
    + 'body.lang-en .brand__title,body.lang-en .nav__link,'
    + 'body.lang-en .section__title,body.lang-en .featured__title,'
    + 'body.lang-en .news-card__title,body.lang-en .stack-card__title{'
    +   'letter-spacing:-.3px;font-family:"IBM Plex Sans Arabic",system-ui,sans-serif}'
    /* Mobile */
    + '@media (max-width:768px){'
    +   '.theme-panel__lang{padding:12px 14px 6px}'
    +   '.theme-panel__lang .theme-mode svg{width:18px;height:18px}'
    +   '.theme-panel__lang .theme-mode span{font-size:10.5px}'
    + '}';
  var s = document.createElement('style');
  s.id = 'i18nStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ OBSERVER — يتتبع theme panel + المحتوى الديناميكي ═══ */
function startObserver(){
  if (!window.MutationObserver) return;
  var obs = new MutationObserver(function(muts){
    /* تأكد من حقن قسم اللغة في theme panel */
    if (document.getElementById('themePanel') && !document.querySelector('.theme-panel__lang')) {
      injectLangSection();
    }
    /* ترجم المحتوى الجديد إذا كانت اللغة إنجليزية */
    if (currentLang === 'en') {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var n = m.addedNodes[j];
            if (n.nodeType === 1 || n.nodeType === 3) translate(n);
          }
        } else if (m.type === 'characterData') {
          translate(m.target.parentNode);
        }
      }
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

/* ═══ INIT ═══ */
function init(){
  injectCSS();
  HTML.setAttribute('lang', currentLang);
  HTML.setAttribute('dir', currentLang === 'en' ? 'ltr' : 'rtl');
  if (document.body) {
    document.body.classList.toggle('lang-en', currentLang === 'en');
    document.body.classList.toggle('lang-ar', currentLang === 'ar');
  }

  /* انتظر حتى تُنشأ theme panel */
  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if (injectLangSection() || tries >= 30) {
      clearInterval(iv);
    }
  }, 300);

  /* ابدأ المراقبة */
  setTimeout(startObserver, 500);

  /* طبّق اللغة إذا كانت إنجليزية */
  if (currentLang === 'en') {
    setTimeout(function(){ translate(document.body); }, 1000);
    setTimeout(function(){ translate(document.body); }, 2500);
    setTimeout(function(){ translate(document.body); }, 5000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ═══ EXPOSE API ═══ */
window.__i18n = {
  setLang: setLang,
  getLang: function(){ return currentLang; },
  t: function(k){ return DICT[k] || k; },
  translate: translate,
  restore: restore
};

})();
