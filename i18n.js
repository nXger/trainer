(function(){
  const DEFAULT_LANG = 'en';
  const currentLang = localStorage.getItem('lang') || DEFAULT_LANG;
  const I18N = (currentLang === 'en' && typeof I18N_EN !== 'undefined') ? I18N_EN
         : (typeof I18N_RU !== 'undefined' ? I18N_RU : {});
  const FALLBACK = (typeof I18N_RU !== 'undefined') ? I18N_RU : {};

  window.t = function(key, params){
    let str = I18N[key];
    if(str === undefined){ str = FALLBACK[key]; if(str === undefined){ return key; } }
    if(params){ Object.keys(params).forEach(k=>{ str = str.replace(new RegExp('\\{'+k+'\\}','g'), params[k]); }); }
    return str;
  };
  window.getLang = function(){ return localStorage.getItem('lang') || DEFAULT_LANG; };
  window.setLang = function(lang){
    if(lang !== 'ru' && lang !== 'en') return;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    location.reload();
  };
  window.pluralRu = function(n, forms){
    const m100 = n % 100, m10 = n % 10;
    if(m100 >= 11 && m100 <= 14) return forms[2];
    if(m10 === 1) return forms[0];
    if(m10 >= 2 && m10 <= 4) return forms[1];
    return forms[2];
  };
  window.pluralEn = function(n, forms){ return n === 1 ? forms[0] : forms[1]; };
  window.plural = function(n, key){
    const forms = I18N['plural.'+key] || FALLBACK['plural.'+key];
    if(!forms) return String(n);
    return (currentLang === 'en') ? pluralEn(n, forms) : pluralRu(n, forms);
  };
  window.dayShort = function(dow){ return t('day.' + dow); };
  window.dayFull = function(dow){ return t('day.full.' + dow); };
  window.monthName = function(m){ return t('month.' + m); };
  document.documentElement.lang = currentLang;
})();
window.getMuscleName = function(id){
  const entry = (typeof MUSCLE_NAMES_I18N !== 'undefined') ? MUSCLE_NAMES_I18N[id] : null;
  if(!entry) return id;
  return entry[getLang()] || entry.ru || id;   // ← было currentLang
};

window.getExerciseName = function(id){
  const entry = (typeof EXERCISE_NAMES_I18N !== 'undefined') ? EXERCISE_NAMES_I18N[id] : null;
  if(entry){
    return entry[getLang()] || entry.ru || (EX[id] && EX[id].name) || id;   // ← было currentLang
  }
  if(EX[id] && EX[id].name) return EX[id].name;
  return id;
};