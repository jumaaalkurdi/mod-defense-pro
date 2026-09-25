/* ══════════════════════════════════════════════════════════
   DEVELOPER SECTION v2 — الجيش السوري الإلكتروني
   بطاقة صغيرة احترافية + توسيع عند الضغط
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ═══ نصوص ثنائية اللغة ═══ */
var TEXTS = {
  ar: {
    badge: 'البنية السيبرانية',
    armyName: 'الجيش السوري الإلكتروني',
    commander: 'قيادة: dark0x1',
    subtitle: 'قوة الدفاع الرقمي الوطنية',
    hint: 'اضغط للتفاصيل الكاملة',
    sectionAbout: 'عن الجيش السوري الإلكتروني',
    sectionAboutText: 'الجيش السوري الإلكتروني هو الذراع الرقمية للجمهورية العربية السورية. تأسس ليكون درعاً وحصناً في مواجهة التهديدات السيبرانية التي تستهدف البنية التحتية الوطنية، ويقوم بمهام الحماية والدفاع والهجوم الوقائي في الفضاء الإلكتروني.',
    sectionCommander: 'قيادة الفرقة السيبرانية',
    sectionCommanderText: 'يقود الجيش السوري الإلكتروني **dark0x1** — المطور السوري وخبير الأمن السيبراني. يشرف على تدريب الفرق المتخصصة، ويطوّر الأنظمة الدفاعية، ويضع الاستراتيجيات السيبرانية لحماية الوطن رقمياً.',
    sectionWeapons: 'تطوير الأسلحة الإلكترونية',
    sectionWeaponsText: 'يضم الجيش السوري الإلكتروني وحدة متخصصة في تطوير الأسلحة الإلكترونية المتقدمة، تشمل أدوات الحماية الهجومية، منظومات الكشف المبكر، أنظمة الاستجابة للحوادث، والتقنيات الدفاعية الحديثة القادرة على مواجهة أعتى الهجمات الإلكترونية.',
    sectionSoftware: 'برمجيات سرية فائقة التطور',
    sectionSoftwareText: 'يعمل الجيش السوري الإلكتروني على تطوير منظومات برمجية سرية فائقة التطور، تشمل أدوات استخباراتية متقدمة، منصات تحليلية ذكية، أنظمة أتمتة دفاعية، وأدوات استجابة سريعة تعمل في الظل لحماية المصالح الوطنية.',
    sectionComms: 'أنظمة اتصالات متقدمة',
    sectionCommsText: 'طوّر الجيش السوري الإلكتروني أنظمة اتصالات لا تعتمد على البنية التحتية المعاصرة، بل تستخدم شبكات لا مركزية، إرسال بالأقمار الصناعية، وتقنيات Mesh Networking، مما يضمن استمرارية الاتصال حتى في ظل انقطاع الشبكات التقليدية أو استهدافها.',
    sectionQuantum: 'تشفير مضاد للهجمات الكمومية',
    sectionQuantumText: 'يعمل الجيش السوري الإلكتروني على تطوير خوارزميات تشفير غير قابلة للهجمات الكمومية، تعتمد على تقنيات Post-Quantum Cryptography (PQC)، مما يضمن حماية البيانات العسكرية والوطنية لعقود قادمة، حتى مع ظهور الحواسيب الكمومية القادرة على كسر التشفير التقليدي.',
    sectionAI: 'تطوير الذكاء الاصطناعي العسكري',
    sectionAIText: 'يعمل الجيش السوري الإلكتروني على تطوير منظومات الذكاء الاصطناعي العسكري التي تخدم الوطن، تشمل التحليل الذكي للبيانات، التنبؤ بالتهديدات، المساعدات العسكرية الذكية، وأنظمة الدعم في القرارات الاستراتيجية.',
    statTeams: 'فرق متخصصة',
    statOps: 'عملية',
    statUptime: 'جاهزية',
    quote: 'البرمجة أمانة وطنية — كل سطر كود يخدم الوطن',
    skillsTitle: 'التخصصات',
    skills: ['الأمن السيبراني', 'تطوير الويب', 'هندسة الأنظمة', 'تدريب الفرق', 'اختبار الاختراق', 'الدفاع الرقمي']
  },
  en: {
    badge: 'Cyber Infrastructure',
    armyName: 'Syrian Electronic Army',
    commander: 'Command: dark0x1',
    subtitle: 'National Digital Defense Force',
    hint: 'Click for full details',
    sectionAbout: 'About the Syrian Electronic Army',
    sectionAboutText: 'The Syrian Electronic Army is the digital arm of the Syrian Arab Republic. Established as a shield against cyber threats targeting national infrastructure, it carries out protection, defense, and preventive operations in cyberspace.',
    sectionCommander: 'Cyber Division Command',
    sectionCommanderText: 'The Syrian Electronic Army is commanded by **dark0x1** — Syrian developer and cybersecurity expert. He oversees the training of specialized teams, develops defensive systems, and sets cyber strategies to protect the homeland digitally.',
    sectionWeapons: 'Electronic Weapons Development',
    sectionWeaponsText: 'The Syrian Electronic Army includes a specialized unit for developing advanced electronic weapons, including offensive protection tools, early detection systems, incident response systems, and modern defensive technologies capable of confronting the most advanced electronic attacks.',
    sectionSoftware: 'Ultra-Advanced Secret Software',
    sectionSoftwareText: 'The Syrian Electronic Army develops ultra-advanced secret software systems, including advanced intelligence tools, smart analytical platforms, defensive automation systems, and rapid response tools operating in the shadows to protect national interests.',
    sectionComms: 'Advanced Communication Systems',
    sectionCommsText: 'The Syrian Electronic Army has developed communication systems that do not rely on contemporary infrastructure. Instead, they use decentralized networks, satellite transmission, and Mesh Networking technologies, ensuring communication continuity even when traditional networks are cut off or targeted.',
    sectionQuantum: 'Quantum-Resistant Encryption',
    sectionQuantumText: 'The Syrian Electronic Army develops encryption algorithms resistant to quantum attacks, based on Post-Quantum Cryptography (PQC) technologies, ensuring the protection of military and national data for decades to come, even with the emergence of quantum computers capable of breaking traditional encryption.',
    sectionAI: 'Military AI Development',
    sectionAIText: 'The Syrian Electronic Army develops military AI systems serving the homeland, including intelligent data analysis, threat prediction, military smart assistants, and strategic decision support systems.',
    statTeams: 'Specialized Teams',
    statOps: 'Operations',
    statUptime: 'Readiness',
    quote: 'Programming is a national trust — every line of code serves the homeland',
    skillsTitle: 'Specialties',
    skills: ['Cybersecurity', 'Web Development', 'Systems Engineering', 'Team Training', 'Penetration Testing', 'Digital Defense']
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

function tArr(key){
  var lang = getLang();
  var dict = TEXTS[lang] || TEXTS.ar;
  return dict[key] || TEXTS.ar[key] || [];
}

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('devStylesV2')) return;
  var css = ''
    /* ═══ حاوية القسم ═══ */
    + '.dev-v2{position:relative;z-index:1;padding:40px 0 60px}'
    + '.dev-v2__container{max-width:900px;margin-inline:auto}'

    /* ═══ البطاقة المدمجة ═══ */
    + '.dev-card{position:relative;background:linear-gradient(145deg,rgba(13,17,8,.92),rgba(6,7,10,.96));'
    + 'border:1.5px solid var(--line-2);border-radius:20px;overflow:hidden;'
    + 'box-shadow:0 20px 60px -20px rgba(0,0,0,.9),0 0 40px -15px rgba(201,163,78,.25);'
    + 'transition:all .4s cubic-bezier(.16,1,.3,1);cursor:pointer}'
    + '.dev-card::before{content:"";position:absolute;top:0;inset-inline:0;height:2px;'
    + 'background:linear-gradient(90deg,transparent,var(--gold),var(--gold-2),var(--gold),transparent);'
    + 'z-index:2;pointer-events:none}'

    /* ═══ الرأس المدمج (دائماً مرئي) ═══ */
    + '.dev-card__head{position:relative;display:flex;align-items:center;gap:18px;padding:20px 24px;'
    + 'transition:all .3s}'
    + '.dev-card__head:hover{background:rgba(201,163,78,.04)}'

    /* أيقونة القيادة */
    + '.dev-card__avatar{flex:none;width:68px;height:68px;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;'
    + 'border-radius:18px;position:relative;'
    + 'box-shadow:0 8px 24px -6px rgba(201,163,78,.7),0 0 0 1.5px rgba(201,163,78,.3);'
    + 'transition:all .4s cubic-bezier(.16,1,.3,1)}'
    + '.dev-card__avatar svg{width:34px;height:34px;transition:transform .4s}'
    + '.dev-card__avatar::after{content:"";position:absolute;top:4px;right:4px;width:12px;height:12px;'
    + 'background:#4ade80;border-radius:50%;border:2.5px solid #06070a;'
    + 'box-shadow:0 0 10px rgba(74,222,128,.9);animation:devDotV2 2s ease-in-out infinite}'
    + '@keyframes devDotV2{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.2)}}'

    /* النص */
    + '.dev-card__info{flex:1;min-width:0;text-align:start}'
    + '.dev-card__eyebrow{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;'
    + 'background:rgba(201,163,78,.12);border:1px solid var(--line-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:9.5px;font-weight:800;'
    + 'letter-spacing:1.5px;color:var(--gold-2);margin-bottom:6px;'
    + 'clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)}'
    + '.dev-card__title{font-family:"Noto Kufi Arabic",sans-serif;font-size:clamp(15px,2.5vw,19px);'
    + 'font-weight:900;color:#fff;line-height:1.25;margin-bottom:4px}'
    + '.dev-card__sub{font-family:"Noto Kufi Arabic",sans-serif;font-size:12.5px;'
    + 'color:var(--gold-2);font-weight:700;display:flex;align-items:center;gap:6px;flex-wrap:wrap}'
    + '.dev-card__sub svg{width:13px;height:13px;flex:none}'
    + '.dev-card__sub span{color:var(--text-3);font-weight:500}'

    /* زر التوسيع (سهم) */
    + '.dev-card__toggle{flex:none;width:40px;height:40px;display:grid;place-items:center;'
    + 'border:1.5px solid var(--line-2);background:rgba(201,163,78,.06);color:var(--gold-2);'
    + 'border-radius:12px;transition:all .4s cubic-bezier(.16,1,.3,1)}'
    + '.dev-card__toggle svg{width:18px;height:18px;transition:transform .4s cubic-bezier(.16,1,.3,1)}'
    + '.dev-card.is-open .dev-card__toggle{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-color:var(--gold)}'
    + '.dev-card.is-open .dev-card__toggle svg{transform:rotate(180deg)}'
    + '.dev-card__head:hover .dev-card__toggle{transform:scale(1.05)}'

    /* ═══ المحتوى القابل للتوسيع ═══ */
    + '.dev-card__content{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s cubic-bezier(.16,1,.3,1)}'
    + '.dev-card.is-open .dev-card__content{grid-template-rows:1fr}'
    + '.dev-card__inner{overflow:hidden}'
    + '.dev-card__body{padding:0 24px 24px;border-top:1px solid var(--line);padding-top:24px}'

    /* ═══ رأس صغير للتفاصيل ═══ */
    + '.dev-card__commander{display:flex;align-items:center;gap:12px;padding:12px 14px;'
    + 'background:linear-gradient(135deg,rgba(201,163,78,.1),rgba(201,163,78,.02));'
    + 'border:1px solid var(--line-2);border-radius:12px;margin-bottom:20px}'
    + '.dev-card__commander-icon{flex:none;width:44px;height:44px;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;'
    + 'border-radius:12px;font-family:"Black Ops One",monospace;font-size:15px;font-weight:400}'
    + '.dev-card__commander-info{flex:1;min-width:0}'
    + '.dev-card__commander-name{font-family:"Noto Kufi Arabic",sans-serif;font-size:14px;'
    + 'font-weight:800;color:#fff;margin-bottom:2px}'
    + '.dev-card__commander-role{font-family:"Noto Kufi Arabic",sans-serif;font-size:11.5px;'
    + 'color:var(--gold-2);font-weight:600}'

    /* ═══ أقسام المقال ═══ */
    + '.dev-sec{margin-bottom:22px}'
    + '.dev-sec:last-child{margin-bottom:0}'
    + '.dev-sec__title{display:flex;align-items:center;gap:10px;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:14px;font-weight:800;'
    + 'color:var(--gold-2);margin-bottom:10px;padding-bottom:8px;'
    + 'border-bottom:1px solid var(--line);position:relative}'
    + '.dev-sec__title::after{content:"";position:absolute;bottom:-1px;inset-inline-start:0;'
    + 'width:40px;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}'
    + '.dev-sec__title svg{width:18px;height:18px;flex:none}'
    + '.dev-sec__text{font-family:"Noto Kufi Arabic",sans-serif;font-size:13.5px;'
    + 'line-height:1.95;color:var(--text-2)}'
    + '.dev-sec__text strong{color:var(--gold-2);font-weight:800}'

    /* ═══ الإحصائيات ═══ */
    + '.dev-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}'
    + '.dev-stat{text-align:center;padding:14px 10px;'
    + 'background:rgba(201,163,78,.06);border:1px solid var(--line-2);border-radius:12px;'
    + 'transition:all .3s}'
    + '.dev-stat:hover{background:rgba(201,163,78,.12);transform:translateY(-2px)}'
    + '.dev-stat__num{display:block;font-family:"Black Ops One",monospace;font-size:22px;'
    + 'color:var(--gold-2);line-height:1;margin-bottom:6px}'
    + '.dev-stat__label{font-family:"Noto Kufi Arabic",sans-serif;font-size:10.5px;'
    + 'color:var(--text-3);font-weight:600}'

    /* ═══ المهارات ═══ */
    + '.dev-skills{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}'
    + '.dev-skill{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;'
    + 'background:rgba(201,163,78,.06);border:1px solid var(--line-2);border-radius:20px;'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:11.5px;font-weight:700;'
    + 'color:var(--text-2);transition:all .25s}'
    + '.dev-skill:hover{background:rgba(201,163,78,.14);border-color:var(--gold);color:var(--gold-2)}'
    + '.dev-skill svg{width:12px;height:12px;color:var(--gold-2);flex:none}'

    /* ═══ الاقتباس ═══ */
    + '.dev-quote{margin-top:22px;padding:18px 22px;text-align:center;'
    + 'font-family:"Amiri",serif;font-size:19px;color:var(--gold-3);line-height:1.9;'
    + 'background:linear-gradient(135deg,rgba(201,163,78,.08),rgba(201,163,78,.02));'
    + 'border:1px solid var(--line-2);border-radius:14px;position:relative}'
    + '.dev-quote::before{content:"❝";color:var(--gold);font-size:26px;'
    + 'display:block;margin-bottom:4px;opacity:.6;line-height:1}'

    /* ═══ الجوال ═══ */
    + '@media (max-width:640px){'
    + '.dev-v2{padding:30px 0 40px}'
    + '.dev-card__head{padding:16px 18px;gap:14px}'
    + '.dev-card__avatar{width:58px;height:58px;border-radius:14px}'
    + '.dev-card__avatar svg{width:28px;height:28px}'
    + '.dev-card__eyebrow{font-size:9px;padding:2px 8px;letter-spacing:1px}'
    + '.dev-card__title{font-size:15px}'
    + '.dev-card__sub{font-size:11.5px}'
    + '.dev-card__toggle{width:34px;height:34px;border-radius:10px}'
    + '.dev-card__toggle svg{width:16px;height:16px}'
    + '.dev-card__body{padding:0 18px 18px;padding-top:18px}'
    + '.dev-card__commander{padding:10px 12px;gap:10px}'
    + '.dev-card__commander-icon{width:38px;height:38px;font-size:13px}'
    + '.dev-card__commander-name{font-size:13px}'
    + '.dev-card__commander-role{font-size:11px}'
    + '.dev-sec__title{font-size:13px}'
    + '.dev-sec__text{font-size:12.5px;line-height:1.85}'
    + '.dev-stat__num{font-size:18px}'
    + '.dev-stat__label{font-size:10px}'
    + '.dev-skill{font-size:11px;padding:6px 10px}'
    + '.dev-quote{font-size:16px;padding:14px 16px}'
    + '}'
    + '@media (max-width:400px){'
    + '.dev-card__head{padding:14px 14px;gap:12px}'
    + '.dev-card__avatar{width:52px;height:52px}'
    + '.dev-card__avatar svg{width:24px;height:24px}'
    + '.dev-card__title{font-size:14px}'
    + '.dev-card__body{padding:0 14px 14px;padding-top:14px}'
    + '}';
  var s = document.createElement('style');
  s.id = 'devStylesV2';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ بناء HTML ═══ */
function buildHTML(){
  var lang = getLang();
  var skills = tArr('skills');

  var skillsHtml = '';
  skills.forEach(function(s){
    skillsHtml += '<span class="dev-skill">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + s + '</span>';
  });

  return '<div class="container dev-v2__container">'
    + '<div class="dev-card" id="devCard" role="button" tabindex="0" aria-expanded="false">'

    + '<div class="dev-card__head">'
    + '<div class="dev-card__avatar">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">'
    + '<path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/>'
    + '<path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>'
    + '</div>'
    + '<div class="dev-card__info">'
    + '<div class="dev-card__eyebrow">' + t('badge') + '</div>'
    + '<div class="dev-card__title">' + t('armyName') + '</div>'
    + '<div class="dev-card__sub">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + t('commander')
    + '<span>•</span>'
    + t('subtitle')
    + '</div>'
    + '</div>'
    + '<div class="dev-card__toggle" aria-hidden="true">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + '</div>'
    + '</div>'

    + '<div class="dev-card__content">'
    + '<div class="dev-card__inner">'
    + '<div class="dev-card__body">'

    + '<div class="dev-card__commander">'
    + '<div class="dev-card__commander-icon">&lt;/&gt;</div>'
    + '<div class="dev-card__commander-info">'
    + '<div class="dev-card__commander-name">dark0x1</div>'
    + '<div class="dev-card__commander-role">' + t('sectionCommander') + '</div>'
    + '</div>'
    + '</div>'

    + '<div class="dev-sec">'
    + '<div class="dev-sec__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/></svg>'
    + t('sectionAbout')
    + '</div>'
    + '<div class="dev-sec__text">' + formatText(t('sectionAboutText')) + '</div>'
    + '</div>'

    + '<div class="dev-sec">'
    + '<div class="dev-sec__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + t('sectionCommander')
    + '</div>'
    + '<div class="dev-sec__text">' + formatText(t('sectionCommanderText')) + '</div>'
    + '</div>'

    + '<div class="dev-sec">'
    + '<div class="dev-sec__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke-linecap="round"/></svg>'
    + t('sectionWeapons')
    + '</div>'
    + '<div class="dev-sec__text">' + formatText(t('sectionWeaponsText')) + '</div>'
    + '</div>'

    + '<div class="dev-sec">'
    + '<div class="dev-sec__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a3 3 0 0 0 3 3h1v2h2v-2h1a3 3 0 0 0 3-3v-1h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Z" stroke-linejoin="round"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>'
    + t('sectionAI')
    + '</div>'
    + '<div class="dev-sec__text">' + formatText(t('sectionAIText')) + '</div>'
    + '</div>'

    + '<div class="dev-sec">'
    + '<div class="dev-sec__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v8M8 12h8" stroke-linecap="round"/></svg>'
    + t('sectionSoftware')
    + '</div>'
    + '<div class="dev-sec__text">' + formatText(t('sectionSoftwareText')) + '</div>'
    + '</div>'

    + '<div class="dev-sec">'
    + '<div class="dev-sec__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + t('sectionComms')
    + '</div>'
    + '<div class="dev-sec__text">' + formatText(t('sectionCommsText')) + '</div>'
    + '</div>'

    + '<div class="dev-sec">'
    + '<div class="dev-sec__title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v8M12 14v8M2 12h8M14 12h8" stroke-linecap="round"/><circle cx="12" cy="12" r="3"/><path d="M5 5l4 4M19 5l-4 4M5 19l4-4M19 19l-4-4" stroke-linecap="round"/></svg>'
    + t('sectionQuantum')
    + '</div>'
    + '<div class="dev-sec__text">' + formatText(t('sectionQuantumText')) + '</div>'
    + '</div>'

    + '<div class="dev-stats">'
    + '<div class="dev-stat"><span class="dev-stat__num">+40</span><span class="dev-stat__label">' + t('statTeams') + '</span></div>'
    + '<div class="dev-stat"><span class="dev-stat__num">+2500</span><span class="dev-stat__label">' + t('statOps') + '</span></div>'
    + '<div class="dev-stat"><span class="dev-stat__num">24/7</span><span class="dev-stat__label">' + t('statUptime') + '</span></div>'
    + '</div>'

    + '<div class="dev-skills">' + skillsHtml + '</div>'

    + '<div class="dev-quote">' + t('quote') + '</div>'

    + '</div>'
    + '</div>'
    + '</div>'

    + '</div>'
    + '</div>';
}

function formatText(text){
  if(!text) return '';
  return String(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/* ═══ إدارة التوسيع ═══ */
function setupToggle(card){
  var head = card.querySelector('.dev-card__head');
  if(!head) return;

  function toggle(){
    var isOpen = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  head.addEventListener('click', toggle);

  card.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      toggle();
    }
  });
}

/* ═══ إعادة البناء عند تغيير اللغة ═══ */
function rebuild(){
  var sec = document.getElementById('devV2Section');
  if(!sec) return;
  sec.innerHTML = buildHTML();
  var card = document.getElementById('devCard');
  if(card) setupToggle(card);
}

/* ═══ حقن القسم ═══ */
function injectSection(){
  var home = document.getElementById('pageHome');
  if(!home) return false;
  var existing = document.getElementById('devV2Section');
  if(existing){
    /* موجود — فقط تأكد من الترجمة */
    if(existing.dataset.lang !== getLang()){
      existing.dataset.lang = getLang();
      rebuild();
    }
    return true;
  }

  var sec = document.createElement('section');
  sec.id = 'devV2Section';
  sec.className = 'dev-v2';
  sec.dataset.lang = getLang();
  sec.innerHTML = buildHTML();

  /* أضف قبل Footer */
  var footer = document.querySelector('.footer');
  if(footer && footer.parentNode){
    footer.parentNode.insertBefore(sec, footer);
  } else {
    home.appendChild(sec);
  }

  var card = document.getElementById('devCard');
  if(card) setupToggle(card);

  return true;
}

/* ═══ INIT ═══ */
function init(){
  injectCSS();
  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(injectSection() || tries >= 40) clearInterval(iv);
  }, 200);
  setTimeout(injectSection, 1000);
  setTimeout(injectSection, 3000);

  /* استمع لتغيير اللغة */
  if(window.MutationObserver){
    var mo = new MutationObserver(function(){
      var sec = document.getElementById('devV2Section');
      if(sec && sec.dataset.lang !== getLang()){
        sec.dataset.lang = getLang();
        rebuild();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__devSectionV2 = { refresh: injectSection, rebuild: rebuild };

})();
