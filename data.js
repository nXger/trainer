const MUSCLES = [
  {id:'legs',name:'Ноги и таз',groups:[
    {id:'quads',name:'Квадрицепсы',sub:['Прямая','Латеральная','Медиальная','Промежуточная']},
    {id:'hamstrings',name:'Бицепс бедра',sub:['Длинная головка','Короткая головка']},
    {id:'glutes',name:'Ягодицы',sub:['Большая','Средняя','Малая']},
    {id:'adductors',name:'Приводящие мышцы',sub:['Внутренняя поверхность бедра']},
    {id:'abductors',name:'Отводящие мышцы',sub:['Средняя ягодичная','Малая ягодичная']},
    {id:'calves',name:'Икры',sub:['Икроножная','Камбаловидная']},
    {id:'foot',name:'Сгибатели/разгибатели стопы и пальцев',sub:[]},
  ]},
  {id:'arms',name:'Руки',groups:[
    {id:'biceps',name:'Бицепс плеча',sub:['Длинная головка','Короткая головка']},
    {id:'triceps',name:'Трицепс плеча',sub:['Длинная','Латеральная','Медиальная']},
    {id:'brachialis',name:'Плечевая мышца (brachialis)',sub:[]},
    {id:'coracobrachialis',name:'Клювовидно-плечевая мышца',sub:[]},
    {id:'brachioradialis',name:'Плечелучевая мышца',sub:[]},
    {id:'supinator',name:'Супинатор',sub:[]},
    {id:'pronators',name:'Пронаторы',sub:[]},
    {id:'fcr',name:'Лучевой сгибатель запястья',sub:[]},
    {id:'fcu',name:'Локтевой сгибатель запястья',sub:[]},
    {id:'fds',name:'Поверхностный сгибатель пальцев',sub:[]},
    {id:'fdp',name:'Глубокий сгибатель пальцев',sub:[]},
    {id:'fpl',name:'Длинный сгибатель большого пальца кисти',sub:[]},
    {id:'ecrl',name:'Длинный лучевой разгибатель запястья',sub:[]},
    {id:'ecrb',name:'Короткий лучевой разгибатель запястья',sub:[]},
    {id:'ecu',name:'Локтевой разгибатель запястья',sub:[]},
    {id:'finger_extensors',name:'Разгибатели пальцев',sub:[]},
    {id:'ei',name:'Разгибатель указательного пальца',sub:[]},
    {id:'edm',name:'Разгибатель мизинца',sub:[]},
    {id:'apl',name:'Длинная мышца, отводящая большой палец кисти',sub:[]},
    {id:'thumb_extensors',name:'Разгибатели большого пальца (короткий и длинный)',sub:[]},
    {id:'fpb',name:'Короткий сгибатель большого пальца кисти',sub:[]},
    {id:'apb',name:'Короткая мышца, отводящая большой палец кисти',sub:[]},
    {id:'opponens_pollicis',name:'Противопоставляющая большой палец',sub:[]},
    {id:'adductor_pollicis',name:'Приводящая большой палец',sub:[]},
    {id:'adm',name:'Мышца, отводящая мизинец',sub:[]},
    {id:'fdm',name:'Короткий сгибатель мизинца',sub:[]},
    {id:'opponens_digiti_minimi',name:'Противопоставляющая мизинец',sub:[]},
    {id:'lumbricals',name:'Червеобразные мышцы',sub:[]},
    {id:'interossei',name:'Межкостные мышцы (ладонные и тыльные)',sub:[]},
  ]},
  {id:'chest',name:'Грудь',groups:[
    {id:'pectoralis_major',name:'Большая грудная',sub:['Ключичная/верхняя','Грудинная/средняя','Брюшная/нижняя']},
    {id:'pectoralis_minor',name:'Малая грудная',sub:[]},
    {id:'serratus',name:'Передняя зубчатая',sub:[]},
    {id:'intercostals',name:'Межреберные',sub:[]},
  ]},
  {id:'back',name:'Спина',groups:[
    {id:'lats',name:'Широчайшая мышца спины',sub:[]},
    {id:'traps',name:'Трапециевидная мышца',sub:['Верхняя','Средняя','Нижняя']},
    {id:'rhomboids',name:'Ромбовидные мышцы',sub:['Большая','Малая']},
    {id:'levator_scapulae',name:'Мышца, поднимающая лопатку',sub:[]},
    {id:'erectors',name:'Разгибатели спины',sub:[]},
    {id:'ql',name:'Квадратная мышца поясницы',sub:[]},
    {id:'rear_delts',name:'Задние дельты',sub:[]},
  ]},
  {id:'shoulders',name:'Плечи',groups:[
    {id:'delts',name:'Дельтовидные',sub:['Передняя','Средняя','Задняя']},
    {id:'rotator_cuff',name:'Вращательная манжета',sub:['Надостная','Подостная','Малая круглая','Подлопаточная']},
    {id:'teres',name:'Большая и малая круглые',sub:[]},
  ]},
  {id:'core',name:'Пресс и кор',groups:[
    {id:'rectus_abdominis',name:'Прямая мышца живота',sub:['Верхняя','Нижняя']},
    {id:'obliques',name:'Косые мышцы',sub:['Внешние','Внутренние']},
    {id:'transverse',name:'Поперечная мышца живота',sub:[]},
    {id:'iliopsoas',name:'Подвздошно-поясничная',sub:[]},
    {id:'pelvic_floor',name:'Мышцы тазового дна',sub:[]},
  ]},
  {id:'neck',name:'Шея',groups:[
    {id:'scm',name:'Грудино-ключично-сосцевидная',sub:[]},
    {id:'scalenes',name:'Лестничные',sub:[]},
    {id:'neck_extensors',name:'Подзатылочные / разгибатели шеи',sub:[]},
  ]},
];
const MUSCLE_BY_ID={};
MUSCLES.forEach(cat=>cat.groups.forEach(g=>{MUSCLE_BY_ID[g.id]=g}));
MUSCLE_BY_ID['forearm']={id:'forearm',name:'Предплечья (устаревшее)',sub:[]};
const MUSCLE_SECTION = {};
MUSCLES.forEach(cat => {
  cat.groups.forEach(g => { MUSCLE_SECTION[g.id] = { id: cat.id, name: cat.name }; });
});

const MUSCLE_COEF = {
  // Ноги и таз
  quads:{recovery_rate:0.78,daily_subtraction:0.020},
  hamstrings:{recovery_rate:0.77,daily_subtraction:0.020},
  glutes:{recovery_rate:0.78,daily_subtraction:0.020},
  adductors:{recovery_rate:0.75,daily_subtraction:0.025},
  abductors:{recovery_rate:0.76,daily_subtraction:0.020},
  calves:{recovery_rate:0.72,daily_subtraction:0.030},
  foot:{recovery_rate:0.70,daily_subtraction:0.030},

  // Руки
  biceps:{recovery_rate:0.72,daily_subtraction:0.030},
  triceps:{recovery_rate:0.72,daily_subtraction:0.030},
  brachialis:{recovery_rate:0.73,daily_subtraction:0.030},
  coracobrachialis:{recovery_rate:0.75,daily_subtraction:0.020},
  brachioradialis:{recovery_rate:0.68,daily_subtraction:0.030},
  supinator:{recovery_rate:0.67,daily_subtraction:0.030},
  pronators:{recovery_rate:0.68,daily_subtraction:0.030},
  fcr:{recovery_rate:0.68,daily_subtraction:0.030},
  fcu:{recovery_rate:0.68,daily_subtraction:0.030},
  fds:{recovery_rate:0.66,daily_subtraction:0.035},
  fdp:{recovery_rate:0.66,daily_subtraction:0.035},
  fpl:{recovery_rate:0.66,daily_subtraction:0.035},
  ecrl:{recovery_rate:0.68,daily_subtraction:0.030},
  ecrb:{recovery_rate:0.68,daily_subtraction:0.030},
  ecu:{recovery_rate:0.68,daily_subtraction:0.030},
  finger_extensors:{recovery_rate:0.68,daily_subtraction:0.030},
  ei:{recovery_rate:0.69,daily_subtraction:0.030},
  edm:{recovery_rate:0.69,daily_subtraction:0.030},
  apl:{recovery_rate:0.67,daily_subtraction:0.030},
  thumb_extensors:{recovery_rate:0.67,daily_subtraction:0.030},
  fpb:{recovery_rate:0.66,daily_subtraction:0.035},
  apb:{recovery_rate:0.66,daily_subtraction:0.035},
  opponens_pollicis:{recovery_rate:0.66,daily_subtraction:0.035},
  adductor_pollicis:{recovery_rate:0.66,daily_subtraction:0.035},
  adm:{recovery_rate:0.68,daily_subtraction:0.030},
  fdm:{recovery_rate:0.68,daily_subtraction:0.030},
  opponens_digiti_minimi:{recovery_rate:0.68,daily_subtraction:0.030},
  lumbricals:{recovery_rate:0.70,daily_subtraction:0.025},
  interossei:{recovery_rate:0.68,daily_subtraction:0.030},

  // Грудь
  pectoralis_major:{recovery_rate:0.72,daily_subtraction:0.030},
  pectoralis_minor:{recovery_rate:0.74,daily_subtraction:0.025},
  serratus:{recovery_rate:0.76,daily_subtraction:0.020},
  intercostals:{recovery_rate:0.78,daily_subtraction:0.020},

  // Спина
  lats:{recovery_rate:0.77,daily_subtraction:0.020},
  traps:{recovery_rate:0.75,daily_subtraction:0.025},
  rhomboids:{recovery_rate:0.75,daily_subtraction:0.025},
  levator_scapulae:{recovery_rate:0.74,daily_subtraction:0.025},
  erectors:{recovery_rate:0.78,daily_subtraction:0.020},
  ql:{recovery_rate:0.77,daily_subtraction:0.020},
  rear_delts:{recovery_rate:0.72,daily_subtraction:0.030},

  // Плечи
  delts:{recovery_rate:0.72,daily_subtraction:0.030},
  rotator_cuff:{recovery_rate:0.70,daily_subtraction:0.030},
  teres:{recovery_rate:0.73,daily_subtraction:0.025},

  // Пресс и кор
  rectus_abdominis:{recovery_rate:0.78,daily_subtraction:0.020},
  obliques:{recovery_rate:0.77,daily_subtraction:0.020},
  transverse:{recovery_rate:0.80,daily_subtraction:0.015},
  iliopsoas:{recovery_rate:0.74,daily_subtraction:0.025},
  pelvic_floor:{recovery_rate:0.82,daily_subtraction:0.010},

  // Шея
  scm:{recovery_rate:0.74,daily_subtraction:0.025},
  scalenes:{recovery_rate:0.72,daily_subtraction:0.030},
  neck_extensors:{recovery_rate:0.70,daily_subtraction:0.030},
};

const LOAD_FACTOR    = 0.25;
const LOAD_THRESHOLD = 0.30;
const LOAD_GREEN     = 0.40;
const LOAD_YELLOW    = 0.65;
const LOAD_ORANGE    = 0.85;

const FOREARM_IDS=['brachioradialis','supinator','pronators','fcr','fcu','fds','fdp','fpl','ecrl','ecrb','ecu','finger_extensors','ei','edm','apl','thumb_extensors','fpb','apb','opponens_pollicis','adductor_pollicis','adm','fdm','opponens_digiti_minimi','lumbricals','interossei'];
const DAYS=['вс','пн','вт','ср','чт','пт','сб'];
const WEEK_ORDER=[1,2,3,4,5,6,0];
const MONTH_NAMES=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
