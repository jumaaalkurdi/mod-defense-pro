/* ══════════════════════════════════════════════════════════
   DEVELOPER SECTION — قسم المطور dark0x1
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

function injectCSS(){
  if(document.getElementById('devStyles')) return;
  var css = ''
    + '.dev-section{position:relative;z-index:1;padding:60px 0;overflow:hidden}'
    + '.dev-section::before{content:"";position:absolute;inset:0;'
    + 'background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(201,163,78,.08),transparent 70%);pointer-events:none}'
    + '.dev-section__inner{max-width:1000px;margin-inline:auto;padding:40px 34px;'
    + 'background:linear-gradient(160deg,rgba(13,17,8,.92),rgba(6,7,10,.96));'
    + 'border:1.5px solid var(--line-2);'
    + 'clip-path:polygon(0 0,calc(100% - 28px) 0,100% 28px,100% 100%,28px 100%,0 calc(100% - 28px));'
    + 'box-shadow:0 40px 100px -40px rgba(0,0,0,.95),0 0 80px -30px rgba(201,163,78,.35);'
    + 'position:relative;overflow:hidden}'
    + '.dev-section__inner::before{content:"";position:absolute;top:0;inset-inline:0;height:2px;'
    + 'background:linear-gradient(90deg,transparent,var(--gold),var(--gold-2),var(--gold),transparent)}'
    + '.dev-section__inner::after{content:"";position:absolute;bottom:0;inset-inline:0;height:2px;'
    + 'background:linear-gradient(90deg,transparent,var(--gold),var(--gold-2),var(--gold),transparent)}'
    + '.dev-badge{display:inline-flex;align-items:center;gap:10px;padding:7px 18px;'
    + 'background:linear-gradient(135deg,rgba(201,163,78,.16),rgba(201,163,78,.04));'
    + 'border:1px solid var(--line-3);color:var(--gold-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:12px;font-weight:800;'
    + 'letter-spacing:2px;margin-bottom:24px;'
    + 'clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)}'
    + '.dev-badge svg{width:16px;height:16px}'
    + '.dev-header{display:flex;align-items:center;gap:24px;margin-bottom:32px;flex-wrap:wrap}'
    + '.dev-avatar{width:110px;height:110px;flex:none;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,var(--gold),var(--gold-2));'
    + 'color:#06070a;border-radius:50%;'
    + 'box-shadow:0 0 60px -10px rgba(201,163,78,.9),0 0 0 4px rgba(201,163,78,.2),0 0 0 10px rgba(201,163,78,.08);'
    + 'position:relative;animation:devPulse 3s ease-in-out infinite}'
    + '@keyframes devPulse{'
    + '0%,100%{box-shadow:0 0 60px -10px rgba(201,163,78,.9),0 0 0 4px rgba(201,163,78,.2),0 0 0 10px rgba(201,163,78,.08)}'
    + '50%{box-shadow:0 0 80px -6px rgba(201,163,78,1),0 0 0 6px rgba(201,163,78,.3),0 0 0 16px rgba(201,163,78,.12)}}'
    + '.dev-avatar svg{width:56px;height:56px}'
    + '.dev-avatar::after{content:"";position:absolute;top:8px;right:8px;width:16px;height:16px;'
    + 'background:#4ade80;border-radius:50%;border:3px solid #06070a;'
    + 'box-shadow:0 0 12px rgba(74,222,128,1);animation:devDot 2s ease-in-out infinite}'
    + '@keyframes devDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.2)}}'
    + '.dev-info{flex:1;min-width:250px}'
    + '.dev-name{font-family:"Black Ops One",monospace;font-size:clamp(28px,4vw,44px);'
    + 'color:#fff;line-height:1;margin-bottom:8px;'
    + 'background:linear-gradient(135deg,var(--gold-3),var(--gold-2) 30%,var(--gold) 60%,var(--gold-deep));'
    + '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;'
    + 'letter-spacing:1px;direction:ltr;text-align:left}'
    + '.dev-role{font-family:"Noto Kufi Arabic",sans-serif;font-size:16px;font-weight:700;'
    + 'color:var(--gold-2);margin-bottom:10px;display:flex;align-items:center;gap:8px}'
    + '.dev-role svg{width:18px;height:18px}'
    + '.dev-sub{font-family:"Noto Kufi Arabic",sans-serif;font-size:13px;color:var(--text-2);line-height:1.8}'
    + '.dev-article{font-family:"Noto Kufi Arabic",sans-serif;font-size:14.5px;line-height:2;'
    + 'color:var(--text-2);padding:24px 26px;margin-top:20px;'
    + 'background:rgba(0,0,0,.35);border:1px solid var(--line);border-inline-start:3px solid var(--gold);'
    + 'clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}'
    + '.dev-article p{margin-bottom:14px}'
    + '.dev-article p:last-child{margin-bottom:0}'
    + '.dev-article strong{color:var(--gold-2);font-weight:800}'
    + '.dev-article em{color:var(--gold-3);font-style:normal;font-family:"Amiri",serif;font-size:1.1em}'
    + '.dev-skills{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-top:22px}'
    + '.dev-skill{display:flex;align-items:center;gap:10px;padding:12px 14px;'
    + 'background:rgba(201,163,78,.05);border:1px solid var(--line-2);'
    + 'font-family:"Noto Kufi Arabic",sans-serif;font-size:12.5px;font-weight:700;color:var(--text);'
    + 'clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}'
    + '.dev-skill svg{width:16px;height:16px;color:var(--gold-2);flex:none}'
    + '.dev-quote{margin-top:24px;padding:18px 22px;text-align:center;'
    + 'font-family:"Amiri",serif;font-size:20px;color:var(--gold-3);line-height:1.9;'
    + 'background:linear-gradient(135deg,rgba(201,163,78,.08),rgba(201,163,78,.02));'
    + 'border:1px solid var(--line-2);border-inline:0;'
    + 'clip-path:polygon(14px 0,100% 0,100% 100%,0 100%)}'
    + '.dev-quote::before{content:"❝";color:var(--gold);font-size:28px;display:block;margin-bottom:6px;opacity:.6}'
    + '@media (max-width:768px){'
    + '.dev-section__inner{padding:26px 20px}'
    + '.dev-header{flex-direction:column;text-align:center;gap:18px}'
    + '.dev-avatar{width:90px;height:90px}'
    + '.dev-avatar svg{width:46px;height:46px}'
    + '.dev-name{font-size:32px;text-align:center}'
    + '.dev-role{justify-content:center}'
    + '.dev-sub{text-align:center}'
    + '.dev-article{font-size:13.5px;padding:18px 18px;line-height:1.9}'
    + '.dev-skills{grid-template-columns:repeat(2,1fr)}'
    + '.dev-quote{font-size:16px;padding:14px 16px}'
    + '}';
  var s = document.createElement('style');
  s.id = 'devStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

function injectSection(){
  var home = document.getElementById('pageHome');
  if(!home) return false;
  if(document.getElementById('devSection')) return true;

  var sec = document.createElement('section');
  sec.id = 'devSection';
  sec.className = 'dev-section';
  sec.innerHTML = '<div class="container"><div class="dev-section__inner reveal">'
    + '<span class="dev-badge">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + 'المطور السوري'
    + '</span>'
    + '<div class="dev-header">'
    + '<div class="dev-avatar">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">'
    + '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'
    + '</svg>'
    + '</div>'
    + '<div class="dev-info">'
    + '<div class="dev-name">dark0x1</div>'
    + '<div class="dev-role">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/></svg>'
    + 'المطور الرئيسي وخبير الأمن السيبراني'
    + '</div>'
    + '<div class="dev-sub">مطوّر ويب سوري متخصص في الأمن السيبراني وتدريب الفرق الإلكترونية</div>'
    + '</div>'
    + '</div>'

    + '<div class="dev-article">'
    + '<p><strong>المطور السوري dark0x1</strong> — اسم يحمل في طياته معنى الإتقان والاحترافية في مجال تطوير الويب والأمن السيبراني. مطوّر سوري جمع بين البساطة والقوة، وبنى هذا الموقع بنفسه من الصفر إلى أن أصبح منصة إعلامية رسمية بمستوى عالمي.</p>'

    + '<p>لم يكن تطوير هذا الموقع مجرد مهمة تقنية، بل <em>رسالة وطنية</em> أدّاها المطوّر بإخلاص. عمل على تصميم النظام المعماري الكامل، وبرمجة الواجهة الأمامية المتقدمة، وتطبيق نظام إدارة المحتوى، ودمج المساعد العسكري الذكي، وكل ذلك بجودة عالية ومعايير عالمية.</p>'

    + '<p>إلى جانب تطوير الموقع، يشرف <strong>dark0x1</strong> على <strong>تدريب الفرق السيبرانية</strong>، حيث نقل خبراته في الأمن الإلكتروني والدفاع الرقمي إلى المتدربين. أسّس منهجاً تدريبياً متكاملاً يشمل اختبار الاختراق الأخلاقي، حماية البنية التحتية الرقمية، الاستجابة للحوادث السيبرانية، والتحقيق الجنائي الرقمي.</p>'

    + '<p>يتميز المطوّر بفلسفة عمل واضحة: <em>«البرمجة أمانة وطنية — كل سطر كود يخدم الوطن»</em>. آمن بأن التقنية الحديثة قادرة على رفع مستوى الخدمات الرسمية، وأن المؤسسات السورية تستحق منصات رقمية بمستوى عالمي.</p>'

    + '<p>أنجز dark0x1 هذا الموقع بجهد فردي، مستخدماً تقنيات حديثة: JavaScript خالص، GitHub API، Netlify للنشر، PWA للتثبيت، مع نظام حماية متعدد الطبقات ونظام إشعارات ذكي ومساعد ذكاء اصطناعي محلي. كل هذه الميزات نُفّذت بدون أي تكلفة، اعتماداً على أدوات مفتوحة المصدر.</p>'
    + '</div>'

    + '<div class="dev-skills">'
    + '<div class="dev-skill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>تطوير الويب</div>'
    + '<div class="dev-skill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/></svg>الأمن السيبراني</div>'
    + '<div class="dev-skill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke-linecap="round"/></svg>هندسة الأنظمة</div>'
    + '<div class="dev-skill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke-linecap="round" stroke-linejoin="round"/></svg>تدريب الفرق</div>'
    + '<div class="dev-skill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-linecap="round"/></svg>اختبار الاختراق</div>'
    + '<div class="dev-skill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M5 5l14 14M5 19 19 5" stroke-linecap="round"/></svg>الدفاع الرقمي</div>'
    + '</div>'

    + '<div class="dev-quote">'
    + 'البرمجة أمانة وطنية — كل سطر كود يخدم الوطن'
    + '</div>'

    + '</div></div>';

  /* أضف القسم قبل Footer */
  var footer = document.querySelector('.footer');
  if(footer){
    footer.parentNode.insertBefore(sec, footer);
  } else {
    home.appendChild(sec);
  }

  var rv = sec.querySelectorAll('.reveal:not(.is-in)');
  for(var i = 0; i < rv.length; i++) rv[i].classList.add('is-in');

  return true;
}

function init(){
  injectCSS();
  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(injectSection() || tries >= 40) clearInterval(iv);
  }, 200);
  setTimeout(injectSection, 1000);
  setTimeout(injectSection, 3000);
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__devSection = { refresh: injectSection };

})();
