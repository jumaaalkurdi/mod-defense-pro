/* ══════════════════════════════════════════════════════════
   AI LOCAL ENGINE — النسخة النهائية
   ══════════════════════════════════════════════════════════ */
(function(){
'use strict';

function normalizeArabic(text){
  if(!text) return '';
  var s = String(text).toLowerCase();
  s = s.replace(/[\u064B-\u065F\u0670]/g, '');
  s = s.replace(/\u0640/g, '');
  s = s.replace(/[أإآٱ]/g, 'ا');
  s = s.replace(/[ىئ]/g, 'ي');
  s = s.replace(/ة/g, 'ه');
  s = s.replace(/ؤ/g, 'و');
  s = s.replace(/[.,!?،؛:؟«»""''()\[\]{}]/g, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

function tokenize(text){
  var n = normalizeArabic(text);
  return n ? n.split(' ').filter(function(w){ return w.length > 1; }) : [];
}

function stemArabic(word){
  var w = word;
  w = w.replace(/^(وال|بال|فال|كال|لل|ال)/, '');
  w = w.replace(/^(و|ف|ب|ك|ل)(?=.)/, '');
  w = w.replace(/(ات|ون|ين|ان|تها|تهم|هما|كم|نا|ها|هن|ية|يه|ه)$/, '');
  return w;
}

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

function scoreEntry(query, entry){
  if(!entry || !entry.keywords) return 0;
  var qTokens = tokenize(query);
  var qStems = qTokens.map(stemArabic);
  var qNorm = normalizeArabic(query);
  var best = 0;

  try {
    entry.keywords.forEach(function(kw){
      var kwNorm = normalizeArabic(kw);
      if(qNorm.indexOf(kwNorm) > -1){
        var s = 3.5 + (kwNorm.length * 0.15);
        if(s > best) best = s;
      }
      tokenize(kw).forEach(function(kt){
        var ks = stemArabic(kt);
        qTokens.forEach(function(qt, i){
          var qs = qStems[i];
          if(qt === kt){ if(3 > best) best = 3; }
          else if(qs && ks && qs === ks){ if(2.4 > best) best = 2.4; }
          else {
            var sim = similarity(qt, kt);
            if(sim > 0.72){ var s3 = sim * 1.8; if(s3 > best) best = s3; }
          }
        });
      });
    });
    var simQ = similarity(qNorm, normalizeArabic(entry.q || ''));
    if(simQ > 0.55){ var sq = simQ * 3.2; if(sq > best) best = sq; }
  } catch(e){}
  return best;
}

function findBestAnswer(query){
  var KB = window.__aiKnowledge;
  if(!KB || !KB.entries || !KB.entries.length) return { entry: null, type: 'no_kb' };
  if(normalizeArabic(query).length < 2) return { entry: null, type: 'short' };

  var scored = KB.entries.map(function(e){
    return { entry: e, score: scoreEntry(query, e) };
  }).sort(function(a, b){ return b.score - a.score; });

  if(!scored.length || scored[0].score < 0.9){
    return {
      entry: null,
      type: 'no_match',
      related: scored.slice(0, 4).filter(function(s){ return s.score > 0.6; })
    };
  }

  return {
    entry: scored[0].entry,
    type: 'match',
    related: scored.slice(1, 4).filter(function(s){ return s.score > 0.6; })
  };
}

function answer(query){
  try {
    var result = findBestAnswer(query);

    if(!result || !result.entry){
      return buildFallback(result);
    }

    var answerText = result.entry.a || 'لا توجد إجابة.';

    /* أسئلة ذات صلة */
    if(result.related && result.related.length){
      answerText += '\n\n━━━━━━━━━━━━━━━━\n**أسئلة ذات صلة:**';
      result.related.forEach(function(r){
        if(r && r.entry && r.entry.q) answerText += '\n💡 ' + r.entry.q;
      });
    }

    /* توقيع المطور — لكل الردود ما عدا الترحيب */
    var skip = ['general_hello', 'general_thanks', 'general_who', 'general_help'];
    if(skip.indexOf(result.entry.id) === -1){
      answerText += '\n\n━━━━━━━━━━━━━━━━\n👨‍💻 **منصة من تصميم المطور السوري dark0x1**';
    }

    return answerText;
  } catch(e){
    return '⚠️ حدث خطأ. الرجاء المحاولة مرة أخرى.';
  }
}

function buildFallback(result){
  var KB = window.__aiKnowledge;
  var msg = 'لم أجد إجابة دقيقة لسؤالك.\n\n';

  if(result && result.related && result.related.length){
    msg += '**هل تقصد:**\n';
    result.related.forEach(function(r){
      if(r && r.entry && r.entry.q) msg += '🔹 ' + r.entry.q + '\n';
    });
    msg += '\n';
  }

  if(KB && KB.categories){
    msg += '**يمكنك السؤال عن:**\n';
    for(var k in KB.categories){
      if(KB.categories.hasOwnProperty(k) && k !== 'general'){
        var c = KB.categories[k];
        msg += c.icon + ' ' + c.name + '\n';
      }
    }
  }

  msg += '\n💡 **نصيحة:** استخدم كلمات بسيطة ومحددة.';
  msg += '\n\n━━━━━━━━━━━━━━━━\n👨‍💻 **منصة من تصميم المطور السوري dark0x1**';
  return msg;
}

window.__aiLocal = {
  answer: answer,
  find: findBestAnswer,
  normalize: normalizeArabic,
  tokenize: tokenize,
  suggestions: function(lang){
    var KB = window.__aiKnowledge;
    if(!KB || !KB.suggestions) return [];
    return KB.suggestions[lang || 'ar'] || KB.suggestions.ar || [];
  },
  count: function(){
    return (window.__aiKnowledge && window.__aiKnowledge.entries) ? window.__aiKnowledge.entries.length : 0;
  },
  stats: function(){
    var KB = window.__aiKnowledge;
    if(!KB || !KB.entries) return { total: 0 };
    var byCat = {};
    KB.entries.forEach(function(e){
      if(e && e.cat) byCat[e.cat] = (byCat[e.cat] || 0) + 1;
    });
    return { total: KB.entries.length, byCategory: byCat };
  }
};

})();
