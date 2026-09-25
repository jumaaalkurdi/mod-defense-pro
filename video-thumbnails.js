/* ══════════════════════════════════════════════════════════
   VIDEO THUMBNAILS — خلفيات احترافية لبطاقات الفيديو
   تصاميم SVG عسكرية متنوعة
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

function makeSVG(design, color){
  var c = color || '#c9a34e';
  var d = design || 0;

  /* تعريفات مشتركة */
  var defs = '<defs>'
    + '<linearGradient id="bg' + d + '" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#1a2210"/>'
    + '<stop offset="0.5" stop-color="#0f1408"/>'
    + '<stop offset="1" stop-color="#06070a"/>'
    + '</linearGradient>'
    + '<radialGradient id="glow' + d + '" cx="50%" cy="50%" r="60%">'
    + '<stop offset="0" stop-color="' + c + '" stop-opacity="0.15"/>'
    + '<stop offset="1" stop-color="' + c + '" stop-opacity="0"/>'
    + '</radialGradient>'
    + '<linearGradient id="line' + d + '" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0" stop-color="' + c + '" stop-opacity="0"/>'
    + '<stop offset="0.5" stop-color="' + c + '" stop-opacity="0.6"/>'
    + '<stop offset="1" stop-color="' + c + '" stop-opacity="0"/>'
    + '</linearGradient>'
    + '</defs>';

  /* خلفية أساسية */
  var bg = '<rect width="800" height="450" fill="url(#bg' + d + ')"/>';
  bg += '<rect width="800" height="450" fill="url(#glow' + d + ')"/>';

  /* تصاميم مختلفة */
  var pattern = '';

  /* 1) نمط شبكة عسكرية */
  if(d === 0){
    pattern = '<g stroke="' + c + '" stroke-width="0.5" opacity="0.15" fill="none">';
    for(var x = 0; x <= 800; x += 40) pattern += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="450"/>';
    for(var y = 0; y <= 450; y += 40) pattern += '<line x1="0" y1="' + y + '" x2="800" y2="' + y + '"/>';
    pattern += '</g>';
    pattern += '<g fill="' + c + '" opacity="0.3">';
    for(var i = 0; i < 8; i++){
      pattern += '<circle cx="' + (Math.random() * 800) + '" cy="' + (Math.random() * 450) + '" r="1.5"/>';
    }
    pattern += '</g>';
  }

  /* 2) نمط دوائر متداخلة */
  if(d === 1){
    pattern = '<g stroke="' + c + '" stroke-width="1" opacity="0.12" fill="none">';
    pattern += '<circle cx="400" cy="225" r="200"/>';
    pattern += '<circle cx="400" cy="225" r="150"/>';
    pattern += '<circle cx="400" cy="225" r="100"/>';
    pattern += '<circle cx="400" cy="225" r="50"/>';
    pattern += '</g>';
    pattern += '<g stroke="' + c + '" stroke-width="0.6" opacity="0.08" fill="none">';
    pattern += '<line x1="0" y1="225" x2="800" y2="225"/>';
    pattern += '<line x1="400" y1="0" x2="400" y2="450"/>';
    pattern += '</g>';
  }

  /* 3) نمط خطوط مائلة (diagonal) */
  if(d === 2){
    pattern = '<g stroke="' + c + '" stroke-width="1" opacity="0.1" fill="none">';
    for(var k = -450; k < 800; k += 30){
      pattern += '<line x1="' + k + '" y1="0" x2="' + (k + 450) + '" y2="450"/>';
    }
    pattern += '</g>';
    pattern += '<g stroke="' + c + '" stroke-width="0.6" opacity="0.08" fill="none">';
    for(k = -450; k < 800; k += 60){
      pattern += '<line x1="' + (k + 450) + '" y1="0" x2="' + k + '" y2="450"/>';
    }
    pattern += '</g>';
  }

  /* 4) نمط جبال وهضاب */
  if(d === 3){
    pattern = '<g fill="none" stroke="' + c + '" stroke-width="1.5" opacity="0.15">';
    pattern += '<path d="M0 350 L150 250 L280 320 L450 180 L600 280 L750 220 L800 250"/>';
    pattern += '<path d="M0 380 L180 320 L320 370 L500 280 L680 340 L800 300" stroke-width="0.8" opacity="0.5"/>';
    pattern += '<path d="M0 410 L220 380 L380 400 L580 350 L800 390" stroke-width="0.6" opacity="0.3"/>';
    pattern += '</g>';
    pattern += '<g stroke="' + c + '" stroke-width="0.5" opacity="0.08" fill="none">';
    for(var yy = 0; yy <= 450; yy += 20){
      pattern += '<line x1="0" y1="' + yy + '" x2="800" y2="' + yy + '"/>';
    }
    pattern += '</g>';
  }

  /* 5) نمط رادار / أهداف */
  if(d === 4){
    pattern = '<g stroke="' + c + '" stroke-width="1" opacity="0.15" fill="none">';
    pattern += '<circle cx="400" cy="225" r="180" stroke-dasharray="4 8"/>';
    pattern += '<circle cx="400" cy="225" r="120" stroke-dasharray="4 8"/>';
    pattern += '<circle cx="400" cy="225" r="60" stroke-dasharray="4 8"/>';
    pattern += '<line x1="220" y1="225" x2="580" y2="225"/>';
    pattern += '<line x1="400" y1="45" x2="400" y2="405"/>';
    pattern += '<line x1="273" y1="98" x2="527" y2="352" opacity="0.5"/>';
    pattern += '<line x1="527" y1="98" x2="273" y2="352" opacity="0.5"/>';
    pattern += '</g>';
    pattern += '<g fill="' + c + '" opacity="0.4">';
    pattern += '<circle cx="500" cy="160" r="2.5"/>';
    pattern += '<circle cx="320" cy="290" r="2"/>';
    pattern += '<circle cx="460" cy="320" r="1.8"/>';
    pattern += '</g>';
  }

  /* 6) نمط سداسي (hex) */
  if(d === 5){
    pattern = '<g fill="none" stroke="' + c + '" stroke-width="0.7" opacity="0.12">';
    for(var hx = 0; hx <= 900; hx += 60){
      for(var hy = 0; hy <= 500; hy += 52){
        var offset = (Math.floor(hy / 52) % 2) * 30;
        pattern += '<polygon points="'
          + (hx + offset) + ',' + (hy - 15) + ' '
          + (hx + offset + 26) + ',' + (hy - 15) + ' '
          + (hx + offset + 39) + ',' + hy + ' '
          + (hx + offset + 26) + ',' + (hy + 15) + ' '
          + (hx + offset) + ',' + (hy + 15) + ' '
          + (hx + offset - 13) + ',' + hy;
        pattern += '"/>';
      }
    }
    pattern += '</g>';
  }

  /* إطار ذهبي دقيق */
  var frame = '<rect x="0.5" y="0.5" width="799" height="449" fill="none" stroke="' + c + '" stroke-width="1" opacity="0.25"/>';

  /* خط توهج أفقي */
  var line = '<rect x="0" y="224" width="800" height="2" fill="url(#line' + d + ')" opacity="0.6"/>';

  /* شعار عسكري صغير في الزاوية */
  var mark = '<g transform="translate(740,40)" opacity="0.3">'
    + '<path d="M0 0 L20 8 L20 24 C20 36 14 44 10 48 C6 44 0 36 0 24 Z" fill="none" stroke="' + c + '" stroke-width="1.5"/>'
    + '<circle cx="10" cy="20" r="4" fill="none" stroke="' + c + '" stroke-width="1"/>'
    + '</g>';

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">'
    + defs + bg + pattern + line + mark + frame
    + '</svg>'
  );
}

/* ═══ استبدال دالة svgThumb في video-pro.js ═══ */
function patchVideoPro(){
  try {
    if(!window.__vpx || !window.__vpx.videos) return false;

    /* أعد تعريف svgThumb في الـ closure عبر تعديل مصفوفة الفيديوهات */
    var videos = window.__vpx.videos();
    if(videos && videos.length){
      videos.forEach(function(v, i){
        if(v && !v.thumb){
          v.thumb = makeSVG(i % 6);
        }
      });
    }
    return true;
  } catch(e){ return false; }
}

/* ═══ استبدال مباشر في حالة إعادة التحميل ═══ */
window.__videoThumbs = {
  make: makeSVG,
  designs: 6,
  patch: patchVideoPro
};

})();
