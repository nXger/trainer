function computePercents(loads){
  const ids = Object.keys(loads||{});
  if(!ids.length) return {};
  const sum = ids.reduce((s,id)=>s+(parseFloat(loads[id])||0), 0);
  if(sum<=0) return {};
  const result = {};
  ids.forEach(id=>{ result[id] = Math.round(100/sum*(parseFloat(loads[id])||0)); });
  return result;
}


const BUILTIN_IDS=Object.keys(EX);

function sortedExerciseEntries(){ return Object.entries(EX).sort((a,b)=>a[1].name.localeCompare(b[1].name,'ru')); }
function muscleNames(ids){ return (ids||[]).map(id=>MUSCLE_BY_ID[id]?.name||id); }
function muscleSummary(muscles){
  if(!muscles) return '';
  let entries;
  if(Array.isArray(muscles)) entries = muscles.map(id=>[id,null]);
  else entries = Object.entries(muscles);
  return entries.map(([id,pct])=>{
    const name = MUSCLE_BY_ID[id]?.name || id;
    return pct!=null ? `${name} ${pct}%` : name;
  }).join(', ');
}

/* ---------- Markers ---------- */
function getExerciseMarkers(exId){
  try{
    const all = JSON.parse(localStorage.getItem('exerciseMarkers')||'{}');
    // если пользователь явно сохранял массив (даже пустой) — он главнее
    if(Array.isArray(all[exId])) return all[exId];
    // иначе — дефолт из exercises.js
    const def = EX[exId] && EX[exId].markers;
    return Array.isArray(def) ? def : [];
  }catch(e){
    const def = EX[exId] && EX[exId].markers;
    return Array.isArray(def) ? def : [];
  }
}
function setExerciseMarkers(exId, markers){
  try{
    const all = JSON.parse(localStorage.getItem('exerciseMarkers')||'{}');
    if(Array.isArray(markers)){
      all[exId] = markers.slice();    // и [] тоже — это "пользователь стёр"
    }else{
      delete all[exId];
    }
    localStorage.setItem('exerciseMarkers', JSON.stringify(all));
  }catch(e){}
}
function parseMarkers(str){
  return (str||'').split(',').map(s=>s.trim()).filter(Boolean);
}
function getAllUsedMarkers(){
  const set = new Set();
  // дефолты из exercises.js
  Object.values(EX).forEach(ex => {
    if(Array.isArray(ex.markers)) ex.markers.forEach(m => m && set.add(m));
  });
  // + пользовательские (могут содержать кастомные метки)
  try{
    const all = JSON.parse(localStorage.getItem('exerciseMarkers')||'{}');
    Object.values(all).forEach(arr=>{
      if(Array.isArray(arr)) arr.forEach(m => m && set.add(m));
    });
  }catch(e){}
  return [...set].sort((a,b)=>a.localeCompare(b,'ru'));
}

/* -------- Default markers seeding (from legend file) -------- */



/* Simple display-only chips (used in add-form previews etc.) */
function markersChipsHtml(markers, q){
  if(!markers || !markers.length) return '';
  const ql = q ? q.toLowerCase() : '';
  return markers.map(m=>{
    const hit = ql && m.toLowerCase().includes(ql);
    return `<span class="marker-chip${hit?' hit':''}">${escapeHtml(m)}</span>`;
  }).join('');
}

/* Read-only chips for training view */
function renderMarkerChipsOnly(exId){
  const markers = getExerciseMarkers(exId);
  if(!markers.length) return '';
  return `<div style="margin-bottom:6px;display:flex;flex-wrap:wrap;gap:3px">${markers.map(m=>`<span class="marker-chip">${escapeHtml(m)}</span>`).join('')}</div>`;
}

/* Interactive marker cells with [+] — used in search, stats, plan */
let markerModalExId = null;

function renderMarkerCells(exId, opts){
  opts = opts || {};
  const q = opts.q ? opts.q.toLowerCase() : '';
  const markers = getExerciseMarkers(exId);
  const chips = markers.map(m=>{
    const enc = encodeURIComponent(m);
    const isHit = q && m.toLowerCase().includes(q);
    const hitStyle = isHit ? 'background:#f0c86033;border:1px solid #f0c860;' : '';
    return `<span class="marker-chip" style="cursor:pointer;padding-right:5px;${hitStyle}" onclick="event.stopPropagation();removeMarkerConfirm('${exId}', decodeURIComponent('${enc}'))" title="Нажмите чтобы удалить">${escapeHtml(m)} <span style="opacity:.55">×</span></span>`;
  }).join(' ');
  const addBtn = `<span class="marker-chip" style="cursor:pointer;background:#223a22;color:#9f9;border:1px dashed #4a7a4a" onclick="event.stopPropagation();openMarkerModal('${exId}')" title="Добавить метку">+</span>`;
  const marginTop = opts.marginTop !== false ? '4px 0' : '0';
  return `<div style="display:flex;flex-wrap:wrap;gap:3px;align-items:center;margin:${marginTop}">${chips}${chips ? ' ' : ''}${addBtn}</div>`;
}

function openMarkerModal(exId, focusInput){
  if(!exId) return;
  markerModalExId = exId;
  const old = document.getElementById('marker-modal');
  if(old) old.remove();
  document.body.insertAdjacentHTML('beforeend', renderMarkerModal(exId));
  if(focusInput){
    setTimeout(()=>{
      const inp = document.getElementById('marker-new-input');
      if(inp) inp.focus();
    }, 50);
  }
}

function closeMarkerModal(skipRender){
  const modal = document.getElementById('marker-modal');
  if(modal) modal.remove();
  markerModalExId = null;
  if(!skipRender) render();
}

function refreshMarkerModal(focusInput){
  if(!markerModalExId) return;
  const exId = markerModalExId;
  const old = document.getElementById('marker-modal');
  if(old) old.remove();
  document.body.insertAdjacentHTML('beforeend', renderMarkerModal(exId));
  if(focusInput){
    setTimeout(()=>{
      const inp = document.getElementById('marker-new-input');
      if(inp) inp.focus();
    }, 30);
  }
}

function renderMarkerModal(exId){
  const allMarkers = getAllUsedMarkers();
  const currentMarkers = getExerciseMarkers(exId);
  const exName = EX[exId]?.name || exId;

  const chipsHtml = allMarkers.length
    ? allMarkers.map(m=>{
        const isOn = currentMarkers.includes(m);
        const enc = encodeURIComponent(m);
        return `<button onclick="toggleMarkerOnEx(decodeURIComponent('${enc}'))" style="padding:5px 12px;border-radius:5px;font-size:13px;cursor:pointer;border:1px solid ${isOn?'#4a7a4a':'#333'};background:${isOn?'#2a5a2a':'#222'};color:${isOn?'#9f9':'#ddd'}">${isOn?'✓ ':''}${escapeHtml(m)}</button>`;
      }).join('')
    : `<span style="color:#666;font-size:12px">пока нет меток ни у одного упражнения</span>`;

  return `<div id="marker-modal" onclick="if(event.target===this)closeMarkerModal()" style="position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:1000;display:flex;align-items:flex-end;justify-content:center">
    <div onclick="event.stopPropagation()" style="background:#1a1a1a;border:1px solid #333;border-radius:12px 12px 0 0;width:100%;max-width:600px;max-height:85vh;overflow-y:auto;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px))">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong style="font-size:15px">Метки: ${escapeHtml(exName)}</strong>
        <button onclick="closeMarkerModal()" style="background:transparent;border:none;color:#888;font-size:22px;cursor:pointer;padding:0 6px;line-height:1">×</button>
      </div>
      <div style="font-size:12px;color:#888;margin-bottom:8px">Все использованные метки (нажмите, чтобы поставить/снять):</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">${chipsHtml}</div>
      <div style="font-size:12px;color:#888;margin-bottom:6px">Добавить новую метку:</div>
      <div style="display:flex;gap:6px">
        <input type="text" id="marker-new-input" placeholder="новая метка" autocomplete="off" style="flex:1;background:#111;border:1px solid #333;color:#e8e8e8;padding:8px 10px;border-radius:6px;font-size:14px" onkeydown="if(event.key==='Enter'){event.preventDefault();addNewMarkerFromModal()}">
        <button onclick="addNewMarkerFromModal()" style="padding:8px 14px;background:#2a5a2a;border:1px solid #3a7a3a;color:#e8e8e8;border-radius:6px;font-size:14px;cursor:pointer">Добавить</button>
      </div>
      <div style="font-size:11px;color:#666;margin-top:14px;text-align:center">Нажмите на метку, чтобы поставить/снять её с этого упражнения</div>
    </div>
  </div>`;
}

function toggleMarkerOnEx(marker){
  if(!markerModalExId) return;
  const cur = getExerciseMarkers(markerModalExId);
  if(cur.includes(marker)){
    setExerciseMarkers(markerModalExId, cur.filter(m=>m !== marker));
  } else {
    setExerciseMarkers(markerModalExId, [...cur, marker]);
  }
  refreshMarkerModal(false);
}

function addNewMarkerFromModal(){
  if(!markerModalExId) return;
  const inp = document.getElementById('marker-new-input');
  if(!inp) return;
  const val = inp.value.trim();
  if(!val) return;
  const cur = getExerciseMarkers(markerModalExId);
  if(!cur.includes(val)) setExerciseMarkers(markerModalExId, [...cur, val]);
  refreshMarkerModal(true);
}

function removeMarkerConfirm(exId, marker){
  const exName = EX[exId]?.name || exId;
  if(!confirm(`Удалить метку «${marker}» с «${exName}»?`)) return;
  const cur = getExerciseMarkers(exId).filter(m=>m !== marker);
  setExerciseMarkers(exId, cur);
  if(markerModalExId === exId){
    const modal = document.getElementById('marker-modal');
    if(modal) modal.remove();
    markerModalExId = null;
  }
  render();
}

document.addEventListener('keydown', e=>{
  if(e.key === 'Escape' && document.getElementById('marker-modal')){
    closeMarkerModal();
  }
});

/* ---------- Muscle picker ---------- */
function renderMusclePicker(loadsOrIds, prefix){
  let loads = {};
  if(Array.isArray(loadsOrIds)){ loadsOrIds.forEach(id=>{loads[id]=5}); }
  else if(loadsOrIds && typeof loadsOrIds==='object'){ loads = loadsOrIds; }
  const renderGroup = (g)=>{
    const isChecked = g.id in loads;
    const loadVal = isChecked ? loads[g.id] : 5;
    const active = v=>loadVal===v?'preset-active':'';
    return `
      <div style="margin-bottom:10px">
        <label class="day-chk" style="margin:0">
          <input type="checkbox" class="${prefix}-chk" data-mid="${g.id}" ${isChecked?'checked':''}
            onchange="muscleToggle('${prefix}','${g.id}',this.checked)">
          ${g.name}
        </label>
        <div class="${prefix}-load" data-mid="${g.id}" style="display:${isChecked?'block':'none'};margin-left:22px;margin-top:6px">
          <div class="muscle-load-row" style="margin:0">
            <div class="form-row" style="margin-bottom:6px">
              <button type="button" class="preset-btn ${active(7.5)}" data-val="7.5" onclick="musclePreset('${prefix}','${g.id}',7.5)">Высокая</button>
              <button type="button" class="preset-btn ${active(5)}" data-val="5" onclick="musclePreset('${prefix}','${g.id}',5)">Средняя</button>
              <button type="button" class="preset-btn ${active(2.5)}" data-val="2.5" onclick="musclePreset('${prefix}','${g.id}',2.5)">Низкая</button>
            </div>
            <div class="slider-wrap">
              <input type="range" min="1" max="10" step="0.5" value="${loadVal}"
                class="${prefix}-slider" data-mid="${g.id}"
                oninput="muscleSliderInput('${prefix}','${g.id}',this.value)">
              <span class="${prefix}-val load-val" data-mid="${g.id}">${loadVal}</span>
            </div>
          </div>
        </div>
      </div>`;
  };

  let html='';
  MUSCLES.forEach(cat=>{
    html+=`<div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 6px">${cat.name}</div>`;
    if(cat.id === 'arms'){
      cat.groups.filter(g => !FOREARM_IDS.includes(g.id)).forEach(g => {html += renderGroup(g)});
      const forearmGroups = cat.groups.filter(g => FOREARM_IDS.includes(g.id));
      if(forearmGroups.length){
        const selectedCount = forearmGroups.filter(g => g.id in loads).length;
        const expanded = selectedCount > 0;
        const hasClass = selectedCount > 0 ? ' has-selected' : '';
        const countLabel = selectedCount > 0 ? `выбрано ${selectedCount}` : `${forearmGroups.length} мышц`;
        html += `<div class="forearm-header${hasClass}" onclick="toggleForearmSection('${prefix}')">
          <span class="fa-arrow" id="${prefix}-forearm-arrow">${expanded ? '▾' : '▸'}</span>
          <strong>Предплечье и кисть</strong>
          <span class="fa-count">${countLabel}</span>
        </div>
        <div id="${prefix}-forearm-section" style="display:${expanded ? 'block' : 'none'}">
          ${forearmGroups.map(renderGroup).join('')}
        </div>`;
      }
    }else{
      cat.groups.forEach(g => {html += renderGroup(g)});
    }
  });
  return html;
}

function toggleForearmSection(prefix){
  const el = document.getElementById(prefix+'-forearm-section');
  const arrow = document.getElementById(prefix+'-forearm-arrow');
  const header = el ? el.previousElementSibling : null;
  if(!el) return;
  const hidden = el.style.display === 'none';
  el.style.display = hidden ? 'block' : 'none';
  if(arrow) arrow.textContent = hidden ? '▾' : '▸';
  if(header && !hidden){
    const checked = el.querySelectorAll(`.${prefix}-chk:checked`).length;
    const countEl = header.querySelector('.fa-count');
    const total = el.querySelectorAll(`.${prefix}-chk`).length;
    if(countEl) countEl.textContent = checked > 0 ? `выбрано ${checked}` : `${total} мышц`;
    header.classList.toggle('has-selected', checked > 0);
  }
}

function muscleToggle(prefix, mid, checked){
  const el = document.querySelector(`.${prefix}-load[data-mid="${mid}"]`);
  if(el) el.style.display = checked ? 'block' : 'none';
}
function musclePreset(prefix, mid, val){
  const slider = document.querySelector(`.${prefix}-slider[data-mid="${mid}"]`);
  const display = document.querySelector(`.${prefix}-val[data-mid="${mid}"]`);
  const buttons = document.querySelectorAll(`.${prefix}-load[data-mid="${mid}"] .preset-btn`);
  if(slider) slider.value = val;
  if(display) display.textContent = val;
  buttons.forEach(b=>{ b.classList.toggle('preset-active', parseFloat(b.dataset.val)===val); });
}
function muscleSliderInput(prefix, mid, val){
  const v = parseFloat(val);
  const display = document.querySelector(`.${prefix}-val[data-mid="${mid}"]`);
  const buttons = document.querySelectorAll(`.${prefix}-load[data-mid="${mid}"] .preset-btn`);
  if(display) display.textContent = val;
  buttons.forEach(b=>{ b.classList.toggle('preset-active', parseFloat(b.dataset.val)===v); });
}
function getMuscleLoads(prefix){
  const result = {};
  document.querySelectorAll(`.${prefix}-chk:checked`).forEach(chk=>{
    const mid = chk.dataset.mid;
    const slider = document.querySelector(`.${prefix}-slider[data-mid="${mid}"]`);
    const val = slider ? (parseFloat(slider.value)||5) : 5;
    result[mid] = val;
  });
  return result;
}

function getMusclesFromEx(ex){
  if(!ex || !ex.muscles) return [];
  if(Array.isArray(ex.muscles)){
    const n = Math.max(ex.muscles.length, 1);
    return ex.muscles.map(id => ({ id, share: 1 / n }));
  }
  return Object.entries(ex.muscles).map(([id, pct]) => ({ id, share: (parseFloat(pct) || 0) / 100 }));
}

function getPlanItem(exId){
  const own = ownPlanStore.get();
  if(!own || !own.enabled) return null;
  return (own.items || []).find(it => it.id === exId) || null;
}
function findBlockChild(exId, blocks){
  // Упражнение всегда лежит прямым потомком какого-то блока (даже вложенного),
  // поэтому достаточно пройти по children всех блоков.
  for(const b of (blocks || [])){
    for(const c of (b.children || [])){
      if(c.type === 'exercise' && c.id === exId) return c;
    }
  }
  return null;
}

function getExSets(exId){
  const own = ownPlanStore.get();
  if(own && own.enabled){
    // 1. Standalone-упражнение в плане
    const item = (own.items || []).find(it => it.id === exId);
    if(item && Number.isFinite(item.sets) && item.sets > 0) return item.sets;

    // 2. Упражнение внутри блока (в т.ч. вложенного) — берём его override
    const child = findBlockChild(exId, own.blocks || []);
    if(child && Number.isFinite(child.sets) && child.sets > 0) return child.sets;
  }
  // 3. Дефолт из exercises.js
  return EX[exId]?.sets || 4;
}

function getLoadColor(load){
  if(load > LOAD_ORANGE) return '#e85a5a';
  if(load > LOAD_YELLOW) return '#e8a860';
  if(load > LOAD_GREEN)  return '#e8c44d';
  return '#6ab06a';
}
function getLoadLabel(load){
  if(load > LOAD_ORANGE) return 'нужен отдых';
  if(load > LOAD_YELLOW) return 'высокая';
  if(load > LOAD_GREEN)  return 'умеренная';
  return 'восстановлена';
}
function getWeightMode(exId){
  const ex = EX[exId];
  if(!ex) return 'total';
  if(ex.weightMode) return ex.weightMode;
  // Fallback для упражнений, которых нет в WEIGHT_MODES
  const markers = Array.isArray(ex.markers) ? ex.markers : [];
  const hasBW   = markers.includes('Собственный вес');
  const hasFree = markers.includes('Гантели/Штанга/Гиря');
  const hasMach = markers.includes('Тренажер');
  const hasBand = markers.includes('Резинка');
  if(hasBW && !hasFree && !hasMach && !hasBand) return 'bodyweight';
  return 'total';
}
function weightLabel(mode){
  switch(mode){
    case 'one':        return 'вес на 1 сторону (кг)';
    case 'both':       return 'общий вес (кг)';
    case 'bodyweight': return 'доп. вес (кг)';
    default:           return 'общий вес (кг)';
  }
}
function weightHint(mode, exId){
  const ex = EX[exId];
  const markers = (ex && Array.isArray(ex.markers)) ? ex.markers : [];
  switch(mode){
    case 'one':
      return '💡 Вес одной гантели/стороны. При расчёте усталости умножится на 2';
    case 'both':
      return '💡 Суммарный вес на обе стороны (штанга + блины = 60 → введите 60)';
    case 'bodyweight':
      return '💡 Пусто или 0 — свой вес. Введите доп. вес (пояс/жилет), если нужно';
    default:
      return '💡 Вес на обе стороны/тренажёре';
  }
}
function computeAllMuscleLoads(){
  const logs = store.logs;
  const todayStr = fmt(todayDate());
  const dates = Object.keys(logs).filter(d => {
    const day = logs[d];
    if(!day) return false;
    return Object.entries(day).some(([k,v]) =>
      !k.startsWith('_') && v && v.done && EX[logBaseId(k)] && !EX[logBaseId(k)].app
    );
  }).sort();
  const loads = {};
  Object.keys(MUSCLE_COEF).forEach(m => { loads[m] = 0; });
  if(!dates.length) return { loads, days: 0 };
  const muscleRecords = {};
  const start = new Date(dates[0] + 'T00:00:00');
  const cur = new Date(start);
  let days = 0;
  const ASSUMED_BODYWEIGHT_KG = parseFloat(localStorage.getItem('bodyWeight')) || 75;
const DEFAULT_BW_FACTOR = 0.65;
  const TRANSITION_RESET   = 10;
  let loadsAtStartOfToday = null;

  while(fmt(cur) <= todayStr){
    const dStr = fmt(cur);
    if(dStr === todayStr){
  loadsAtStartOfToday = { ...loads };
}
    const dayLog = logs[dStr] || {};

    // Явный пропуск дня — полный отдых для всех
    if(dayLog._skip){
      Object.keys(loads).forEach(m => {
        const cfg = MUSCLE_COEF[m];
        if(!cfg) return;
        loads[m] = Math.max(0, loads[m] * cfg.recovery_rate - cfg.daily_subtraction);
        if(loads[m] < 0.02) loads[m] = 0;
      });
      cur.setDate(cur.getDate() + 1);
      days++;
      continue;
    }

    // 1. Базовое восстановление каждый день
    Object.keys(loads).forEach(m => {
      const cfg = MUSCLE_COEF[m];
      if(!cfg) return;
      loads[m] = loads[m] * cfg.recovery_rate;
    });

    // 2. Сессии
    const sessions = [];
    const trained = new Set();
    Object.entries(dayLog).forEach(([id, e]) => {
      if(id.startsWith('_') || !e || !e.done) return;
      const ex = EX[logBaseId(id)];
      if(!ex || ex.app) return;
      const muscles = getMusclesFromEx(ex);
      if(!muscles.length) return;
      sessions.push({
  id, log: e, muscles,
  weightMode: ex.weightMode || 'total',
  bwEffWeight: ASSUMED_BODYWEIGHT_KG * (ex.bwFactor ?? DEFAULT_BW_FACTOR),
});
    });

    sessions.forEach(s => {
      let tonnage = 0, maxW = 0;
      (s.log.sets || []).forEach(set => {
        if(!set) return;
        const r = parseFloat(set.r) || 0;
        if(r <= 0) return;
        const w = parseFloat(set.w) || 0;
        const effW = w > 0 ? w : s.bwEffWeight;
tonnage += effW * r;
if(effW > maxW) maxW = effW;
      });
      if(tonnage <= 0) return;                 // ← ноль работы — не тренировка
      const wMult = s.weightMode === 'one' ? 2 : 1;
s.muscles.forEach(({ id, share }) => {
  trained.add(id);
  const effMaxW    = maxW * wMult * share;
  const effTonnage = tonnage * wMult * share;
        const rec = muscleRecords[id] || { maxWeight: 0, maxTonnage: 0 };
        const rawWRatio = rec.maxWeight  > 0 ? effMaxW    / rec.maxWeight  : 1.0;
        const rawTRatio = rec.maxTonnage > 0 ? effTonnage / rec.maxTonnage : 1.0;
        if(rawWRatio > TRANSITION_RESET || rawTRatio > TRANSITION_RESET){
          muscleRecords[id] = { maxWeight: effMaxW, maxTonnage: effTonnage };
          return;
        }
        const wRatio = Math.min(rawWRatio, 3.0);
        const tRatio = rawTRatio;
        if(tRatio >= LOAD_THRESHOLD){
          const inc = wRatio * tRatio * LOAD_FACTOR;
          loads[id] = (loads[id] || 0) + Math.min(inc, 0.40);
        }
        if(effMaxW    > rec.maxWeight)  rec.maxWeight  = effMaxW;
        if(effTonnage > rec.maxTonnage) rec.maxTonnage = effTonnage;
        muscleRecords[id] = rec;
      });
    });

    // 3. Полный отдых для мышц, у которых сегодня не было фактической работы
    if(dStr < todayStr){
      Object.keys(loads).forEach(m => {
        if(trained.has(m)) return;
        const cfg = MUSCLE_COEF[m];
        if(!cfg) return;
        loads[m] = Math.max(0, loads[m] - cfg.daily_subtraction);
        if(loads[m] < 0.02) loads[m] = 0;
      });
    }

    cur.setDate(cur.getDate() + 1);
    days++;
  }
  const dailyDeltas = {};
if(loadsAtStartOfToday){
  Object.keys(loads).forEach(m => {
    dailyDeltas[m] = loads[m] - (loadsAtStartOfToday[m] || 0);
  });
}
return { loads, days, dailyDeltas };
}



const store={
  get logs(){return JSON.parse(localStorage.getItem('logs')||'{}')},
  set logs(v){localStorage.setItem('logs',JSON.stringify(v))},
};
const customStore={
  get list(){return JSON.parse(localStorage.getItem('customEx')||'[]')},
  set list(v){localStorage.setItem('customEx',JSON.stringify(v))},
};
const ownPlanStore={
  get(){try{return JSON.parse(localStorage.getItem('ownPlan')||'null')}catch(e){return null}},
  set(v){localStorage.setItem('ownPlan',JSON.stringify(v))},
};

/* ---------- FLIP-анимация перемещений ---------- */
const __reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Анимация вкладок и форм ---------- */
(function injectAnimStyles(){
  if (document.getElementById('anim-styles')) return;
  const s = document.createElement('style');
  s.id = 'anim-styles';
  s.textContent = `
    @keyframes appFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes formExpand {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #app.app-anim { animation: appFadeIn 0.22s ease-out; }
    [data-form-anim].form-anim { animation: formExpand 0.24s cubic-bezier(0.4, 0, 0.2, 1); }
    @media (prefers-reduced-motion: reduce) {
      #app.app-anim, [data-form-anim].form-anim { animation: none !important; }
    }
  `;
  document.head.appendChild(s);
})();

let __animState = { view: null, form: null };
let __appAnimTimer = null;
function flipCapture(){
  const map = new Map();
  if (__reduceMotion) return map;
  document.querySelectorAll('[data-flip-key]').forEach(el => {
    const key = el.getAttribute('data-flip-key');
    if (!key) return;
    const r = el.getBoundingClientRect();
    map.set(key, { top: r.top, left: r.left });
  });
  return map;
}

function flipPlay(before){
  if (!before || !before.size) return;
  document.querySelectorAll('[data-flip-key]').forEach(el => {
    const key = el.getAttribute('data-flip-key');
    if (!key) return;
    const old = before.get(key);
    if (!old) return;
    const r = el.getBoundingClientRect();
    const dx = old.left - r.left;
    const dy = old.top - r.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.willChange = 'transform';
    void el.offsetWidth;              // принудительный reflow
    el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    el.style.transform = '';
    const cleanup = () => {
      el.style.transition = '';
      el.style.transform = '';
      el.style.willChange = '';
    };
    el.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, 450);
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function logBaseId(logKey){
  const i = logKey.search(/[~*]/);
  return i < 0 ? logKey : logKey.slice(0, i);
}
function fmt(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function todayDate(){const d=new Date();d.setHours(0,0,0,0);return d}

function customStartDate(c){
  if(c.schedule && c.schedule.startDate) return c.schedule.startDate;
  try{
    const ts=parseInt(String(c.id).slice(1),36);
    if(!isNaN(ts))return fmt(new Date(ts));
  }catch(e){}
  return '1970-01-01';
}
function syncCustomEx(){
  customStore.list.forEach(c=>{
    if(c.deleted) return;
    let muscles = c.muscles;
    if(Array.isArray(muscles)){
      const pct = muscles.length ? Math.floor(100/muscles.length) : 0;
      const obj = {};
      muscles.forEach(id=>{obj[id]=pct});
      muscles = obj;
    }
    if(!muscles || typeof muscles!=='object') muscles = {};
    EX[c.id]={name:c.name,app:!!c.app,sets:c.sets||4,reps:c.reps||'12-15',muscles,weightMode:c.weightMode||'total'};
  });
}

function isScheduleActive(schedule,date,startFallback){
  if(!schedule)return false;
  if(schedule.type==='none')return false;
  if(schedule.type==='delayAfterParent')return false;
  const startStr=schedule.startDate||startFallback;
  if(startStr){
    const start=new Date(startStr+'T00:00:00');
    const d=new Date(date);d.setHours(0,0,0,0);
    if(d<start)return false;
  }
  if(schedule.type==='everyday')return true;
  if(schedule.type==='days')return !!(schedule.days&&schedule.days.includes(date.getDay()));
  if(schedule.type==='even')return date.getDate()%2===0;
  if(schedule.type==='odd')return date.getDate()%2===1;
  if(schedule.type==='interval'){
    const startStr2 = schedule.startDate || '1970-01-01';
    const start=new Date(startStr2+'T00:00:00');
    const d=new Date(date);d.setHours(0,0,0,0);
    const diff=Math.floor((d-start)/86400000);
    return diff>=0&&diff%schedule.interval===0;
  }
  return false;
}
function scheduleSummary(schedule){
  if(!schedule||schedule.type==='none')return 'не задано';
  if(schedule.type==='everyday')return 'каждый день';
  if(schedule.type==='even')return 'чётные дни';
  if(schedule.type==='odd')return 'нечётные дни';
  if(schedule.type==='days'){
    const names=WEEK_ORDER.filter(d=>schedule.days.includes(d)).map(d=>DAYS[d]);
    return names.length?names.join(', '):'не задано';
  }
  if(schedule.type==='interval')return 'раз в '+schedule.interval+' дн.';
  if(schedule.type==='delayAfterParent')return 'через '+ (schedule.delayDays||2) +' дн. после родителя';
  return 'не задано';
}

function isDisabledOn(item, dateStr){
  if(!item || !item.disabled) return null;
  const periods = Array.isArray(item.disabled) ? item.disabled : [item.disabled];
  for(const p of periods){
    if(!p || !p.reason) continue;
    const fromOk = !p.from || dateStr >= p.from;
    const untilOk = !p.until || dateStr <= p.until;
    if(fromOk && untilOk) return p;
  }
  return null;
}
function isCurrentlyDisabled(item){
  return isDisabledOn(item, fmt(todayDate()));
}

/* ---------- Block helpers ---------- */
function getBlockById(blocks, id){
  return (blocks || []).find(b => b.id === id) || null;
}

function getBlockExercises(block, allBlocks, visited){
  visited = visited || new Set();
  if(!block || visited.has(block.id)) return [];
  visited.add(block.id);
  const result = [];
  (block.children || []).forEach(child => {
    if(child.type === 'exercise'){
      if(EX[child.id]) result.push(child.id);
    } else if(child.type === 'block'){
      const nested = getBlockById(allBlocks, child.id);
      if(nested) result.push(...getBlockExercises(nested, allBlocks, visited));
    }
  });
  return result;
}
function getBlockDescendantIds(blocks, blockId, visited){
  visited = visited || new Set();
  if(visited.has(blockId)) return [];
  visited.add(blockId);
  const block = getBlockById(blocks, blockId);
  if(!block) return [];
  const result = [blockId];
  (block.children || []).forEach(child => {
    if(child.type === 'block'){
      result.push(...getBlockDescendantIds(blocks, child.id, visited));
    }
  });
  return result;
}

/* =========================================================
   PLAN COMPUTATION
   ========================================================= */
function isChildEntryActive(childRef, date, parentBlock, parentActive, blocks) {
  let schedule;
  if (childRef.type === 'exercise') {
    schedule = childRef.schedule || { type: 'none' };
  } else {
    const nested = getBlockById(blocks, childRef.id);
    schedule = childRef.scheduleOverride || (nested ? nested.schedule : { type: 'none' });
    if (!schedule) schedule = { type: 'none' };
  }

  const activeWithParent = childRef.activeWithParent !== false;

  if (schedule.type === 'delayAfterParent') {
    const delay = schedule.delayDays || 1;
    const past = new Date(date);
    past.setDate(past.getDate() - delay);
    if (!parentBlock || !parentBlock.schedule) return false;
    return isScheduleActive(parentBlock.schedule, past);
  }

  if (activeWithParent && !parentActive) return false;
  if (schedule.type === 'none') return true;
  return isScheduleActive(schedule, date);
}

function processBlockTree(block, date, blocks, visited, ancestorDisabled, disableReason, blockActive) {
  if (!block || visited.has(block.id)) return null;
  visited.add(block.id);

  const dateStr = fmt(date);
  const blockDis = isDisabledOn(block, dateStr);
  const myDisabled = ancestorDisabled || !!blockDis;
  const myReason = blockDis ? blockDis.reason : disableReason;

  const node = {
    type: 'block',
    blockId: block.id,
    name: block.name,
    items: [],
    cancelled: [],
    flatExercises: [],
    exCount: 0
  };

  (block.children || []).forEach(child => {
    const childActive = isChildEntryActive(child, date, block, blockActive, blocks);
    const childDis = isDisabledOn(child, dateStr);
    const childDisabled = myDisabled || !!childDis;
    const childReason = childDis ? childDis.reason : myReason;

    if (child.type === 'exercise') {
      if (childActive) {
        if (childDisabled) {
          node.cancelled.push({ id: child.id, reason: childReason || 'disabled', blockName: block.name });
        } else {
          node.items.push({ type: 'exercise', id: child.id });
          node.flatExercises.push(child.id);
          node.exCount++;
        }
      }
    } else if (child.type === 'block') {
      const nested = getBlockById(blocks, child.id);
      if (!nested) return;
      if (childActive) {
        const childNode = processBlockTree(nested, date, blocks, visited, childDisabled, childReason, true);
        if (childNode && (childNode.items.length > 0 || childNode.cancelled.length > 0)) {
          node.items.push({ type: 'block', node: childNode });
          node.flatExercises.push(...childNode.flatExercises);
          node.exCount += childNode.exCount;
        }
      }
    }
  });

  if (node.exCount === 0 && node.cancelled.length === 0) return null;
  return node;
}

function getTopLevelBlocks(){
  const own = ownPlanStore.get();
  const all = (own && own.blocks) || [];
  const referenced = new Set();
  all.forEach(b => {
    (b.children || []).forEach(c => {
      if (c.type === 'block') referenced.add(c.id);
    });
  });
  return all.filter(b => !referenced.has(b.id));
}

function getPlan(date){
  const dateStr = fmt(date);
  const own = ownPlanStore.get();
  const main = [];
  const groups = [];
  const cancelled = [];
  const seen = new Set();
  const cancelledSeen = new Set();
  const dayLog = store.logs[dateStr] || {};
  const skippedBlocks = dayLog._skippedBlocks || {};
  const counts = {};
  const assignKey = (exId) => {
    counts[exId] = (counts[exId] || 0) + 1;
    return counts[exId] === 1 ? exId : exId + '~' + counts[exId];
  };

  if(own && own.enabled){
    const allBlocks = own.blocks || [];

    (own.items || []).forEach(item => {
      if(!EX[item.id]) return;
      if(!isScheduleActive(item.schedule, date)) return;
      const dis = isDisabledOn(item, dateStr);
      if(dis){
        cancelled.push({ id: item.id, reason: dis.reason, type: 'disabled' });
        cancelledSeen.add(item.id);
      } else {
        const logKey = assignKey(item.id);
        main.push(logKey);
        seen.add(item.id);
        groups.push({ type: 'exercise', id: item.id, logKey });
      }
    });

    const topBlocks = getTopLevelBlocks();
    topBlocks.forEach(block => {
      if(skippedBlocks[block.id]){
        groups.push({ type: 'block', blockId: block.id, name: block.name, skipped: skippedBlocks[block.id], tree: null });
        getBlockExercises(block, allBlocks).forEach(id => seen.add(id));
        return;
      }
      const blockDis = isDisabledOn(block, dateStr);
      if (blockDis) {
        groups.push({ type: 'block', blockId: block.id, name: block.name, disabled: blockDis, tree: null });
        getBlockExercises(block, allBlocks).forEach(id => seen.add(id));
        return;
      }

      const blockActive = isScheduleActive(block.schedule, date);
      const blockOut = processBlockTree(block, date, allBlocks, new Set(), false, null, blockActive);

      if (blockOut) {
        const filterNode = (n) => {
          const newItems = [];
          const newCancelled = n.cancelled.filter(c => !seen.has(c.id) && !cancelledSeen.has(c.id));
          newCancelled.forEach(c => cancelledSeen.add(c.id));

          n.items.forEach(it => {
            if (it.type === 'exercise') {
              if (EX[it.id]) {
                const logKey = assignKey(it.id);
                newItems.push({ ...it, logKey });
              }
            } else if (it.type === 'block') {
              if (skippedBlocks[it.node.blockId]) {
                it.node.flatExercises.forEach(exId => {
                  if(!cancelledSeen.has(exId) && !seen.has(exId)){
                    cancelled.push({ id: exId, reason: skippedBlocks[it.node.blockId].reason || 'блок пропущен', blockName: it.node.name, type: 'skipped' });
                    cancelledSeen.add(exId);
                    seen.add(exId);
                  }
                });
                return;
              }
              const filteredChild = filterNode(it.node);
              if (filteredChild) newItems.push({ type: 'block', node: filteredChild });
            }
          });

          if (newItems.length === 0 && newCancelled.length === 0) return null;

          let exCount = 0;
          const flatExs = [];
          newItems.forEach(it => {
            if (it.type === 'exercise') { exCount++; flatExs.push(it.logKey); }
            else { exCount += it.node.exCount; flatExs.push(...it.node.flatExercises); }
          });
          return { ...n, items: newItems, cancelled: newCancelled, exCount, flatExercises: flatExs };
        };

        const filteredBlock = filterNode(blockOut);

        if (filteredBlock && filteredBlock.exCount > 0) {
          filteredBlock.flatExercises.forEach(k => { main.push(k); seen.add(logBaseId(k)); });
          filteredBlock.cancelled.forEach(c => { cancelledSeen.add(c.id); cancelled.push(c); });
          groups.push({ type: 'block', blockId: block.id, name: block.name, tree: filteredBlock });
        } else if (filteredBlock && filteredBlock.cancelled.length > 0) {
          filteredBlock.cancelled.forEach(c => { cancelledSeen.add(c.id); cancelled.push(c); });
          groups.push({ type: 'block', blockId: block.id, name: block.name, disabled: { reason: 'все упражнения отменены' }, tree: null });
        }
      }
    });
  }

  customStore.list.forEach(c => {
    if(c.deleted || seen.has(c.id) || cancelledSeen.has(c.id)) return;
    if(isCustomActive(c, date)){
      const logKey = assignKey(c.id);
      main.push(logKey);
      seen.add(c.id);
      groups.push({ type: 'exercise', id: c.id, logKey });
    }
  });

  Object.entries(dayLog).forEach(([id, e]) => {
    if (id.startsWith('_') || !e || !e.adHoc) return;
    if (main.includes(id)) return;
    main.push(id);
    seen.add(logBaseId(id));
    groups.push({ type: 'adhoc', id, logKey: id });
  });

  return { info: [], main, groups, cancelled, after: [] };
}

function isCustomActive(c, date){
  if(c.deleted) return false;
  return isScheduleActive(c.schedule, date, customStartDate(c));
}

/* ---------- stats & PRs ---------- */
function getExerciseStats(log){
  let maxW=0,maxR=0,totalVol=0,totalSets=0;
  (log?.sets||[]).forEach(s=>{
    if(!s)return;
    const w=parseFloat(s.w)||0;
    const r=parseFloat(s.r)||0;
    if(w>maxW)maxW=w;
    if(r>maxR)maxR=r;
    if(r>0){totalSets++;if(w>0)totalVol+=w*r;}
  });
  return {maxW,maxR,totalVol,totalSets};
}
function getLastEntryBefore(exId, dateStr){
  const logs = store.logs;
  const dates = Object.keys(logs).filter(d => d < dateStr).sort().reverse();
  for(const d of dates){
    const day = logs[d];
    if(!day) continue;
    let best = null, bestMax = -1;
    Object.entries(day).forEach(([k,e]) => {
      if(k.startsWith('_') || !e || !e.done) return;
      if(logBaseId(k) !== exId) return;
      const m = Math.max(...(e.sets||[]).map(s=>parseFloat(s.w)||0), 0);
      if(m > bestMax){ bestMax = m; best = { date: d, ...e }; }
    });
    if(best) return best;
  }
  return null;
}
function getExerciseHistoryBefore(exId, dateStr){
  const logs = store.logs;
  let maxW = 0;
  const repsByWeight = {};
  Object.keys(logs).filter(d => d < dateStr).forEach(d => {
    const day = logs[d];
    if(!day) return;
    Object.entries(day).forEach(([k,e]) => {
      if(k.startsWith('_') || !e || !e.done) return;
      if(logBaseId(k) !== exId) return;
      (e.sets||[]).forEach(s => {
        if(!s) return;
        const w = parseFloat(s.w)||0;
        const r = parseFloat(s.r)||0;
        if(w > maxW) maxW = w;
        if(r > 0){ if(repsByWeight[w] === undefined || r > repsByWeight[w]) repsByWeight[w] = r; }
      });
    });
  });
  return { maxW, repsByWeight };
}
function checkPRs(exId,log,dateStr){
  const sets=log?.sets||[];
  const hasData=sets.some(s=>s&&parseFloat(s.r)>0);
  if(!hasData)return {weightPR:null,repsPR:null};
  const prev=getExerciseHistoryBefore(exId,dateStr);
  let weightPR=null,repsPR=null;
  
  // Лучшие результаты, включая предыдущие подходы текущего дня
  let bestW = prev.maxW;
  let bestRepsByWeight = { ...prev.repsByWeight };
  
  sets.forEach(s=>{
    if(!s)return;
    const w=parseFloat(s.w)||0;
    const r=parseFloat(s.r)||0;
    if(r<=0)return;
    
    // Weight PR: строго больше лучшего веса, виденного до этого момента
    if(w>bestW){ 
      if(!weightPR||w>weightPR.w||(w===weightPR.w&&r>weightPR.r)) weightPR={w,r}; 
    }
    
    // Reps PR: больше повторений на этом весе, чем когда-либо ранее
    const prevReps=bestRepsByWeight[w];
    const isNewWeight = prevReps===undefined;
    
    if(isNewWeight || r>prevReps){
      // Проверка доминирования: не выдавать reps-PR, если ранее был более тяжёлый подход с >= повторениями
      let dominated = false;
      for(const [w2, r2] of Object.entries(bestRepsByWeight)){
        if(parseFloat(w2) >= w && r2 >= r){
          dominated = true;
          break;
        }
      }
      if(!dominated){
        if(!repsPR||r>repsPR.r||(r===repsPR.r&&w>repsPR.w)) repsPR={w,r};
      }
    }
    
    // Обновляем "лучшие на данный момент" для следующих подходов
    if(w>bestW) bestW = w;
    if(r>0){
      if(bestRepsByWeight[w]===undefined || r>bestRepsByWeight[w]) bestRepsByWeight[w] = r;
    }
  });
  return {weightPR,repsPR};
}
function getDaySteadyCount(dateStr){
  const dayLog = store.logs[dateStr] || {};
  let count = 0;
  Object.entries(dayLog).forEach(([k,e])=>{
    if(k.startsWith('_')||!e||!e.done) return;
    const ex = EX[logBaseId(k)];
    if(!ex||ex.app) return;
    if(checkSteadyAllSets(logBaseId(k), e, dateStr)) count++;
  });
  return count;
}
function getDayPRCounts(dateStr){
  const dayLog=store.logs[dateStr]||{};
  let weight=0,reps=0;
  Object.entries(dayLog).forEach(([k,e])=>{
    if(k.startsWith('_')||!e||!e.done)return;
    const exId = logBaseId(k);
    const ex = EX[exId];
    if(!ex || ex.app) return;
    const {weightPR,repsPR}=checkPRs(exId, e, dateStr);
    if(weightPR)weight++;
    if(repsPR)reps++;
  });
  return {weight,reps};
}
function getPRBadgesHtml(exId,log,dateStr){
  if(!log)return '';
  const {weightPR,repsPR}=checkPRs(exId,log,dateStr);
  let html='';
  if(weightPR)html+=`<span class="pr-badge pr-weight" title="Новый максимальный вес">🔩 ${weightPR.w}кг</span>`;
  if(repsPR)html+=`<span class="pr-badge pr-reps" title="Новый вес или больше повторений">💪 ${repsPR.w>0?repsPR.w+'кг×':''}${repsPR.r}</span>`;
  return html;
}
function getTargetReps(exId,dateStr){
  const logs=store.logs;
  const dates=Object.keys(logs).filter(d=>d<dateStr).sort().reverse();
  for(const d of dates){
    const day = logs[d];
    if(!day) continue;
    let bestMaxW = 0, bestReps = 0;
    Object.entries(day).forEach(([k,e])=>{
      if(k.startsWith('_') || !e || !e.done) return;
      if(logBaseId(k) !== exId) return;
      let maxW=0,repsAtMaxW=0;
      (e.sets||[]).forEach(s=>{
        if(!s)return;
        const w=parseFloat(s.w)||0;
        const r=parseFloat(s.r)||0;
        if(r<=0)return;
        if(w>maxW){maxW=w;repsAtMaxW=r;}
        else if(w===maxW&&r>repsAtMaxW)repsAtMaxW=r;
      });
      if(repsAtMaxW>0 && maxW > bestMaxW){ bestMaxW = maxW; bestReps = repsAtMaxW; }
    });
    if(bestReps>0) return Math.min(bestReps+1,15);
  }
  return 15;
}
function checkSteadyAllSets(exId,log,dateStr){
  const ex=EX[exId];
  if(!ex||ex.app)return null;
  const plannedSets = (log && Number.isFinite(log._customSets) && log._customSets > 0)
    ? log._customSets : getExSets(exId);
  const filled=(log?.sets||[]).filter(s=>s&&parseFloat(s.r)>0);
  if(filled.length<plannedSets||filled.length<2)return null;
  const w0=parseFloat(filled[0].w)||0;
  const r0=parseFloat(filled[0].r)||0;
  const allSame=filled.every(s=>(parseFloat(s.w)||0)===w0&&(parseFloat(s.r)||0)===r0);
  if(!allSame)return null;
  const logs=store.logs;
  let maxWBefore=0;
  Object.keys(logs).filter(d=>d<dateStr).forEach(d=>{
    const day = logs[d];
    if(!day) return;
    Object.entries(day).forEach(([k,e])=>{
      if(k.startsWith('_') || !e || !e.done) return;
      if(logBaseId(k) !== exId) return;
      (e.sets||[]).forEach(s=>{
        if(!s)return;
        const w=parseFloat(s.w)||0;
        if(w>maxWBefore)maxWBefore=w;
      });
    });
  });
  if(w0<maxWBefore)return null;
  let maxSteadyBefore=0;
  Object.keys(logs).filter(d=>d<dateStr).forEach(d=>{
    const day = logs[d];
    if(!day) return;
    Object.entries(day).forEach(([k,e])=>{
      if(k.startsWith('_') || !e || !e.done) return;
      if(logBaseId(k) !== exId) return;
      const wSets=(e.sets||[]).filter(s=>s&&(parseFloat(s.w)||0)===w0&&parseFloat(s.r)>0);
      if(wSets.length<plannedSets)return;
      const minR=Math.min(...wSets.map(s=>parseFloat(s.r)||0));
      if(minR>maxSteadyBefore)maxSteadyBefore=minR;
    });
  });
  if(r0<=maxSteadyBefore)return null;
  return {count:filled.length,w:w0,r:r0};
}
function computeProgressHtml(exId,log,dateStr){
  if(!log||!log.sets)return '';
  const last=getLastEntryBefore(exId,dateStr);
  if(!last)return '';
  if(!log.sets.some(s=>s&&parseFloat(s.r)>0))return '';
  const t=getExerciseStats(log),p=getExerciseStats(last);
  const dW=Math.round((t.maxW-p.maxW)*100)/100;
  const dR=Math.round(t.maxR-p.maxR);
  const parts=[];
  if(dW>0)parts.push(`<span class="up">+${dW}кг</span>`);
  else if(dW<0)parts.push(`<span class="down">${dW}кг</span>`);
  if(dR>0)parts.push(`<span class="up">+${dR} повт</span>`);
  else if(dR<0)parts.push(`<span class="down">${dR} повт</span>`);
  if(!parts.length)return '';
  return `<div class="progress-line">${parts.join(' · ')}</div>`;
}
function renderDayMetaHtml(dayLog,isToday){
  const ton=dayTonnage(dayLog);
  let html='';
  if(!isToday)html+=`<button class="mini-btn" onclick="goToday()">Сегодня</button>`;
  if(ton.sets>0)html+=`<span>${ton.tonnage} кг · ${ton.sets} подх.</span>`;
  return html;
}
function updateExerciseUI(logKey){
  const el = document.querySelector(`.ex[data-log-key="${logKey}"]`);
  if(!el) return;
  const exId = logBaseId(logKey);
  const dateStr = fmt(currentDate);
  const log = store.logs[dateStr]?.[logKey];
  const progressEl = el.querySelector('[data-progress]');
  const prEl = el.querySelector('[data-pr]');
  const steadyEl = el.querySelector('[data-steady]');
  if(progressEl) progressEl.innerHTML = computeProgressHtml(exId, log, dateStr);
  if(prEl){
    const prHtml = getPRBadgesHtml(exId, log, dateStr);
    prEl.innerHTML = prHtml ? `<div class="pr-row">${prHtml}</div>` : '';
  }
  if(steadyEl){
    const steady = checkSteadyAllSets(exId, log, dateStr);
    steadyEl.innerHTML = steady ? `<div class="pr-row"><span class="pr-badge pr-max" title="Все подходы одинаковые — пора увеличить вес или повторы">🎯 ${steady.count}×${steady.r}</span></div>` : '';
  }
}

function updateDayMeta(){
  const el=document.getElementById('day-meta');
  if(!el)return;
  const dateStr=fmt(currentDate);
  const dayLog=store.logs[dateStr]||{};
  const isToday=dateStr===fmt(todayDate());
  const html=renderDayMetaHtml(dayLog,isToday);
  el.innerHTML=html;
  el.style.display=html?'flex':'none';
}
function getLastEntry(exId){
  const logs=store.logs;
  const dates=Object.keys(logs).sort().reverse();
  for(const d of dates){
    const e=logs[d]&&logs[d][exId];
    if(e&&e.done)return {date:d,...e};
  }
  return null;
}
function formatSets(log){
  if(!log) return 'нет данных';
  if(!log.sets || !log.sets.length) return 'нет данных';
  const parts=log.sets.filter(s=>s&&(s.w||s.r));
  if(!parts.length) return 'нет данных';
  const groups=[];
  parts.forEach(s=>{
    const w=String(s.w||'').trim();
    const r=String(s.r||'?').trim();
    const last=groups[groups.length-1];
    if(last && last.w===w){ last.reps.push(r); }
    else { groups.push({w, reps:[r]}); }
  });
  return groups.map(g => {
    if(!g.w) return `свой вес (${g.reps.join('+')})`;
    return `${g.w}кг(${g.reps.join('+')})`;
  }).join('+');
}
function checkTonnagePR(dateStr){
  const logs=store.logs;
  const t=dayTonnage(logs[dateStr]||{}).tonnage;
  if(t<=0)return null;
  let maxBefore=0;
  Object.keys(logs).filter(d=>d<dateStr).forEach(d=>{
    const dt=dayTonnage(logs[d]||{}).tonnage;
    if(dt>maxBefore)maxBefore=dt;
  });
  if(maxBefore>0 && t<=maxBefore)return null;
  return {tonnage:t,prev:maxBefore};
}
function renderDayTonnageHtml(dateStr,dayLog){
  const {tonnage,sets}=dayTonnage(dayLog);
  if(tonnage===0&&sets===0)return '';
  const pr=checkTonnagePR(dateStr);
  let html='<div class="day-tonnage">';
  html+=`💯 ${tonnage>0?tonnage+' кг · ':''}${sets} подх.`;
  if(pr){
    const title=pr.prev>0?`Рекорд по дневному тоннажу (предыдущий: ${pr.prev} кг)`:'Первый рекорд тоннажа';
    html+=` <span class="pr-badge pr-tonnage" title="${title}">🏆 рекорд</span>`;
  }
  html+='</div>';
  return html;
}
function dayTonnage(dayLog){
  let tonnage=0,sets=0;
  Object.entries(dayLog).forEach(([id,e])=>{
    if(id.startsWith('_')||!e||!e.done)return;
    const ex = EX[logBaseId(id)];
    const wMult = (ex && ex.weightMode === 'one') ? 2 : 1;
const bwEff = ex ? (75 * (ex.bwFactor ?? 0.65)) : 0;
(e.sets||[]).forEach(s=>{
  if(!s)return;
  const w0=parseFloat(s.w)||0, r=parseFloat(s.r)||0;
  if(r>0){
    sets++;
    const w = w0 > 0 ? w0 : bwEff;
    if(w > 0) tonnage += w * r * wMult;
  }
});
  });
  return {tonnage:Math.round(tonnage),sets};
}

let currentDate=todayDate();
let view='today';
let selectedDate=todayDate();
let calendarMonth=new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1);
let statsExerciseId=null;
let searchQuery='';
let blockCollapseState = {}; // {blockId: 'expanded'|'collapsed'}, пусто = авто
let expandedMuscleGroups = new Set();
let schedulePreviewBlockId = null;
let moveState = null; // { fromType: 'item'|'child', fromIdx, fromBlockId? }

function toggleMuscleGroup(key){
  const body = document.getElementById('mg-body-' + key);
  if(!body) return;
  const header = body.previousElementSibling;

  if(expandedMuscleGroups.has(key)){
    // сворачивание: фиксируем фактическую высоту → reflow → 0 (чтобы анимация была плавной)
    const h = body.scrollHeight;
    body.style.maxHeight = h + 'px';
    void body.offsetHeight;
    body.style.maxHeight = '0px';
    expandedMuscleGroups.delete(key);
    if(header) header.classList.remove('expanded');
  } else {
    // разворачивание: 0 → фактическая высота
    body.style.maxHeight = body.scrollHeight + 'px';
    expandedMuscleGroups.add(key);
    if(header) header.classList.add('expanded');
  }
}

// Максимальный эффективный вес по каждой мышце: max(вес_упражнения × доля мышцы)
function getMaxWeightByMuscle(){
  const logs = store.logs;
  const result = {};
  Object.keys(logs).forEach(d => {
    const dayLog = logs[d];
    if(!dayLog) return;
    Object.entries(dayLog).forEach(([id, e]) => {
      if(id.startsWith('_') || !e || !e.done) return;
      const ex = EX[logBaseId(id)];
      if(!ex || ex.app) return;
      const muscles = getMusclesFromEx(ex);
      if(!muscles.length) return;
      let maxW = 0;
      (e.sets||[]).forEach(s => {
        if(!s) return;
        const w = parseFloat(s.w)||0;
        if(w > maxW) maxW = w;
      });
      if(maxW <= 0) return;
      const wMult = ex.weightMode === 'one' ? 2 : 1;
muscles.forEach(({id: mid, share}) => {
  const effW = maxW * wMult * share;
  if(!result[mid] || effW > result[mid]) result[mid] = effW;
});
    });
  });
  return result;
}

function toggleBlockCollapse(blockId, currentlyCollapsed){
  blockCollapseState[blockId] = currentlyCollapsed ? 'expanded' : 'collapsed';
  render();
}

/* ---------- Training view ---------- */
function renderExercise(logKey, log, depth = 0){
  const exId = logBaseId(logKey);
  const ex = EX[exId];
  if(!ex) return '';
  const dateStr = fmt(currentDate);
  const isSkipped = log && log._skipped;
  const done = (log?.done && !isSkipped) ? 'done' : '';
  const checked = (log?.done && !isSkipped) ? 'checked' : '';
  const last = getLastEntryBefore(exId, dateStr);
  const musStr = muscleSummary(ex.muscles);
  const musclesHtml = musStr ? `<div class="ex-last" style="color:#7a7a7a">${escapeHtml(musStr)}</div>` : '';
  const markersHtml = renderMarkerChipsOnly(exId);
  const indentStyle = depth > 0 ? `margin-left:${depth * 16}px;` : '';
  const sets = (log && Number.isFinite(log._customSets) && log._customSets > 0) ? log._customSets : getExSets(exId);

  const skipBtn = isSkipped
    ? `<button class="mini-btn" style="padding:2px 7px;font-size:11px;background:#2a4a2a;border-color:#3a6a3a;color:#9f9" onclick="event.stopPropagation();unskipExerciseToday('${logKey}')" title="Вернуть">↺</button>`
    : `<button class="mini-btn" style="padding:2px 7px;font-size:11px;background:transparent;border-color:#444;color:#888" onclick="event.stopPropagation();skipExerciseToday('${logKey}')" title="Пропустить на сегодня">⊘</button>`;

  const head = `<div class="ex-head">
      <input type="checkbox" ${checked} onchange="toggleDone('${logKey}',this.checked)">
      <strong>${escapeHtml(ex.name)}</strong>
      <span class="meta">${ex.app?'по приложению':sets+'×'+getTargetReps(exId,dateStr)}</span>
      ${skipBtn}
    </div>`;

    if (isSkipped) {
    return `<div class="ex ex-cancelled" data-ex-id="${exId}" data-log-key="${logKey}" data-flip-key="log:${logKey}" style="${indentStyle}">
      ${head}
      <div class="ex-last" style="color:#c66;margin-bottom:0">🚫 Пропущено: ${escapeHtml(log._skipped.reason)}</div>
    </div>`;
  }

  if(ex.app){
      return `<div class="ex ${done}" data-ex-id="${exId}" data-log-key="${logKey}" data-flip-key="log:${logKey}" style="${indentStyle}">
      ${head}
      ${markersHtml}
      <div class="ex-app"><span>${log?.done?'✓ Подтверждено':'Отметь галочку, если сделал'}</span></div>
      <div class="ex-last">Последний раз: ${last?last.date:'нет данных'}</div>
      ${musclesHtml}
    </div>`;
  }


  const logSets = log?.sets || [];
  let rows = '';
  const wMode = getWeightMode(exId);
const wLabel = weightLabel(wMode);
const wHintText = weightHint(wMode, exId);
const wHint = `<div class="ex-last" style="color:#7cc0e8;font-size:11px;line-height:1.35;margin-bottom:4px">${wHintText}</div>`;
  
  for(let i=0;i<sets;i++){
    const s = logSets[i] || {};
    rows += `<div class="set-row">
  <span class="set-num">${i+1}</span>
  <input type="text" inputmode="decimal" placeholder="${wLabel}" value="${s.w||''}" oninput="onSetInput('${logKey}',${i},'w',this)">
  <input type="text" inputmode="numeric" placeholder="повторения" value="${s.r||''}" oninput="onSetInput('${logKey}',${i},'r',this)">
</div>`;
  }

  const setsCtrl = `<div style="display:flex;align-items:center;gap:8px;margin:0 0 6px;font-size:12px;color:#888">
    <button class="mini-btn" style="padding:1px 8px;font-size:14px;line-height:1;min-width:26px" onclick="changeSets('${logKey}',-1)" title="Меньше подходов">−</button>
    <span>Подходов: <strong style="color:#e8e8e8">${sets}</strong></span>
    <button class="mini-btn" style="padding:1px 8px;font-size:14px;line-height:1;min-width:26px" onclick="changeSets('${logKey}',1)" title="Больше подходов">+</button>
  </div>`;

  const progressHtml = computeProgressHtml(exId, log, dateStr);
  const prHtml = getPRBadgesHtml(exId, log, dateStr);
  const steady = checkSteadyAllSets(exId, log, dateStr);
    return `<div class="ex ${done}" data-ex-id="${exId}" data-log-key="${logKey}" data-flip-key="log:${logKey}" style="${indentStyle}">
    ${head}
    ${markersHtml}
    <div class="ex-last">Прошлый раз: ${formatSets(last)}</div>
${musclesHtml}
${wHint}
<div data-progress>${progressHtml}</div>
    <div data-pr>${prHtml?`<div class="pr-row">${prHtml}</div>`:''}</div>
    <div data-steady>${steady?`<div class="pr-row"><span class="pr-badge pr-max" title="Все подходы одинаковые — пора увеличить вес или повторы">🎯 ${steady.count}×${steady.r}</span></div>`:''}</div>
    ${setsCtrl}
    ${rows}
  </div>`;
}
function renderTabs(){
  return `<div class="tabs">
    <button class="${view==='today'?'active':''}" onclick="setView('today')">Тренировка</button>
    <button class="${view==='history'?'active':''}" onclick="setView('history')">История</button>
    <button class="${view==='custom'?'active':''}" onclick="setView('custom')">Свои</button>
    <button class="${view==='search'?'active':''}" onclick="setView('search')">Поиск</button>
    <button class="${view==='stats'||view==='stats-ex'?'active':''}" onclick="setView('stats')">Стата</button>
    <button class="${view==='trainer'?'active':''}" onclick="setView('trainer')">Тренер</button>
    <button class="${view==='settings'?'active':''}" onclick="setView('settings')" title="Настройки">⚙️</button>
  </div>`;
}

function renderBlockGroup(node, dayLog, depth = 0){
  const doneCount = node.flatExercises.filter(id => dayLog[id] && dayLog[id].done && !dayLog[id]._skipped).length;
  const allDone = node.exCount > 0 && doneCount === node.exCount;
  const state = blockCollapseState[node.blockId];
  const isCollapsed = state === 'expanded' ? false : (state === 'collapsed' ? true : allDone);
  const indentStyle = depth > 0 ? `margin-left:${depth * 16}px;` : '';
  const headerStyle = indentStyle + (allDone ? 'opacity:0.55;' : '');
  const skipBtn = `<button class="mini-btn" style="padding:2px 6px;font-size:10px;background:transparent;border-color:#444;color:#888" onclick="event.stopPropagation();skipBlockToday('${node.blockId}', '${escapeHtml(node.name).replace(/'/g, "\\'")}')" title="Пропустить блок на сегодня">⊘</button>`;

  let html = `<div class="block-header" onclick="toggleBlockCollapse('${node.blockId}', ${isCollapsed})" style="${headerStyle}">
    <span class="blk-toggle">${isCollapsed ? '▸' : '▾'}</span>
    <span class="blk-icon">📦</span>
    ${escapeHtml(node.name)}
    <span style="margin-left:auto;display:flex;align-items:center;gap:6px">
      ${skipBtn}
      <span class="blk-count">${doneCount}/${node.exCount}${allDone ? ' ✓' : ''}</span>
    </span>
  </div>`;

   if(!isCollapsed){
        const isChildDone = (item) => {
      if (item.type === 'exercise') {
        const lg = dayLog[item.logKey];
        return !!(lg && lg.done && !lg._skipped);
      }
      if (item.type === 'block') {
        const cn = item.node;
        if (!cn || cn.exCount === 0) return false;
        return cn.flatExercises.every(id => dayLog[id] && dayLog[id].done && !dayLog[id]._skipped);
      }
      return false;
    };
    const normalItems = [];
    const doneItems = [];
    node.items.forEach(item => {
      if (isChildDone(item)) doneItems.push(item);
      else normalItems.push(item);
    });
    normalItems.concat(doneItems).forEach(item => {
      if (item.type === 'exercise') {
        html += renderExercise(item.logKey, dayLog[item.logKey], depth + 1);
      } else if (item.type === 'block') {
        html += renderBlockGroup(item.node, dayLog, depth + 1);
      }
    });
  }
  return `<div data-flip-key="blk:${node.blockId}">${html}</div>`;
}
function openAdHocPicker() {
  let modal = document.getElementById('adhoc-modal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="adhoc-modal" style="display:flex;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:1000;align-items:flex-end;justify-content:center" onclick="if(event.target===this)closeAdHocPicker()">
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px 12px 0 0;width:100%;max-width:600px;max-height:85vh;display:flex;flex-direction:column;padding-bottom:env(safe-area-inset-bottom)">
          <div style="padding:16px 16px 8px;display:flex;justify-content:space-between;align-items:center">
            <strong style="font-size:15px">Добавить на сегодня</strong>
            <button onclick="closeAdHocPicker()" style="background:transparent;border:none;color:#888;font-size:22px;cursor:pointer;line-height:1">×</button>
          </div>
          <div style="padding:0 16px 8px">
            <input type="text" id="adhoc-search" class="form-input" placeholder="Поиск упражнения..." oninput="renderAdHocList()" style="margin-bottom:8px">
          </div>
          <div id="adhoc-list" style="flex:1;overflow-y:auto;padding:0 16px 16px"></div>
        </div>
      </div>
    `);
    modal = document.getElementById('adhoc-modal');
  }
  modal.style.display = 'flex';
  document.getElementById('adhoc-search').value = '';
  renderAdHocList();
}

function closeAdHocPicker() {
  const modal = document.getElementById('adhoc-modal');
  if (modal) modal.style.display = 'none';
}

function renderAdHocList() {
  const q = document.getElementById('adhoc-search').value.toLowerCase().trim();
  const list = document.getElementById('adhoc-list');
  const dateStr = fmt(currentDate);
  const dayLog = store.logs[dateStr] || {};

  const matches = sortedExerciseEntries().filter(([id, ex]) => {
  const alreadyAdHoc = Object.entries(dayLog).some(([k, v]) =>
    !k.startsWith('_') && v && v.adHoc && logBaseId(k) === id
  );
  if (alreadyAdHoc) return false;
  if (!q) return true;
  if (ex.name.toLowerCase().includes(q)) return true;
  const markers = getExerciseMarkers(id);
  if (markers.some(m => m.toLowerCase().includes(q))) return true;
  const msum = muscleSummary(ex.muscles) || '';
  if (msum.toLowerCase().includes(q)) return true;
  return false;
});

  if (!matches.length) {
    list.innerHTML = '<div style="padding:14px;color:#666;text-align:center">Ничего не найдено</div>';
    return;
  }

  list.innerHTML = matches.map(([id, ex]) => {
    const msum = muscleSummary(ex.muscles);
    return `<div onclick="addAdHocExercise('${id}')" style="padding:10px 12px;background:#141414;border:1px solid #262626;border-radius:6px;margin-bottom:6px;cursor:pointer;font-size:13.5px;color:#ddd">
      <div>${escapeHtml(ex.name)}</div>
      ${msum ? `<div style="font-size:11px;color:#666;margin-top:3px">${escapeHtml(msum)}</div>` : ''}
    </div>`;
  }).join('');
}

function addAdHocExercise(id) {
  const dateStr = fmt(currentDate);
  const logs = store.logs;
  logs[dateStr] = logs[dateStr] || {};
  let n = 1, key;
  do { key = id + '*' + n; n++; } while (logs[dateStr][key]);
  logs[dateStr][key] = { adHoc: true };
  store.logs = logs;
  closeAdHocPicker();
  render();
}

function removeAdHocExercise(logKey) {
  const exName = EX[logBaseId(logKey)]?.name || logKey;
  if (!confirm(`Убрать «${exName}» из сегодняшней тренировки?`)) return;
  const dateStr = fmt(currentDate);
  const logs = store.logs;
  if (logs[dateStr] && logs[dateStr][logKey]) {
    delete logs[dateStr][logKey];
    if (!Object.keys(logs[dateStr]).length) delete logs[dateStr];
    store.logs = logs;
  }
  render();
}

function renderAdHocExercise(logKey, log) {
  return `<div style="position:relative; border:1px dashed #4a7a4a; border-radius:8px; padding:2px; margin-bottom:8px; background:#1a2a1a">
    <div style="position:absolute;top:6px;right:6px;z-index:10">
      <button class="del-btn" style="font-size:16px;padding:4px" onclick="removeAdHocExercise('${logKey}')" title="Убрать из сегодняшней тренировки">✕</button>
    </div>
    <div style="padding:6px 6px 0 6px">
      ${renderExercise(logKey, log)}
    </div>
  </div>`;
}
function renderToday(){
  const dow=currentDate.getDay();
  const plan=getPlan(currentDate);
  const dayLog=store.logs[fmt(currentDate)]||{};
  const skipped=!!dayLog._skip;
  const isToday=fmt(currentDate)===fmt(todayDate());
  let html=renderTabs();
  html+=`<div class="header">
    <button onclick="shiftDay(-1)">←</button>
    <span>${DAYS[dow]}, ${fmt(currentDate)}</span>
    <button onclick="shiftDay(1)">→</button>
  </div>`;
  if(plan.info.length)html+=`<div class="info">${plan.info.join(' · ')}</div>`;
  const dayMetaHtml=renderDayMetaHtml(dayLog,isToday);
  html+=`<div id="day-meta" class="meta-row" style="display:${dayMetaHtml?'flex':'none'}">${dayMetaHtml}</div>`;
  
  if(skipped){
    html+=`<div class="skip-banner">
      <span>🚫 Пропуск: ${escapeHtml(dayLog._skip.reason||'без причины')}</span>
      <button class="mini-btn" onclick="unskipDay()">Отменить</button>
    </div>`;
  }else{
    html+=`<div class="skip-row"><button class="mini-btn" onclick="showSkipUI()">Пропустить день</button></div>`;
    html+=`<div id="skipForm" style="display:none" class="ex">
      <strong style="font-size:13px">Причина:</strong>
      <div class="skip-reasons">
        <button onclick="quickSkip('болезнь')">болезнь</button>
        <button onclick="quickSkip('нет времени')">нет времени</button>
        <button onclick="quickSkip('отдых')">отдых</button>
        <button onclick="quickSkip('травма')">травма</button>
        <button onclick="customSkip()">другое…</button>
      </div>
    </div>`;
  }
  
  if(!skipped){
        if(plan.groups && plan.groups.length){
      // Завершённые блоки И выполненные упражнения — в конец (относительно родителя)
      const isGroupDone = (g) => {
        if (g.type === 'block' && g.tree) {
          const node = g.tree;
          if (node.exCount === 0) return false;
          return node.flatExercises.every(id => dayLog[id] && dayLog[id].done && !dayLog[id]._skipped);
        }
        if (g.type === 'exercise' || g.type === 'adhoc') {
          const lg = dayLog[g.logKey];
          return !!(lg && lg.done && !lg._skipped);
        }
        return false;
      };
      const normalGroups = [];
      const doneGroups = [];
      plan.groups.forEach(g => {
        if (isGroupDone(g)) doneGroups.push(g);
        else normalGroups.push(g);
      });
      normalGroups.push(...doneGroups);

      html+=`<h2>Основные</h2>`;
      normalGroups.forEach(g => {
        if(g.type === 'exercise'){
          html += renderExercise(g.logKey, dayLog[g.logKey]);
        } else if(g.type === 'block'){
          if (g.skipped) {
            const safeName = escapeHtml(g.name).replace(/'/g, "\\'");
            html += `<div class="block-header" style="opacity:0.6;background:#2a1a1a;border-color:#4a2020;margin-bottom:6px;display:flex;align-items:center;gap:6px">
              <span class="blk-icon">📦</span>
              <span style="flex:1">${escapeHtml(g.name)}</span>
              <span style="color:#c66;font-size:11px">⊘ ${escapeHtml(g.skipped.reason)}</span>
              <button class="mini-btn" style="padding:3px 8px;font-size:11px" onclick="skipBlockToday('${g.blockId}', '${safeName}')" title="Изменить причину">✎</button>
              <button class="mini-btn" style="padding:3px 8px;font-size:11px" onclick="unskipBlockToday('${g.blockId}')">Вернуть</button>
            </div>`;
          } else if (g.disabled) {
            html += `<div class="block-header" style="opacity:0.6;background:#2a1a1a;border-color:#4a2020;margin-bottom:6px;display:flex;align-items:center;gap:6px">
              <span class="blk-icon">📦</span>
              <span style="flex:1">${escapeHtml(g.name)}</span>
              <span style="color:#c66;font-size:11px">🚫 ${escapeHtml(g.disabled.reason || 'отменено')}${g.disabled.until ? ` (до ${g.disabled.until})` : ''}</span>
            </div>`;
          } else if (g.duplicateOnly) {
  html += `<div class="block-header" style="opacity:0.6;background:#1a1a1a;border-color:#333;margin-bottom:6px;display:flex;align-items:center;gap:6px">
    <span class="blk-icon">📦</span>
    <span style="flex:1">${escapeHtml(g.name)}</span>
    <span style="color:#888;font-size:11px">↗ упражнения показаны отдельно</span>
  </div>`;
} else {
            html += renderBlockGroup(g.tree, dayLog);
          }
        } else if(g.type === 'adhoc'){
          html += renderAdHocExercise(g.logKey, dayLog[g.logKey]);
        }
      });
    } else if(plan.main.length) {
      plan.main.forEach(k => html += renderExercise(k, dayLog[k]));
    }

    if(plan.cancelled && plan.cancelled.length){
      html+=`<h2>Отменено</h2>`;
      plan.cancelled.forEach(c=>{
        const ex=EX[logBaseId(c.id)];
        if(!ex) return;
        const reasonText = c.blockName ? `${c.reason} (${c.blockName})` : (c.reason||'без причины');
        const actions = c.type === 'skipped' ? `
          <button class="mini-btn" style="padding:2px 8px;font-size:11px" onclick="skipExerciseToday('${c.id}')" title="Изменить причину">✎</button>
          <button class="mini-btn" style="padding:2px 8px;font-size:11px;background:#2a5a2a;border-color:#3a7a3a;color:#9f9" onclick="unskipExerciseToday('${c.id}')" title="Вернуть">↺</button>
        ` : '';
        html+=`<div class="ex ex-cancelled">
          <div class="ex-head">
            <span style="color:#c66;font-size:14px;line-height:1">⊘</span>
            <strong style="text-decoration:line-through;color:#999">${escapeHtml(ex.name)}</strong>
            <span class="meta" style="color:#c66;margin-left:auto">отменено</span>
            ${actions}
          </div>
          <div class="ex-last" style="color:#aa8;margin-bottom:0">Причина: ${escapeHtml(reasonText)}${c.type === 'disabled' ? ' · <span style="color:#888">(долгосрочно, правка в «Свои»)</span>' : ''}</div>
        </div>`;
      });
    }
    
    if(!plan.groups.length && !plan.cancelled.length){
      html+=`<div class="ex" style="color:#777">
        На этот день упражнений нет.
        <button class="mini-btn" style="margin-top:8px" onclick="setView('custom')">Настроить план</button>
      </div>`;
    }
  }
  
  html+=`<h2>Дополнительно</h2>`;
  html+=`<button class="add-btn" onclick="openAdHocPicker()">+ Добавить упражнение на сегодня</button>`;
  html+=`<h2>Заметка</h2>
  <textarea class="form-input" rows="2" placeholder="Как прошло, самочувствие…" oninput="setDayNote(this.value)">${escapeHtml(dayLog._note||'')}</textarea>`;
  document.getElementById('app').innerHTML=html;
}

/* ---------- History view ---------- */
function getHistoryStartDate(){
  const logs=store.logs;
  const dates=Object.keys(logs).filter(d=>{
    const day=logs[d];
    if(!day||!Object.keys(day).length)return false;
    if(day._skip)return true;
    return Object.entries(day).some(([k,v])=>!k.startsWith('_')&&v&&v.done);
  }).sort();
  return dates[0]||null;
}
function getDayStatus(dateStr){
  const date = new Date(dateStr+'T00:00:00');
  const today = todayDate();
  const todayStr = fmt(today);
  const isFuture = date > today;
  const isToday = dateStr === todayStr;
  if(isFuture) return {state:'future',isToday:false,isFuture:true,date};
  const start = getHistoryStartDate();
  if(!isToday && (!start || dateStr < start)){
    return {state:'before',isToday:false,isFuture:false,date};
  }
  const dayLog = store.logs[dateStr] || {};
  if(dayLog._skip) return {state:'skip',reason:dayLog._skip.reason||'',isToday,isFuture:false,dayLog,date};
  const plan = getPlan(date);
  const expected = [...plan.main, ...plan.after].filter(k=>EX[logBaseId(k)]);
  const cancelled = plan.cancelled || [];
  const doneSet = new Set();
Object.entries(dayLog).forEach(([id,e])=>{
  if(id.startsWith('_')) return;
  if(e && e.done && EX[logBaseId(id)]) doneSet.add(id);
});
  const doneInPlan = expected.filter(id => doneSet.has(id));
  const missed = expected.filter(id => !doneSet.has(id));
  const cancelledIds = new Set(cancelled.map(c => c.id));
  const offPlan = [...doneSet].filter(id => !expected.includes(id) && !cancelledIds.has(id));

  let state;
  if(expected.length === 0){
    if(offPlan.length > 0) state = 'offplan';
    else if(cancelled.length > 0) state = 'cancelled';
    else state = 'empty';
  }
  else if(doneInPlan.length === expected.length){state='done';}
  else if(doneInPlan.length > 0){state='part';}
  else{state = isToday ? 'today-none' : 'full-miss';}
  if(isToday && state === 'part') state = 'today-part';

  return {state, isToday, isFuture:false, dayLog, date, plan, expected, cancelled, doneInPlan, missed, offPlan};
}
function renderDayCard(dateStr){
  const status=getDayStatus(dateStr);
  const d=new Date(dateStr+'T00:00:00');
  const header=`<div class="day-card-header">
    <span>${DAYS[d.getDay()]}, ${dateStr}</span>
    ${status.state==='future'||status.state==='before'
      ?''
      :`<button class="mini-btn" onclick="editDay('${dateStr}')">✎ Редактировать</button>`}
  </div>`;
  if(status.state==='before')
    return `<div class="day-card">${header}<div class="ex" style="color:#666">До начала ведения истории</div></div>`;
  if(status.state==='future'){
    const plan=getPlan(d);
        const expected=[...plan.main,...plan.after].filter(k=>EX[logBaseId(k)]);
    return `<div class="day-card">${header}
      <div class="ex" style="color:#888">Будущий день · запланировано ${expected.length} упр.</div>
    </div>`;
  }
  const dayLog=status.dayLog||{};
  let body='';
  if(status.state==='skip'){
    body+=`<div class="skip-banner">
      <span>🚫 Пропуск: ${escapeHtml(status.reason||'без причины')}</span>
      <button class="mini-btn" onclick="unskipHistoryDay('${dateStr}')">Отменить</button>
    </div>`;
    return `<div class="day-card">${header}${body}</div>`;
  }
  body+=renderDayTonnageHtml(dateStr,dayLog);
  if(dayLog._note){
    body+=`<div class="ex" style="color:#aaa;font-size:13px;white-space:pre-wrap">📝 ${escapeHtml(dayLog._note)}</div>`;
  }
  const plan=status.plan||getPlan(d);
  if(plan.info&&plan.info.length){ body+=`<div class="info">${plan.info.join(' · ')}</div>`; }
  const expected=status.expected||[];
  const missed=status.missed||[];
  const doneInPlan=status.doneInPlan||[];
  const offPlan=status.offPlan||[];
  if(expected.length===0&&offPlan.length===0&&!dayLog._note){
    body+=`<div class="ex" style="color:#666">Нет запланированных упражнений и активности</div>`;
  }
  if(doneInPlan.length){
    body+=`<h2>Сделано (${doneInPlan.length}/${expected.length})</h2>`;
    doneInPlan.forEach(id=>{
      const ex=EX[logBaseId(id)]
      const val=ex.app?'✓':formatSets(dayLog[id]);
      const badges=getExerciseBadges(id,dayLog[id],dateStr);
      body+=`<div class="ex">
        <div class="hist-row">
          <strong style="color:#9f9;cursor:pointer" onclick="openExerciseStats('${id}')">✓ ${escapeHtml(ex.name)}</strong>
          <span class="ex-last" style="margin-left:auto">${val}</span>
          <button class="del-btn" title="Удалить запись" onclick="deleteHistoryEntry('${id}','${dateStr}')">✕</button>
        </div>
        ${badges?`<div class="pr-row" style="margin-top:4px;margin-bottom:0">${badges}</div>`:''}
      </div>`;
    });
  }
  const cancelled = status.cancelled || [];
  if(cancelled.length){
    body+=`<h2>Отменено (${cancelled.length})</h2>`;
    cancelled.forEach(c=>{
      const ex = EX[c.id];
      if(!ex) return;
      const reasonText = c.blockName ? `${c.reason} (${c.blockName})` : (c.reason||'без причины');
      body+=`<div class="ex ex-cancelled">
        <div class="ex-head">
          <span style="color:#c66;font-size:14px;line-height:1">⊘</span>
          <strong style="text-decoration:line-through;color:#999">${escapeHtml(ex.name)}</strong>
          <span class="meta" style="color:#c66">отменено</span>
        </div>
        <div class="ex-last" style="color:#aa8;margin-bottom:0">Причина: ${escapeHtml(reasonText)}</div>
      </div>`;
    });
  }
  if(missed.length){
    const isT=status.isToday;
    body+=`<h2>${isT?'Не сделано (пока)':'Пропущено'} (${missed.length})</h2>`;
    missed.forEach(id=>{
      const ex=EX[logBaseId(id)]
      body+=`<div class="ex" style="color:${isT?'#888':'#c66'}"><strong>${isT?'○':'✗'} ${escapeHtml(ex.name)}</strong></div>`;
    });
  }
  if(offPlan.length){
    body+=`<h2>Вне плана (${offPlan.length})</h2>`;
    offPlan.forEach(id=>{
      const ex=EX[logBaseId(id)]
      const val=ex.app?'✓':formatSets(dayLog[id]);
      const badges=getExerciseBadges(id,dayLog[id],dateStr);
      body+=`<div class="ex">
        <div class="hist-row">
          <strong>+ ${escapeHtml(ex.name)}</strong>
          <span class="ex-last" style="margin-left:auto">${val}</span>
          <button class="del-btn" title="Удалить запись" onclick="deleteHistoryEntry('${id}','${dateStr}')">✕</button>
        </div>
        ${badges?`<div class="pr-row" style="margin-top:4px;margin-bottom:0">${badges}</div>`:''}
      </div>`;
    });
  }
  return `<div class="day-card">${header}${body}</div>`;
}
function renderHistory(){
  const y=calendarMonth.getFullYear();
  const m=calendarMonth.getMonth();
  let html=renderTabs();
  html+=`<div class="header">
    <span>История</span>
    <button class="mini-btn" onclick="goHistoryToday()">Сегодня</button>
    <span><i class="lg-dot" style="background:#4a3a1a"></i>🔩 рекорд веса</span>
    <span><i class="lg-dot" style="background:#1a3a4a"></i>💪 рекорд повторов</span>
  </div>`;
  html+=`<div class="cal-nav">
    <button onclick="shiftMonth(-1)">‹</button>
    <span>${MONTH_NAMES[m]} ${y}</span>
    <button onclick="shiftMonth(1)">›</button>
  </div>`;
  html+=`<div class="cal-grid">`;
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(d=>{html+=`<div class="cal-dow">${d}</div>`});
  const first=new Date(y,m,1);
  const offset=(first.getDay()+6)%7;
  for(let i=0;i<offset;i++)html+=`<div class="cal-day empty-cell"></div>`;
  const dim=new Date(y,m+1,0).getDate();
  const selStr=fmt(selectedDate);
for(let day=1;day<=dim;day++){
  const dateStr=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const status=getDayStatus(dateStr);
  const classes=['cal-day','state-'+status.state];
  if(status.isToday)classes.push('today');
  if(dateStr===selStr)classes.push('selected');
  const clickable=status.isToday||(status.state!=='future'&&status.state!=='before');
  if(clickable)classes.push('clickable');
  const onclick=clickable?`onclick="selectDate('${dateStr}')"`:'';
  const isSkip=status.state==='skip';
  const num=isSkip?'🚫':day;

  let tonHtml='';
  if(!isSkip && status.state!=='future' && status.state!=='before'){
    const tonPR=checkTonnagePR(dateStr);
    if(tonPR){
      const title=tonPR.prev>0?`Рекорд тоннажа: ${tonPR.tonnage} кг (прошлый: ${tonPR.prev} кг)`:`Первый рекорд тоннажа: ${tonPR.tonnage} кг`;
      tonHtml=`<span class="cal-tonnage-pr" title="${title}">🏆</span>`;
    }
  }

  let cancelMark='';
  if(status.cancelled && status.cancelled.length){
    cancelMark=`<span class="cal-cancelled-mark" title="${status.cancelled.length} отменено">⊘</span>`;
  }

  let prsHtml='';
  if(!isSkip && (status.state==='done'||status.state==='part'||status.state==='offplan'||status.state==='today-part'||status.state==='today-none'||status.state==='full-miss')){
    const prs=getDayPRCounts(dateStr);
    const steadyCount=getDaySteadyCount(dateStr);
    if(prs.weight||prs.reps||steadyCount){
      prsHtml='<div class="cal-day-prs">';
      if(prs.weight)prsHtml+=`<span class="cal-pr-weight" title="Рекорды по весу">🔩${prs.weight>1?prs.weight:''}</span>`;
      if(prs.reps)prsHtml+=`<span class="cal-pr-reps" title="Рекорды по повторениям">💪${prs.reps>1?prs.reps:''}</span>`;
      if(steadyCount)prsHtml+=`<span class="cal-pr-steady" title="Достигнут максимум на максимальном весе">🎯${steadyCount>1?steadyCount:''}</span>`;
      prsHtml+='</div>';
    }
  }
  html+=`<div class="${classes.join(' ')}" ${onclick}>${tonHtml}<span class="cal-day-num">${num}</span>${prsHtml}${cancelMark}</div>`;
}
  html+=`</div>`;
  html+=`<div class="legend">
    <span><i class="lg-dot" style="background:#1e4d1e"></i>сделано</span>
    <span><i class="lg-dot" style="background:#4a2020"></i>частично</span>
    <span><i class="lg-dot" style="background:#8a1a1a"></i>пропуск</span>
    <span><i class="lg-dot" style="background:#333"></i>отдых</span>
    <span><i class="lg-dot" style="background:#1a1a1a;border:1px solid #333"></i>пусто</span>
    <span><i class="lg-dot" style="background:transparent;border:1px solid #e8c44d"></i>сегодня</span>
  </div>`;
  html+=renderDayCard(selStr);
  document.getElementById('app').innerHTML=html;
}
function selectDate(dateStr){ selectedDate=new Date(dateStr+'T00:00:00'); render(); }
function shiftMonth(delta){ calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+delta,1); render(); }
function goHistoryToday(){ selectedDate=todayDate(); calendarMonth=new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1); render(); }
function editDay(dateStr){ currentDate=new Date(dateStr+'T00:00:00'); currentDate.setHours(0,0,0,0); view='today'; render(); }
function unskipHistoryDay(dateStr){
  if(!confirm('Отменить пропуск этого дня?'))return;
  const logs=store.logs;
  if(logs[dateStr]&&logs[dateStr]._skip){
    delete logs[dateStr]._skip;
    if(!Object.keys(logs[dateStr]).length)delete logs[dateStr];
    store.logs=logs;
  }
  render();
}

/* ---------- Search view ---------- */
function exerciseMatchesQuery(id, ex, q){
  if(!q) return true;
  const ql = q.toLowerCase();
  if(ex.name.toLowerCase().includes(ql)) return true;
  const markers = getExerciseMarkers(id);
  if(markers.some(m => m.toLowerCase().includes(ql))) return true;
  const msum = muscleSummary(ex.muscles) || '';
  if(msum.toLowerCase().includes(ql)) return true;
  return false;
}
function renderSearch(){
  let html=renderTabs();
  html+=`<div class="header"><span>Поиск упражнения</span></div>`;
  html+=`<input type="text" id="searchInput" class="form-input" placeholder="Название, метка или мышца…" value="${escapeHtml(searchQuery)}" oninput="setSearchQuery(this.value)">`;
  html+=`<div id="searchResults"></div>`;
  document.getElementById('app').innerHTML=html;
  renderSearchResults();
}
function renderSearchResults(){
  const el=document.getElementById('searchResults');
  if(!el)return;
  const q=searchQuery.toLowerCase().trim();
  if(!q){ el.innerHTML=`<div class="ex" style="color:#777">Введите название упражнения, метку или мышцу</div>`; return; }
  const matches=sortedExerciseEntries().filter(([id,ex]) => exerciseMatchesQuery(id, ex, q));
  if(!matches.length){ el.innerHTML=`<div class="ex" style="color:#777">Ничего не найдено</div>`; return; }

  // id всех активных (не удалённых) своих упражнений
  const customIds = new Set(customStore.list.filter(c => !c.deleted).map(c => c.id));

  let html='';
  matches.forEach(([id,ex])=>{
    const logs=store.logs;
    const entries=[];
        Object.keys(logs).sort().reverse().forEach(d=>{
      const day = logs[d];
      if(!day) return;
      Object.entries(day).forEach(([k,e]) => {
        if(k.startsWith('_') || !e || !e.done) return;
        if(logBaseId(k) !== id) return;
        entries.push({date:d, ...e});
      });
    });
    const isCustom = customIds.has(id);
    html+=`<div class="ex ex-link" onclick="openExerciseStats('${id}')">`;
    html+=`<div class="hist-row" style="margin-bottom:2px">
      <strong style="flex:1">${escapeHtml(ex.name)}</strong>
      ${isCustom ? `<button class="del-btn" title="Удалить упражнение" onclick="event.stopPropagation();deleteCustom('${id}')">✕</button>` : ''}
    </div>`;
    html+=`<div onclick="event.stopPropagation()">${renderMarkerCells(id, {q: q, marginTop: false})}</div>`;
    const msum = muscleSummary(ex.muscles);
    if(msum){ html+=`<div class="ex-last" style="color:#666">${escapeHtml(msum)}</div>`; }
    if(!entries.length){
      html+=`<div class="ex-last">нет записей</div>`;
    }else{
      html+=`<div class="ex-last" style="color:#aaa">Записей: ${entries.length} · последняя: ${entries[0].date}</div>`;
      entries.slice(0,20).forEach(e=>{
        const val=ex.app?'✓':formatSets(e);
        const badges=getExerciseBadges(id,e,e.date);
          html+=`<div class="hist-row">
          <span class="ex-last">${e.date}: ${val}</span>
          ${badges?`<span>${badges}</span>`:''}
        </div>`;
      });
      if(entries.length>20)html+=`<div class="ex-last" style="color:#666">… и ещё ${entries.length-20}</div>`;
    }
    html+=`</div>`;
  });
  el.innerHTML=html;
}
function setSearchQuery(v){ searchQuery=v; renderSearchResults(); }

/* ---------- Custom view ---------- */
let editingCustomId=null;

function updateCustomForm(){
  const typeEl=document.querySelector('input[name="cType"]:checked');
  const setsBlock=document.getElementById('cSetsBlock');
  if(typeEl&&setsBlock)setsBlock.style.display=typeEl.value==='app'?'none':'block';
  const schedEl=document.querySelector('input[name="cSched"]:checked');
  const daysBlock=document.getElementById('cDaysBlock');
  const intervalBlock=document.getElementById('cIntervalBlock');
  if(schedEl){
    if(daysBlock)daysBlock.style.display=schedEl.value==='days'?'block':'none';
    if(intervalBlock)intervalBlock.style.display=schedEl.value==='interval'?'block':'none';
  }
}
function editCustom(id){editingCustomId=id;render()}
function cancelEditCustom(){editingCustomId=null;render()}
function renderCustomEditForm(c){
  const startDate=c.schedule?.startDate||fmt(todayDate());
  const schedType=c.schedule?.type||'none';
  const days=c.schedule?.days||[];
  const interval=c.schedule?.interval||3;
  const toggle=`var d=document.getElementById('editDaysBlock'),i=document.getElementById('editIntervalBlock');`;
  return `<div class="ex" style="border-color:#3a5a3a;background:#152515">
    <div style="font-size:13px;color:#9f9;margin-bottom:8px;font-weight:600">Редактирование</div>
    <input type="text" id="editName" class="form-input" value="${escapeHtml(c.name)}" placeholder="Название">
    <div class="form-row">
      <label><input type="radio" name="editType" value="sets" ${c.app?'':'checked'} onchange="document.getElementById('editSetsBlock').style.display='block'"> Подходы</label>
      <label><input type="radio" name="editType" value="app" ${c.app?'checked':''} onchange="document.getElementById('editSetsBlock').style.display='none'"> По приложению</label>
    </div>
    <div id="editSetsBlock" style="display:${c.app?'none':'block'}">
  <input type="number" id="editSets" class="form-input" value="${c.sets||4}" min="1" placeholder="Подходы">
  <input type="text" id="editReps" class="form-input" value="${escapeHtml(c.reps||'12-15')}" placeholder="Повторения">
  <div style="font-size:12px;color:#888;margin:8px 0 4px">Как вы вводите вес?</div>
<div class="form-row" style="flex-direction:column;gap:6px;align-items:flex-start">
  <label><input type="radio" name="editWeightMode" value="total" ${(c.weightMode||'total')==='total'?'checked':''}> Общий вес снаряда</label>
  <label><input type="radio" name="editWeightMode" value="both" ${c.weightMode==='both'?'checked':''}> Общий вес на обе стороны</label>
  <label><input type="radio" name="editWeightMode" value="one" ${c.weightMode==='one'?'checked':''}> На одну сторону</label>
  <label><input type="radio" name="editWeightMode" value="bodyweight" ${c.weightMode==='bodyweight'?'checked':''}> Свой вес</label>
</div>
</div>
    <div style="font-size:12px;color:#888;margin:8px 0 4px">Мышцы:</div>
    ${renderMusclePicker(c.muscles||[],'editMuscle')}
    <div style="font-size:13px;color:#ccc;margin:10px 0 6px">Расписание:</div>
    <div class="form-row">
      <label><input type="radio" name="editSched" value="none" ${schedType==='none'?'checked':''} onchange="${toggle}d.style.display='none';i.style.display='none'"> Без</label>
      <label><input type="radio" name="editSched" value="days" ${schedType==='days'?'checked':''} onchange="${toggle}d.style.display='block';i.style.display='none'"> Дни</label>
      <label><input type="radio" name="editSched" value="interval" ${schedType==='interval'?'checked':''} onchange="${toggle}d.style.display='none';i.style.display='block'"> Раз в N</label>
      <label><input type="radio" name="editSched" value="even" ${schedType==='even'?'checked':''} onchange="${toggle}d.style.display='none';i.style.display='none'"> Чётные</label>
      <label><input type="radio" name="editSched" value="odd" ${schedType==='odd'?'checked':''} onchange="${toggle}d.style.display='none';i.style.display='none'"> Нечётные</label>
      <label><input type="radio" name="editSched" value="everyday" ${schedType==='everyday'?'checked':''} onchange="${toggle}d.style.display='none';i.style.display='none'"> Каждый</label>
    </div>
    <div id="editDaysBlock" style="display:${schedType==='days'?'block':'none'}">${WEEK_ORDER.map(d=>`<label class="day-chk"><input type="checkbox" class="edit-day" value="${d}" ${days.includes(d)?'checked':''}> ${DAYS[d]}</label>`).join('')}</div>
    <div id="editIntervalBlock" style="display:${schedType==='interval'?'block':'none'}">
      <input type="number" id="editInterval" class="form-input" value="${interval}" min="1" placeholder="Раз в N дней">
    </div>
    <div style="font-size:12px;color:#888;margin:6px 0 4px">Начиная с:</div>
    <input type="date" id="editStart" class="form-input" value="${startDate}">
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="mini-btn" style="flex:1" onclick="cancelEditCustom()">Отмена</button>
      <button class="mini-btn" style="flex:2;background:#2a5a2a;border-color:#3a7a3a" onclick="saveEditCustom('${c.id}')">Сохранить</button>
    </div>
  </div>`;
}
function saveEditCustom(id){
  const c=customStore.list.find(x=>x.id===id);
  if(!c)return;
  const name=document.getElementById('editName').value.trim();
  if(!name){alert('Введите название');return}
  const app=document.querySelector('input[name="editType"]:checked').value==='app';
  const sets=parseInt(document.getElementById('editSets').value)||4;
  const reps=document.getElementById('editReps').value.trim()||'12-15';
  const loads=getMuscleLoads('editMuscle');
  const muscles=computePercents(loads);
  const schedType=document.querySelector('input[name="editSched"]:checked').value;
  const startDate=document.getElementById('editStart').value||fmt(todayDate());
  let schedule={type:'none'};
  if(schedType==='days'){
    const days=[...document.querySelectorAll('.edit-day:checked')].map(el=>parseInt(el.value));
    if(!days.length){alert('Выберите хотя бы один день');return}
    schedule={type:'days',days,startDate};
  }else if(schedType==='interval'){
    schedule={type:'interval',interval:parseInt(document.getElementById('editInterval').value)||3,startDate};
  }else if(schedType==='even'||schedType==='odd'||schedType==='everyday'){
    schedule={type:schedType,startDate};
  }
  const wModeEl = document.querySelector('input[name="editWeightMode"]:checked');
const weightMode = wModeEl ? wModeEl.value : 'total';
customStore.list=customStore.list.map(x=>x.id===id?{...x,name,app,sets,reps,muscles,loads,schedule,weightMode}:x);
  syncCustomEx();
  editingCustomId=null;
  render();
}
function deleteCustom(id){
  const name = EX[id]?.name || id;

  const usages = [];
  const own = ownPlanStore.get();
  if(own && own.enabled){
    if((own.items || []).some(it => it.id === id)) usages.push('в плане');
    let inBlock = false;
    (own.blocks || []).forEach(b => {
      if((b.children || []).some(c => c.type === 'exercise' && c.id === id)) inBlock = true;
    });
    if(inBlock) usages.push('в блоке плана');
  }
  let historyCount = 0;
  const logs0 = store.logs;
  Object.keys(logs0).forEach(d => {
    if(logs0[d] && logs0[d][id] && !logs0[d][id]._skip) historyCount++;
  });
  if(historyCount > 0) usages.push(`в истории (${historyCount} зап.)`);

  const usageWarning = usages.length
    ? `\n\n⚠️ Используется: ${usages.join(', ')}.`
    : '';

  if(!confirm(`Удалить «${name}»?${usageWarning}\n\nМетки упражнения тоже будут удалены.`)) return;

  let wipeHistory = false;
  if(historyCount > 0){
    wipeHistory = confirm(
      `Удалить также ${historyCount} записей истории по «${name}»?\n\n` +
      `ОК — записи удалятся безвозвратно (тоннаж дней и статистика пересчитаются без них).\n` +
      `Отмена — записи останутся в localStorage и в бэкапах, но в интерфейсе будут скрыты.`
    );
  }

  customStore.list = customStore.list.map(c => c.id === id ? {...c, deleted: true} : c);
  setExerciseMarkers(id, []);
  delete EX[id];

  if(wipeHistory){
    const logs = store.logs;
    Object.keys(logs).forEach(d => {
      const day = logs[d];
      if(!day) return;
      Object.keys(day).forEach(k => {
        if(!k.startsWith('_') && logBaseId(k) === id) delete day[k];
      });
      if(!Object.keys(day).length) delete logs[d];
    });
    store.logs = logs;
  }

  // Почистить план от «мёртвых» ссылок (не обязательно, но убирает мусор из бэкапа)
  const own2 = ownPlanStore.get();
  if(own2){
    if(Array.isArray(own2.items)) own2.items = own2.items.filter(it => it.id !== id);
    (own2.blocks || []).forEach(b => {
      b.children = (b.children || []).filter(c => !(c.type === 'exercise' && c.id === id));
    });
    ownPlanStore.set(own2);
  }

  render();
}

/* ---------- Common ---------- */
function deleteHistoryEntry(exId,date){
  const name=EX[exId]?.name||exId;
  if(!confirm(`Удалить запись «${name}» за ${date}?`))return;
  const logs=store.logs;
  if(logs[date]&&logs[date][exId]){
    delete logs[date][exId];
    const rest=Object.keys(logs[date]).filter(k=>!k.startsWith('_'));
    if(!rest.length&&!logs[date]._skip&&!logs[date]._note)delete logs[date];
    store.logs=logs;
  }
  render();
}
function showSkipUI(){
  const el=document.getElementById('skipForm');
  if(!el)return;
  el.style.display=el.style.display==='none'?'block':'none';
}
function quickSkip(reason){
  const d=fmt(currentDate),logs=store.logs;
  logs[d]=logs[d]||{};
  logs[d]._skip={reason};
  store.logs=logs;
  render();
}
function customSkip(){
  const reason=prompt('Причина пропуска:','');
  if(reason===null)return;
  quickSkip(reason.trim()||'без причины');
}
function unskipDay(){
  const d=fmt(currentDate),logs=store.logs;
  if(logs[d]&&logs[d]._skip){
    delete logs[d]._skip;
    const rest=Object.keys(logs[d]);
    if(!rest.length)delete logs[d];
    store.logs=logs;
  }
  render();
}
function skipExerciseToday(logKey) {
  const exId = logBaseId(logKey);
  const name = EX[exId]?.name || logKey;
  const d = fmt(currentDate), logs = store.logs;
  const existing = logs[d]?.[logKey]?._skipped;
  const isEdit = !!existing;
  const reason = prompt(
    isEdit ? `Изменить причину пропуска «${name}»:` : `Пропустить «${name}» на сегодня?\nПричина:`,
    existing ? existing.reason : ''
  );
  if (reason === null) return;
  logs[d] = logs[d] || {};
  logs[d][logKey] = logs[d][logKey] || {};
  logs[d][logKey]._skipped = { reason: reason.trim() || 'без причины' };
  if (logs[d][logKey].done) delete logs[d][logKey].done;
  store.logs = logs;
  render();
}

function unskipExerciseToday(logKey) {
  const d = fmt(currentDate), logs = store.logs;
  if (logs[d] && logs[d][logKey] && logs[d][logKey]._skipped) {
    delete logs[d][logKey]._skipped;
    if (!Object.keys(logs[d][logKey]).length) delete logs[d][logKey];
    if (!Object.keys(logs[d]).length) delete logs[d];
    store.logs = logs;
  }
  render();
}

function skipBlockToday(blockId, blockName) {
  const d = fmt(currentDate), logs = store.logs;
  const existing = logs[d]?._skippedBlocks?.[blockId];
  const isEdit = !!existing;
  const reason = prompt(
    isEdit ? `Изменить причину пропуска блока «${blockName}»:` : `Пропустить блок «${blockName}» на сегодня?\nПричина:`,
    existing ? existing.reason : ''
  );
  if (reason === null) return;
  logs[d] = logs[d] || {};
  logs[d]._skippedBlocks = logs[d]._skippedBlocks || {};
  logs[d]._skippedBlocks[blockId] = { reason: reason.trim() || 'без причины' };
  store.logs = logs;
  render();
}

function unskipBlockToday(blockId) {
  const d = fmt(currentDate), logs = store.logs;
  if (logs[d] && logs[d]._skippedBlocks && logs[d]._skippedBlocks[blockId]) {
    delete logs[d]._skippedBlocks[blockId];
    if (!Object.keys(logs[d]._skippedBlocks).length) delete logs[d]._skippedBlocks;
    if (!Object.keys(logs[d]).length) delete logs[d];
    store.logs = logs;
  }
  render();
}
function goToday(){currentDate=todayDate();render()}
function setDayNote(value){
  const d=fmt(currentDate),logs=store.logs;
  logs[d]=logs[d]||{};
  if(value)logs[d]._note=value;
  else delete logs[d]._note;
  if(!Object.keys(logs[d]).length)delete logs[d];
  store.logs=logs;
}

/* ---------- Stats ---------- */
function weekStart(d){
  const x=new Date(d); x.setHours(0,0,0,0);
  const dow=(x.getDay()+6)%7;
  x.setDate(x.getDate()-dow);
  return x;
}
function getWeeklyVolume(weeksBack=8){
  const logs=store.logs;
  const today=todayDate();
  const curWeek=weekStart(today);
  const weeks=[];
  for(let i=weeksBack-1;i>=0;i--){
    const start=new Date(curWeek);
    start.setDate(start.getDate()-i*7);
    weeks.push(start);
  }
  return weeks.map(start=>{
    let tonnage=0,sets=0;
    const startStr=fmt(start);
    const end=new Date(start);end.setDate(end.getDate()+7);
    const endStr=fmt(end);
    Object.keys(logs).forEach(d=>{
      if(d>=startStr && d<endStr){
        const t=dayTonnage(logs[d]);
        tonnage+=t.tonnage;
        sets+=t.sets;
      }
    });
    const label=String(start.getDate()).padStart(2,'0')+'.'+String(start.getMonth()+1).padStart(2,'0');
    return { label, value:tonnage, title:`Неделя с ${label}: ${tonnage} кг · ${sets} подх.` };
  });
}
function getStreak(){
  const today=todayDate();
  const todayStr=fmt(today);
  const start=getHistoryStartDate();
  if(!start)return {current:0,record:0};
  let current=0;
  let d=new Date(today);
  let dStr=fmt(d);
  while(dStr>=start){
    const st=getDayStatus(dStr);
    if(st.state==='before')break;
    if(st.state==='skip'||st.state==='full-miss')break;
    if(st.state==='done'||st.state==='part'||st.state==='today-part')current++;
    d.setDate(d.getDate()-1);
    dStr=fmt(d);
  }
  let record=0,cur=0;
  let curD=new Date(start+'T00:00:00');
  let curStr=fmt(curD);
  while(curStr<=todayStr){
    const st=getDayStatus(curStr);
    if(st.state==='done'||st.state==='part'||st.state==='today-part'){
      cur++;
      if(cur>record)record=cur;
    }else if(st.state==='skip'||st.state==='full-miss'){
      cur=0;
    }
    curD.setDate(curD.getDate()+1);
    curStr=fmt(curD);
  }
  return {current,record};
}
function getMonthlyCompletion(){
  const today=todayDate();
  const y=today.getFullYear(),m=today.getMonth();
  const dim=today.getDate();
  let total=0,done=0;
  for(let day=1;day<=dim;day++){
    const dStr=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const st=getDayStatus(dStr);
    if(st.state==='before'||st.state==='skip')continue;
    const plan=st.plan||getPlan(new Date(dStr+'T00:00:00'));
        const expected=[...plan.main,...plan.after].filter(k=>EX[logBaseId(k)]);
    total+=expected.length;
    if(st.doneInPlan)done+=st.doneInPlan.length;
  }
  return {total,done,pct:total>0?Math.round(done/total*100):0};
}
function countExercisePRs(exId){
  const logs = store.logs;
  let w = 0, r = 0, s = 0;
  if(!EX[exId] || EX[exId].app) return { w, r, s };
  Object.keys(logs).sort().forEach(d => {
    const day = logs[d];
    if(!day) return;
    Object.entries(day).forEach(([k, e]) => {
      if(k.startsWith('_') || !e || !e.done) return;
      if(logBaseId(k) !== exId) return;
      const pr = checkPRs(exId, e, d);
      if(pr.weightPR) w++;
      if(pr.repsPR) r++;
      if(checkSteadyAllSets(exId, e, d)) s++;
    });
  });
  return { w, r, s };
}
function renderBars(items,opts={}){
  if(!items.length)return `<div class="ex" style="color:#666">Нет данных</div>`;
  const max=Math.max(...items.map(i=>i.value),1);
  const color=opts.color||'linear-gradient(180deg,#4a8,#2a5)';
  let html='<div class="bars">';
  items.forEach(it=>{
    const h=Math.max(2,(it.value/max)*120);
    const label=it.label||'';
    const value=it.value>0?(opts.fmt?opts.fmt(it.value):it.value):'';
    const title=it.title||`${label}: ${it.value}`;
    html+=`<div class="bar-col" title="${escapeHtml(title)}">
      <div class="bar-val">${value}</div>
      <div class="bar" style="height:${h}px;background:${color}"></div>
      <div class="bar-label">${label}</div>
    </div>`;
  });
  html+='</div>';
  return html;
}
function renderStats(){
  let html=renderTabs();
  html+=`<div class="header"><span>Статистика</span></div>`;
  const streak=getStreak();
  const monthly=getMonthlyCompletion();
  const weekly=getWeeklyVolume(8);
  const totalTonnage=weekly.reduce((s,w)=>s+w.value,0);
  html+=`<div class="stats-summary">
    <div class="stat-card"><div class="stat-val">${streak.current}</div><div class="stat-lbl">дней подряд</div></div>
    <div class="stat-card"><div class="stat-val">${streak.record}</div><div class="stat-lbl">рекорд стрика</div></div>
    <div class="stat-card"><div class="stat-val">${monthly.pct}%</div><div class="stat-lbl">за месяц (${monthly.done}/${monthly.total})</div></div>
    <div class="stat-card"><div class="stat-val">${totalTonnage} кг</div><div class="stat-lbl">тоннаж за 8 нед.</div></div>
  </div>`;
  html+=`<h2>Объём по неделям</h2>`;
  html+=renderBars(weekly,{fmt:v=>v>999?Math.round(v/100)/10+'к':v});
  html+=`<h2>Упражнения</h2>`;
  const logs=store.logs;
    const exStats=Object.entries(EX).map(([id,ex])=>{
    let sessions=0,totalSets=0;
    Object.keys(logs).forEach(d=>{
      const day = logs[d];
      if(!day) return;
      Object.entries(day).forEach(([k,e]) => {
        if(k.startsWith('_') || !e || !e.done) return;
        if(logBaseId(k) !== id) return;
        sessions++;
        totalSets += (e.sets||[]).filter(s=>s&&parseFloat(s.r)>0).length;
      });
    });
    return {id,ex,sessions,totalSets};
  }).filter(x=>x.sessions>0).sort((a,b)=>b.sessions-a.sessions);
  if(!exStats.length){
    html+=`<div class="ex" style="color:#666">Пока нет тренировок</div>`;
  }else{
    exStats.forEach(s=>{
      html+=`<div class="ex ex-link" onclick="openExerciseStats('${s.id}')">
        <div class="hist-row">
          <strong>${escapeHtml(s.ex.name)}</strong>
          <span class="ex-last" style="margin-left:auto">${s.sessions} сессий · ${s.totalSets} подх.</span>
          <span style="color:#666">›</span>
        </div>
      </div>`;
    });
  }
  html+=renderInstallSection();
  html+=renderDataSection();
  document.getElementById('app').innerHTML=html;
}
function openExerciseStats(logKey){ statsExerciseId = logBaseId(logKey); view = 'stats-ex'; render(); }
function renderExerciseStats(){
  const exId=statsExerciseId;
  const ex=EX[exId];
  if(!ex){view='stats';render();return}
  let html=renderTabs();
  html+=`<div class="header">
    <button onclick="setView('stats')">← Назад</button>
    <span style="font-size:13px;text-align:right">${escapeHtml(ex.name)}</span>
  </div>`;
  const logs=store.logs;
    const sessions = [];
  Object.keys(logs).sort().forEach(d => {
    const day = logs[d];
    if(!day) return;
    Object.entries(day).forEach(([k, e]) => {
      if(k.startsWith('_') || !e || !e.done) return;
      if(logBaseId(k) !== exId) return;
      sessions.push({ date: d, log: e });
    });
  });
  const msum = muscleSummary(ex.muscles);
  if(msum){ html+=`<div class="ex"><div class="ex-last" style="color:#999">Мышцы: ${escapeHtml(msum)}</div></div>`; }
  html+=`<div class="ex">${renderMarkerCells(exId, {marginTop: false})}</div>`;
  if(!sessions.length){
    html+=`<div class="ex" style="color:#666">Нет записей для этого упражнения</div>`;
    document.getElementById('app').innerHTML=html;
    return;
  }
  if(ex.app){
    html+=`<div class="ex"><strong>По приложению</strong><div class="ex-last">Сессий: ${sessions.length} · последняя: ${sessions[sessions.length-1].date}</div></div>`;
    html+=`<h2>Все записи</h2>`;
    sessions.slice().reverse().forEach(s=>{
      html+=`<div class="ex"><div class="hist-row"><strong>${s.date}</strong><span class="ex-last" style="margin-left:auto">✓</span></div></div>`;
    });
    document.getElementById('app').innerHTML=html;
    return;
  }
  let maxW=0,maxR=0,totalTonnage=0,totalSets=0;
  sessions.forEach(s=>{
    (s.log.sets||[]).forEach(set=>{
      if(!set)return;
      const w=parseFloat(set.w)||0,r=parseFloat(set.r)||0;
      if(w>maxW)maxW=w;
      if(r>maxR)maxR=r;
      if(r>0){totalSets++;if(w>0)totalTonnage+=w*r;}
    });
  });
  const prs=countExercisePRs(exId);
  html+=`<div class="stats-summary">
    <div class="stat-card"><div class="stat-val">${maxW} кг</div><div class="stat-lbl">макс. вес</div></div>
    <div class="stat-card"><div class="stat-val">${maxR}</div><div class="stat-lbl">макс. повторов</div></div>
    <div class="stat-card"><div class="stat-val">${sessions.length}</div><div class="stat-lbl">сессий</div></div>
    <div class="stat-card"><div class="stat-val">${Math.round(totalTonnage)} кг</div><div class="stat-lbl">тоннаж за всё время</div></div>
  </div>`;
  html+=`<div class="ex"><div class="pr-row" style="margin-bottom:0">
    <span class="pr-badge pr-weight">🔩 ${prs.w}</span>
    <span class="pr-badge pr-reps">💪 ${prs.r}</span>
    <span class="pr-badge pr-max">🎯 ${prs.s}</span>
  </div></div>`;
  const recent=sessions.slice(-20);
  html+=`<h2>Макс. вес по сессиям</h2>`;
  html+=renderBars(recent.map(s=>({
    label:s.date.slice(5),
    value:getExerciseStats(s.log).maxW,
    title:`${s.date}: ${getExerciseStats(s.log).maxW} кг`,
  })),{color:'linear-gradient(180deg,#ca6,#a84)'});
  html+=`<h2>Тоннаж по сессиям</h2>`;
  html+=renderBars(recent.map(s=>{
    const st=getExerciseStats(s.log);
    return { label:s.date.slice(5), value:st.totalVol, title:`${s.date}: ${Math.round(st.totalVol)} кг` };
  }),{fmt:v=>v>999?Math.round(v/100)/10+'к':v,color:'linear-gradient(180deg,#4a8,#2a5)'});
  html+=`<h2>Все записи</h2>`;
  sessions.slice().reverse().slice(0,30).forEach(s=>{
    const val=formatSets(s.log);
    const badges=getExerciseBadges(exId,s.log,s.date);
    html+=`<div class="ex">
      <div class="hist-row">
        <strong>${s.date}</strong>
        <span class="ex-last" style="margin-left:auto">${val}</span>
      </div>
      ${badges?`<div class="pr-row" style="margin-top:4px;margin-bottom:0">${badges}</div>`:''}
    </div>`;
  });
  document.getElementById('app').innerHTML=html;
}

/* ---------- Data backup ---------- */
function exportData(){
  let exerciseMarkers = {};
  try{ exerciseMarkers = JSON.parse(localStorage.getItem('exerciseMarkers')||'{}'); }catch(e){}
  const data={
    version:1,
    exportedAt:new Date().toISOString(),
    logs:store.logs,
    customEx:customStore.list,
    ownPlan:ownPlanStore.get(),
    planConfigured:localStorage.getItem('planConfigured')==='1',
    exerciseMarkers:exerciseMarkers,
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const d=new Date();
  const fname=`trainer-backup-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.json`;
  a.href=url;
  a.download=fname;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  localStorage.setItem('lastBackupDate',fmt(todayDate()));
  render();
}
function importData(){
  const input=document.getElementById('import-file');
  if(!input)return;
  input.value='';
  input.click();
}
function handleImportFile(ev){
  const file=ev.target.files&&ev.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(!data||typeof data!=='object')throw new Error('файл не JSON-объект');
      if(!data.logs||typeof data.logs!=='object')throw new Error('в файле нет поля logs');
      const logsCount=Object.keys(data.logs).length;
      const customCount=Array.isArray(data.customEx)?data.customEx.length:0;
      if(!confirm(`Импорт заменит все текущие данные.\n\nВ файле:\n• ${logsCount} дн. логов\n• ${customCount} своих упражнений\n\nПродолжить?`))return;
      store.logs=data.logs;
      if(Array.isArray(data.customEx)){
        customStore.list=data.customEx;
        syncCustomEx();
      }
      if(data.ownPlan){ ownPlanStore.set(data.ownPlan); }
      if(data.planConfigured){ localStorage.setItem('planConfigured','1'); }
      if(data.exerciseMarkers && typeof data.exerciseMarkers === 'object'){
        localStorage.setItem('exerciseMarkers', JSON.stringify(data.exerciseMarkers));
      }
      alert('Данные загружены');
      render();
    }catch(err){
      alert('Ошибка чтения файла: '+err.message);
    }
  };
  reader.readAsText(file);
}
function resetAll(){
  if(!confirm('Удалить ВСЕ данные (тренировки и свои упражнения)?'))return;
  if(!confirm('Точно? Отменить будет невозможно.'))return;
  localStorage.removeItem('logs');
  localStorage.removeItem('customEx');
  localStorage.removeItem('lastBackupDate');
  localStorage.removeItem('ownPlan');
  localStorage.removeItem('planConfigured');
  localStorage.removeItem('exerciseMarkers');
  localStorage.removeItem('defaultMarkersSeeded_v1');
  localStorage.removeItem('bodyWeight'); // <-- ДОБАВЛЕНО: удаляем вес
  location.reload();
}
function renderInstallSection(){
  if(!deferredPrompt)return '';
  return `<h2>Приложение</h2>
  <div class="ex">
    <div class="ex-last">Установи на главный экран — открывается как обычное приложение, работает офлайн</div>
    <button class="mini-btn" style="margin-top:8px;background:#2a4a5a;border-color:#3a6a7a" onclick="installPWA()">📲 Установить</button>
  </div>`;
}
function installPWA(){
  if(!deferredPrompt)return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(()=>{deferredPrompt=null;render();});
}
function renderDataSection(){
  const last=localStorage.getItem('lastBackupDate');
  let lastLine;
  let warn='';
  if(last){
    const days=Math.floor((todayDate()-new Date(last+'T00:00:00'))/86400000);
    lastLine=`Последний бэкап: ${last} (${days===0?'сегодня':days+' дн. назад'})`;
    if(days>=14)warn=`<div class="ex-last" style="color:#e8a860">⚠️ Пора сделать новый бэкап</div>`;
  }else{
    lastLine='Последний бэкап: никогда';
    warn=`<div class="ex-last" style="color:#e8a860">⚠️ Бэкап ещё не делался</div>`;
  }
  return `<h2>Данные</h2>
  <div class="ex">
    <div class="ex-last">${lastLine}</div>
    ${warn}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
      <button class="mini-btn" style="background:#2a5a2a;border-color:#3a7a3a" onclick="exportData()">💾 Скачать</button>
      <button class="mini-btn" onclick="importData()">📂 Загрузить</button>
      <button class="mini-btn" style="background:#5a2a2a;border-color:#7a3a3a" onclick="resetAll()">🗑 Сбросить</button>
    </div>
    <input type="file" id="import-file" accept=".json,application/json" style="display:none" onchange="handleImportFile(event)">
  </div>`;
}
/* ---------- Настройки и Вес тела ---------- */
function renderSettings(){
  const currentBW = parseFloat(localStorage.getItem('bodyWeight')) || 75;
  const last = localStorage.getItem('lastBackupDate');
  let lastLine, warn = '';
  
  if(last){
    const days = Math.floor((todayDate() - new Date(last + 'T00:00:00')) / 86400000);
    lastLine = `Последний бэкап: ${last} (${days === 0 ? 'сегодня' : days + ' дн. назад'})`;
    if(days >= 14) warn = `<div class="ex-last" style="color:#e8a860">⚠️ Пора сделать новый бэкап</div>`;
  } else {
    lastLine = 'Последний бэкап: никогда';
    warn = `<div class="ex-last" style="color:#e8a860">⚠️ Бэкап ещё не делался</div>`;
  }
  
  let html = renderTabs();
  html += `<div class="header"><span>Настройки</span></div>
  <div class="ex" style="margin-top:12px">
    <h3>⚖️ Вес тела</h3>
    <p style="font-size:13px;color:#888;margin-bottom:8px">Используется для расчёта усталости при упражнениях с собственным весом (например, отжимания).</p>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px">
      <input type="number" id="settings-bodyweight" value="${currentBW}" min="30" max="250" step="0.5" style="width:100px;padding:8px;border-radius:6px;border:1px solid #ccc">
      <span>кг</span>
      <button class="mini-btn" onclick="saveBodyWeight()">Сохранить</button>
    </div>
  </div>
  <h2>Данные</h2>
  <div class="ex">
    <div class="ex-last">${lastLine}</div>
    ${warn}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
      <button class="mini-btn" style="background:#2a5a2a;border-color:#3a7a3a" onclick="exportData()">💾 Скачать</button>
      <button class="mini-btn" onclick="importData()">📂 Загрузить</button>
      <button class="mini-btn" style="background:#5a2a2a;border-color:#7a3a3a" onclick="resetAll()">🗑 Сбросить</button>
    </div>
    <input type="file" id="import-file" accept=".json,application/json" style="display:none" onchange="handleImportFile(event)">
  </div>`;
  
  document.getElementById('app').innerHTML = html;
}

function saveBodyWeight(){
  const input = document.getElementById('settings-bodyweight');
  if(!input) return;
  const val = parseFloat(input.value);
  if(val >= 30 && val <= 250){
    localStorage.setItem('bodyWeight', val);
    alert('Вес тела сохранён!');
    render();
  } else {
    alert('Введите корректный вес (30-250 кг)');
  }
}

function showBodyWeightPrompt(){
  if(localStorage.getItem('bodyWeight')) return;
  const modal = document.createElement('div');
  modal.id = 'bw-prompt-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999';
  modal.innerHTML = `
    <div style="background:#1e1e1e;padding:24px;border-radius:12px;max-width:320px;width:90%;text-align:center;border:1px solid #333">
      <h3 style="margin-top:0;color:#fff">Добро пожаловать! 🏋️</h3>
      <p style="color:#ccc;font-size:14px;margin-bottom:16px">Для точного расчёта усталости в упражнениях с собственным весом, укажите ваш текущий вес тела:</p>
      <input type="number" id="onboard-bodyweight" value="75" min="30" max="250" step="0.5" style="width:100%;padding:10px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;font-size:16px;margin-bottom:16px;text-align:center">
      <button class="mini-btn" style="width:100%;padding:10px;font-size:16px;background:#2a5a2a;border-color:#3a7a3a" onclick="saveOnboardBodyWeight()">Начать тренировку</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveOnboardBodyWeight(){
  const input = document.getElementById('onboard-bodyweight');
  const val = parseFloat(input.value);
  if(val >= 30 && val <= 250){
    localStorage.setItem('bodyWeight', val);
    const modal = document.getElementById('bw-prompt-modal');
    if(modal) modal.remove();
    render();
  } else {
    alert('Введите корректный вес (30-250 кг)');
  }
}


/* ---------- Тренер ---------- */
function renderTrainer(){
  const { loads, days, dailyDeltas } = computeAllMuscleLoads();

  const planMuscles = new Set();
  const allPlanExIds = new Set();
  const own = ownPlanStore.get();
  
  if(own && own.enabled){
    (own.items || []).forEach(it => {
      allPlanExIds.add(it.id);
      const ex = EX[it.id];
      if(ex) getMusclesFromEx(ex).forEach(({ id }) => planMuscles.add(id));
    });
    (own.blocks || []).forEach(block => {
      getBlockExercises(block, own.blocks).forEach(exId => {
        allPlanExIds.add(exId);
        if(EX[exId]) getMusclesFromEx(EX[exId]).forEach(({ id }) => planMuscles.add(id));
      });
    });
  }

  let html = renderTabs();
  html += `<div class="header"><span>Тренер</span></div>`;

  // Если в плане ничего нет и нет тренировок — показываем заглушку
  if (allPlanExIds.size === 0 && days === 0) {
    html += `<div class="ex" style="color:#888;font-size:13px">
      Добавьте упражнения в план или выполните первую тренировку, чтобы тренер начал анализировать.
    </div>`;
    html += renderTrainerAbout();
    document.getElementById('app').innerHTML = html;
    return;
  }

  const ready=[], moderate=[], high=[], rest=[];
  if (days > 0) {
    Object.entries(loads).forEach(([m, l]) => {
      if(!(m in MUSCLE_BY_ID)) return;
      if(l <= LOAD_GREEN) ready.push(m);
      else if(l <= LOAD_YELLOW) moderate.push(m);
      else if(l <= LOAD_ORANGE) high.push(m);
      else rest.push(m);
    });
  }

  if (days === 0) {
    html += `<div class="ex" style="color:#e8a860;font-size:13px;margin-bottom:12px;background:#2a1a1a;border-color:#4a2020;">
      ⚠️ Пока нет данных о выполненных упражнениях. Ниже — анализ вашего плана и рекомендации.
    </div>`;
  } else {
    const groupDefs = [
      {key:'ready',    label:'✅ Готовы к работе',    color:'#6ab06a', muscles: ready},
      {key:'moderate', label:'🟡 Умеренная усталость', color:'#e8c44d', muscles: moderate},
      {key:'high',     label:'🟠 Высокая усталость',   color:'#e8a860', muscles: high},
      {key:'rest',     label:'🔴 Нужен отдых',         color:'#e85a5a', muscles: rest},
    ];
    groupDefs.forEach(g => g.muscles.sort((a,b) => (loads[b]||0) - (loads[a]||0)));

    html += `<div class="info">Данных за ${days} дн. Нажмите на группу, чтобы раскрыть список мышц.</div>`;

    groupDefs.forEach(group => {
      const isExpanded = expandedMuscleGroups.has(group.key);
      const n = group.muscles.length;
      const countLabel = n === 0 ? 'пусто' : (n === 1 ? '1 мышца' : (n < 5 ? `${n} мышцы` : `${n} мышц`));

      html += `<div class="muscle-group">
        <div class="muscle-group-header ${isExpanded?'expanded':''}"
             style="border-left-color:${group.color}"
             onclick="toggleMuscleGroup('${group.key}')">
          <span class="mg-arrow">▸</span>
          <span>${group.label}</span>
          <span class="mg-count">${countLabel}</span>
        </div>
        <div class="muscle-group-body" id="mg-body-${group.key}"
             style="max-height:${isExpanded?'5000px':'0'}">
          ${n === 0
            ? `<div class="muscle-item" style="justify-content:center;color:#666;font-size:12px">Нет мышц в этой группе</div>`
            : group.muscles.map(mid => {
                const load = loads[mid] || 0;
const pct = Math.round(load * 100);
const color = getLoadColor(load);
const name = MUSCLE_BY_ID[mid]?.name || mid;
const delta = (dailyDeltas && dailyDeltas[mid]) || 0;
const deltaPct = Math.round(delta * 100);
const deltaStr = deltaPct === 0 ? '±0%' : (deltaPct > 0 ? `+${deltaPct}%` : `${deltaPct}%`);
const deltaColor = deltaPct > 0 ? '#6ab06a' : (deltaPct < 0 ? '#e85a5a' : '#888');
const inPlan = planMuscles.has(mid);
return `<div class="muscle-item">
  <div class="mi-info">
    <span class="mi-name">${escapeHtml(name)}${!inPlan?' <span style="color:#e8a860;font-size:10.5px">(не в плане)</span>':''}</span>
    <span class="mi-weight" style="color:${deltaColor}">сегодня: ${deltaStr}</span>
    <div class="mi-bar"><div class="mi-bar-fill" style="width:${Math.min(pct,100)}%;background:${color}"></div></div>
  </div>
  <span class="mi-pct" style="color:${color}">${pct}%</span>
</div>`;
              }).join('')
          }
        </div>
      </div>`;
    });
  }

  html += `<h2>Рекомендации</h2>`;
  const recs = [];
  if(rest.length){
    const names = rest.slice(0,6).map(m => MUSCLE_BY_ID[m]?.name || m).join(', ');
    recs.push(`🔴 Нужен отдых: ${names}${rest.length > 6 ? ' и др.' : ''}`);
  }
  if(ready.length){
    const names = ready.slice(0,6).map(m => MUSCLE_BY_ID[m]?.name || m).join(', ');
    recs.push(`🟢 Готовы к нагрузке: ${names}${ready.length > 6 ? ' и др.' : ''}`);
  }
  const pairs = [['biceps','triceps'],['pectoralis_major','lats'],['fcr','finger_extensors'],['quads','hamstrings']];
  pairs.forEach(([a,b]) => {
    if(!(a in loads) || !(b in loads)) return;
    const diff = Math.abs(loads[a] - loads[b]);
    if(diff > 0.30){
      const big = loads[a] > loads[b] ? a : b;
      const small = loads[a] > loads[b] ? b : a;
      recs.push(`⚖️ Дисбаланс: ${MUSCLE_BY_ID[big].name} нагружен сильнее, чем ${MUSCLE_BY_ID[small].name} — добавь работу на ${MUSCLE_BY_ID[small].name.toLowerCase()}`);
    }
  });
  
  const notInPlan = [];
  MUSCLES.forEach(cat => cat.groups.forEach(g => {
    if(g.id in MUSCLE_COEF && !planMuscles.has(g.id)) notInPlan.push(g);
  }));

  if(notInPlan.length){
    recs.push(`📋 Не задействованы в плане: ${notInPlan.map(g => g.name).join(', ')}`);
  }
  if(!recs.length) recs.push('Пока всё сбалансировано — продолжай в том же духе.');

  recs.forEach(r => {
    html += `<div class="ex" style="font-size:13px;line-height:1.5">${r}</div>`;
  });

  // ==========================================
  // БЛОК: Подбор упражнений для легкого дня
  // ==========================================
  if (notInPlan.length) {
    // Считаем загруженность дней по плану (включая блоки)
    const dayCounts = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
    if (own && own.enabled) {
      const addSched = (sched) => {
        if (!sched) return;
        if (sched.type === 'days') sched.days.forEach(d => dayCounts[d]++);
        else if (sched.type === 'everyday') [0,1,2,3,4,5,6].forEach(d => dayCounts[d]++);
        else if (sched.type === 'interval') [0,1,2,3,4,5,6].forEach(d => dayCounts[d] += 7 / (sched.interval || 7));
        else if (sched.type === 'even') [0,2,4,6].forEach(d => dayCounts[d] += 1.5);
        else if (sched.type === 'odd') [1,3,5].forEach(d => dayCounts[d] += 1.5);
      };

      (own.items || []).forEach(it => addSched(it.schedule));
      (own.blocks || []).forEach(block => addSched(block.schedule));
    }
    
    // Находим самый легкий день
    const daysSorted = Object.entries(dayCounts).sort((a,b) => a[1] - b[1]);
    const lightestDayIdx = parseInt(daysSorted[0][0]);
    const lightestDayName = DAYS[lightestDayIdx];

    let suggestionHtml = `<h2>💡 Подсказка: что добавить в план</h2>`;
    suggestionHtml += `<div class="ex" style="font-size:12.5px;color:#aaa;line-height:1.55;margin-bottom:10px">
      Для незадействованных мышц лучше всего подойдут следующие упражнения. 
      <strong>Рекомендуем добавить их в ${lightestDayName}</strong> — это день с наименьшей загруженностью в вашем текущем плане.
    </div>`;

    let hasSuggestions = false;
    notInPlan.forEach(g => {
      // Собираем все упражнения для этой мышцы (>=30%), которых нет в плане
      const validExs = Object.entries(EX)
        .map(([id, ex]) => ({ id, ex, share: (ex.muscles && ex.muscles[g.id]) || 0 }))
        .filter(item => item.share >= 30 && !allPlanExIds.has(item.id))
        .sort((a,b) => b.share - a.share);

      const suggestions = [];

      // Вариант 1: Самое эффективное упражнение (независимо от инвентаря)
      const bestOverall = validExs[0];
      if (bestOverall) {
        suggestions.push(bestOverall);
      }

      // Вариант 2: Самое эффективное упражнение БЕЗ тренажера/резинки
      const bestNoEq = validExs.find(item => {
        const markers = getExerciseMarkers(item.id);
        return !markers.includes('Тренажер') && !markers.includes('Резинка');
      });

      // Добавляем второй вариант, только если он отличается от первого
      if (bestNoEq && (!bestOverall || bestNoEq.id !== bestOverall.id)) {
        suggestions.push(bestNoEq);
      }

      if (suggestions.length) {
        hasSuggestions = true;
        suggestionHtml += `<div class="ex" style="font-size:13px;margin-bottom:6px">
          <strong style="color:#ccc">${escapeHtml(g.name)}:</strong><br>
          ${suggestions.map(e => {
            const markers = getExerciseMarkers(e.id);
            const isEq = markers.includes('Тренажер') || markers.includes('Резинка');
            const note = isEq ? ' <span style="color:#e8a860;font-size:10px">(с инвентарем)</span>' : ' <span style="color:#6ab06a;font-size:10px">(свободный вес / тело)</span>';
            return `• ${escapeHtml(e.ex.name)} <span style="color:#6ab06a">(${e.share}%)</span>${note}`;
          }).join('<br>')}
        </div>`;
      }
    });

    if (hasSuggestions) {
      html += suggestionHtml;
    }
  }

  html += renderTrainerAbout();
  document.getElementById('app').innerHTML = html;
}

function renderTrainerAbout(){
  return `<h2>О системе</h2>
  <div class="ex" style="font-size:12.5px;color:#aaa;line-height:1.55">
    <p style="margin:0 0 8px"><strong style="color:#ccc">Загруженность</strong> — условная «усталость» мышцы в процентах. После тренировки она растёт, в дни отдыха снижается. Если тренировался два дня подряд — день тренировки не считается днём отдыха, восстановление к нему не применяется.</p>
    <p style="margin:0 0 8px"><strong style="color:#ccc">Формула начисления:</strong><br>
        <code>increase = weight_ratio × tonnage_ratio × ${LOAD_FACTOR}</code><br>
        <span style="color:#888;font-size:11.5px">(доля участия мышцы уже учтена в эффективной нагрузке, по которой считается рекорд)</span><br>
        где отношения берутся к личным рекордам <strong>этой мышцы</strong>:
    эффективный вес = вес_упражнения × доля_участия, и сравнивается он с рекордом именно мышцы, а не упражнения.
    Поэтому новое упражнение не даёт «автоматический рекорд» — мышца должна получить больше, чем когда-либо получала.</p>
    <p style="margin:0 0 8px"><strong style="color:#ccc">Восстановление в день отдыха:</strong><br>
    <code>load = max(0, load × recovery_rate − daily_subtraction)</code></p>
    <p style="margin:0 0 8px"><strong style="color:#ccc">Порог значимости:</strong> если тоннаж сессии меньше ${Math.round(LOAD_THRESHOLD*100)}% от рекорда — нагрузка не начисляется.</p>
    <p style="margin:0 0 8px"><strong style="color:#ccc">Количество подходов</strong> входит в формулу через тоннаж: <code>tonnage = Σ(weight × reps)</code>. Если рекорд мышцы 800 кг (4×10×20), а сегодня сделал 3×10×20 = 600 кг, то <code>tRatio = 0.75</code> — стимул на 25% меньше. Один подход вместо четырёх при прочих равных даёт <code>tRatio = 0.25 &lt; ${LOAD_THRESHOLD}</code> — нагрузка не начисляется. Поэтому делать всю запланированную работу выгоднее, чем «отсидеться».</p>
    <p style="margin:0"><strong style="color:#ccc">Цвета:</strong><br>
    🟢 0–${Math.round(LOAD_GREEN*100)}% — восстановлена, можно тяжёлую работу<br>
    🟡 ${Math.round(LOAD_GREEN*100)}–${Math.round(LOAD_YELLOW*100)}% — умеренная усталость<br>
    🟠 ${Math.round(LOAD_YELLOW*100)}–${Math.round(LOAD_ORANGE*100)}% — только лёгкая сессия<br>
    🔴 &gt;${Math.round(LOAD_ORANGE*100)}% — нужен отдых</p>
  </div>`;
}

/* ---------- Онбординг / конструктор плана ---------- */
let onbPlan = {items: [], blocks: []};
let onbAdding = false;
let onbAddType = 'existing';
let onbAddSchedType = 'days';
let onbEditingIdx = null;
let onbAddingBlock = false;
let blockEditPath = [];
let prevView = null;
let addExistingSelectedId = '';
let editingChildIdx = null;
let wizardState = {
  step: 0, // 0 - выбор режима, 1 - инвентарь, 2 - дни, 3 - мышцы
  mode: null, // 'manual' или 'auto'
  equipment: [],
  days: [1, 3, 5], // По умолчанию Пн, Ср, Пт
  parts: []
};

function needsOnboarding(){
  if(localStorage.getItem('planConfigured')) return false;
  return Object.keys(store.logs).length === 0;
}

function loadOnbPlanFromStore(){
  const own = ownPlanStore.get();
  let items = (own && own.items) ? JSON.parse(JSON.stringify(own.items)).filter(it => EX[it.id]) : [];
  let blocks = (own && own.blocks) ? JSON.parse(JSON.stringify(own.blocks)) : [];
  if(items.length === 0 && blocks.length === 0){
    items = customStore.list
      .filter(c => !c.deleted && c.schedule && c.schedule.type !== 'none')
      .map(c => ({ id: c.id, schedule: { ...c.schedule }, disabled: null }));
  }
  onbPlan = { items, blocks };
  onbEditingIdx = null;
  onbAdding = false;
  onbAddingBlock = false;
  editingChildIdx = null;
  const validPath = [];
  for (const id of blockEditPath) {
    if (blocks.some(b => b.id === id)) validPath.push(id);
    else break;
  }
  blockEditPath = validPath;
}
function saveOnbPlanToStore(){
  ownPlanStore.set({ enabled: true, items: onbPlan.items, blocks: onbPlan.blocks || [] });
  localStorage.setItem('planConfigured', '1');
}

function isCustomDirty(){
  const stored = ownPlanStore.get();
  const currItemsStr = JSON.stringify(onbPlan.items || []);
  const currBlocksStr = JSON.stringify(onbPlan.blocks || []);
  if(!stored) return (onbPlan.items||[]).length > 0 || (onbPlan.blocks||[]).length > 0;
  const storedItemsStr = JSON.stringify(stored.items || []);
  const storedBlocksStr = JSON.stringify(stored.blocks || []);
  return storedItemsStr !== currItemsStr || storedBlocksStr !== currBlocksStr;
}

function hasPendingAddData(){
  if(!onbAdding) return false;
  if(onbAddType === 'existing'){
    return !!addExistingSelectedId;
  }else{
    const nameEl = document.getElementById('addNewName');
    if(nameEl && nameEl.value.trim()) return true;
    const anyMuscle = document.querySelector('.addNewMuscle-chk:checked');
    return !!anyMuscle;
  }
}

/* ---------- Block helpers ---------- */
function getCurrentBlock() {
  if (!blockEditPath.length) return null;
  const id = blockEditPath[blockEditPath.length - 1];
  return (onbPlan.blocks || []).find(b => b.id === id) || null;
}

function isTopLevelBlockLocal(blockId){
  return !(onbPlan.blocks || []).some(b =>
    b.id !== blockId && (b.children || []).some(c => c.type === 'block' && c.id === blockId)
  );
}

function getTopLevelBlocksLocal() {
  const all = onbPlan.blocks || [];
  const referenced = new Set();
  all.forEach(b => {
    (b.children || []).forEach(c => {
      if (c.type === 'block') referenced.add(c.id);
    });
  });
  return all.filter(b => !referenced.has(b.id));
}

function enterBlock(blockId) {
  blockEditPath.push(blockId);
  editingChildIdx = null;
  render();
}

function goToBreadcrumb(index) {
  blockEditPath = blockEditPath.slice(0, index);
  editingChildIdx = null;
  render();
}

function blockNameExists(name, excludeId){
  return (onbPlan.blocks || []).some(b => b.id !== excludeId && b.name === name);
}

function createBlockInCurrent() {
  let n = 1;
  let name;
  do {
    name = 'Блок ' + n;
    n++;
  } while (blockNameExists(name));
  const newBlock = {
    id: 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    schedule: { type: 'none' },
    disabled: null,
    children: []
  };
  if (!onbPlan.blocks) onbPlan.blocks = [];
  onbPlan.blocks.push(newBlock);
  if (blockEditPath.length) {
    const current = getCurrentBlock();
    if (current) {
      current.children = current.children || [];
      current.children.push({ type: 'block', id: newBlock.id, activeWithParent: true });
    }
  }
  enterBlock(newBlock.id);
}

function deleteBlockById(blockId) {
  const block = (onbPlan.blocks || []).find(b => b.id === blockId);
  if (!block) return;
  const childCount = (block.children || []).length;
  const extra = childCount > 0 ? `\nВместе с содержимым (${childCount} элементов).` : '';
  if (!confirm(`Удалить блок «${block.name}»?${extra}`)) return;
  const toDelete = new Set([blockId]);
  const collect = (id) => {
    const b = (onbPlan.blocks || []).find(x => x.id === id);
    if (!b) return;
    (b.children || []).forEach(c => {
      if (c.type === 'block') {
        toDelete.add(c.id);
        collect(c.id);
      }
    });
  };
  collect(blockId);
  (onbPlan.blocks || []).forEach(b => {
    b.children = (b.children || []).filter(c => !(c.type === 'block' && toDelete.has(c.id)));
  });
  const remainingRefs = new Set();
  (onbPlan.blocks || []).forEach(b => {
    if (toDelete.has(b.id)) return;
    (b.children || []).forEach(c => {
      if (c.type === 'block') remainingRefs.add(c.id);
    });
  });
  onbPlan.blocks = (onbPlan.blocks || []).filter(b => {
    if (!toDelete.has(b.id)) return true;
    return remainingRefs.has(b.id);
  });
  const idx = blockEditPath.findIndex(id => toDelete.has(id));
  if (idx >= 0) {
    blockEditPath = blockEditPath.slice(0, idx);
  }
  editingChildIdx = null;
  render();
}

function removeChildAt(idx) {
  const block = getCurrentBlock();
  if (!block) return;
  const child = block.children[idx];
  if (!child) return;

  let name = 'упражнение';
  if (child.type === 'exercise') {
    name = EX[child.id]?.name ? `«${EX[child.id].name}»` : 'упражнение';
  } else if (child.type === 'block') {
    const nested = (onbPlan.blocks || []).find(b => b.id === child.id);
    name = nested ? `блок «${nested.name}»` : 'блок';
  }

  if (!confirm(`Удалить ${name} из блока?`)) return;

  block.children = (block.children || []).filter((_, i) => i !== idx);
  editingChildIdx = null;
  render();
}

function getEligibleBlocksForCurrent() {
  const currentBlock = getCurrentBlock();
  if (!currentBlock) return [];
  const ancestors = new Set(blockEditPath);
  const allBlocks = onbPlan.blocks || [];
  return allBlocks.filter(b => {
    if (ancestors.has(b.id)) return false;
    const descendants = getBlockDescendantIds(allBlocks, b.id);
    if (descendants.includes(currentBlock.id)) return false;
    return true;
  });
}

function showAddExistingBlock() {
  onbAddingBlock = true;
  render();
}
function cancelAddExistingBlock() {
  onbAddingBlock = false;
  render();
}
function addExistingBlockToCurrent(blockId) {
  const current = getCurrentBlock();
  if (!current) return;
  if (!current.children) current.children = [];
  current.children.push({ type: 'block', id: blockId, activeWithParent: true });
  onbAddingBlock = false;
  render();
}

function renameCurrentBlock(value) {
  const block = getCurrentBlock();
  if (!block) return;
  block.name = value;
  const warnEl = document.getElementById('blkNameWarn');
  if (warnEl) {
    const dup = value.trim() && blockNameExists(value.trim(), block.id);
    warnEl.style.display = dup ? 'block' : 'none';
  }
}

function updateCurrentBlockDisable() {
  const block = getCurrentBlock();
  if (!block) return;
  if (saveDisableState(block, 'blk')) {
    render();
  }
}

function updateCurrentBlockSchedule() {
  const block = getCurrentBlock();
  if (!block) return;
  const schedType = document.querySelector('input[name="blkSched"]:checked').value;
  const startDate = document.getElementById('blkStart').value || fmt(todayDate());
  const isTop = isTopLevelBlockLocal(block.id);
  let schedule;
  if (schedType === 'delayAfterParent' && isTop) {
    schedule = { type: 'none', startDate };
  } else if (schedType === 'days') {
    const days = [...document.querySelectorAll('.blk-day:checked')].map(el => parseInt(el.value));
    schedule = { type: 'days', days, startDate };
  } else if (schedType === 'interval') {
    const interval = parseInt(document.getElementById('blkIntervalVal').value) || 3;
    schedule = { type: 'interval', interval, startDate };
  } else if (schedType === 'delayAfterParent') {
    const delayDays = parseInt(document.getElementById('blkDelayVal').value) || 2;
    schedule = { type: 'delayAfterParent', delayDays, startDate };
  } else {
    schedule = { type: schedType, startDate };
  }
  block.schedule = schedule;
  render();
}

/* ---------- Child schedule editor ---------- */
function renderChildScheduleEditor(child, prefix, isBlock) {
  const nestedBlock = isBlock ? (onbPlan.blocks || []).find(b => b.id === child.id) : null;
  const schedule = isBlock
    ? (child.scheduleOverride || (nestedBlock && nestedBlock.schedule) || { type: 'none' })
    : (child.schedule || { type: 'none' });
  const activeWithParent = child.activeWithParent !== false;
  const days = schedule.days || [];
  const interval = schedule.interval || 3;
  const delayDays = schedule.delayDays || 2;
  const schedType = schedule.type || 'none';

  const scheduleOptions = [
    ['none', 'Без'],
    ['days', 'Дни'],
    ['interval', 'Раз в N'],
    ['even', 'Чётные'],
    ['odd', 'Нечётные'],
    ['everyday', 'Каждый'],
    ['delayAfterParent', 'Через N после родителя']
  ];

  return `
    <label class="day-chk" style="margin:0 0 8px">
      <input type="checkbox" class="${prefix}-awp" ${activeWithParent ? 'checked' : ''}>
      Активен вместе с материнским
    </label>
    <div style="font-size:12px;color:#888;margin:4px 0">Расписание:</div>
    <div class="form-row" style="gap:8px">
      ${scheduleOptions.map(([val, lbl]) =>
        `<label><input type="radio" name="${prefix}-sched" value="${val}" ${schedType === val ? 'checked' : ''} onchange="updateChildSchedUI('${prefix}','${val}')"> ${lbl}</label>`
      ).join('')}
    </div>
    <div id="${prefix}-days" style="display:${schedType === 'days' ? 'block' : 'none'}">
      ${WEEK_ORDER.map(d => `<label class="day-chk"><input type="checkbox" class="${prefix}-day" value="${d}" ${days.includes(d) ? 'checked' : ''}> ${DAYS[d]}</label>`).join('')}
    </div>
    <div id="${prefix}-interval" style="display:${schedType === 'interval' ? 'block' : 'none'};margin-top:6px">
      <input type="number" class="${prefix}-interval-val" value="${interval}" min="1" placeholder="Раз в N дней" style="width:100%;background:#111;border:1px solid #333;color:#e8e8e8;padding:6px 9px;border-radius:6px;font-size:13px">
    </div>
    <div id="${prefix}-delay" style="display:${schedType === 'delayAfterParent' ? 'block' : 'none'};margin-top:6px">
      <input type="number" class="${prefix}-delay-val" value="${delayDays}" min="1" placeholder="Через N дней после активации родителя" style="width:100%;background:#111;border:1px solid #333;color:#e8e8e8;padding:6px 9px;border-radius:6px;font-size:13px">
    </div>
  `;
}

function updateChildSchedUI(prefix, type) {
  const d = document.getElementById(prefix + '-days');
  const i = document.getElementById(prefix + '-interval');
  const dl = document.getElementById(prefix + '-delay');
  if (d) d.style.display = type === 'days' ? 'block' : 'none';
  if (i) i.style.display = type === 'interval' ? 'block' : 'none';
  if (dl) dl.style.display = type === 'delayAfterParent' ? 'block' : 'none';
}

function readChildSchedule(prefix) {
  const typeEl = document.querySelector(`input[name="${prefix}-sched"]:checked`);
  const type = typeEl ? typeEl.value : 'none';
  const awpEl = document.querySelector(`.${prefix}-awp`);
  const activeWithParent = awpEl ? awpEl.checked : true;
  let schedule = { type };
  if (type === 'days') {
    schedule.days = [...document.querySelectorAll(`.${prefix}-day:checked`)].map(el => parseInt(el.value));
  } else if (type === 'interval') {
    const el = document.querySelector(`.${prefix}-interval-val`);
    schedule.interval = parseInt(el && el.value) || 3;
  } else if (type === 'delayAfterParent') {
    const el = document.querySelector(`.${prefix}-delay-val`);
    schedule.delayDays = parseInt(el && el.value) || 2;
  }
  return { schedule, activeWithParent };
}

/* ---------- Child edit handlers ---------- */
function onEditChild(idx) { editingChildIdx = idx; render(); }
function onCancelChildEdit() { editingChildIdx = null; render(); }
function schedulesMatch(a, b){
  if(!a || !b) return false;
  const at = a.type || 'none';
  const bt = b.type || 'none';
  if(at !== bt) return false;
  if(at === 'days'){
    const ad = (a.days || []).slice().sort().join(',');
    const bd = (b.days || []).slice().sort().join(',');
    return ad === bd;
  }
  if(at === 'interval') return a.interval === b.interval;
  if(at === 'delayAfterParent') return a.delayDays === b.delayDays;
  return true;
}
function onSaveChildEdit(idx) {
  const block = getCurrentBlock();
  if (!block) return;
  const child = block.children[idx];
  if (!child) return;
  const prefix = 'ce' + idx;
  const { schedule, activeWithParent } = readChildSchedule(prefix);
  
  if (!saveDisableState(child, prefix)) return;
  
  // Сохраняем количество подходов
  if (child.type === 'exercise') {
    const setsEl = document.getElementById(prefix + 'Sets');
    if (setsEl) {
      const raw = setsEl.value.trim();
      if (raw === '') {
        delete child.sets; // вернуть дефолт
      } else {
        const val = parseInt(raw, 10);
        if (Number.isFinite(val) && val >= 1 && val <= 20) {
          child.sets = val;
        } else {
          alert('Количество подходов должно быть от 1 до 20');
          return;
        }
      }
    }
  }
  
  child.activeWithParent = activeWithParent;
if (child.type === 'exercise') {
  child.schedule = schedule;
} else {
  const nested = (onbPlan.blocks || []).find(b => b.id === child.id);
  const nestedSched = nested ? nested.schedule : null;
  if(schedule.type === 'none' || schedulesMatch(schedule, nestedSched)){
    child.scheduleOverride = null;   // используем расписание самого подблока
  } else {
    child.scheduleOverride = schedule;
  }
}
  editingChildIdx = null;
  render();
}
function renderDisableSection(prefix, item, isBlock) {
  const currentDis = isCurrentlyDisabled(item);
  const isDis = !!currentDis;
  const disReason = currentDis ? (currentDis.reason || '') : '';
  const disUntil = currentDis ? (currentDis.until || '') : '';
  const disFrom = currentDis ? currentDis.from : '';
  const toggle = `var f=document.getElementById('${prefix}DisFields');f.style.display=this.checked?'block':'none';`;
  return `
    ${isDis ? `<div class="dis-info">
      🚫 Отключено с <strong>${disFrom}</strong>${disUntil ? ` по <strong>${disUntil}</strong>` : ' (бессрочно)'}<br>
      Причина: <strong>${escapeHtml(disReason)}</strong>
    </div>` : ''}
    <div style="font-size:13px;color:#ccc;margin:12px 0 6px;padding-top:10px;border-top:1px solid #2a2a2a">
      <label><input type="checkbox" id="${prefix}DisChk" ${isDis?'checked':''} onchange="${toggle}"> ${isDis ? 'Управлять отключением' : (isBlock ? 'Отключить блок' : 'Отключить упражнение')}</label>
    </div>
    <div id="${prefix}DisFields" style="display:${isDis?'block':'none'}">
      <input type="text" id="${prefix}DisReason" class="form-input" placeholder="Причина (болезнь, травма…)" value="${escapeHtml(disReason)}">
      <div style="font-size:12px;color:#888;margin:4px 0">Отключить до (пусто = бессрочно):</div>
      <input type="date" id="${prefix}DisUntil" class="form-input" value="${disUntil}">
    </div>
  `;
}

function saveDisableState(item, prefix) {
  const willBeDisabled = document.getElementById(`${prefix}DisChk`).checked;
  const reason = document.getElementById(`${prefix}DisReason`).value.trim();
  const until = document.getElementById(`${prefix}DisUntil`).value || null;
  const today = fmt(todayDate());
  const yesterday = fmt(new Date(todayDate().getTime() - 86400000));

  const wasDisabled = !!isCurrentlyDisabled(item);

  let disabled = item.disabled ? JSON.parse(JSON.stringify(item.disabled)) : null;

  if(willBeDisabled && !wasDisabled){
    if(!reason){alert('Укажите причину отключения');return false;}
    if(until && until < today){alert('Дата должна быть не раньше сегодня');return false;}
    const entry = { reason, from: today, until: until };
    if(!disabled) disabled = [];
    if(!Array.isArray(disabled)) disabled = [disabled];
    disabled.push(entry);
  }else if(!willBeDisabled && wasDisabled){
    const arr = Array.isArray(disabled) ? disabled : [disabled];
    disabled = arr.map(p => {
      if(p.from <= today && (!p.until || p.until >= today)){
        if(p.from > yesterday) return null;
        return { ...p, until: yesterday };
      }
      return p;
    }).filter(Boolean);
    if(!disabled.length) disabled = null;
  }else if(willBeDisabled && wasDisabled){
    if(!reason){alert('Укажите причину отключения');return false;}
    if(until && until < today){alert('Дата должна быть не раньше сегодня');return false;}
    const arr = Array.isArray(disabled) ? disabled : [disabled];
    disabled = arr.map(p => {
      if(p.from <= today && (!p.until || p.until >= today)){
        return { ...p, reason, until };
      }
      return p;
    });
  }
  item.disabled = disabled;
  return true;
}
function renderChildEditForm(child, idx) {
  const isBlock = child.type === 'block';
  const name = isBlock
    ? ((onbPlan.blocks || []).find(b => b.id === child.id)?.name || 'блок')
    : (EX[child.id]?.name || 'упражнение');

  let setsInput = '';
if (!isBlock) {
  const ex = EX[child.id];
  if (!ex || !ex.app) {
    const defaultSets = ex ? (ex.sets || 4) : 4;
    const currentSets = (Number.isFinite(child.sets) && child.sets > 0) ? child.sets : defaultSets;
    setsInput = `
      <div style="font-size:12px;color:#888;margin:10px 0 4px">
        Количество подходов (по умолчанию ${defaultSets}, пусто = дефолт):
      </div>
      <input type="number" id="ce${idx}Sets" class="form-input" min="1" max="20"
             value="${currentSets}" placeholder="${defaultSets}">
    `;
  }
}

    return `<div class="child-settings" data-form-anim>
    <div style="font-size:13px;color:#9f9;margin-bottom:8px;font-weight:600">Настройки: ${escapeHtml(name)}</div>
    ${renderChildScheduleEditor(child, 'ce' + idx, isBlock)}
    ${setsInput}
    ${renderDisableSection('ce' + idx, child, isBlock)}
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="mini-btn" style="flex:1" onclick="onCancelChildEdit()">Отмена</button>
      <button class="mini-btn" style="flex:2;background:#2a5a2a;border-color:#3a7a3a" onclick="onSaveChildEdit(${idx})">Сохранить</button>
    </div>
  </div>`;
}

/* ---------- Add exercise logic ---------- */
function attemptAddExercise(){
  let id, newEx = null;
  let overrideSets = null;
  let newMarkers = [];

  if(onbAddType === 'existing'){
  id = addExistingSelectedId;
  if(!id){alert('Выберите упражнение из списка');return false;}
  const selectedEx = EX[id];
  if(!selectedEx || !selectedEx.app){
    const setsEl = document.getElementById('addExistingSets');
    const setsVal = setsEl ? parseInt(setsEl.value) : NaN;
    if(Number.isFinite(setsVal) && setsVal > 0) overrideSets = setsVal;
  }
}else{
    const nameEl = document.getElementById('addNewName');
    if(!nameEl){return false;}
    const name = nameEl.value.trim();
    if(!name){alert('Введите название');return false;}

    const app = document.querySelector('input[name="addNewType"]:checked').value === 'app';
    const loads = getMuscleLoads('addNewMuscle');
    if(!app && Object.keys(loads).length === 0){
      alert('Выберите хотя бы одну мышцу');
      return false;
    }
    const muscles = computePercents(loads);

    const setsEl = document.getElementById('addNewSets');
    const repsEl = document.getElementById('addNewReps');
    const sets = setsEl ? (parseInt(setsEl.value)||4) : 4;
    const reps = repsEl ? (repsEl.value.trim()||'12-15') : '12-15';
    const markersEl = document.getElementById('addNewMarkers');
    newMarkers = parseMarkers(markersEl ? markersEl.value : '');
    id = 'c' + Date.now().toString(36);
    const wModeEl = document.querySelector('input[name="addNewWeightMode"]:checked');
const weightMode = wModeEl ? wModeEl.value : 'total';
newEx = { id, name, app, sets, reps, muscles, loads, schedule: { type: 'none' }, weightMode };
  }

  // Подтверждение только если дубликат в ТОМ ЖЕ контейнере
  if (blockEditPath.length) {
    const block = getCurrentBlock();
    if (!block) return false;
    const dup = (block.children || []).some(c => c.type === 'exercise' && c.id === id);
    if (dup && !confirm('Это упражнение уже есть в этом блоке. Добавить ещё раз?')) return false;
  } else {
    if (onbPlan.items.some(it => it.id === id) &&
        !confirm('Это упражнение уже есть в плане. Добавить ещё раз?')) return false;
  }

  // Создать кастомное упражнение при необходимости
  if (newEx) {
    const list = customStore.list;
    list.push(newEx);
    customStore.list = list;
    syncCustomEx();
    if (newMarkers.length) setExerciseMarkers(id, newMarkers);
  }

  // Добавить в план
  if (blockEditPath.length) {
    const block = getCurrentBlock();
    if (block) {
      block.children = block.children || [];
      const child = { type: 'exercise', id, activeWithParent: true, schedule: { type: 'none' } };
      if (overrideSets) child.sets = overrideSets;
      try {
        const { schedule, activeWithParent } = readChildSchedule('addChildSched');
        child.schedule = schedule;
        child.activeWithParent = activeWithParent;
      } catch(e) {}
      block.children.push(child);
    }
  } else {
    const startEl = document.getElementById('addStart');
    const startDate = (startEl && startEl.value) || fmt(todayDate());
    let schedule;
    if (onbAddSchedType === 'days') {
      const days = [...document.querySelectorAll('.add-day:checked')].map(el => parseInt(el.value));
      if (!days.length) { alert('Выберите хотя бы один день'); return false; }
      schedule = { type: 'days', days, startDate };
    } else if (onbAddSchedType === 'interval') {
      const intEl = document.getElementById('addInterval');
      schedule = { type: 'interval', interval: parseInt(intEl && intEl.value) || 3, startDate };
    } else {
      schedule = { type: onbAddSchedType, startDate };
    }
    const newItem = { id, schedule, disabled: null };
    if (overrideSets) newItem.sets = overrideSets;
    onbPlan.items.push(newItem);
  }

  return true;
}

function onbShowAdd(){
  onbAdding = true;
  onbEditingIdx = null;
  onbAddingBlock = false;
  editingChildIdx = null;
  onbAddType = 'existing';
  onbAddSchedType = 'days';
  addExistingSelectedId = '';
  render();
  setTimeout(() => {
    const s = document.getElementById('addExistingSearch');
    if(s) s.focus();
  }, 50);
}
function onbCancelAdd(){onbAdding = false;render()}
function onbSetAddType(t){
  onbAddType = t;
  document.getElementById('addExistingBlock').style.display = t === 'existing' ? 'block' : 'none';
  document.getElementById('addNewBlock').style.display = t === 'new' ? 'block' : 'none';
  if(t === 'existing'){
    updateAddExistingPreview();
  }
}
function onbSetSched(t){
  onbAddSchedType = t;
  document.getElementById('addDaysBlock').style.display = t === 'days' ? 'block' : 'none';
  document.getElementById('addIntervalBlock').style.display = t === 'interval' ? 'block' : 'none';
}

function getExSearchInfo(exId, ex){
  const muscleNames = [];
  const sectionSet = new Set();
  Object.keys(ex.muscles || {}).forEach(mid => {
    const m = MUSCLE_BY_ID[mid];
    if(m) muscleNames.push(m.name);
    const sec = MUSCLE_SECTION[mid];
    if(sec) sectionSet.add(sec.name);
  });
  const markers = exId ? getExerciseMarkers(exId) : [];
  return { muscleNames, sectionNames: [...sectionSet], markers };
}

function matchExercise(exId, ex, q){
  const info = getExSearchInfo(exId, ex);
  if(!q) return { ok: true, byName: false, byMuscle: false, bySection: false, byMarker: false, info };
  const ql = q.toLowerCase();
  const byName = ex.name.toLowerCase().includes(ql);
  const byMuscle = info.muscleNames.some(m => m.toLowerCase().includes(ql));
  const bySection = info.sectionNames.some(s => s.toLowerCase().includes(ql));
  const byMarker = info.markers.some(m => m.toLowerCase().includes(ql));
  return { ok: byName || byMuscle || bySection || byMarker, byName, byMuscle, bySection, byMarker, info };
}

function highlightMatch(text, q, color){
  if(!q) return escapeHtml(text);
  const ql = q.toLowerCase();
  const lower = text.toLowerCase();
  let result = '';
  let i = 0;
  while(true){
    const idx = lower.indexOf(ql, i);
    if(idx < 0){ result += escapeHtml(text.slice(i)); break; }
    result += escapeHtml(text.slice(i, idx));
    result += `<span style="background:${color}33;color:${color};border-radius:2px;padding:0 1px">${escapeHtml(text.slice(idx, idx + ql.length))}</span>`;
    i = idx + ql.length;
  }
  return result;
}

function renderAddExistingRow(id, name, isSel, q, match){
  const bg = isSel ? '#1a3a1a' : '#141414';
  const bd = isSel ? '#4a7a4a' : '#262626';
  const fg = isSel ? '#9f9' : '#ddd';
  const nameHtml = (match && match.byName) ? highlightMatch(name, q, '#f0c860') : escapeHtml(name);

  let infoLine = '';
  if(match && match.info){
    const { muscleNames, sectionNames, markers } = match.info;
    const ql = q ? q.toLowerCase() : '';
    const parts = [];
    if(muscleNames.length){
      parts.push(muscleNames.map(mn => {
        if(ql && match.byMuscle && mn.toLowerCase().includes(ql)){
          return `<span style="background:#7cc0e833;color:#7cc0e8;border-radius:2px;padding:0 2px">${escapeHtml(mn)}</span>`;
        }
        return escapeHtml(mn);
      }).join(', '));
    }
    if(sectionNames.length){
      const secHtml = sectionNames.map(sn => {
        if(ql && match.bySection && sn.toLowerCase().includes(ql)){
          return `<span style="background:#c090e033;color:#c090e0;border-radius:2px;padding:0 2px">${escapeHtml(sn)}</span>`;
        }
        return escapeHtml(sn);
      }).join(', ');
      parts.push(`<span style="color:#555">·</span> ${secHtml}`);
    }
    if(parts.length){
      infoLine += `<div style="font-size:10.5px;color:#6a6a6a;margin-top:3px;line-height:1.35">${parts.join(' ')}</div>`;
    }
    if(markers && markers.length){
      infoLine += `<div style="margin-top:3px">${markersChipsHtml(markers, q)}</div>`;
    }
  }

  return `<div onclick="selectAddExisting('${id}')" data-id="${id}"
    style="padding:8px 11px;background:${bg};border:1px solid ${bd};border-radius:5px;margin-bottom:4px;cursor:pointer;font-size:13px;line-height:1.3;color:${fg}">
    <div><span class="check-mark" style="display:${isSel ? 'inline' : 'none'}">✓ </span>${nameHtml}</div>
    ${infoLine}
  </div>`;
}

function updateAddExistingPreview(){
  const el = document.getElementById('addExistingPreview');
  if(!el) return;
  const ex = addExistingSelectedId ? EX[addExistingSelectedId] : null;
  const summary = ex ? muscleSummary(ex.muscles) : '';
  const markers = addExistingSelectedId ? getExerciseMarkers(addExistingSelectedId) : [];
  let html = '';
  if(summary) html += '✓ ' + escapeHtml(summary);
  if(markers.length){
    if(html) html += '<br>';
    html += markersChipsHtml(markers);
  }
  el.innerHTML = html;
  el.style.color = ex ? '#6ab06a' : '#888';
  const setsWrapper = document.getElementById('addExistingSetsWrapper');
if(setsWrapper){
  setsWrapper.style.display = (ex && ex.app) ? 'none' : 'block';
}
}

function filterAddExistingList(){
  const search = document.getElementById('addExistingSearch');
  const list   = document.getElementById('addExistingList');
  const count  = document.getElementById('addExistingCount');
  if(!search || !list) return;

  const q = search.value.trim();
  const results = [];
  sortedExerciseEntries().forEach(([id, ex]) => {
    const m = matchExercise(id, ex, q);
    if(m.ok) results.push({ id, ex, match: m });
  });

  if(count){
    if(!q) count.textContent = `Всего упражнений: ${results.length}`;
    else if(!results.length) count.textContent = 'Ничего не найдено';
    else if(results.length === 1) count.textContent = '1 совпадение';
    else count.textContent = `Найдено: ${results.length}`;
  }

  if(!results.length){
    list.innerHTML = '<div style="padding:14px;color:#666;font-size:13px;text-align:center">Ничего не найдено</div>';
    addExistingSelectedId = '';
    updateAddExistingPreview();
    return;
  }

  if(results.length === 1){
    addExistingSelectedId = results[0].id;
  } else if(addExistingSelectedId && !results.some(r => r.id === addExistingSelectedId)){
    addExistingSelectedId = '';
  }

  list.innerHTML = results.map(r =>
    renderAddExistingRow(r.id, r.ex.name, r.id === addExistingSelectedId, q, r.match)
  ).join('');

  updateAddExistingPreview();
}

function selectAddExisting(id){
  addExistingSelectedId = id;
  const list = document.getElementById('addExistingList');
  if(list){
    list.querySelectorAll('div[data-id]').forEach(row => {
      const rowId = row.dataset.id;
      const isSel = rowId === id;
      row.style.background = isSel ? '#1a3a1a' : '#141414';
      row.style.borderColor = isSel ? '#4a7a4a' : '#262626';
      row.style.color = isSel ? '#9f9' : '#ddd';
      const check = row.querySelector('.check-mark');
      if(check) check.style.display = isSel ? 'inline' : 'none';
    });
  }
  updateAddExistingPreview();
}
function movePlanItem(idx, dir){
  const j = idx + dir;
  if(j < 0 || j >= onbPlan.items.length) return;
  const tmp = onbPlan.items[idx];
  onbPlan.items[idx] = onbPlan.items[j];
  onbPlan.items[j] = tmp;
  render();
}

function moveChild(idx, dir){
  const block = getCurrentBlock();
  if(!block || !block.children) return;
  const j = idx + dir;
  if(j < 0 || j >= block.children.length) return;
  const tmp = block.children[idx];
  block.children[idx] = block.children[j];
  block.children[j] = tmp;
  render();
}
function startMoveItem(itemIdx){
  moveState = { fromType: 'item', fromIdx: itemIdx };
  renderMoveModal();
}

function startMoveChild(childIdx){
  const block = getCurrentBlock();
  if(!block) return;
  moveState = { fromType: 'child', fromIdx: childIdx, fromBlockId: block.id };
  renderMoveModal();
}

function renderMoveModal(){
  if(!moveState) return;
  const old = document.getElementById('move-modal');
  if(old) old.remove();

  const targets = [{ id: '__top__', name: 'Верхний уровень плана' }];
  (onbPlan.blocks || []).forEach(b => {
    targets.push({ id: b.id, name: '📦 ' + b.name });
  });

  document.body.insertAdjacentHTML('beforeend', `
    <div id="move-modal" onclick="if(event.target===this)closeMoveModal()" style="position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:1000;display:flex;align-items:flex-end;justify-content:center">
      <div onclick="event.stopPropagation()" style="background:#1a1a1a;border:1px solid #333;border-radius:12px 12px 0 0;width:100%;max-width:600px;max-height:85vh;overflow-y:auto;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px))">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <strong>Куда переместить?</strong>
          <button onclick="closeMoveModal()" style="background:transparent;border:none;color:#888;font-size:22px;cursor:pointer;padding:0 6px;line-height:1">×</button>
        </div>
        ${targets.map(t => `<button onclick="doMove('${t.id}')" style="display:block;width:100%;text-align:left;padding:10px;margin-bottom:6px;background:#141414;border:1px solid #262626;border-radius:6px;color:#ddd;font-size:13px;cursor:pointer">${escapeHtml(t.name)}</button>`).join('')}
      </div>
    </div>
  `);
}

function closeMoveModal(){
  const m = document.getElementById('move-modal');
  if(m) m.remove();
  moveState = null;
}

function doMove(targetId){
  if(!moveState) return;

  // 1. Забираем элемент из источника
  let child = null;
  if(moveState.fromType === 'item'){
    child = onbPlan.items[moveState.fromIdx];
    if(!child){ closeMoveModal(); return; }
    onbPlan.items.splice(moveState.fromIdx, 1);
  } else {
    const src = (onbPlan.blocks || []).find(b => b.id === moveState.fromBlockId);
    if(!src){ closeMoveModal(); return; }
    child = (src.children || [])[moveState.fromIdx];
    if(!child){ closeMoveModal(); return; }
    src.children.splice(moveState.fromIdx, 1);
  }

  // 2. Кладём в цель
  if(targetId === '__top__'){
    if(child.type !== 'exercise'){
      alert('Перемещение блоков пока не поддерживается');
      closeMoveModal();
      return;
    }
    const item = { id: child.id, schedule: child.schedule || { type: 'none' }, disabled: child.disabled || null };
    if(child.sets) item.sets = child.sets;
    onbPlan.items.push(item);
  } else {
    const target = (onbPlan.blocks || []).find(b => b.id === targetId);
    if(!target){ closeMoveModal(); return; }
    if(moveState.fromType === 'child' && moveState.fromBlockId === targetId){
      alert('Уже в этом блоке');
      closeMoveModal();
      return;
    }
    target.children = target.children || [];
    if(target.children.some(c => c.type === 'exercise' && c.id === child.id)){
      alert('Это упражнение уже в целевом блоке');
      closeMoveModal();
      return;
    }
    if(child.type === 'exercise'){
      target.children.push(child);
    } else {
      const newChild = { type: 'exercise', id: child.id, activeWithParent: true, schedule: child.schedule || { type: 'none' } };
      if(child.sets) newChild.sets = child.sets;
      if(child.disabled) newChild.disabled = child.disabled;
      target.children.push(newChild);
    }
  }

  closeMoveModal();
  render();
}
function onbRemoveItem(idx){
  const item = onbPlan.items[idx];
  const ex = item ? EX[item.id] : null;
  const name = ex ? ex.name : 'упражнение';
  if(!confirm(`Удалить «${name}» из плана?`)) return;
  onbPlan.items.splice(idx, 1);
  onbEditingIdx = null;
  render();
}
function onbShowEdit(idx){
  onbEditingIdx = idx;
  onbAdding = false;
  onbAddingBlock = false;
  editingChildIdx = null;
  render();
}
function onbCancelEdit(){
  onbEditingIdx = null;
  render();
}
function onbSaveEdit(idx){
  const item = onbPlan.items[idx];
  if(!item) return;

  const schedType = document.querySelector('input[name="peSched"]:checked').value;
  const startDate = document.getElementById('peStart').value || fmt(todayDate());
  let schedule;
  if(schedType === 'days'){
    const days = [...document.querySelectorAll('.pe-day:checked')].map(el => parseInt(el.value));
    if(!days.length){alert('Выберите хотя бы один день');return}
    schedule = { type:'days', days, startDate };
  }else if(schedType === 'interval'){
    schedule = { type:'interval', interval: parseInt(document.getElementById('peIntervalVal').value)||3, startDate };
  }else{
    schedule = { type:schedType, startDate };
  }

  const wasDisabled = !!isCurrentlyDisabled(item);
  const willBeDisabled = document.getElementById('peDisChk').checked;
  const reason = document.getElementById('peDisReason').value.trim();
  const until = document.getElementById('peDisUntil').value || null;
  const today = fmt(todayDate());
  const yesterday = fmt(new Date(todayDate().getTime() - 86400000));

  let disabled = item.disabled ? JSON.parse(JSON.stringify(item.disabled)) : null;

  if(willBeDisabled && !wasDisabled){
    if(!reason){alert('Укажите причину отключения');return}
    if(until && until < today){alert('Дата должна быть не раньше сегодня');return}
    const entry = { reason, from: today, until: until };
    if(!disabled) disabled = [];
    disabled.push(entry);
  }else if(!willBeDisabled && wasDisabled){
    const arr = Array.isArray(disabled) ? disabled : [disabled];
    disabled = arr.map(p => {
      if(p.from <= today && (!p.until || p.until >= today)){
        if(p.from > yesterday) return null;
        return { ...p, until: yesterday };
      }
      return p;
    }).filter(Boolean);
    if(!disabled.length) disabled = null;
  }else if(willBeDisabled && wasDisabled){
    if(!reason){alert('Укажите причину отключения');return}
    if(until && until < today){alert('Дата должна быть не раньше сегодня');return}
    const arr = Array.isArray(disabled) ? disabled : [disabled];
    disabled = arr.map(p => {
      if(p.from <= today && (!p.until || p.until >= today)){
        return { ...p, reason, until };
      }
      return p;
    });
  }

  const setsEl = document.getElementById('peSets');
  const setsVal = setsEl ? parseInt(setsEl.value) : NaN;
  const newItem = { ...item, schedule, disabled };
  if(Number.isFinite(setsVal) && setsVal > 0) newItem.sets = setsVal;
  else delete newItem.sets;
  onbPlan.items[idx] = newItem;
  onbEditingIdx = null;
  render();
}
function updateAddNewMuscleLabel() {
  const typeEl = document.querySelector('input[name="addNewType"]:checked');
  const labelEl = document.getElementById('addNewMusclesLabel');
  if (typeEl && labelEl) {
    if (typeEl.value === 'app') {
      labelEl.textContent = 'Мышцы (необязательно для приложений):';
    } else {
      labelEl.textContent = 'Мышцы (обязательно хотя бы одна):';
    }
  }
}
function renderAddForm(){
  const isBlockContext = blockEditPath.length > 0;
  const daysChecks = WEEK_ORDER.map(d =>
    `<label class="day-chk"><input type="checkbox" class="add-day" value="${d}"> ${DAYS[d]}</label>`
  ).join('');

  let childScheduleSection = '';
  if(isBlockContext){
    childScheduleSection = `
      <div style="font-size:12px;color:#888;margin:10px 0 4px;padding-top:8px;border-top:1px solid #2a2a2a">Настройки для этого блока:</div>
      ${renderChildScheduleEditor({type:'exercise', id:'', activeWithParent:true, schedule:{type:'none'}}, 'addChildSched', false)}
    `;
  }

  const scheduleSection = isBlockContext ? '' : `
    <div style="font-size:13px;color:#ccc;margin:10px 0 6px">Расписание:</div>
    <div class="form-row">
      <label><input type="radio" name="addSched" value="days" ${onbAddSchedType==='days'?'checked':''} onchange="onbSetSched('days')"> Дни недели</label>
      <label><input type="radio" name="addSched" value="interval" ${onbAddSchedType==='interval'?'checked':''} onchange="onbSetSched('interval')"> Раз в N</label>
      <label><input type="radio" name="addSched" value="even" ${onbAddSchedType==='even'?'checked':''} onchange="onbSetSched('even')"> Чётные</label>
      <label><input type="radio" name="addSched" value="odd" ${onbAddSchedType==='odd'?'checked':''} onchange="onbSetSched('odd')"> Нечётные</label>
      <label><input type="radio" name="addSched" value="everyday" ${onbAddSchedType==='everyday'?'checked':''} onchange="onbSetSched('everyday')"> Каждый день</label>
    </div>
    <div id="addDaysBlock" style="display:${onbAddSchedType==='days'?'block':'none'}">${daysChecks}</div>
    <div id="addIntervalBlock" style="display:${onbAddSchedType==='interval'?'block':'none'}">
      <input type="number" id="addInterval" class="form-input" value="3" min="1" placeholder="Раз в N дней">
    </div>
    <div style="font-size:12px;color:#888;margin:6px 0 4px">Начиная с:</div>
    <input type="date" id="addStart" class="form-input" value="${fmt(todayDate())}">
  `;

    return `
    <div class="ex" data-form-anim style="margin-top:10px">
      <div class="form-row">
        <label><input type="radio" name="addType" value="existing" ${onbAddType==='existing'?'checked':''} onchange="onbSetAddType('existing')"> Существующее</label>
        <label><input type="radio" name="addType" value="new" ${onbAddType==='new'?'checked':''} onchange="onbSetAddType('new')"> Новое</label>
      </div>
      <div id="addExistingBlock" style="display:${onbAddType==='existing'?'block':'none'}">
        <input type="text" id="addExistingSearch" class="form-input"
               placeholder="Поиск: название, метка, мышца…" autocomplete="off"
               oninput="filterAddExistingList()">
        <div id="addExistingCount" style="color:#6ab0ff;font-size:12px;margin:-2px 0 6px"></div>
        <div id="addExistingList" style="max-height:320px;overflow-y:auto;margin-bottom:8px">
          ${sortedExerciseEntries().map(([id, ex]) => {
            const m = matchExercise(id, ex, '');
            return renderAddExistingRow(id, ex.name, id === addExistingSelectedId, '', m);
          }).join('')}
        </div>
        <div id="addExistingPreview" class="ex-last" style="margin-top:-4px;color:#888"></div>
        <div id="addExistingSetsWrapper" style="margin-top:8px;display:${(EX[addExistingSelectedId] && EX[addExistingSelectedId].app) ? 'none' : 'block'}">
  <div style="font-size:12px;color:#888;margin:6px 0 4px">Количество подходов (пусто = по умолчанию):</div>
  <input type="number" id="addExistingSets" class="form-input" min="1" max="20" placeholder="напр. 4">
</div>
      </div>
      <div id="addNewBlock" style="display:${onbAddType==='new'?'block':'none'}">
        <input type="text" id="addNewName" class="form-input" placeholder="Название упражнения">
        <div class="form-row">
          <label><input type="radio" name="addNewType" value="sets" checked onchange="document.getElementById('addNewSetsBlock').style.display='block'; updateAddNewMuscleLabel()"> Подходы</label>
          <label><input type="radio" name="addNewType" value="app" onchange="document.getElementById('addNewSetsBlock').style.display='none'; updateAddNewMuscleLabel()"> По приложению</label>
        </div>
        <div id="addNewSetsBlock">
          <input type="number" id="addNewSets" class="form-input" value="4" min="1" placeholder="Количество подходов">
          <input type="text" id="addNewReps" class="form-input" value="12-15" placeholder="Повторения">
          <div style="font-size:12px;color:#888;margin:8px 0 4px">Как вы вводите вес?</div>
<div class="form-row" style="flex-direction:column;gap:6px;align-items:flex-start">
  <label><input type="radio" name="addNewWeightMode" value="total" checked> Общий вес снаряда (машина, блин, стек)</label>
  <label><input type="radio" name="addNewWeightMode" value="both"> Общий вес на обе стороны (штанга, 2 гантели)</label>
  <label><input type="radio" name="addNewWeightMode" value="one"> На одну руку/ногу/сторону (одна гантель)</label>
  <label><input type="radio" name="addNewWeightMode" value="bodyweight"> Свой вес (без веса или доп. отягощение)</label>
</div>
<div style="font-size:11px;color:#777;margin-top:4px">
  «На одну сторону» умножается на 2 при расчёте усталости.
</div>
        </div>
        <div style="font-size:12px;color:#888;margin:8px 0 4px">Метки (через запятую, необязательно):</div>
        <input type="text" id="addNewMarkers" class="form-input" placeholder="напр. база, жим, домашние">
        <div id="addNewMusclesLabel" style="font-size:12px;color:#888;margin:8px 0 4px">Мышцы (обязательно хотя бы одна):</div>
        ${renderMusclePicker({},'addNewMuscle')}
      </div>
      ${childScheduleSection}
      ${scheduleSection}
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="mini-btn" style="flex:1" onclick="onbCancelAdd()">Отмена</button>
        <button class="mini-btn" style="flex:2;background:#2a5a2a;border-color:#3a7a3a" onclick="onbConfirmAdd()">Добавить</button>
      </div>
    </div>`;
}
function onbConfirmAdd(){
  if(attemptAddExercise()){
    onbAdding = false;
    render();
  }
}

function renderPlanEditForm(item, idx){
  const ex = EX[item.id];
  if(!ex) return '';
  const sched = item.schedule || {};
  const schedType = sched.type || 'days';
  const days = sched.days || [];
  const interval = sched.interval || 3;
  const startDate = sched.startDate || fmt(todayDate());
  const plannedSets = (Number.isFinite(item.sets) && item.sets > 0) ? item.sets : (ex.sets || 4);
  const currentDis = isCurrentlyDisabled(item);
  const isDis = !!currentDis;
  const disReason = currentDis ? (currentDis.reason || '') : '';
  const disUntil = currentDis ? (currentDis.until || '') : '';
  const disFrom = currentDis ? currentDis.from : '';
  const msum = muscleSummary(ex.muscles);

  const toggle = `var f=document.getElementById('peDisFields');f.style.display=this.checked?'block':'none';`;
  const schedToggle = `var d=document.getElementById('peDays'),i=document.getElementById('peInterval');`;

    return `<div class="ex" data-form-anim style="border-color:#3a5a3a;background:#152515;margin-top:6px;margin-bottom:8px">
    <div style="font-size:13px;color:#9f9;margin-bottom:8px;font-weight:600">Редактирование: ${escapeHtml(ex.name)}</div>
    ${msum ? `<div class="psched" style="color:#666;margin-bottom:8px;font-size:11.5px">${escapeHtml(msum)}</div>` : ''}
    ${renderMarkerCells(item.id, {marginTop: false})}

    <div style="font-size:12px;color:#888;margin:8px 0 4px">Расписание:</div>
    <div class="form-row">
      <label><input type="radio" name="peSched" value="days" ${schedType==='days'?'checked':''} onchange="${schedToggle}d.style.display='block';i.style.display='none'"> Дни</label>
      <label><input type="radio" name="peSched" value="interval" ${schedType==='interval'?'checked':''} onchange="${schedToggle}d.style.display='none';i.style.display='block'"> Раз в N</label>
      <label><input type="radio" name="peSched" value="even" ${schedType==='even'?'checked':''} onchange="${schedToggle}d.style.display='none';i.style.display='none'"> Чётные</label>
      <label><input type="radio" name="peSched" value="odd" ${schedType==='odd'?'checked':''} onchange="${schedToggle}d.style.display='none';i.style.display='none'"> Нечётные</label>
      <label><input type="radio" name="peSched" value="everyday" ${schedType==='everyday'?'checked':''} onchange="${schedToggle}d.style.display='none';i.style.display='none'"> Каждый день</label>
    </div>
    <div id="peDays" style="display:${schedType==='days'?'block':'none'}">
      ${WEEK_ORDER.map(d=>`<label class="day-chk"><input type="checkbox" class="pe-day" value="${d}" ${days.includes(d)?'checked':''}> ${DAYS[d]}</label>`).join('')}
    </div>
    <div id="peInterval" style="display:${schedType==='interval'?'block':'none'}">
      <input type="number" id="peIntervalVal" class="form-input" value="${interval}" min="1">
    </div>

    ${ex.app ? '' : `<div style="font-size:12px;color:#888;margin:6px 0 4px">Количество подходов:</div>
<input type="number" id="peSets" class="form-input" min="1" max="20" value="${plannedSets}">`}
    <div style="font-size:12px;color:#888;margin:6px 0 4px">Начиная с:</div>
    <input type="date" id="peStart" class="form-input" value="${startDate}">

    ${isDis ? `<div class="dis-info">
      🚫 Отключено с <strong>${disFrom}</strong>${disUntil ? ` по <strong>${disUntil}</strong>` : ' (бессрочно)'}<br>
      Причина: <strong>${escapeHtml(disReason)}</strong>
    </div>` : ''}

    <div style="font-size:13px;color:#ccc;margin:12px 0 6px;padding-top:10px;border-top:1px solid #2a2a2a">
      <label><input type="checkbox" id="peDisChk" ${isDis?'checked':''} onchange="${toggle}"> ${isDis ? 'Управлять отключением' : 'Отключить упражнение'}</label>
    </div>
    <div id="peDisFields" style="display:${isDis?'block':'none'}">
      <input type="text" id="peDisReason" class="form-input" placeholder="Причина (болезнь, травма…)" value="${escapeHtml(disReason)}">
      <div style="font-size:12px;color:#888;margin:4px 0">Отключить до (пусто = бессрочно):</div>
      <input type="date" id="peDisUntil" class="form-input" value="${disUntil}">
    </div>

    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="mini-btn" style="flex:1" onclick="onbCancelEdit()">Отмена</button>
      <button class="mini-btn" style="flex:2;background:#2a5a2a;border-color:#3a7a3a" onclick="onbSaveEdit(${idx})">Сохранить</button>
    </div>
  </div>`;
}

/* ---------- Render helpers ---------- */
function renderBreadcrumb() {
  if (!blockEditPath.length) return '';
  let html = '<div class="breadcrumb">';
  html += `<span class="bc-item" onclick="goToBreadcrumb(0)">План</span>`;
  for (let i = 0; i < blockEditPath.length; i++) {
    const id = blockEditPath[i];
    const block = (onbPlan.blocks || []).find(b => b.id === id);
    if (!block) continue;
    html += ` <span class="bc-sep">›</span> `;
    if (i === blockEditPath.length - 1) {
      html += `<span class="bc-current">${escapeHtml(block.name)}</span>`;
    } else {
      html += `<span class="bc-item" onclick="goToBreadcrumb(${i + 1})">${escapeHtml(block.name)}</span>`;
    }
  }
  html += '</div>';
  return html;
}

function renderPlanItems() {
  const items = onbPlan.items;
  if(!items.length){
    return `<div class="ex" style="color:#777;font-size:13px">Пока пусто — добавьте первое упражнение</div>`;
  }
    let html = '';
  const occ = {};
  items.forEach((item, idx) => {
    const ex = EX[item.id];
    if(!ex) return;
    occ[item.id] = (occ[item.id] || 0) + 1;
    const flipKey = `plan:${item.id}:${occ[item.id]}`;
    if(onbEditingIdx === idx){
      html += renderPlanEditForm(item, idx);
      return;
    }
    const dis = isCurrentlyDisabled(item);
    const plannedSets = (Number.isFinite(item.sets) && item.sets > 0) ? item.sets : (ex.sets || 4);
const setsLabel = ex.app
  ? 'по приложению'
  : `${plannedSets} ${plannedSets===1?'подход':(plannedSets<5?'подхода':'подходов')}`;
    const badge = dis ? `<span class="pbadge">отменено</span>` : '';
    const msum = muscleSummary(ex.muscles);
    const mus = msum ? `<div class="psched" style="color:#666">${escapeHtml(msum)}</div>` : '';
    const extra = dis ? `<div class="psched" style="color:#c66">🚫 ${escapeHtml(dis.reason)}${dis.until ? ` (до ${dis.until})` : ''}</div>` : '';
       html += `<div class="plan-item ${dis?'disabled':''}" data-flip-key="${flipKey}">
      <div style="flex:1;min-width:0">
        <div class="pname">${escapeHtml(ex.name)}${badge}</div>
        <div class="psched">${scheduleSummary(item.schedule)} · ${setsLabel}</div>
        ${mus}
        ${renderMarkerChipsOnly(item.id)}
        ${extra}
      </div>
      <button class="pdel" onclick="startMoveItem(${idx})" title="Переместить">⇄</button>
      <button class="pdel" onclick="movePlanItem(${idx},-1)" ${idx===0?'disabled style="opacity:0.3"':''} title="Выше">↑</button>
<button class="pdel" onclick="movePlanItem(${idx},1)" ${idx===items.length-1?'disabled style="opacity:0.3"':''} title="Ниже">↓</button>
      <button class="pdel" style="color:#6ab0ff" onclick="onbShowEdit(${idx})" title="Редактировать">✎</button>
      <button class="pdel" onclick="onbRemoveItem(${idx})" title="Удалить">✕</button>
    </div>`;
  });
  return html;
}

function renderPlanBlocks() {
  const topBlocks = getTopLevelBlocksLocal();
  if (!topBlocks.length) {
    return `<div class="ex" style="color:#777;font-size:13px">Пока пусто — создайте первый блок</div>`;
  }
  let html = `<h2>Блоки (${topBlocks.length})</h2>`;
  topBlocks.forEach(block => {
    const dis = isCurrentlyDisabled(block);
    const badge = dis ? `<span class="pbadge">отменено</span>` : '';
    const exCount = getBlockExercises(block, onbPlan.blocks || []).length;
    html += `<div class="plan-item ${dis?'disabled':''}">
      <div style="flex:1;min-width:0">
        <div class="pname">📦 ${escapeHtml(block.name)}${badge}</div>
        <div class="psched">${scheduleSummary(block.schedule)} · ${exCount} ${exCount===1?'упражнение':(exCount<5?'упражнения':'упражнений')}</div>
        ${dis ? `<div class="psched" style="color:#c66">🚫 ${escapeHtml(dis.reason)}${dis.until ? ` (до ${dis.until})` : ''}</div>` : ''}
      </div>
      <button class="pdel" style="color:#6ab0ff" onclick="enterBlock('${block.id}')" title="Открыть">✎</button>
      <button class="pdel" onclick="deleteBlockById('${block.id}')" title="Удалить">✕</button>
    </div>`;
  });
  return html;
}
function toggleBlockSchedulePreview(blockId){
  schedulePreviewBlockId = (schedulePreviewBlockId === blockId) ? null : blockId;
  render();
}
function blockHasExercisesOn(block, date, allBlocks, visited, forceActive){
  if(!block) return false;
  visited = visited || new Set();
  if(visited.has(block.id)) return false;
  visited.add(block.id);

  const dateStr = fmt(date);
  if(isDisabledOn(block, dateStr)) return false;

  const blockActive = forceActive ? true : isScheduleActive(block.schedule, date);

  for(const child of (block.children || [])){
    const childActive = isChildEntryActive(child, date, block, blockActive, allBlocks);
    if(!childActive) continue;
    if(isDisabledOn(child, dateStr)) continue;

    if(child.type === 'exercise'){
      if(EX[child.id]) return true;
    } else if(child.type === 'block'){
      const nested = getBlockById(allBlocks, child.id);
      if(!nested) continue;
      if(blockHasExercisesOn(nested, date, allBlocks, visited, true)) return true;
    }
  }
  return false;
}
function renderBlockSchedulePreview(block){
  if(!block) return '';

  const weeksToShow = 2;
  const dayShort = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const today = todayDate();
  const todayStr = fmt(today);
  const dow = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(monday.getDate() - dow);

  const allBlocks = onbPlan.blocks || [];

  // Компактная рамка вокруг всей сетки
  let html = `<div style="margin-top:8px;padding:8px;background:#111;border:1px solid #262626;border-radius:8px;max-width:340px">`;

  // Шапка
  html += `<div style="display:grid;grid-template-columns:30px repeat(7,1fr);gap:2px;margin-bottom:2px">`;
  html += `<div></div>`;
  dayShort.forEach(d => {
    html += `<div style="text-align:center;font-size:10px;color:#888;font-weight:600">${d}</div>`;
  });
  html += `</div>`;

  for(let w = 0; w < weeksToShow; w++){
    const rowStart = new Date(monday);
    rowStart.setDate(rowStart.getDate() + w * 7);
    const label = rowStart.getDate() + '.' + String(rowStart.getMonth()+1).padStart(2,'0');

    html += `<div style="display:grid;grid-template-columns:30px repeat(7,1fr);gap:2px;margin-bottom:2px">`;
    html += `<div style="font-size:9.5px;color:#666;align-self:center">${label}</div>`;

    for(let d = 0; d < 7; d++){
      const cur = new Date(monday);
      cur.setDate(cur.getDate() + w * 7 + d);
      const curStr = fmt(cur);

      const blockDis = isDisabledOn(block, curStr);
      const blockActive = !blockDis && isScheduleActive(block.schedule, cur);
      const hasEx = blockHasExercisesOn(block, cur, allBlocks, new Set(), false);
      const isToday = curStr === todayStr;

      let bg, fg, bd;
      if(blockActive && hasEx){
        // Блок работает — упражнения есть
        bg = '#2a5a2a'; fg = '#9f9'; bd = '1px solid #3a7a3a';
      } else if(blockActive && !hasEx){
        // Блок работает, но упражнений в этот день нет
        bg = '#1a2a1a'; fg = '#5a8a5a'; bd = '1px solid #2a4a2a';
      } else if(!blockActive && hasEx){
        // Блок сам не работает, но независимые дети активны
        bg = '#1a3a5a'; fg = '#7cc0e8'; bd = '1px solid #3a7ac0';
      } else {
        // Тишина
        bg = '#1a1a1a'; fg = '#555'; bd = '1px solid #262626';
      }

      if(isToday) bd = '2px solid #e8c44d';

      html += `<div style="padding:3px 1px;text-align:center;background:${bg};color:${fg};border:${bd};border-radius:3px;font-size:11px;${isToday?'font-weight:600':''}" title="${curStr}">${cur.getDate()}</div>`;
    }

    html += `</div>`;
  }

  // Компактная легенда
  html += `<div style="display:flex;gap:10px;flex-wrap:wrap;font-size:10px;color:#888;margin-top:6px;padding-top:6px;border-top:1px solid #222">
    <span><span style="display:inline-block;width:10px;height:10px;background:#2a5a2a;border:1px solid #3a7a3a;border-radius:2px;vertical-align:middle"></span> блок работает</span>
    <span><span style="display:inline-block;width:10px;height:10px;background:#1a3a5a;border:1px solid #3a7ac0;border-radius:2px;vertical-align:middle"></span> только дети</span>
    <span><span style="display:inline-block;width:10px;height:10px;background:#1a2a1a;border:1px solid #2a4a2a;border-radius:2px;vertical-align:middle"></span> пусто</span>
  </div>`;

  html += `</div>`;
  return html;
}
function renderBlockSettings(block) {
  const sched = block.schedule || {};
  let schedType = sched.type || 'none';
  const isTop = isTopLevelBlockLocal(block.id);
  if (schedType === 'delayAfterParent' && isTop) schedType = 'none';
  const days = sched.days || [];
  const interval = sched.interval || 3;
  const delayDays = sched.delayDays || 2;
  const startDate = sched.startDate || fmt(todayDate());

  return `<div class="ex" style="border-color:#3a5a3a;background:#152515;margin-bottom:10px">
    <div style="font-size:12px;color:#888;margin-bottom:4px">Название блока:</div>
    <input type="text" id="blkName" class="form-input" value="${escapeHtml(block.name)}" oninput="renameCurrentBlock(this.value)">
    <div id="blkNameWarn" class="warn-text" style="display:none">Это имя уже используется другим блоком</div>
    <div style="font-size:12px;color:#888;margin:8px 0 4px">Расписание блока:</div>
    <div class="form-row">
      <label><input type="radio" name="blkSched" value="none" ${schedType==='none'?'checked':''} onchange="updateCurrentBlockSchedule()"> Без</label>
      <label><input type="radio" name="blkSched" value="days" ${schedType==='days'?'checked':''} onchange="updateCurrentBlockSchedule()"> Дни</label>
      <label><input type="radio" name="blkSched" value="interval" ${schedType==='interval'?'checked':''} onchange="updateCurrentBlockSchedule()"> Раз в N</label>
      <label><input type="radio" name="blkSched" value="even" ${schedType==='even'?'checked':''} onchange="updateCurrentBlockSchedule()"> Чётные</label>
      <label><input type="radio" name="blkSched" value="odd" ${schedType==='odd'?'checked':''} onchange="updateCurrentBlockSchedule()"> Нечётные</label>
      <label><input type="radio" name="blkSched" value="everyday" ${schedType==='everyday'?'checked':''} onchange="updateCurrentBlockSchedule()"> Каждый</label>
      ${isTop ? '' : `<label><input type="radio" name="blkSched" value="delayAfterParent" ${schedType==='delayAfterParent'?'checked':''} onchange="updateCurrentBlockSchedule()"> Через N после родителя</label>`}
    </div>
    <div id="blkDays" style="display:${schedType==='days'?'block':'none'}">
      ${WEEK_ORDER.map(d=>`<label class="day-chk"><input type="checkbox" class="blk-day" value="${d}" ${days.includes(d)?'checked':''} onchange="updateCurrentBlockSchedule()"> ${DAYS[d]}</label>`).join('')}
    </div>
    <div id="blkInterval" style="display:${schedType==='interval'?'block':'none'}">
      <input type="number" id="blkIntervalVal" class="form-input" value="${interval}" min="1" onchange="updateCurrentBlockSchedule()">
    </div>
    ${isTop ? '' : `<div id="blkDelay" style="display:${schedType==='delayAfterParent'?'block':'none'}">
      <input type="number" id="blkDelayVal" class="form-input" value="${delayDays}" min="1" onchange="updateCurrentBlockSchedule()" placeholder="N дней">
    </div>`}
    <div style="font-size:12px;color:#888;margin:6px 0 4px">Начиная с:</div>
    <input type="date" id="blkStart" class="form-input" value="${startDate}" onchange="updateCurrentBlockSchedule()">
    <div style="margin-top:8px">
  <button class="mini-btn" onclick="toggleBlockSchedulePreview('${block.id}')" style="padding:4px 10px;font-size:12px">
    ${schedulePreviewBlockId === block.id ? '▼' : '▶'} Расписание (14 дней)
  </button>
  ${schedulePreviewBlockId === block.id ? renderBlockSchedulePreview(block) : ''}
</div>
    ${renderDisableSection('blk', block, true)}
    <button class="mini-btn" style="margin-top:8px;background:#2a5a2a;border-color:#3a7a3a" onclick="updateCurrentBlockDisable()">Применить отключение</button>
  </div>`;
}

function renderBlockChildren(block) {
  const children = block.children || [];
  if (!children.length) {
    return `<div class="ex" style="color:#777;font-size:13px">В блоке пока пусто</div>`;
  }

  let html = '';
  const seen = {};
  children.forEach((child, idx) => {
    const key = child.type + ':' + child.id;
    seen[key] = (seen[key] || 0) + 1;
    const flipKey = `child:${key}:${seen[key]}`;
    if (editingChildIdx === idx) {
      html += renderChildEditForm(child, idx);
      return;
    }
    
    if (child.type === 'exercise' && EX[child.id]) {
      const ex = EX[child.id];
      const schedType = child.schedule?.type || 'none';
      const awp = child.activeWithParent !== false;
      let schedLabel = scheduleSummary(child.schedule);
      if (schedType === 'none') schedLabel = awp ? 'как родитель' : 'каждый день';
      
      // Вычисляем количество подходов (ручное или по умолчанию)
      const defaultSets = ex.sets || 4;
      const effectiveSets = (Number.isFinite(child.sets) && child.sets > 0) ? child.sets : defaultSets;
      const setsInfo = ex.app ? 'по приложению' : `${effectiveSets} подх.`;
      
      const dis = isCurrentlyDisabled(child);
      const badge = dis ? `<span class="pbadge">отменено</span>` : '';
      
            html += `<div class="plan-item ${dis ? 'disabled' : ''}" data-flip-key="${flipKey}">
        <div style="flex:1;min-width:0">
          <div class="pname">${escapeHtml(ex.name)}${badge}</div>
          <div class="psched">${awp ? '' : 'независимо · '}${schedLabel} · ${setsInfo}</div>
          ${renderMarkerChipsOnly(child.id)}
          ${dis ? `<div class="psched" style="color:#c66">🚫 ${escapeHtml(dis.reason)}${dis.until ? ` (до ${dis.until})` : ''}</div>` : ''}
        </div>
        <button class="pdel" onclick="startMoveChild(${idx})" title="Переместить">⇄</button>
        <button class="pdel" onclick="moveChild(${idx},-1)" ${idx===0?'disabled style="opacity:0.3"':''} title="Выше">↑</button>
<button class="pdel" onclick="moveChild(${idx},1)" ${idx===children.length-1?'disabled style="opacity:0.3"':''} title="Ниже">↓</button>
        <button class="pdel" style="color:#6ab0ff" onclick="onEditChild(${idx})" title="Настройки">✎</button>
        <button class="pdel" onclick="removeChildAt(${idx})" title="Удалить">✕</button>
      </div>`;
      
    } else if (child.type === 'block') {
      const nested = (onbPlan.blocks || []).find(b => b.id === child.id);
      if (!nested) return;
      
      const awp = child.activeWithParent !== false;
      const exCount = getBlockExercises(nested, onbPlan.blocks || []).length;
      const sched = child.scheduleOverride || nested.schedule;
      let schedLabel = scheduleSummary(sched);
      if (sched.type === 'none' || !sched.type) schedLabel = awp ? 'как родитель' : 'каждый день';
      
      const dis = isCurrentlyDisabled(child);
      const badge = dis ? `<span class="pbadge">отменено</span>` : '';
      
            html += `<div class="plan-item ${dis ? 'disabled' : ''}" data-flip-key="${flipKey}">
        <div style="flex:1;min-width:0">
          <div class="pname">📦 ${escapeHtml(nested.name)}${badge}</div>
          <div class="psched">${awp ? 'активен с родителем' : 'независимо'} · ${schedLabel} · ${exCount} упр.</div>
          ${dis ? `<div class="psched" style="color:#c66">🚫 ${escapeHtml(dis.reason)}${dis.until ? ` (до ${dis.until})` : ''}</div>` : ''}
        </div>
        <button class="pdel" onclick="startMoveChild(${idx})" title="Переместить">⇄</button>
        <button class="pdel" onclick="moveChild(${idx},-1)" ${idx===0?'disabled style="opacity:0.3"':''} title="Выше">↑</button>
<button class="pdel" onclick="moveChild(${idx},1)" ${idx===children.length-1?'disabled style="opacity:0.3"':''} title="Ниже">↓</button>
        <button class="pdel" style="color:#6ab0ff" onclick="onEditChild(${idx})" title="Настройки">✎</button>
        <button class="pdel" style="color:#6ab0ff" onclick="enterBlock('${nested.id}')" title="Открыть">↗</button>
        <button class="pdel" onclick="removeChildAt(${idx})" title="Удалить">✕</button>
      </div>`;
    }
  });

  return html;
}

function renderAddExistingBlockList() {
  const eligible = getEligibleBlocksForCurrent();
  let inner = '';
  if (!eligible.length) {
    inner = `<div style="padding:14px;color:#666;font-size:13px;text-align:center">Нет доступных блоков для добавления</div>`;
  } else {
    inner = eligible.map(b => `
      <div onclick="addExistingBlockToCurrent('${b.id}')" style="padding:8px 11px;background:#141414;border:1px solid #262626;border-radius:5px;margin-bottom:4px;cursor:pointer;font-size:13px;line-height:1.3;color:#ddd">
        <div>📦 ${escapeHtml(b.name)}</div>
        <div style="font-size:10.5px;color:#6a6a6a;margin-top:3px">${scheduleSummary(b.schedule)}</div>
      </div>
    `).join('');
  }
    return `<div class="ex" data-form-anim style="margin-top:10px">
    <div style="font-size:13px;color:#9f9;margin-bottom:8px;font-weight:600">Добавить существующий блок</div>
    <div style="max-height:320px;overflow-y:auto;margin-bottom:8px">${inner}</div>
    <button class="mini-btn" style="width:100%" onclick="cancelAddExistingBlock()">Отмена</button>
  </div>`;
}

function renderPlanBuilderContent(){
  const isCustomMode = view === 'custom';
  const title = isCustomMode ? 'Мой план' : 'Соберём ваш план';
  const subtitle = isCustomMode ? 'Добавляйте, редактируйте и отключайте упражнения' : 'Выберите упражнения и расписание для каждого';
  const btnText = isCustomMode ? 'Сохранить' : 'Начать';

  const currentBlock = getCurrentBlock();
  const breadcrumbHtml = renderBreadcrumb();

  let contentHtml = '';

  if (currentBlock) {
    contentHtml += renderBlockSettings(currentBlock);
    contentHtml += renderBlockChildren(currentBlock);
  } else {
    contentHtml += renderPlanItems();
    contentHtml += renderPlanBlocks();
  }

  const addButtonsHtml = onbAdding || onbAddingBlock || editingChildIdx !== null ? '' : `
    <button class="add-btn" onclick="onbShowAdd()">+ Добавить упражнение</button>
    ${currentBlock ? `<button class="add-btn" onclick="showAddExistingBlock()">+ Добавить существующий блок</button>` : ''}
    <button class="add-btn" onclick="createBlockInCurrent()">+ Создать блок</button>
  `;

  const addingFormHtml = onbAdding ? renderAddForm() : '';
  const addingBlockHtml = onbAddingBlock ? renderAddExistingBlockList() : '';

  const planConfigured = !!localStorage.getItem('planConfigured');
  const formOpen = onbAdding || onbEditingIdx !== null || onbAddingBlock || editingChildIdx !== null;
  let btnDisabled = false;
  if(formOpen){
    btnDisabled = true;
  } else if(isCustomMode && planConfigured && !isCustomDirty()){
    btnDisabled = true;
  }

  const btnAttr = btnDisabled ? 'disabled style="opacity:0.5;cursor:not-allowed"' : '';
  const heroHtml = currentBlock ? '' : `
    <div class="onb-hero" style="padding-bottom:10px">
      <div class="ico">🏋️</div>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>`;

  return `
    ${heroHtml}
    ${breadcrumbHtml}
    ${contentHtml}
    ${addButtonsHtml}
    ${addingFormHtml}
    ${addingBlockHtml}
    <div class="onb-actions">
      <button class="primary" onclick="onbSave()" ${btnAttr}>${btnText}</button>
    </div>`;
}

function renderOnboarding(){
  if (localStorage.getItem('planConfigured') && wizardState.mode === null) {
    wizardState.mode = 'manual';
  }

  if (wizardState.mode === 'manual') {
    document.getElementById('app').innerHTML = renderPlanBuilderContent();
    return;
  }

  const s = wizardState.step;
  let html = `<div class="onb-hero">
    <div class="ico">${s === 0 ? '⚙️' : '🤖'}</div>
    <h1>${s === 0 ? 'Создание плана' : 'Автоматический план'}</h1>
    <p>${s === 0 ? 'Выберите способ настройки' : 'Ответьте на вопросы, и мы составим программу'}</p>
  </div>`;

  if (s === 0) {
    html += `<div class="onb-card" onclick="wizardSetMode('auto')" style="cursor:pointer">
      <span class="ico">🤖</span>
      <h3>Автоматически</h3>
      <p>Программа сама подберет упражнения под ваш инвентарь и распределит их по дням (до 10 упражнений в день).</p>
    </div>
    <div class="onb-card" onclick="wizardSetMode('manual')" style="cursor:pointer">
      <span class="ico">📝</span>
      <h3>Вручную</h3>
      <p>Самостоятельно добавьте упражнения, настройте блоки и расписание.</p>
    </div>`;
  } 
  else if (s === 1) {
    html += `<h2>1. Какой у вас инвентарь?</h2>
    <div class="ex">`;
    const eqList = ['Гантели/Штанга/Гиря', 'Тренажер', 'Резинка', 'Собственный вес'];
    eqList.forEach(eq => {
      const checked = wizardState.equipment.includes(eq) ? 'checked' : '';
      html += `<label class="day-chk" style="display:flex;margin-bottom:8px;font-size:14px">
        <input type="checkbox" ${checked} onchange="toggleWizardEq('${eq}', this.checked)"> ${eq}
      </label>`;
    });
    html += `</div>`;
  } 
  else if (s === 2) {
    html += `<h2>2. В какие дни вы будете тренироваться?</h2>
    <p style="font-size:12px;color:#888;margin-top:-5px;margin-bottom:10px">Выбранные дни будут повторяться каждую неделю</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px">`;
    WEEK_ORDER.forEach(d => {
      const isActive = wizardState.days.includes(d);
      html += `<button class="mini-btn" style="flex:1;min-width:40px;padding:10px;font-size:13px;${isActive?'background:#2a5a2a;border-color:#4a7a4a;color:#9f9':''}" onclick="toggleWizardDay(${d})">${DAYS[d]}</button>`;
    });
    html += `</div>`;
  } 
  else if (s === 3) {
    html += `<h2>3. Какие группы мышц тренировать?</h2>
    <div class="ex">`;
    MUSCLES.forEach(cat => {
      const checked = wizardState.parts.includes(cat.id) ? 'checked' : '';
      html += `<label class="day-chk" style="display:flex;margin-bottom:8px;font-size:14px">
        <input type="checkbox" ${checked} onchange="toggleWizardPart('${cat.id}', this.checked)"> ${cat.name}
      </label>`;
    });
    html += `</div>`;
  }

  html += `<div class="onb-actions" style="margin-top:20px">`;
  
  if (s > 0) {
    html += `<button class="secondary" onclick="wizardPrev()">Назад</button>`;
  } else {
    html += `<button class="secondary" onclick="wizardSetMode('manual')">Вручную</button>`;
  }
  
  // Кнопка всегда кликабельна, но визуально блекнет, если ничего не выбрано
  const isValid = checkWizardValid(s);
  const btnStyle = isValid ? '' : 'opacity:0.5;';
  
  if (s < 3) {
    html += `<button class="primary" onclick="wizardNext()" style="${btnStyle}">Далее</button>`;
  } else {
    html += `<button class="primary" onclick="generateAutoPlan()" style="${btnStyle}">Создать план</button>`;
  }
  html += `</div>`;
  
  document.getElementById('app').innerHTML = html;
}




function checkWizardValid(step) {
  if (step === 1) return wizardState.equipment.length > 0;
  if (step === 2) return wizardState.days.length > 0;
  if (step === 3) return wizardState.parts.length > 0;
  return true;
}

function wizardSetMode(mode) {
  wizardState.mode = mode;
  wizardState.step = 1;
  renderOnboarding();
}
function toggleWizardEq(eq, checked) {
  if (checked) { if (!wizardState.equipment.includes(eq)) wizardState.equipment.push(eq); }
  else { wizardState.equipment = wizardState.equipment.filter(e => e !== eq); }
  renderOnboarding();
}
function toggleWizardDay(d) {
  if (wizardState.days.includes(d)) wizardState.days = wizardState.days.filter(x => x !== d);
  else wizardState.days.push(d);
  renderOnboarding();
}
function toggleWizardPart(id, checked) {
  if (checked) { if (!wizardState.parts.includes(id)) wizardState.parts.push(id); }
  else { wizardState.parts = wizardState.parts.filter(p => p !== id); }
  renderOnboarding();
}
function wizardNext() {
  if (!checkWizardValid(wizardState.step)) return;
  wizardState.step++; 
  renderOnboarding(); 
}
function wizardPrev() { 
  if (wizardState.step === 1) { wizardState.mode = null; wizardState.step = 0; }
  else { wizardState.step--; }
  renderOnboarding(); 
}
function renderWizard() {
  const s = wizardState.step;
  let html = `<div class="onb-hero">
    <div class="ico">🤖</div>
    <h1>Автоматический план</h1>
    <p>Ответьте на 3 вопроса, и мы составим программу</p>
  </div>`;

  if (s === 1) {
    html += `<h2>1. Какой у вас инвентарь?</h2>
    <div class="ex">`;
    const eqList = ['Собственный вес', 'Гантели/Штанга/Гиря', 'Тренажер', 'Резинка'];
    eqList.forEach(eq => {
      const checked = wizardState.equipment.includes(eq) ? 'checked' : '';
      html += `<label class="day-chk" style="display:flex;margin-bottom:8px;font-size:14px">
        <input type="checkbox" ${checked} onchange="toggleWizardEq('${eq}', this.checked)"> ${eq}
      </label>`;
    });
    html += `</div>`;
  } 
  else if (s === 2) {
    html += `<h2>2. В какие дни вы будете тренироваться?</h2>
    <div class="ex" style="display:flex;flex-wrap:wrap;gap:8px">`;
    WEEK_ORDER.forEach(d => {
      const checked = wizardState.days.includes(d) ? 'checked' : '';
      const isActive = wizardState.days.includes(d) ? 'active' : '';
      html += `<label class="onb-days" style="flex:1 0 40px;margin:0">
        <button class="${isActive}" style="width:100%" onclick="toggleWizardDay(${d})">${DAYS[d]}</button>
      </label>`;
    });
    html += `</div>`;
  } 
  else if (s === 3) {
    html += `<h2>3. Какие группы мышц тренировать?</h2>
    <div class="ex">`;
    MUSCLES.forEach(cat => {
      const checked = wizardState.parts.includes(cat.id) ? 'checked' : '';
      html += `<label class="day-chk" style="display:flex;margin-bottom:8px;font-size:14px">
        <input type="checkbox" ${checked} onchange="toggleWizardPart('${cat.id}', this.checked)"> ${cat.name}
      </label>`;
    });
    html += `</div>`;
  }

  html += `<div class="onb-actions" style="margin-top:20px">`;
  if (s > 1) {
    html += `<button class="secondary" onclick="wizardPrev()">Назад</button>`;
  } else {
    html += `<button class="secondary" onclick="skipWizard()">Вручную</button>`;
  }
  
  if (s < 3) {
    html += `<button class="primary" onclick="wizardNext()">Далее</button>`;
  } else {
    html += `<button class="primary" onclick="generateAutoPlan()">Создать план</button>`;
  }
  html += `</div>`;
  
  return html;
}

function renderCustom(){ document.getElementById('app').innerHTML = renderTabs() + renderPlanBuilderContent(); }

function validateAllBlockNames(){
  const names = new Set();
  for (const b of (onbPlan.blocks || [])) {
    const trimmed = (b.name || '').trim();
    if (!trimmed) {
      alert('У блока пустое имя. Задайте имя.');
      return false;
    }
    if (names.has(trimmed)) {
      alert(`Дублирующееся имя блока: "${trimmed}"`);
      return false;
    }
    names.add(trimmed);
  }
  return true;
}

function onbSave(){
  if(!validateAllBlockNames()) return;

  if(onbPlan.items.length === 0 && (onbPlan.blocks||[]).length === 0 && !localStorage.getItem('planConfigured')){
    if(!confirm('В плане нет упражнений и блоков. Всё равно начать?')) return;
  }

  if(onbAdding && hasPendingAddData()){
    if(confirm('Добавить новое упражнение перед сохранением?')){
      if(!attemptAddExercise()){
        return;
      }
    }
    onbAdding = false;
  }
  onbAddingBlock = false;
  editingChildIdx = null;

  saveOnbPlanToStore();
  if(view === 'custom'){
    loadOnbPlanFromStore();
    render();
  }else{
    view = 'today';
    currentDate = todayDate();
    showBodyWeightPrompt(); // <-- ДОБАВЛЕНО: запрашиваем вес при старте
    render();
  }
}

function editOwnPlan(){ setView('custom'); }
function generateAutoPlan() {
  if (!checkWizardValid(3)) {
    alert('Выберите хотя бы одну группу мышц.');
    return;
  }

  const selectedEquipment = wizardState.equipment;
  const targetMuscles = [];
  
  // Собираем ID всех мышц из выбранных категорий
  MUSCLES.forEach(cat => {
    if (wizardState.parts.includes(cat.id)) {
      cat.groups.forEach(g => targetMuscles.push(g.id));
    }
  });

  let pool = [];
  const used = new Set();
  
  // Для каждой мышцы ищем лучшее упражнение под инвентарь
  targetMuscles.forEach(mId => {
    const bestEx = Object.entries(EX)
      .map(([id, ex]) => ({ id, ex, share: (ex.muscles && ex.muscles[mId]) || 0 }))
      .filter(item => item.share >= 20) 
      .filter(item => {
        if (used.has(item.id)) return false;
        const markers = getExerciseMarkers(item.id);
        return markers.some(m => selectedEquipment.includes(m));
      })
      .sort((a,b) => b.share - a.share)[0];
      
    if (bestEx) {
      pool.push(bestEx.id);
      used.add(bestEx.id);
    }
  });

  if (pool.length === 0) {
    alert('Не удалось подобрать упражнения под выбранный инвентарь и группы мышц.');
    return;
  }

  // === РАСЧЕТ СМЕЩЕНИЙ (DELAY) ДЛЯ 14-ДНЕВНОГО ЦИКЛА ===
  const startDateObj = todayDate();
  const startDate = fmt(startDateObj);
  const startDow = startDateObj.getDay(); // Текущий день недели (0 - вс, 1 - пн...)
  
  // Сортируем выбранные дни по порядку недели
  const sortedDays = [...wizardState.days].sort((a,b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
  const numTrainingDays = sortedDays.length * 2; 
  
  const offsets = [];
  let currentOffset = 0;
  
  // 1. Высчитываем задержку до ПЕРВОГО выбранного дня
  const firstDayIdx = WEEK_ORDER.indexOf(sortedDays[0]);
  const startDayIdx = WEEK_ORDER.indexOf(startDow);
  
  let firstDiff = firstDayIdx - startDayIdx;
  if (firstDiff < 0) firstDiff += 7; // Если день на этой неделе уже прошел, ждем до следующей
  currentOffset = firstDiff;
  offsets.push(currentOffset);
  
  // 2. Высчитываем задержки для остальных дней ПЕРВОЙ недели
  for (let i = 1; i < sortedDays.length; i++) {
    const prevDayIdx = WEEK_ORDER.indexOf(sortedDays[i-1]);
    const dayIdx = WEEK_ORDER.indexOf(sortedDays[i]);
    let diff = dayIdx - prevDayIdx;
    if (diff <= 0) diff += 7; // Переход через воскресенье
    currentOffset += diff;
    offsets.push(currentOffset);
  }
  
  // 3. Высчитываем задержки для ВТОРОЙ недели
  for (let i = 0; i < sortedDays.length; i++) {
    const prevDayIdx = (i === 0) ? WEEK_ORDER.indexOf(sortedDays[sortedDays.length-1]) : WEEK_ORDER.indexOf(sortedDays[i-1]);
    const dayIdx = WEEK_ORDER.indexOf(sortedDays[i]);
    let diff = dayIdx - prevDayIdx;
    if (diff <= 0) diff += 7;
    currentOffset += diff;
    offsets.push(currentOffset);
  }

  // === РАСПРЕДЕЛЕНИЕ УПРАЖНЕНИЙ (МАКС 10 В ДЕНЬ) ===
  const daysExercises = Array.from({ length: numTrainingDays }, () => []);
  let dayCounter = 0;
  pool.forEach(exId => {
    // Если в текущем дне уже 10 упражнений, переходим к следующему
    if (daysExercises[dayCounter].length >= 10) {
      dayCounter = (dayCounter + 1) % numTrainingDays;
    }
    daysExercises[dayCounter].push(exId);
    dayCounter = (dayCounter + 1) % numTrainingDays;
  });

  // === ГЕНЕРАЦИЯ СТРУКТУРЫ ===
  const rootBlockId = 'b' + Date.now().toString(36) + 'root';
  
  const rootBlock = {
    id: rootBlockId,
    name: 'Мезоцикл (14 дней)',
    schedule: { type: 'interval', interval: 14, startDate: startDate }, // Корневой блок активен раз в 14 дней
    disabled: null,
    children: []
  };
  
  const newBlocks = [rootBlock];
  
  daysExercises.forEach((exList, i) => {
    if (exList.length === 0) return;
    
    const subBlockId = 'b' + Date.now().toString(36) + i;
    // Выводим правильный день недели для названия
    const dayName = `Тренировка ${i + 1} (${DAYS[sortedDays[i % sortedDays.length]]})`;
    
    const children = exList.map(exId => ({
      type: 'exercise',
      id: exId,
      activeWithParent: false,
      schedule: { type: 'none' }
    }));
    
    newBlocks.push({
      id: subBlockId,
      name: dayName,
      schedule: { type: 'none' },
      disabled: null,
      children: children
    });
    
    // Привязываем к корневому блоку с правильной задержкой
    rootBlock.children.push({
      type: 'block',
      id: subBlockId,
      activeWithParent: false,
      scheduleOverride: { 
        type: 'delayAfterParent', 
        delayDays: offsets[i],
        startDate: startDate
      }
    });
  });

  onbPlan.blocks = newBlocks;
  onbPlan.items = [];
  saveOnbPlanToStore();
  localStorage.setItem('planConfigured', '1');
  
    view = 'today';
  currentDate = todayDate();
  showBodyWeightPrompt(); // <-- ДОБАВЛЕНО
  render();
}
function render(){
  const before = flipCapture();
  renderInner();
  flipPlay(before);

  const rm = (typeof __reduceMotion !== 'undefined')
    ? __reduceMotion
    : (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const app = document.getElementById('app');
  if (app && !rm) {
    /* --- Смена вкладки: затухание всего контента --- */
    if (__animState.view !== null && __animState.view !== view) {
      const oldV = __animState.view === 'stats-ex' ? 'stats' : __animState.view;
      const newV = view === 'stats-ex' ? 'stats' : view;
      if (oldV !== newV) {
        clearTimeout(__appAnimTimer);
        app.classList.remove('app-anim');
        void app.offsetWidth;
        app.classList.add('app-anim');
        __appAnimTimer = setTimeout(() => app.classList.remove('app-anim'), 260);
      }
    }
    __animState.view = view;

    /* --- Открытие формы редактирования: выезд сверху --- */
    const inBlock = blockEditPath.length > 0;
    const curForm = [
      inBlock ? 'B' : 'T',
      onbEditingIdx !== null ? 'e' + onbEditingIdx : '-',
      editingChildIdx !== null ? 'c' + editingChildIdx : '-',
      onbAdding ? 'a' : '-',
      onbAddingBlock ? 'ab' : '-',
    ].join('|');
    if (curForm !== __animState.form) {
      const formEl = app.querySelector('[data-form-anim]');
      if (formEl) {
        formEl.classList.remove('form-anim');
        void formEl.offsetWidth;
        formEl.classList.add('form-anim');
        setTimeout(() => formEl.classList.remove('form-anim'), 280);
      }
    }
    __animState.form = curForm;
  } else {
    __animState.view = view;
    __animState.form = null;
  }
}

function renderInner(){
  if(needsOnboarding() || view === 'onboarding'){
    renderOnboarding();
    return;
  }
  if(view === 'history') renderHistory();
  else if(view === 'custom') renderCustom();
  else if(view === 'search') renderSearch();
  else if(view === 'stats') renderStats();
  else if(view === 'stats-ex') renderExerciseStats();
  else if(view === 'trainer') renderTrainer();
  else if(view === 'settings') renderSettings();
  else renderToday();
}

function setView(v){
  if(view === 'custom' && v !== 'custom'){
    const hasPending = onbAdding || onbEditingIdx !== null || onbAddingBlock || editingChildIdx !== null;
    const hasUnsaved = isCustomDirty();

    if(hasPending || hasUnsaved){
      if(confirm('Сохранить изменения в плане?')){
        onbAdding = false;
        onbEditingIdx = null;
        onbAddingBlock = false;
        editingChildIdx = null;
        if (validateAllBlockNames()) saveOnbPlanToStore();
      } else {
        loadOnbPlanFromStore();
      }
    }
  }

  if(v === 'custom' && prevView !== 'custom'){
    blockEditPath = [];
    loadOnbPlanFromStore();
  }
  prevView = v;
  view = v;
  if(v === 'stats') statsExerciseId = null;
  render();
}
function shiftDay(d){currentDate.setDate(currentDate.getDate()+d);render()}
function toggleDone(logKey, checked){
  const exId = logBaseId(logKey);
  const ex = EX[exId];
  if(!ex) return;
  if(checked && ex.app){
    if(!confirm(`Подтвердить: «${ex.name}» сделано?`)){render();return}
  }
  const d = fmt(currentDate), logs = store.logs;
  logs[d] = logs[d] || {};
  logs[d][logKey] = logs[d][logKey] || {};
  if(checked && logs[d][logKey]._skipped) delete logs[d][logKey]._skipped;
  logs[d][logKey].done = checked;
  if(!checked){
    const sets = logs[d][logKey].sets;
    const hasSets = sets && sets.some(x => x && (x.w || x.r));
    if(!hasSets && !logs[d][logKey]._skipped) delete logs[d][logKey];
  }
  if(logs[d]){
    const nonMeta = Object.keys(logs[d]).filter(k => !k.startsWith('_'));
    if(!nonMeta.length && !logs[d]._skip && !logs[d]._note && !logs[d]._skippedBlocks) delete logs[d];
  }
  store.logs = logs; render();
}
function onSetInput(logKey, idx, field, el){
  let v = el.value;
  if(field === 'w'){
    v = v.replace(',', '.').replace(/[^\d.]/g,'');
    const parts = v.split('.');
    if(parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
  } else {
    v = v.replace(/,/g, '.').split('.')[0].replace(/\D/g,'');
  }
  if(v !== el.value) el.value = v;
  setSet(logKey, idx, field, v);
}
function changeSets(logKey, delta) {
  const dateStr = fmt(currentDate);
  const logs = store.logs;
  logs[dateStr] = logs[dateStr] || {};
  logs[dateStr][logKey] = logs[dateStr][logKey] || {};
  const log = logs[dateStr][logKey];
  const exId = logBaseId(logKey);
  const current = (Number.isFinite(log._customSets) && log._customSets > 0) ? log._customSets : getExSets(exId);
  const next = current + delta;
  if (next < 1 || next > 20) return;
  if (delta < 0) {
    const sets = log.sets || [];
    const removingIdx = current - 1;
    const setToRemove = sets[removingIdx];
    const hasData = setToRemove && (setToRemove.w || setToRemove.r);
    const msg = hasData
      ? `Уменьшить подходы с ${current} до ${next}?\nДанные подхода #${current} (${setToRemove.w||'—'} кг × ${setToRemove.r||'—'}) будут удалены.`
      : `Уменьшить подходы с ${current} до ${next}?`;
    if (!confirm(msg)) return;
    if (sets.length > removingIdx) sets.splice(removingIdx, 1);
  }
  log._customSets = next;
  store.logs = logs;
  render();
}
function setSet(logKey, idx, field, value){
  const d = fmt(currentDate), logs = store.logs;
  logs[d] = logs[d] || {}; logs[d][logKey] = logs[d][logKey] || {};
  const arr = logs[d][logKey].sets || (logs[d][logKey].sets = []);
  arr[idx] = arr[idx] || {};
  arr[idx][field] = value;
  store.logs = logs;
  updateExerciseUI(logKey);
  updateDayMeta();
}
function getExerciseBadges(logKey, log, dateStr){
  const exId = logBaseId(logKey);
  const pr = getPRBadgesHtml(exId, log, dateStr);
  const steady = EX[exId] && !EX[exId].app ? checkSteadyAllSets(exId, log, dateStr) : null;
  const steadyHtml = steady ? `<span class="pr-badge pr-max" title="Все подходы одинаковые и максимальные повторы за всё время">🎯 ${steady.count}×${steady.r}</span>` : '';
  return pr + steadyHtml;
}
/* ---------- PWA ---------- */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();
  deferredPrompt=e;
  if(view==='stats')render();
});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;});
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js').catch(err=>console.warn('SW:',err));
  });
}

syncCustomEx();
loadOnbPlanFromStore();
showBodyWeightPrompt();
render();
