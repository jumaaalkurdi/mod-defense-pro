(function(){
'use strict';

const G = {
  images: [],
  currentIndex: 0,
  lightbox: null
};

function createStrip(){
  const strip = document.createElement('section');
  strip.className = 'gallery-strip';
  strip.id = 'galleryStrip';
  strip.innerHTML =
    '<div class="container">' +
      '<div class="gallery-strip__header">' +
        '<div class="gallery-strip__title">' +
          '<span class="gallery-strip__eyebrow">الأرشيف البصري</span>' +
          '<h2 class="gallery-strip__heading">📸 صور رسمية</h2>' +
        '</div>' +
        '<button type="button" class="gallery-strip__expand" id="stripExpand" aria-label="عرض الكل">' +
          '<span>عرض الكل</span>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:14px;height:14px;">' +
            '<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="gallery-strip__track" id="stripTrack"></div>' +
    '</div>';

  const footer = document.querySelector('.footer');
  if(footer && footer.parentNode){
    footer.parentNode.insertBefore(strip, footer);
  }
}

async function loadImages(){
  if(window.__data && window.__data.GALLERY_IMAGES){
    return window.__data.GALLERY_IMAGES;
  }
  return [
    { src: 'https://images.unsplash.com/photo-1579912437766-789d8ac7bd97?w=800&q=80', title: 'عرض عسكري رسمي' },
    { src: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80', title: 'وحدة الفرسان' },
    { src: 'https://images.unsplash.com/photo-1569304662755-6dd7c5607b51?w=800&q=80', title: 'تدريبات متقدمة' },
    { src: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800&q=80', title: 'إنجازات ميدانية' },
    { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80', title: 'مشاريع إعمار' },
    { src: 'https://images.unsplash.com/photo-1591552170914-3a2e0e29a1f2?w=800&q=80', title: 'لحظات خالدة' }
  ];
}

function renderStrip(images){
  const track = document.getElementById('stripTrack');
  if(!track) return;
  track.innerHTML = '';

  images.forEach((img, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'gallery-strip__item';
    item.dataset.index = i;
    item.setAttribute('aria-label', img.title || 'صورة');
    item.innerHTML =
      '<img src="' + img.src + '" alt="' + (img.title || '') + '" loading="lazy" referrerpolicy="no-referrer">' +
      '<span class="gallery-strip__item-overlay"></span>' +
      '<span class="gallery-strip__item-zoom">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
          '<circle cx="11" cy="11" r="7"/>' +
          '<path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke-linecap="round"/>' +
        '</svg>' +
      '</span>';

    item.addEventListener('click', () => openLightbox(images, i));
    track.appendChild(item);
  });
}

function openLightbox(images, startIndex){
  if(G.lightbox) return;

  G.images = images;
  G.currentIndex = startIndex;

  const lb = document.createElement('div');
  lb.className = 'gallery-lb';
  lb.innerHTML =
    '<div class="gallery-lb__backdrop"></div>' +
    '<button type="button" class="gallery-lb__close" aria-label="إغلاق">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
        '<path d="M6 6l12 12M18 6l-12 12" stroke-linecap="round"/>' +
      '</svg>' +
    '</button>' +
    '<button type="button" class="gallery-lb__nav gallery-lb__nav--prev" aria-label="السابق">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
        '<path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</button>' +
    '<button type="button" class="gallery-lb__nav gallery-lb__nav--next" aria-label="التالي">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">' +
        '<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</button>' +
    '<div class="gallery-lb__stage">' +
      '<img class="gallery-lb__img" src="" alt="">' +
    '</div>' +
    '<div class="gallery-lb__info">' +
      '<span class="gallery-lb__title"></span>' +
      '<span class="gallery-lb__counter"></span>' +
    '</div>';

  document.body.appendChild(lb);
  document.body.classList.add('no-scroll');
  G.lightbox = lb;

  lb.querySelector('.gallery-lb__close').addEventListener('click', closeLightbox);
  lb.querySelector('.gallery-lb__backdrop').addEventListener('click', closeLightbox);
  lb.querySelector('.gallery-lb__nav--prev').addEventListener('click', () => nav(1));
  lb.querySelector('.gallery-lb__nav--next').addEventListener('click', () => nav(-1));

  document.addEventListener('keydown', onKey);

  requestAnimationFrame(() => lb.classList.add('is-open'));
  show();
}

function show(){
  if(!G.lightbox) return;
  const img = G.images[G.currentIndex];
  const imgEl = G.lightbox.querySelector('.gallery-lb__img');
  const titleEl = G.lightbox.querySelector('.gallery-lb__title');
  const counterEl = G.lightbox.querySelector('.gallery-lb__counter');

  imgEl.style.opacity = '0';
  imgEl.src = img.src;
  imgEl.alt = img.title || '';
  imgEl.onload = () => { imgEl.style.opacity = '1'; };
  imgEl.onerror = () => {
    imgEl.style.opacity = '1';
    imgEl.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#131a0d"/>' +
      '<text x="400" y="300" text-anchor="middle" fill="#c9a34e" font-family="sans-serif" font-size="24">' +
      'الصورة غير متوفرة' +
      '</text></svg>'
    );
  };

  if(titleEl) titleEl.textContent = img.title || '';
  if(counterEl) counterEl.textContent = (G.currentIndex + 1) + ' / ' + G.images.length;
}

function nav(direction){
  if(!G.images.length) return;
  G.currentIndex = (G.currentIndex + direction + G.images.length) % G.images.length;
  show();
}

function closeLightbox(){
  if(!G.lightbox) return;
  const lb = G.lightbox;
  lb.classList.remove('is-open');
  document.removeEventListener('keydown', onKey);
  setTimeout(() => {
    lb.remove();
    document.body.classList.remove('no-scroll');
    G.lightbox = null;
  }, 300);
}

function onKey(e){
  if(!G.lightbox) return;
  if(e.key === 'Escape') closeLightbox();
  else if(e.key === 'ArrowRight') nav(1);
  else if(e.key === 'ArrowLeft') nav(-1);
}

function toggleExpand(){
  const btn = document.getElementById('stripExpand');
  const track = document.getElementById('stripTrack');
  if(!btn || !track) return;

  const isOpen = track.classList.contains('is-expanded');

  if(isOpen){
    track.classList.remove('is-expanded');
    btn.querySelector('span').textContent = 'عرض الكل';
  } else {
    track.classList.add('is-expanded');
    btn.querySelector('span').textContent = 'عرض أقل';
  }
}

async function init(){
  createStrip();
  const images = await loadImages();
  G.images = images;
  renderStrip(images);

  const btn = document.getElementById('stripExpand');
  if(btn) btn.addEventListener('click', toggleExpand);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 400));
} else {
  setTimeout(init, 400);
}

window.__gallery = { refresh: init };

})();
