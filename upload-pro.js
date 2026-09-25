(function(){
'use strict';

/* ══════════════════════════════════════════════════════════
   UPLOAD PRO — رفع الصور والفيديوهات مباشرة إلى GitHub
   ══════════════════════════════════════════════════════════ */

var REPO = { owner:'jumaaalkurdi', repo:'mod-defense-pro', branch:'main', path:'content' };
var TOKEN_KEY = 'mod_gh_token';
var MAX_IMAGE_MB = 8;
var MAX_VIDEO_MB = 20;
var IMAGE_MAX_DIM = 1920;
var IMAGE_QUALITY = 0.85;

/* ═══ HELPERS ═══ */
function getToken(){ try { return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''; } catch(e){ return ''; } }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
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
function formatSize(bytes){
  if(bytes < 1024) return bytes + ' B';
  if(bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1048576).toFixed(2) + ' MB';
}
function extOf(name){
  var m = String(name||'').match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : 'bin';
}

/* ═══ CSS ═══ */
function injectCSS(){
  if(document.getElementById('uploadProStyles')) return;
  var css = [
    '.upx-wrap{margin-top:10px;display:flex;flex-direction:column;gap:10px}',
    '.upx-pick{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:12px 18px;',
    '  background:linear-gradient(135deg,rgba(201,163,78,.15),rgba(201,163,78,.04));',
    '  border:1.5px dashed var(--line-2);color:var(--gold-2);cursor:pointer;',
    '  font-family:"Noto Kufi Arabic",sans-serif;font-size:13px;font-weight:700;',
    '  transition:all .3s ease;',
    '  clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)}',
    '.upx-pick:hover{background:linear-gradient(135deg,rgba(201,163,78,.25),rgba(201,163,78,.08));',
    '  border-color:var(--gold);border-style:solid;transform:translateY(-1px)}',
    '.upx-pick svg{width:18px;height:18px;flex:none}',
    '.upx-pick input{display:none}',
    '.upx-info{display:none;align-items:center;gap:12px;padding:12px 14px;',
    '  background:rgba(0,0,0,.35);border:1px solid var(--line-2);',
    '  clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}',
    '.upx-info.is-show{display:flex}',
    '.upx-thumb{flex:none;width:64px;height:64px;overflow:hidden;background:#0a0d05;',
    '  border:1px solid var(--line-2);display:grid;place-items:center;',
    '  clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}',
    '.upx-thumb img{width:100%;height:100%;object-fit:cover}',
    '.upx-thumb svg{width:28px;height:28px;color:var(--gold-2)}',
    '.upx-meta{flex:1;min-width:0;font-family:"Noto Kufi Arabic",sans-serif}',
    '.upx-name{font-size:12.5px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}',
    '.upx-size{font-size:11px;color:var(--text-3);letter-spacing:.3px}',
    '.upx-size strong{color:var(--gold-2);font-weight:700}',
    '.upx-actions{display:flex;gap:6px;flex:none;align-items:center}',
    '.upx-btn{width:34px;height:34px;display:grid;place-items:center;',
    '  border:1px solid var(--line);background:rgba(255,255,255,.03);',
    '  color:var(--text-2);cursor:pointer;transition:all .25s;',
    '  clip-path:polygon(7px 0,100% 0,calc(100% - 7px) 100%,0 100%);font-family:inherit}',
    '.upx-btn svg{width:15px;height:15px}',
    '.upx-btn:hover{border-color:var(--gold);color:var(--gold-2);background:rgba(201,163,78,.1)}',
    '.upx-btn--danger:hover{border-color:#e11d2e;color:#ff7d89;background:rgba(185,28,28,.15)}',
    '.upx-btn--go{background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#06070a;border-color:var(--gold);width:auto;min-width:72px;padding:0 14px;font-size:11.5px;font-weight:800;gap:5px;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center}',
    '.upx-btn--go:hover{transform:translateY(-1px)}',
    '.upx-btn:disabled{opacity:.5;cursor:not-allowed;transform:none !important}',
    '.upx-progress{display:none;height:6px;background:rgba(0,0,0,.5);overflow:hidden;',
    '  clip-path:polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%)}',
    '.upx-progress.is-show{display:block}',
    '.upx-progress__bar{height:100%;width:0;background:linear-gradient(90deg,var(--gold),var(--gold-2),var(--gold-3));',
    '  transition:width .3s ease;box-shadow:0 0 15px var(--gold)}',
    '.upx-hint{font-family:"Noto Kufi Arabic",sans-serif;font-size:11px;color:var(--text-3);',
    '  line-height:1.6;padding:0 4px}',
    '.upx-hint strong{color:var(--gold-2)}',
    '.upx-warn{color:#f59e0b}',
    '.upx-err{color:#ff7d89}',
    '@media (max-width:768px){',
    '  .upx-thumb{width:56px;height:56px}',
    '  .upx-btn{width:32px;height:32px}',
    '  .upx-btn--go{padding:0 12px;font-size:11px}',
    '}'
  ].join('');
  var s = document.createElement('style');
  s.id = 'uploadProStyles';
  s.textContent = css;
  document.head.appendChild(s);
}

/* ═══ IMAGE COMPRESSION ═══ */
function compressImage(file){
  return new Promise(function(resolve){
    if(!file.type || !file.type.startsWith('image/')){ resolve(file); return; }
    if(file.type === 'image/svg+xml' || file.type === 'image/gif'){ resolve(file); return; }
    if(file.size < 300 * 1024){ resolve(file); return; }

    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function(){
      URL.revokeObjectURL(url);
      var w = img.naturalWidth, h = img.naturalHeight;
      var scale = Math.min(1, IMAGE_MAX_DIM / Math.max(w, h));
      var nw = Math.round(w * scale), nh = Math.round(h * scale);

      var canvas = document.createElement('canvas');
      canvas.width = nw; canvas.height = nh;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, nw, nh);

      canvas.toBlob(function(blob){
        if(!blob || blob.size >= file.size){ resolve(file); return; }
        var name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
        resolve(new File([blob], name, { type:'image/jpeg', lastModified: Date.now() }));
      }, 'image/jpeg', IMAGE_QUALITY);
    };
    img.onerror = function(){ URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

/* ═══ FILE → BASE64 ═══ */
function fileToBase64(file){
  return new Promise(function(resolve, reject){
    var r = new FileReader();
    r.onload = function(){
      var s = String(r.result);
      var i = s.indexOf(',');
      if(i < 0){ reject(new Error('صيغة غير صالحة')); return; }
      resolve(s.substring(i + 1));
    };
    r.onerror = function(){ reject(new Error('فشل قراءة الملف')); };
    r.readAsDataURL(file);
  });
}

/* ═══ GITHUB UPLOAD (with progress via XHR) ═══ */
function putFile(path, base64, message, onProgress){
  return new Promise(function(resolve, reject){
    var token = getToken();
    if(!token){ reject(new Error('أدخل GitHub Token أولاً في تبويب الإعدادات')); return; }

    var url = 'https://api.github.com/repos/' + REPO.owner + '/' + REPO.repo + '/contents/' + path;
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Authorization', 'token ' + token);
    xhr.setRequestHeader('Accept', 'application/vnd.github+json');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.upload.onprogress = function(e){
      if(onProgress && e.lengthComputable){
        onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
      }
    };

    xhr.onload = function(){
      if(xhr.status >= 200 && xhr.status < 300){
        if(onProgress) onProgress(100);
        try { resolve(JSON.parse(xhr.responseText)); }
        catch(e){ resolve({ ok:true }); }
      } else {
        var msg = 'فشل الرفع (' + xhr.status + ')';
        try {
          var err = JSON.parse(xhr.responseText);
          if(err && err.message) msg = err.message;
          if(xhr.status === 401) msg = 'التوكن غير صالح';
          if(xhr.status === 403) msg = 'التوكن لا يملك صلاحية الكتابة';
          if(xhr.status === 404) msg = 'الريبو غير موجود';
        } catch(e){}
        reject(new Error(msg));
      }
    };
    xhr.onerror = function(){ reject(new Error('فشل الاتصال بالشبكة')); };
    xhr.onabort = function(){ reject(new Error('تم الإلغاء')); };

    xhr.send(JSON.stringify({
      message: message || ('رفع ' + path),
      content: base64,
      branch: REPO.branch
    }));
  });
}

/* ═══ MAIN UPLOADER UI ═══ */
function attachUploader(opts){
  // opts: { inputId, type ('image'|'video'|'both'), uploadPath, onDone, formSelector }
  var input = document.getElementById(opts.inputId);
  if(!input) return false;
  var form = input.closest('form') || input.closest('.admin-form') || input.parentNode;
  if(!form) return false;
  var container = input.parentNode;
  if(container.querySelector('[data-upx="' + opts.inputId + '"]')) return true;

  var wrap = document.createElement('div');
  wrap.className = 'upx-wrap';
  wrap.setAttribute('data-upx', opts.inputId);
  wrap.innerHTML = ''
    + '<label class="upx-pick">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
        + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-linecap="round" stroke-linejoin="round"/>'
        + '<path d="M17 8l-5-5-5 5" stroke-linecap="round" stroke-linejoin="round"/>'
        + '<path d="M12 3v12" stroke-linecap="round"/>'
      + '</svg>'
      + '<span>📁 اختر ' + (opts.type === 'video' ? 'فيديو' : 'صورة') + ' من جهازك</span>'
      + '<input type="file" accept="' + (opts.type === 'video' ? 'video/*' : opts.type === 'image' ? 'image/*' : 'image/*,video/*') + '">'
    + '</label>'
    + '<div class="upx-info">'
      + '<div class="upx-thumb"></div>'
      + '<div class="upx-meta"><div class="upx-name">—</div><div class="upx-size">—</div></div>'
      + '<div class="upx-actions">'
        + '<button type="button" class="upx-btn upx-btn--go" disabled>'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          + 'رفع'
        + '</button>'
        + '<button type="button" class="upx-btn upx-btn--danger" title="إلغاء">'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>'
        + '</button>'
      + '</div>'
    + '</div>'
    + '<div class="upx-progress"><div class="upx-progress__bar"></div></div>'
    + '<div class="upx-hint">'
      + '💡 <strong>ميزة جديدة:</strong> رفع مباشر إلى GitHub — بدون ImgBB!'
      + (opts.type === 'video' ? ' الفيديوهات حتى <strong>20 MB</strong>.' : ' الصور تُضغط تلقائياً.')
    + '</div>';

  container.appendChild(wrap);

  var pickLabel = wrap.querySelector('.upx-pick');
  var fileInput = wrap.querySelector('input[type="file"]');
  var info = wrap.querySelector('.upx-info');
  var thumb = wrap.querySelector('.upx-thumb');
  var nameEl = wrap.querySelector('.upx-name');
  var sizeEl = wrap.querySelector('.upx-size');
  var goBtn = wrap.querySelector('.upx-btn--go');
  var cancelBtn = wrap.querySelector('.upx-btn--danger');
  var progress = wrap.querySelector('.upx-progress');
  var bar = wrap.querySelector('.upx-progress__bar');
  var hintEl = wrap.querySelector('.upx-hint');

  var currentFile = null;
  var processing = false;

  function setProgress(p){
    progress.classList.add('is-show');
    bar.style.width = p + '%';
  }
  function resetProgress(){
    setTimeout(function(){
      progress.classList.remove('is-show');
      bar.style.width = '0%';
    }, 800);
  }
  function setHint(html, cls){
    hintEl.className = 'upx-hint' + (cls ? ' ' + cls : '');
    hintEl.innerHTML = html;
  }

  fileInput.addEventListener('change', function(){
    var f = fileInput.files && fileInput.files[0];
    if(!f) return;
    handleFile(f);
  });

  function handleFile(f){
    var isVideo = f.type && f.type.startsWith('video/');
    var isImage = f.type && f.type.startsWith('image/');
    if(opts.type === 'image' && !isImage){ toast('اختر صورة فقط', 'error'); resetFile(); return; }
    if(opts.type === 'video' && !isVideo){ toast('اختر فيديو فقط', 'error'); resetFile(); return; }

    var limitMB = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
    if(f.size > limitMB * 1024 * 1024){
      setHint('⚠️ <strong>الملف كبير جداً</strong> — الحد الأقصى ' + limitMB + ' MB. الحجم: ' + formatSize(f.size), 'upx-warn');
      toast('الملف كبير — الحد ' + limitMB + ' MB', 'error');
      resetFile();
      return;
    }

    currentFile = f;
    nameEl.textContent = f.name;
    sizeEl.innerHTML = '📦 ' + formatSize(f.size) + ' — <strong>يُضغط تلقائياً</strong>';

    if(isImage){
      var r = new FileReader();
      r.onload = function(e){
        thumb.innerHTML = '<img src="' + e.target.result + '" alt="">';
      };
      r.readAsDataURL(f);
    } else if(isVideo){
      thumb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z" fill="currentColor"/></svg>';
    }

    info.classList.add('is-show');
    goBtn.disabled = false;
    setHint('✅ جاهز للرفع — اضغط "رفع"', null);
  }

  function resetFile(){
    currentFile = null;
    fileInput.value = '';
    info.classList.remove('is-show');
    progress.classList.remove('is-show');
    bar.style.width = '0%';
    thumb.innerHTML = '';
    nameEl.textContent = '—';
    sizeEl.textContent = '—';
    goBtn.disabled = true;
  }

  cancelBtn.addEventListener('click', function(){
    if(processing) return;
    resetFile();
  });

  goBtn.addEventListener('click', async function(){
    if(!currentFile || processing) return;
    if(!getToken()){ toast('أدخل GitHub Token في تبويب الإعدادات', 'error'); return; }

    processing = true;
    goBtn.disabled = true;
    cancelBtn.disabled = true;

    try {
      setHint('⏳ جارٍ التجهيز...', null);
      var file = currentFile;
      var isVideo = file.type && file.type.startsWith('video/');
      var isImage = file.type && file.type.startsWith('image/');

      /* Compress image */
      if(isImage){
        setHint('🎨 جارٍ ضغط الصورة...', null);
        var origSize = file.size;
        file = await compressImage(file);
        if(file.size < origSize){
          var ratio = Math.round((1 - file.size / origSize) * 100);
          sizeEl.innerHTML = '📦 ' + formatSize(file.size) + ' — <strong>وُفّر ' + ratio + '%</strong>';
        }
      }

      /* Encode */
      setHint('📦 جارٍ الترميز...', null);
      var base64 = await fileToBase64(file);

      /* Generate path */
      var ts = Date.now().toString(36);
      var rnd = Math.random().toString(36).slice(2, 6);
      var ext = extOf(file.name);
      var prefix = isVideo ? 'vid_' : 'img_';
      var filename = prefix + ts + '_' + rnd + '.' + ext;
      var path = REPO.path + '/uploads/' + filename;

      /* Upload */
      setHint('☁️ جارٍ الرفع إلى GitHub...', null);
      setProgress(1);
      await putFile(path, base64, 'رفع ملف: ' + filename, function(p){ setProgress(p); });

      /* Build URL */
      var url = 'https://raw.githubusercontent.com/' + REPO.owner + '/' + REPO.repo + '/' + REPO.branch + '/' + path;

      /* Fill input */
      input.value = url;
      input.dispatchEvent(new Event('input', { bubbles:true }));
      input.dispatchEvent(new Event('change', { bubbles:true }));

      setHint('✅ تم الرفع! الرابط جاهز — اضغط "حفظ" لإنشاء العنصر', null);
      toast('✅ تم رفع الملف بنجاح', 'success');

      if(typeof opts.onDone === 'function') opts.onDone(url, file);

      setTimeout(function(){ resetProgress(); }, 1200);

    } catch(err){
      setHint('❌ ' + (err.message || 'فشل الرفع'), 'upx-err');
      toast('فشل: ' + (err.message || ''), 'error');
      resetProgress();
    } finally {
      processing = false;
      goBtn.disabled = false;
      cancelBtn.disabled = false;
    }
  });

  return true;
}

/* ═══ INJECT INTO ADMIN TABS ═══ */
function injectUploaders(){
  var ok1 = attachUploader({
    inputId: 'gpxImg',
    type: 'image',
    uploadPath: 'gallery'
  });
  var ok2 = attachUploader({
    inputId: 'vpxUrl',
    type: 'both',
    uploadPath: 'videos'
  });
  return ok1 || ok2;
}

/* ═══ INIT ═══ */
function init(){
  injectCSS();

  /* Wait for admin panel to be ready */
  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    var found = injectUploaders();
    if(found && tries > 3) clearInterval(iv);
    if(tries >= 80) clearInterval(iv);
  }, 400);

  /* Re-inject on admin tab switch */
  document.addEventListener('click', function(e){
    var tab = e.target.closest('.admin-tab');
    if(!tab) return;
    setTimeout(injectUploaders, 250);
  });
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

window.__uploadPro = { attach: attachUploader, refresh: injectUploaders };

})();
