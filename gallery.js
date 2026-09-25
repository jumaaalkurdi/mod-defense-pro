(function(){
'use strict';

/* =========================================================
   CINEMATIC GALLERY — معرض سينمائي ثوري
   ========================================================= */

const CG = {
  images: [],
  currentIndex: 0,
  lightbox: null,
  mouseX: 0,
  mouseY: 0
};

/* ============ الصور (placeholder) ============ */
function getImages(){
  if(window.__data && window.__data.GALLERY_IMAGES){
    return window.__data.GALLERY_IMAGES;
  }
  // صور افتراضية — SVG محلي لا يحتاج إنترنت
  const S = function(n, c){
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
      '<defs><linearGradient id="g' + n + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1a2210"/><stop offset="1" stop-color="#06070a"/>' +
      '</linearGradient></defs>' +
      '<rect width="800" height="600" fill="url(#g' + n + ')"/>' +
      '<g fill="none" stroke="#c9a34e" stroke-width="2" opacity="0.4">' +
      '<circle cx="400" cy="300" r="120"/>' +
      '<circle cx="400" cy="300" r="180"/>' +
      '<circle cx="400" cy="300" r="240"/>' +
      '<path d="M400 180 L500 240 L500 360 L400 420 L300 360 L300 240 Z"/>' +
      '</g>' +
      '<text x="400" y="500" text-anchor="middle" fill="#c9a34e" font-family="sans-serif" font-size="28" font-weight="bold">' + c + '</text>' +
      '</svg>'
    );
  };
  return [
    { src: S(1, 'عرض عسكري رسمي'), title: 'عرض عسكري رسمي', cat: 'عرض' },
    { src: S(2, 'وحدة الفرسان'), title: 'وحدة الفرسان', cat: 'تقليد' },
    { src: S(3, 'تدريبات متقدمة'), title: 'تدريبات متقدمة', cat: 'تدريب' },
    { src: S(4, 'إنجازات ميدانية'), title: 'إنجازات ميدانية', cat: 'ميدان' },
    { src: S(5, 'مشاريع إعمار'), title: 'مشاريع إعمار', cat: 'إعمار' },
    { src: S(6, 'لحظات خالدة'), title: 'لحظات خالدة', cat: 'ذاكرة' }
  ];
}

/* ============ إنشاء القسم ============ */
function createSection(){
  const section = document.createElement('section');
  section.className = 'cg-section';
  section.id = 'cinematicGallery';

  // العنوان
  const header = document.createElement('div');
  header.className = 'cg-header';
  header.innerHTML =
    '<div class="cg-header__content">' +
      '<span class="cg-header__eyebrow">الأرشيف البصري</span>' +
      '<h2 class="cg-header__title">الــمــعــرض الــبــصــري الــرســمــي</h2>' +
      '<p class="cg-header__desc">صور حصرية من الميدان — بجودة عالية وتصميم فريد</p>' +
    '</div>' +
    '<button type="button" class="cg-expand-btn" id="cgExpand">' +
      '<span>عرض الكل</span>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button>';

  // الشبكة
  const grid = document.createElement('div');
  grid.className = 'cg-grid';
  grid.id = 'cgGrid';

  section.appendChild(header);
  section.appendChild(grid);

  // أدخله قبل الفوتر
  const footer = document.querySelector('.footer');
  if(footer && footer.parentNode){
    footer.parentNode.insertBefore(section, footer);
  }
}

/* ============ رسم البطاقات ============ */
function renderGrid(images, expanded){
  const grid = document.getElementById('cgGrid');
  if(!grid) return;
  grid.innerHTML = '';

  const list = expanded ? images : images.slice(0, 4);

  list.forEach((img, i) => {
    const card = document.createElement('article');
    card.className = 'cg-card';
    card.dataset.index = i;

    // فئات خاصة للـ featured layout
    if(i === 0) card.classList.add('cg-card--hero');
    if(i === 3) card.classList.add('cg-card--tall');

    card.innerHTML =
      '<div class="cg-card__inner">' +
        '<div class="cg-card__glow"></div>' +
        '<div class="cg-card__media">' +
          '<img class="cg-card__img" src="' + img.src + '" alt="' + (img.title || '') + '" loading="lazy" referrerpolicy="no-referrer">' +
          '<div class="cg-card__overlay"></div>' +
          '<div class="cg-card__scanlines"></div>' +
        '</div>' +
        '<div class="cg-card__content">' +
          '<span class="cg-card__cat">' + (img.cat || 'صورة') + '</span>' +
          '<h3 class="cg-card__title">' + (img.title || '') + '</h3>' +
          '<button type="button" class="cg-card__btn" aria-label="عرض الصورة">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
              '<circle cx="11" cy="11" r="7"/>' +
              '<path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke-linecap="round"/>' +
            '</svg>' +
            '<span>عرض</span>' +
          '</button>' +
        '</div>' +
        '<div class="cg-card__border"></div>' +
        '<div class="cg-card__corner cg-card__corner--tl"></div>' +
        '<div class="cg-card__corner cg-card__corner--tr"></div>' +
        '<div class="cg-card__corner cg-card__corner--bl"></div>' +
        '<div class="cg-card__corner cg-card__corner--br"></div>' +
      '</div>';

    // أحداث الماوس (3D Tilt)
    const inner = card.querySelector('.cg-card__inner');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * -10;
      const ry = (x - 0.5) * 10;

      inner.style.transform = 'perspective(1200px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(20px)';
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });

    // عند الضغط
    card.addEventListener('click', (e) => {
      if(e.target.closest('.cg-card__btn') || !e.target.closest('button')){
        e.preventDefault();
        openLightbox(images, i);
      }
    });

    grid.appendChild(card);
  });

  // تفعيل Reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if(e.isIntersecting){
        setTimeout(() => e.target.classList.add('is-visible'), idx * 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  grid.querySelectorAll('.cg-card').forEach(card => io.observe(card));
}

/* ============ Lightbox ============ */
function openLightbox(images, startIndex){
  if(CG.lightbox) return;

  CG.images = images;
  CG.currentIndex = startIndex;

  const lb = document.createElement('div');
  lb.className = 'cg-lb';
  lb.innerHTML =
    '<div class="cg-lb__backdrop"></div>' +
    '<button type="button" class="cg-lb__close" aria-label="إغلاق">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
        '<path d="M6 6l12 12M18 6l-12 12" stroke-linecap="round"/>' +
      '</svg>' +
    '</button>' +
    '<button type="button" class="cg-lb__nav cg-lb__nav--prev" aria-label="السابق">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
        '<path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</button>' +
    '<button type="button" class="cg-lb__nav cg-lb__nav--next" aria-label="التالي">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
        '<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</button>' +
    '<div class="cg-lb__stage">' +
      '<img class="cg-lb__img" src="" alt="">' +
    '</div>' +
    '<div class="cg-lb__info">' +
      '<span class="cg-lb__title"></span>' +
      '<span class="cg-lb__counter"></span>' +
    '</div>' +
    '<div class="cg-lb__progress"><div class="cg-lb__progress-bar"></div></div>';

  document.body.appendChild(lb);
  document.body.classList.add('no-scroll');
  CG.lightbox = lb;

  lb.querySelector('.cg-lb__close').addEventListener('click', closeLightbox);
  lb.querySelector('.cg-lb__backdrop').addEventListener('click', closeLightbox);
  lb.querySelector('.cg-lb__nav--prev').addEventListener('click', (e) => { e.stopPropagation(); nav(1); });
  lb.querySelector('.cg-lb__nav--next').addEventListener('click', (e) => { e.stopPropagation(); nav(-1); });

  document.addEventListener('keydown', onKey);

  requestAnimationFrame(() => lb.classList.add('is-open'));
  show();
}

function show(){
  if(!CG.lightbox) return;
  const img = CG.images[CG.currentIndex];
  const imgEl = CG.lightbox.querySelector('.cg-lb__img');
  const titleEl = CG.lightbox.querySelector('.cg-lb__title');
  const counterEl = CG.lightbox.querySelector('.cg-lb__counter');
  const progressBar = CG.lightbox.querySelector('.cg-lb__progress-bar');

  imgEl.style.opacity = '0';
  imgEl.src = img.src;
  imgEl.alt = img.title || '';
  imgEl.onload = () => { imgEl.style.opacity = '1'; };

  if(titleEl) titleEl.textContent = img.title || '';
  if(counterEl) counterEl.textContent = (CG.currentIndex + 1) + ' / ' + CG.images.length;
  if(progressBar) progressBar.style.width = ((CG.currentIndex + 1) / CG.images.length * 100) + '%';
}

function nav(direction){
  if(!CG.images.length) return;
  CG.currentIndex = (CG.currentIndex + direction + CG.images.length) % CG.images.length;
  show();
}

function closeLightbox(){
  if(!CG.lightbox) return;
  const lb = CG.lightbox;
  lb.classList.remove('is-open');
  document.removeEventListener('keydown', onKey);
  setTimeout(() => {
    lb.remove();
    document.body.classList.remove('no-scroll');
    CG.lightbox = null;
  }, 400);
}

function onKey(e){
  if(!CG.lightbox) return;
  if(e.key === 'Escape') closeLightbox();
  else if(e.key === 'ArrowRight') nav(1);
  else if(e.key === 'ArrowLeft') nav(-1);
}

/* ============ توسيع ============ */
function toggleExpand(){
  const btn = document.getElementById('cgExpand');
  if(!btn) return;
  const expanded = btn.dataset.expanded === 'true';

  if(expanded){
    renderGrid(CG.images, false);
    btn.dataset.expanded = 'false';
    btn.querySelector('span').textContent = 'عرض الكل';
  } else {
    renderGrid(CG.images, true);
    btn.dataset.expanded = 'true';
    btn.querySelector('span').textContent = 'عرض أقل';
  }
}

/* ============ INIT ============ */
async function init(){
  createSection();
  CG.images = getImages();
  renderGrid(CG.images, false);

  const btn = document.getElementById('cgExpand');
  if(btn) btn.addEventListener('click', toggleExpand);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 400));
} else {
  setTimeout(init, 400);
}

window.__gallery = { refresh: init };

})();
