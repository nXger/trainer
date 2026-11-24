/*
 * Модель мышечной нагрузки:
 * muscles: { muscleId: percent } — независимая оценка вовлечения мышцы по шкале 5–100.
 * Значения НЕ являются долями от 100% и НЕ должны нормироваться по сумме.
 * Это оценочные индексы для приложения, а не точные лабораторные значения %MVIC.
 * Фактическая ЭМГ зависит от техники, амплитуды, темпа, нагрузки и человека.
 */
const EX = {
  barbell_squat: { name:'Приседания со штангой', sets:4, reps:'12-15',
    muscles:{quads:70,glutes:53,adductors:40,hamstrings:25,erectors:35},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  bulgarian_split: { name:'Болгарский сплит-присед', sets:4, reps:'12-15',
    muscles:{quads:75,glutes:70,adductors:38,hamstrings:30,erectors:25},
    markers:['Гантели/Штанга/Гиря','Собственный вес','Волейбол'] },

  romanian_deadlift: { name:'Румынская тяга', sets:4, reps:'12-15',
    muscles:{hamstrings:75,glutes:60,erectors:55,adductors:20},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  leg_curl_machine: { name:'Сгибание ног лежа в тренажере', sets:4, reps:'12-15',
    muscles:{hamstrings:90,calves:8},
    markers:['Тренажер','Волейбол'] },

  leg_curl_band: { name:'Сгибание ноги с резинкой лежа', sets:4, reps:'12-15',
    muscles:{hamstrings:82,calves:8},
    markers:['Резинка'] },

  glute_bridge_weighted: { name:'Ягодичный мост со штангой/гантелью', sets:4, reps:'12-15',
    muscles:{glutes:78,hamstrings:32,pelvic_floor:15,erectors:18,quads:10},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  glute_bridge_hold: { name:'Ягодичный мост с удержанием (тазовое дно)', sets:4, reps:'12-15',
    muscles:{glutes:85,hamstrings:25,pelvic_floor:20,erectors:10},
    markers:['Собственный вес'] },

  leg_abduction_band: { name:'Отведение ноги в сторону с резинкой/в кроссовере', sets:4, reps:'12-15',
    muscles:{abductors:82,glutes:30},
    markers:['Резинка','Тренажер'] },

  sumo_squat_db: { name:'Приседания сумо с гантелью', sets:4, reps:'12-15',
    muscles:{adductors:65,quads:55,glutes:55,hamstrings:25,erectors:25},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  leg_adduction_machine: { name:'Сведение ног в тренажере', sets:4, reps:'12-15',
    muscles:{adductors:90},
    markers:['Тренажер'] },

  leg_adduction_band: { name:'Сведение ног с резинкой', sets:4, reps:'12-15',
    muscles:{adductors:80},
    markers:['Резинка'] },

  leg_abduction_machine: { name:'Разведение ног в тренажере', sets:4, reps:'12-15',
    muscles:{abductors:82,glutes:20},
    markers:['Тренажер'] },

  side_steps_band: { name:'Боковые шаги с резинкой', sets:4, reps:'12-15',
    muscles:{abductors:52,glutes:22,quads:15},
    markers:['Резинка','Волейбол'] },

  calf_raise_standing: { name:'Подъём на носки стоя', sets:4, reps:'12-15',
    muscles:{calves:85,foot:25},
    markers:['Собственный вес','Волейбол'] },

  calf_raise_seated: { name:'Подъём на носки сидя', sets:4, reps:'12-15',
    muscles:{calves:85,foot:20},
    markers:['Тренажер','Гантели/Штанга/Гиря','Волейбол'] },

  walk_toes_heels: { name:'Ходьба на носках/пятках', sets:4, reps:'12-15',
    muscles:{foot:60,calves:50},
    markers:['Собственный вес','Волейбол'] },

  toe_curl_towel: { name:'Сгибание пальцев ног с полотенцем/резинкой', sets:4, reps:'12-15',
    muscles:{foot:85,calves:15},
    markers:['Резинка'] },

  biceps_barbell: { name:'Подъём штанги/гантелей на бицепс', sets:4, reps:'12-15',
    muscles:{biceps:75,brachialis:50,brachioradialis:40,supinator:20},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  hammer_curl: { name:'«Молот» с гантелями', sets:4, reps:'12-15',
    muscles:{brachialis:70,brachioradialis:65,biceps:65,supinator:25,pronators:15,fcr:15},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  overhead_triceps: { name:'Разгибание рук из-за головы', sets:4, reps:'12-15',
    muscles:{triceps:85,delts:20},
    markers:['Гантели/Штанга/Гиря'] },

  close_pushups: { name:'Отжимания узким хватом', sets:4, reps:'12-15',
    muscles:{triceps:65,pectoralis_major:60,delts:45,coracobrachialis:20,serratus:25},
    markers:['Собственный вес'] },

  wrist_curl: { name:'Сгибание запястий со штангой/гантелями', sets:4, reps:'12-15',
    muscles:{fcr:75,fcu:70,fds:50,fdp:40,fpl:25},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  wrist_extension: { name:'Разгибание запястий', sets:4, reps:'12-15',
    muscles:{finger_extensors:70,ecrl:60,ecrb:55,ecu:50,ei:30},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  hand_gripper: { name:'Сжимание эспандера', sets:4, reps:'12-15',
    muscles:{fds:75,fdp:70,fcr:55,fcu:50,fpb:30},
    markers:['Армрестлинг'] },
   hang_bar: { name:'Вис на турнике', sets:4, reps:'30-60 сек',
    muscles:{fds:70,fdp:60,fcr:55,fcu:50,brachioradialis:35,biceps:25,lats:20,traps:15},
    markers:['Собственный вес','Армрестлинг'] },

  incline_db_press: { name:'Жим на наклонной вверх', sets:4, reps:'12-15',
    muscles:{pectoralis_major:75,delts:65,triceps:50,coracobrachialis:25,serratus:25,rotator_cuff:20},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  incline_feet_pushups: { name:'Отжимания с ногами на возвышении', sets:4, reps:'12-15',
    muscles:{pectoralis_major:75,delts:65,triceps:50,serratus:30,coracobrachialis:25},
    markers:['Собственный вес'] },

  bench_press: { name:'Жим лежа', sets:4, reps:'12-15',
    muscles:{pectoralis_major:85,triceps:50,delts:65,coracobrachialis:20,serratus:15},
    markers:['Гантели/Штанга/Гиря'] },

  pushups: { name:'Отжимания от пола', sets:4, reps:'12-15',
    muscles:{pectoralis_major:75,triceps:55,delts:50,coracobrachialis:25,serratus:25},
    markers:['Собственный вес'] },

  decline_press: { name:'Жим на наклонной вниз', sets:4, reps:'12-15',
    muscles:{pectoralis_major:85,triceps:55,delts:40,coracobrachialis:20},
    markers:['Гантели/Штанга/Гиря'] },

  dips: { name:'Отжимания на брусьях', sets:4, reps:'12-15',
    muscles:{pectoralis_major:75,triceps:70,delts:50,coracobrachialis:25},
    markers:['Собственный вес'] },

  hands_elevated_pushups: { name:'Отжимания с руками на возвышении', sets:4, reps:'12-15',
    muscles:{pectoralis_major:65,triceps:45,delts:35,coracobrachialis:20},
    markers:['Собственный вес'] },

  pushup_plus: { name:'Отжимания с протракцией лопаток', sets:4, reps:'12-15',
    muscles:{serratus:85,pectoralis_minor:55,pectoralis_major:35,delts:30},
    markers:['Собственный вес','Волейбол'] },

  pullover_db: { name:'Пуловер с гантелью лежа', sets:4, reps:'12-15',
    muscles:{pectoralis_major:60,pectoralis_minor:35,serratus:30,lats:55,teres:25,triceps:20,intercostals:15},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  plank_protraction: { name:'Планка с протракцией лопаток', sets:4, reps:'30-60 сек',
    muscles:{serratus:80,transverse:60,rectus_abdominis:55,obliques:45,pectoralis_minor:25},
    markers:['Собственный вес','Волейбол'] },

  breath_resistance: { name:'Дыхание с сопротивлением на выдохе', sets:4, reps:'10-15',
    muscles:{intercostals:75,transverse:35,rectus_abdominis:20,obliques:20},
    markers:['Собственный вес','Волейбол'] },

  pullups: { name:'Подтягивания', sets:4, reps:'12-15',
    muscles:{lats:90,biceps:55,teres:45,rhomboids:40,traps:30,brachioradialis:35,rear_delts:25},
    markers:['Собственный вес','Волейбол'] },

  lat_pulldown: { name:'Тяга верхнего блока', sets:4, reps:'12-15',
    muscles:{lats:80,biceps:50,teres:40,rhomboids:35,traps:30,rear_delts:20},
    markers:['Тренажер','Волейбол'] },

  shrugs: { name:'Шраги со штангой/гантелями', sets:4, reps:'12-15',
    muscles:{traps:90,levator_scapulae:45,rhomboids:25,rear_delts:15},
    markers:['Гантели/Штанга/Гиря'] },

  y_raises_prone: { name:'Y-подъёмы лежа на животе', sets:4, reps:'12-15',
    muscles:{traps:70,rear_delts:45,rhomboids:40,levator_scapulae:35,rotator_cuff:30},
    markers:['Собственный вес','Волейбол'] },

  upright_row: { name:'Тяга к подбородку', sets:4, reps:'12-15',
    muscles:{traps:70,delts:60,rear_delts:35,rhomboids:25,biceps:30,brachioradialis:25},
    markers:['Гантели/Штанга/Гиря'] },

  rows_to_waist: { name:'Тяга к поясу', sets:4, reps:'12-15',
    muscles:{rhomboids:75,lats:70,rear_delts:40,traps:35,biceps:45},
    markers:['Тренажер'] },

  band_pull_apart: { name:'Разведение рук с резинкой', sets:4, reps:'12-15',
    muscles:{rear_delts:70,rhomboids:55,traps:45,rotator_cuff:30,levator_scapulae:25},
    markers:['Резинка','Волейбол'] },

  reverse_fly_machine: { name:'Reverse fly в тренажере', sets:4, reps:'12-15',
    muscles:{rear_delts:80,rhomboids:55,traps:35,rotator_cuff:35,levator_scapulae:25},
    markers:['Тренажер','Волейбол'] },

  hyperextension: { name:'Гиперэкстензия', sets:4, reps:'12-15',
    muscles:{erectors:75,glutes:55,hamstrings:40,ql:25,obliques:20},
    markers:['Собственный вес','Волейбол'] },

  deadlift: { name:'Становая тяга', sets:4, reps:'12-15',
    muscles:{erectors:65,glutes:60,hamstrings:50,quads:35,traps:30,lats:25},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  bend_with_db: { name:'Наклон вперёд с гантелью', sets:4, reps:'12-15',
    muscles:{erectors:70,glutes:55,hamstrings:50,ql:25,obliques:20},
    markers:['Гантели/Штанга/Гиря'] },

  side_bend_db: { name:'Наклоны в сторону с гантелью', sets:4, reps:'12-15',
    muscles:{ql:80,obliques:70,erectors:30},
    markers:['Гантели/Штанга/Гиря'] },

  farmers_walk: { name:'Фермерская прогулка', sets:4, reps:'30-60 сек',
    muscles:{ql:45,erectors:45,fcr:55,fcu:55,traps:55,rectus_abdominis:30,obliques:30},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

        overhead_press_db: { name:'Жим гантелей сидя/стоя вверх', sets:4, reps:'12-15',
    muscles:{delts:85,triceps:50,traps:35,rotator_cuff:30,serratus:35,pectoralis_major:20},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  front_raise: { name:'Подъём гантелей перед собой', sets:4, reps:'12-15',
    muscles:{delts:80,pectoralis_major:40,coracobrachialis:45,serratus:25,traps:25},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  lateral_raise: { name:'Махи гантелями в стороны', sets:4, reps:'12-15',
    muscles:{delts:90,rotator_cuff:30,traps:35,levator_scapulae:20},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  lateral_raise_band: { name:'Разведение резинкой в стороны', sets:4, reps:'12-15',
    muscles:{delts:75,traps:40,rotator_cuff:25,levator_scapulae:20,rhomboids:15},
    markers:['Резинка','Волейбол'] },

  bent_reverse_fly: { name:'Разведение гантелей в наклоне', sets:4, reps:'12-15',
    muscles:{rear_delts:80,rhomboids:50,traps:35,rotator_cuff:30,levator_scapulae:20,teres:25},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  reverse_pec_deck: { name:'Обратные разведения в тренажере/с резинкой', sets:4, reps:'12-15',
    muscles:{rear_delts:85,rhomboids:55,traps:30,rotator_cuff:35,levator_scapulae:20},
    markers:['Тренажер','Резинка','Волейбол'] },

  arm_abduction_band: { name:'Отведение руки с резинкой', sets:4, reps:'12-15',
    muscles:{rotator_cuff:80,delts:55,traps:30,levator_scapulae:20},
    markers:['Резинка','Армрестлинг','Волейбол'] },

  rotator_cuff_rot: { name:'Внутренняя/внешняя ротация с резинкой', sets:4, reps:'12-15',
    muscles:{rotator_cuff:90,delts:25,teres:20},
    markers:['Резинка','Армрестлинг','Волейбол'] },

  crunches: { name:'Скручивания', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:80,obliques:55,transverse:25,iliopsoas:15},
    markers:['Собственный вес','Волейбол'] },

  crunches_weighted: { name:'Скручивания с весом/на блоке', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:85,obliques:55,transverse:25,iliopsoas:15},
    markers:['Гантели/Штанга/Гиря','Тренажер','Волейбол'] },

  leg_raise_hanging: { name:'Подъём ног в висе', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:70,iliopsoas:75,obliques:35,transverse:35,lats:25,fds:25},
    markers:['Собственный вес','Волейбол'] },

  leg_raise_lying: { name:'Подъём ног лежа', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:70,iliopsoas:60,obliques:25,transverse:30},
    markers:['Собственный вес','Волейбол'] },

  reverse_crunches: { name:'Обратные скручивания', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:75,obliques:40,transverse:25,iliopsoas:45},
    markers:['Собственный вес','Волейбол'] },

  russian_twist: { name:'Русские скручивания', sets:4, reps:'12-15',
    muscles:{obliques:80,rectus_abdominis:45,transverse:40,iliopsoas:20},
    markers:['Собственный вес','Волейбол'] },

  side_plank: { name:'Боковая планка', sets:4, reps:'30-60 сек',
    muscles:{obliques:80,transverse:65,ql:70,rectus_abdominis:35,glutes:30,abductors:45},
    markers:['Собственный вес','Волейбол'] },

  plank: { name:'Планка', sets:4, reps:'30-60 сек',
    muscles:{transverse:70,rectus_abdominis:70,obliques:60,serratus:35,delts:30,glutes:25},
    markers:['Собственный вес','Волейбол'] },

  stomach_vacuum: { name:'Вакуум живота', sets:4, reps:'10-15',
    muscles:{transverse:80,obliques:20,rectus_abdominis:15},
    markers:['Собственный вес'] },

  knee_raise_hanging: { name:'Подъём коленей в висе', sets:4, reps:'12-15',
    muscles:{iliopsoas:75,rectus_abdominis:70,obliques:35,transverse:35,lats:20},
    markers:['Собственный вес','Волейбол'] },

  leg_raise_band: { name:'Подъём ноги с резинкой стоя/лежа', sets:4, reps:'12-15',
    muscles:{iliopsoas:75,quads:35,rectus_abdominis:30,transverse:20,obliques:20},
    markers:['Резинка'] },

  kegel: { name:'Упражнения Кегеля', sets:4, reps:'12-15',
    muscles:{pelvic_floor:80,transverse:25,glutes:15},
    markers:['Собственный вес'] },

  neck_flexion: { name:'Сгибание шеи с сопротивлением', sets:4, reps:'12-15',
    muscles:{scm:75,scalenes:55,neck_extensors:25},
    markers:['Собственный вес'] },

  neck_side: { name:'Наклоны головы в сторону с сопротивлением', sets:4, reps:'12-15',
    muscles:{scm:75,scalenes:50,neck_extensors:30},
    markers:['Собственный вес'] },

  shoulder_shrug_band: { name:'Подъём ключиц/плеч с резинкой', sets:4, reps:'12-15',
    muscles:{traps:80,scalenes:45,levator_scapulae:35,rhomboids:20},
    markers:['Резинка'] },

  neck_extension: { name:'Разгибание шеи с сопротивлением', sets:4, reps:'12-15',
    muscles:{neck_extensors:85,scm:25,scalenes:20},
    markers:['Собственный вес'] },

  neck_extension_prone: { name:'Подъём головы лежа на животе', sets:4, reps:'12-15',
    muscles:{neck_extensors:85,traps:30,scm:20},
    markers:['Собственный вес'] },

   supination_db: { name:'Супинация с гантелью', sets:4, reps:'12-15',
    muscles:{supinator:75,biceps:45,brachioradialis:30,brachialis:20},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  pronation_db: { name:'Пронация с гантелью', sets:4, reps:'12-15',
    muscles:{pronators:80,fcr:25,fcu:25,brachioradialis:20,supinator:15},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  scapular_elevation: { name:'Подъём лопаток с резинкой/штангой', sets:4, reps:'12-15',
    muscles:{levator_scapulae:70,traps:65,rhomboids:30,scalenes:20,neck_extensors:20},
    markers:['Резинка','Гантели/Штанга/Гиря','Волейбол'] },

  arm_adduction_band: { name:'Приведение руки через тело с резинкой', sets:4, reps:'12-15',
    muscles:{coracobrachialis:60,pectoralis_major:50,lats:35,teres:25,delts:25},
    markers:['Резинка','Армрестлинг'] },

  thumb_ip_flexion: { name:'Сгибание большого пальца с резинкой', sets:4, reps:'12-15',
    muscles:{fpl:75,fpb:45,adductor_pollicis:35,opponens_pollicis:30,fds:20},
    markers:['Резинка','Армрестлинг'] },

  finger_extension_single: { name:'Разгибание пальцев по одному с резинкой', sets:4, reps:'12-15',
    muscles:{ei:55,edm:50,finger_extensors:75,lumbricals:20,interossei:25},
    markers:['Резинка','Армрестлинг'] },

  thumb_extension_band: { name:'Разгибание и отведение большого пальца с резинкой', sets:4, reps:'12-15',
    muscles:{apl:55,thumb_extensors:80,apb:30,interossei:20},
    markers:['Резинка','Армрестлинг'] },

  anconeus_extension: { name:'Разгибание предплечья с резинкой', sets:4, reps:'12-15',
    muscles:{triceps:90,brachialis:15,delts:15},
    markers:['Резинка','Армрестлинг'] },

  thumb_pinch: { name:'Сжатие большого пальца (pinch grip)', sets:4, reps:'10-15',
    muscles:{fpb:55,apb:45,opponens_pollicis:45,adductor_pollicis:60,fpl:25},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  pinky_grip: { name:'Сжатие мизинца с сопротивлением', sets:4, reps:'12-15',
    muscles:{adm:55,fdm:55,opponens_digiti_minimi:65,fds:30,fdp:30},
    markers:['Резинка','Армрестлинг'] },

  finger_spread: { name:'Разведение пальцев с резинкой', sets:4, reps:'12-15',
    muscles:{lumbricals:50,interossei:75,finger_extensors:30},
    markers:['Резинка','Армрестлинг'] },

  cable_crossover: { name:'Сведение рук на блоке (кроссовер)', sets:4, reps:'12-15',
    muscles:{pectoralis_major:85,delts:35,coracobrachialis:25,serratus:20,pectoralis_minor:25},
    markers:['Тренажер','Волейбол'] },

  pinch_grip_hang: { name:'Щипковый хват на пальцы (удержание блина/диска)', sets:4, reps:'30-60 сек',
    muscles:{fds:75,fdp:75,fcr:35,fcu:35,fpl:45,adductor_pollicis:60},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  cable_hook_imitation: { name:'Имитация борьбы в крюк на блоке', sets:4, reps:'12-15',
    muscles:{brachialis:70,brachioradialis:60,fcr:50,fcu:50,biceps:40,pronators:35},
    markers:['Тренажер','Армрестлинг'] },

  rolling_thunder: { name:'Ролик Тандер (Rolling Thunder) на удержание', sets:4, reps:'30-60 сек',
    muscles:{fds:75,fdp:75,fcr:50,fcu:50,fpl:30,adductor_pollicis:30},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  diamond_pushups: { name:'Алмазные отжимания (узкий хват)', sets:4, reps:'12-15',
    muscles:{triceps:75,pectoralis_major:55,delts:35,serratus:25,coracobrachialis:20},
    markers:['Собственный вес','Волейбол'] },

  clap_pushups: { name:'Отжимания с хлопком (плиометрика)', sets:4, reps:'8-12',
    muscles:{pectoralis_major:75,triceps:65,delts:45,serratus:35,coracobrachialis:25},
    markers:['Собственный вес','Волейбол'] },

  handstand_pushups: { name:'Отжимания в стойке на руках', sets:4, reps:'6-10',
    muscles:{delts:85,triceps:65,pectoralis_major:35,traps:30,serratus:40,rotator_cuff:30},
    markers:['Собственный вес','Волейбол'] },

  wide_pushups: { name:'Отжимания с широкой постановкой рук', sets:4, reps:'12-15',
    muscles:{pectoralis_major:85,delts:45,triceps:40,serratus:25,coracobrachialis:20},
    markers:['Собственный вес','Волейбол'] },

  chin_ups: { name:'Подтягивания обратным хватом', sets:4, reps:'8-12',
    muscles:{lats:85,biceps:65,rhomboids:40,teres:40,traps:25,brachialis:35,rear_delts:25},
    markers:['Собственный вес','Волейбол'] },

  neutral_pullups: { name:'Подтягивания нейтральным хватом', sets:4, reps:'8-12',
    muscles:{lats:90,brachialis:55,biceps:50,rhomboids:40,teres:30,traps:25,rear_delts:25},
    markers:['Собственный вес','Волейбол'] },

  muscle_ups: { name:'Выходы силой на турнике', sets:4, reps:'4-8',
    muscles:{lats:80,triceps:60,pectoralis_major:55,delts:55,biceps:45,rhomboids:30,serratus:30},
    markers:['Собственный вес','Волейбол'] },

  l_sit_pullups: { name:'Подтягивания уголком (L-sit)', sets:4, reps:'6-10',
    muscles:{lats:75,rectus_abdominis:70,iliopsoas:55,biceps:45,obliques:35,transverse:35,fds:25},
    markers:['Собственный вес','Волейбол'] },

  // ========== ВЫПРЫГИВАНИЯ ==========
    jump_squats: { name:'Выпрыгивания из приседа', sets:4, reps:'12-15',
      muscles:{quads:70,glutes:65,calves:55,hamstrings:30,transverse:25},
      markers:['Собственный вес', 'Волейбол'] },
    box_jumps: { name:'Запрыгивания на тумбу', sets:4, reps:'8-12',
      muscles:{quads:65,glutes:70,calves:55,hamstrings:30,transverse:25},
      markers:['Тренажер', 'Волейбол', 'Собственный вес'] },
    jumping_lunges: { name:'Выпады с выпрыгиванием (разножка)', sets:4, reps:'12-15',
      muscles:{quads:75,glutes:65,hamstrings:40,calves:45,transverse:25},
      markers:['Собственный вес', 'Волейбол'] },
    broad_jumps: { name:'Прыжки в длину с места', sets:4, reps:'6-10',
      muscles:{glutes:70,quads:60,calves:50,hamstrings:40,transverse:25},
      markers:['Собственный вес', 'Волейбол'] },
    single_leg_hops: { name:'Прыжки на одной ноге', sets:4, reps:'10-15',
      muscles:{quads:65,calves:60,glutes:60,hamstrings:25,transverse:30,abductors:35},
      markers:['Собственный вес', 'Волейбол'] },

          towel_pullups: { name:'Подтягивания с полотенцем', sets:4, reps:'8-12',
      muscles:{lats:85,biceps:50,brachialis:40,brachioradialis:45,fcr:45,fcu:45,fds:55,fdp:50},
      markers:['Армрестлинг', 'Волейбол', 'Собственный вес'] },
    hammer_strength_press: { name:'Жим на тренажере Хаммер', sets:4, reps:'12-15',
      muscles:{pectoralis_major:80,triceps:55,delts:50,serratus:20,rotator_cuff:20},
      markers:['Тренажер'] },
    front_lever: { name:'Выход в горизонт на турнике (Front Lever)', sets:4, reps:'15-30 сек',
      muscles:{rectus_abdominis:75,lats:70,transverse:65,obliques:45,iliopsoas:40,serratus:30},
      markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

    // ========== ДОПОЛНИТЕЛЬНЫЕ ПОЛЕЗНЫЕ УПРАЖНЕНИЯ ==========
    // Спина и плечи (Тренажеры)
    hammer_strength_row: { name:'Тяга на тренажере Хаммер', sets:4, reps:'12-15',
      muscles:{lats:80,rhomboids:65,rear_delts:45,traps:35,biceps:35,brachialis:30},
      markers:['Тренажер'] },
    pullup_wide: { name:'Подтягивания широким хватом', sets:4, reps:'8-12',
      muscles:{lats:90,teres:50,rhomboids:40,traps:25,biceps:45,brachialis:30,brachioradialis:25},
      markers:['Волейбол', 'Собственный вес'] },
    typewriter_pullups: { name:'Подтягивания «Печатная машинка»', sets:4, reps:'6-10',
      muscles:{lats:85,biceps:55,obliques:50,brachialis:40,rhomboids:35,teres:35,brachioradialis:30},
      markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

    // Кор и пресс (Продвинутые)
    dragon_flag: { name:'Флаг дракона (Dragon Flag)', sets:4, reps:'8-12',
      muscles:{rectus_abdominis:90,transverse:65,obliques:55,iliopsoas:40,lats:30,erectors:25},
      markers:['Волейбол', 'Собственный вес'] },
    hanging_windshield_wipers: { name:'Дворники в висе на турнике', sets:4, reps:'8-12',
      muscles:{obliques:85,rectus_abdominis:65,transverse:55,iliopsoas:40,lats:30,fcr:25},
      markers:['Волейбол', 'Собственный вес'] },

    // Хват и предплечья (для Армрестлинга)
    fat_grip_hold: { name:'Удержание толстой рукоятки (Fat Grip)', sets:4, reps:'30-60 сек',
      muscles:{fds:75,fdp:75,fcr:55,fcu:55,brachioradialis:35},
      markers:['Армрестлинг', 'Гантели/Штанга/Гиря'] },

    one_arm_hang: { name:'Вис на одной руке', sets:4, reps:'10-30 сек',
      muscles:{fcr:65,fcu:65,fds:70,fdp:65,brachioradialis:40},
      markers:['Армрестлинг', 'Собственный вес'] },

    archer_pushups: { name:'Отжимания лучника', sets:4, reps:'10-12',
      muscles:{pectoralis_major:80,triceps:65,delts:40,serratus:35,transverse:25,obliques:25},
      markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

    // Дополнительные упражнения на грудь и трицепс (Калистеника)
    pseudo_planche_pushups: { name:'Псевдо-планше отжимания', sets:4, reps:'8-12',
      muscles:{pectoralis_major:80,delts:70,triceps:60,serratus:45,rectus_abdominis:25,rotator_cuff:30},
      markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },
    spiderman_pushups: { name:'Отжимания Человека-паука', sets:4, reps:'12-15',
      muscles:{pectoralis_major:70,triceps:55,obliques:50,rectus_abdominis:35,serratus:25,delts:30},
      markers:['Волейбол', 'Собственный вес'] },

    // Дополнительные упражнения на спину и турник
    explosive_pullups: { name:'Взрывные подтягивания с хлопком', sets:4, reps:'6-10',
      muscles:{lats:85,biceps:55,rhomboids:45,traps:35,brachialis:30,brachioradialis:30,erectors:20},
      markers:['Волейбол', 'Собственный вес'] },
    back_lever: { name:'Выход в горизонт спиной (Back Lever)', sets:4, reps:'15-30 сек',
      muscles:{lats:75,rectus_abdominis:65,erectors:55,transverse:45,obliques:35,delts:35,rotator_cuff:35},
      markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

    // Дополнительные упражнения на ноги (Односторонняя сила)
    pistol_squats: { name:'Приседания «Пистолетик» на одной ноге', sets:4, reps:'8-12',
      muscles:{quads:80,glutes:70,hamstrings:35,calves:40,transverse:30,abductors:45},
      markers:['Волейбол', 'Собственный вес'] },

    // Специфично для Армрестлинга (Предплечье)
    db_forearm_lever: { name:'Рычаг с гантелью на скамье (пронация/супинация)', sets:4, reps:'12-15',
      muscles:{pronators:75,supinator:65,fcr:25,fcu:25,brachioradialis:35,fds:25},
      markers:['Гантели/Штанга/Гиря','Армрестлинг'] },
    db_hip_abduction: { name:'Отведение ноги с гантелью/блином в упоре', sets:4, reps:'12-15',
      muscles:{abductors:80,glutes:30,ql:20,transverse:20},
      markers:['Гантели/Штанга/Гиря'] },

      // Руки и предплечья (Свободный вес / Армрестлинг)
      db_arm_adduction: { name:'Приведение руки через тело с гантелью', sets:4, reps:'12-15',
        muscles:{coracobrachialis:65,pectoralis_major:50,delts:40,rotator_cuff:25},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      db_thumb_flexion: { name:'Сгибание большого пальца с гантелью/блином', sets:4, reps:'12-15',
        muscles:{fpl:75,fpb:50,adductor_pollicis:45,opponens_pollicis:35},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      plate_finger_extension: { name:'Разгибание пальцев под блином/гантелью', sets:4, reps:'12-15',
        muscles:{finger_extensors:75,ei:60,edm:60},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      db_thumb_extension: { name:'Разгибание/отведение большого пальца с гантелью', sets:4, reps:'12-15',
        muscles:{apl:65,thumb_extensors:85},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      plate_pinky_grip: { name:'Сжатие мизинца с блином/гантелью', sets:4, reps:'12-15',
        muscles:{adm:55,fdm:55,opponens_digiti_minimi:65,fds:30,fdp:30},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      plate_finger_spread: { name:'Удержание блина пальцами в разведённом положении', sets:4, reps:'12-15',
        muscles:{lumbricals:50,interossei:75,adm:25},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },

      // Грудь (Дыхательные)
      weighted_breathing: { name:'Дыхание с блином на груди', sets:4, reps:'10-15',
        muscles:{intercostals:80},
        markers:['Гантели/Штанга/Гиря'] },
      cable_wrist_curl: { name:'Заворот кисти на блоке', sets:4, reps:'12-15',
        muscles:{fcr:75,fcu:75,fds:45,fdp:45,biceps:20},
        markers:['Тренажер', 'Армрестлинг'] },
        pronation_forearm_free_weight: { name:'Пронация предплечья, свободный вес', sets:4, reps:'12-15',
        muscles:{pronators:80,brachioradialis:35,biceps:55},
        markers:['Гантели/Штанга/Гиря','Армрестлинг'] },
      radial_ulnar_deviation_free_weight: { name:'Луч через кисть, свободный вес ', sets:4, reps:'12-15',
        muscles:{fcr:65,ecrl:65,ecrb:50,fcu:60,ecu:50},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
        isolated_wrist_abduction_free_weight: { 
        name:'Изолированное отведение кисти свободный вес', 
        sets:4, reps:'12-15',
        muscles:{ecrl:75,ecrb:65,fcr:50,apl:30},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      wrist_curl_extension_free_weight: { name:'Кисть с гантелью свободный вес', sets:4, reps:'12-15',
        muscles:{fcr:65,fcu:65,ecrl:55,ecrb:50,ecu:50},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      finger_hold_strap_handle: { name:'Удержание рукоятки на лямках пальцами (Finger Hold)', sets:4, reps:'30 сек',
        muscles:{fds:80,fdp:80,fpl:40,fcr:25,fcu:25},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
          // --- Тяги в наклоне (Свободный вес) ---
      bent_over_row_chest: { 
        name:'Тяга к груди в наклоне (штанга/гантели)', 
        sets:4, reps:'12-15',
        // Акцент на верхнюю часть спины (ромбовидные, трапеции, задние дельты)
        muscles:{rhomboids:70,traps:55,rear_delts:50,biceps:45,brachialis:35,lats:45,teres:25},
        markers:['Гантели/Штанга/Гиря', 'Волейбол'] },
      bent_over_row_waist: { 
        name:'Тяга к поясу в наклоне (штанга/гантели)', 
        sets:4, reps:'12-15',
        // Акцент на широчайшие мышцы (как в старой db_row)
        muscles:{lats:80,rhomboids:45,rear_delts:35,biceps:45,brachialis:35,teres:25,traps:25},
        markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] 
      },
      calf_jumps: { 
        name:'Прыжки на носках стоя', 
        sets:4, reps:'15-20',
        muscles:{calves:70,foot:45,quads:35,glutes:30,hamstrings:25},
        markers:['Собственный вес', 'Волейбол'] 
      },
        neck_extension_side: { 
        name:'Разгибание шеи лежа на боку (в обе стороны)', 
        sets:4, reps:'12-15',
        muscles:{scm:55,scalenes:40,neck_extensors:60,levator_scapulae:25},
        markers:['Собственный вес'] 
      },
        close_grip_pullups: { 
        name:'Подтягивания узким хватом', 
        sets:4, reps:'8-12',
        muscles:{lats:85,biceps:55,brachialis:50,rhomboids:35,brachioradialis:30,teres:30,traps:25},
        markers:['Собственный вес', 'Волейбол'] 
      },
        dumbbell_flyes: { name:'Сведение гантелей лежа', sets:4, reps:'12-15',
        muscles:{pectoralis_major:85,delts:35,pectoralis_minor:20,coracobrachialis:25,serratus:20},
        markers:['Гантели/Штанга/Гиря', 'Волейбол'] },
        finger_pushups: { name:'Отжимания на пальцах', sets:4, reps:'6-12',
        muscles:{fds:55,fdp:55,interossei:45,lumbricals:35,fcr:25,fcu:25,pectoralis_major:45,triceps:40,delts:25},
        markers:['Собственный вес', 'Волейбол', 'Армрестлинг'] },
          seated_external_rotation: { name:'Внешняя ротация плеча сидя (с резинкой/гантелью)', sets:4, reps:'12-15',
        muscles:{rotator_cuff:85,delts:40},
        markers:['Резинка', 'Гантели/Штанга/Гиря', 'Волейбол'] },

      standing_shoulder_rotation: { name:'Боковые повороты плеч стоя (с гантелями)', sets:4, reps:'12-15',
        muscles:{rotator_cuff:85,delts:35},
        markers:['Гантели/Штанга/Гиря', 'Волейбол'] },

      side_lying_external_rotation: { name:'Боковая ротация лёжа (внешняя ротация плеча)', sets:4, reps:'12-15',
        muscles:{rotator_cuff:85,delts:40},
        markers:['Гантели/Штанга/Гиря', 'Резинка', 'Волейбол'] },
};

/* =========================================================
   WEIGHT MODE
   'one'        — вес на одну руку/ногу/сторону → при расчёте ×2
   'both'       — суммарный вес на обе стороны (штанга, 2 гантели) → ×1
   'total'      — вес снаряда (машина, блин, резинка, стек) → ×1
   'bodyweight' — свой вес; поле опционально (доп. отягощение) → ×1
   По умолчанию — 'total'
   ========================================================= */
const WEIGHT_MODES = {
  // ============================================================
  // 'one' — вес одной гантели / одной руки-ноги / одной стороны
  // ============================================================
  bulgarian_split: 'one',
  hammer_curl: 'one',
  incline_db_press: 'one',
  overhead_press_db: 'one',
  lateral_raise: 'one',
  front_raise: 'one',
  bent_reverse_fly: 'one',
  farmers_walk: 'one',
  side_bend_db: 'one',
  db_forearm_lever: 'one',
  db_hip_abduction: 'one',
  db_arm_adduction: 'one',
  db_thumb_flexion: 'one',
  db_thumb_extension: 'one',
  plate_finger_extension: 'one',
  plate_pinky_grip: 'one',
  plate_finger_spread: 'one',
  dumbbell_flyes: 'one',
  seated_external_rotation: 'one',
  standing_shoulder_rotation: 'one',
  side_lying_external_rotation: 'one',
  supination_db: 'one',
  pronation_db: 'one',
  pronation_forearm_free_weight: 'one',
  radial_ulnar_deviation_free_weight: 'one',
  isolated_wrist_abduction_free_weight: 'one',
  wrist_curl_extension_free_weight: 'one',
  arm_abduction_band: 'one',    // по одной руке
  arm_adduction_band: 'one',    // по одной руке

  // ============================================================
  // 'both' — суммарный вес на обе стороны (штанга / две гантели)
  // ============================================================
  barbell_squat: 'both',
  romanian_deadlift: 'both',
  deadlift: 'both',
  bench_press: 'both',
  decline_press: 'both',
  glute_bridge_weighted: 'both',
  biceps_barbell: 'both',
  shrugs: 'both',
  upright_row: 'both',
  bent_over_row_chest: 'both',
  bent_over_row_waist: 'both',
  wrist_curl: 'both',
  wrist_extension: 'both',

  // ============================================================
  // 'bodyweight' — свой вес, поле опционально (доп. отягощение)
  // ============================================================
  // Отжимания
  pushups: 'bodyweight',
  incline_feet_pushups: 'bodyweight',
  hands_elevated_pushups: 'bodyweight',
  close_pushups: 'bodyweight',
  wide_pushups: 'bodyweight',
  diamond_pushups: 'bodyweight',
  clap_pushups: 'bodyweight',
  handstand_pushups: 'bodyweight',
  archer_pushups: 'bodyweight',
  pseudo_planche_pushups: 'bodyweight',
  spiderman_pushups: 'bodyweight',
  pushup_plus: 'bodyweight',
  finger_pushups: 'bodyweight',
  // Брусья / турник
  dips: 'bodyweight',
  pullups: 'bodyweight',
  chin_ups: 'bodyweight',
  neutral_pullups: 'bodyweight',
  close_grip_pullups: 'bodyweight',
  pullup_wide: 'bodyweight',
  muscle_ups: 'bodyweight',
  l_sit_pullups: 'bodyweight',
  typewriter_pullups: 'bodyweight',
  explosive_pullups: 'bodyweight',
  towel_pullups: 'bodyweight',
  front_lever: 'bodyweight',
  back_lever: 'bodyweight',
  hang_bar: 'bodyweight',
  one_arm_hang: 'bodyweight',
  // Кор / пресс
  crunches: 'bodyweight',
  leg_raise_hanging: 'bodyweight',
  leg_raise_lying: 'bodyweight',
  reverse_crunches: 'bodyweight',
  side_plank: 'bodyweight',
  plank: 'bodyweight',
  plank_protraction: 'bodyweight',
  stomach_vacuum: 'bodyweight',
  knee_raise_hanging: 'bodyweight',
  hanging_windshield_wipers: 'bodyweight',
  dragon_flag: 'bodyweight',
  kegel: 'bodyweight',
  breath_resistance: 'bodyweight',
  // Шея
  neck_flexion: 'bodyweight',
  neck_side: 'bodyweight',
  neck_extension: 'bodyweight',
  neck_extension_prone: 'bodyweight',
  neck_extension_side: 'bodyweight',
  // Спина / гиперэкстензия / Y-подъёмы
  hyperextension: 'bodyweight',
  y_raises_prone: 'bodyweight',
  // Ноги (тело)
  jump_squats: 'bodyweight',
  box_jumps: 'bodyweight',
  jumping_lunges: 'bodyweight',
  broad_jumps: 'bodyweight',
  single_leg_hops: 'bodyweight',
  pistol_squats: 'bodyweight',
  calf_jumps: 'bodyweight',
  calf_raise_standing: 'bodyweight',
  walk_toes_heels: 'bodyweight',
  glute_bridge_hold: 'bodyweight',

  // ============================================================
  // 'total' — снаряд / стек / блин / резинка / прочее (×1)
  // ============================================================
  // Тренажёры / блоки
  leg_curl_machine: 'total',
  leg_adduction_machine: 'total',
  leg_abduction_machine: 'total',
  reverse_fly_machine: 'total',
  reverse_pec_deck: 'total',
  lat_pulldown: 'total',
  rows_to_waist: 'total',
  cable_crossover: 'total',
  hammer_strength_press: 'total',
  hammer_strength_row: 'total',
  cable_hook_imitation: 'one',
  cable_wrist_curl: 'one',
  calf_raise_seated: 'total',
  crunches_weighted: 'total',
  // Блины / фиксированный вес / один снаряд на две руки
  weighted_breathing: 'total',
  pinch_grip_hang: 'one',
  rolling_thunder: 'one',
  fat_grip_hold: 'total',
  finger_hold_strap_handle: 'one',
  thumb_pinch: 'total',
  hand_gripper: 'total',
  sumo_squat_db: 'total',     // одна гантель двумя руками
  overhead_triceps: 'total',  // одна гантель двумя руками
  pullover_db: 'total',       // одна гантель двумя руками
  bend_with_db: 'total',      // одна гантель
  russian_twist: 'total',     // блином / без веса
  // Резинки
  leg_curl_band: 'total',
  leg_adduction_band: 'total',
  leg_abduction_band: 'total',
  side_steps_band: 'total',
  toe_curl_towel: 'total',
  lateral_raise_band: 'total',
  band_pull_apart: 'total',
  rotator_cuff_rot: 'total',
  shoulder_shrug_band: 'total',
  thumb_ip_flexion: 'total',
  finger_extension_single: 'total',
  thumb_extension_band: 'total',
  anconeus_extension: 'total',
  pinky_grip: 'total',
  finger_spread: 'total',
  leg_raise_band: 'total',
};

Object.entries(WEIGHT_MODES).forEach(([id, mode]) => {
  if(EX[id]) EX[id].weightMode = mode;
});
/* Доля собственного веса, которую реально поднимает упражнение.
   Используется, когда поле веса пустое (bodyweight).
   По умолчанию — DEFAULT_BW_FACTOR из app.js (0.65). */
const BW_FACTORS = {
  // Полный вес / почти полный
  pullups: 1.0, chin_ups: 1.0, neutral_pullups: 1.0, close_grip_pullups: 1.0,
  pullup_wide: 1.0, muscle_ups: 1.0, l_sit_pullups: 1.0, typewriter_pullups: 1.0,
  explosive_pullups: 1.0, towel_pullups: 1.0, hang_bar: 0.6, one_arm_hang: 1.0,
  front_lever: 0.8, back_lever: 0.8, dragon_flag: 0.5,
  dips: 0.95, finger_pushups: 0.75, handstand_pushups: 0.95,

  // ~60-70% (отжимания, приседы, выпады)
  pushups: 0.65, incline_feet_pushups: 0.72, hands_elevated_pushups: 0.55,
  close_pushups: 0.65, wide_pushups: 0.60, diamond_pushups: 0.68,
  clap_pushups: 0.70, archer_pushups: 0.75, pseudo_planche_pushups: 0.80,
  spiderman_pushups: 0.65, pushup_plus: 0.65,
  jump_squats: 0.65, box_jumps: 0.70, jumping_lunges: 0.60,
  broad_jumps: 0.65, single_leg_hops: 1.0, pistol_squats: 0.90,
  calf_jumps: 0.90, calf_raise_standing: 0.95, walk_toes_heels: 0.95,
  glute_bridge_hold: 0.40,

  // Кор / пресс (нагрузка сильно ниже)
  crunches: 0.15, leg_raise_hanging: 0.30, leg_raise_lying: 0.25,
  reverse_crunches: 0.20, side_plank: 0.25, plank: 0.25,
  plank_protraction: 0.25, stomach_vacuum: 0.05,
  knee_raise_hanging: 0.30, hanging_windshield_wipers: 0.25,
  breath_resistance: 0.05, kegel: 0.02,

  // Спина / шея
  hyperextension: 0.50, y_raises_prone: 0.10,
  neck_flexion: 0.05, neck_side: 0.05, neck_extension: 0.05,
  neck_extension_prone: 0.05, neck_extension_side: 0.05,
};
const EXERCISE_NAMES_I18N = {
  barbell_squat:                          { ru: 'Приседания со штангой',                                  en: 'Barbell Squat' },
  bulgarian_split:                        { ru: 'Болгарский сплит-присед',                                en: 'Bulgarian Split Squat' },
  romanian_deadlift:                      { ru: 'Румынская тяга',                                         en: 'Romanian Deadlift' },
  leg_curl_machine:                       { ru: 'Сгибание ног лежа в тренажере',                          en: 'Lying Leg Curl Machine' },
  leg_curl_band:                          { ru: 'Сгибание ноги с резинкой лежа',                          en: 'Lying Leg Curl with Band' },
  glute_bridge_weighted:                  { ru: 'Ягодичный мост со штангой/гантелью',                     en: 'Weighted Glute Bridge (Barbell/Dumbbell)' },
  glute_bridge_hold:                      { ru: 'Ягодичный мост с удержанием (тазовое дно)',              en: 'Glute Bridge Hold (Pelvic Floor)' },
  leg_abduction_band:                     { ru: 'Отведение ноги в сторону с резинкой/в кроссовере',       en: 'Standing Hip Abduction with Band/Cable' },
  sumo_squat_db:                          { ru: 'Приседания сумо с гантелью',                             en: 'Sumo Squat with Dumbbell' },
  leg_adduction_machine:                  { ru: 'Сведение ног в тренажере',                               en: 'Leg Adduction Machine' },
  leg_adduction_band:                     { ru: 'Сведение ног с резинкой',                                en: 'Leg Adduction with Band' },
  leg_abduction_machine:                  { ru: 'Разведение ног в тренажере',                             en: 'Leg Abduction Machine' },
  side_steps_band:                        { ru: 'Боковые шаги с резинкой',                                en: 'Lateral Band Walks' },
  calf_raise_standing:                    { ru: 'Подъём на носки стоя',                                   en: 'Standing Calf Raise' },
  calf_raise_seated:                      { ru: 'Подъём на носки сидя',                                   en: 'Seated Calf Raise' },
  walk_toes_heels:                        { ru: 'Ходьба на носках/пятках',                                en: 'Toe/Heel Walking' },
  toe_curl_towel:                         { ru: 'Сгибание пальцев ног с полотенцем/резинкой',             en: 'Toe Curl with Towel/Band' },
  biceps_barbell:                         { ru: 'Подъём штанги/гантелей на бицепс',                       en: 'Barbell/Dumbbell Biceps Curl' },
  hammer_curl:                            { ru: '«Молот» с гантелями',                                    en: 'Dumbbell Hammer Curl' },
  overhead_triceps:                       { ru: 'Разгибание рук из-за головы',                            en: 'Overhead Triceps Extension' },
  close_pushups:                          { ru: 'Отжимания узким хватом',                                 en: 'Close-Grip Push-ups' },
  wrist_curl:                             { ru: 'Сгибание запястий со штангой/гантелями',                 en: 'Wrist Curl with Barbell/Dumbbells' },
  wrist_extension:                        { ru: 'Разгибание запястий',                                    en: 'Wrist Extension' },
  hand_gripper:                           { ru: 'Сжимание эспандера',                                     en: 'Hand Gripper Squeeze' },
  hang_bar:                               { ru: 'Вис на турнике',                                         en: 'Dead Hang on Bar' },
  incline_db_press:                       { ru: 'Жим на наклонной вверх',                                 en: 'Incline Dumbbell Press' },
  incline_feet_pushups:                   { ru: 'Отжимания с ногами на возвышении',                       en: 'Incline Feet Push-ups' },
  bench_press:                            { ru: 'Жим лежа',                                               en: 'Bench Press' },
  pushups:                                { ru: 'Отжимания от пола',                                      en: 'Push-ups' },
  decline_press:                          { ru: 'Жим на наклонной вниз',                                  en: 'Decline Press' },
  dips:                                   { ru: 'Отжимания на брусьях',                                   en: 'Dips' },
  hands_elevated_pushups:                 { ru: 'Отжимания с руками на возвышении',                       en: 'Hands Elevated Push-ups' },
  pushup_plus:                            { ru: 'Отжимания с протракцией лопаток',                        en: 'Push-up Plus (Scapular Protraction)' },
  pullover_db:                            { ru: 'Пуловер с гантелью лежа',                                en: 'Dumbbell Pullover' },
  plank_protraction:                      { ru: 'Планка с протракцией лопаток',                           en: 'Plank with Scapular Protraction' },
  breath_resistance:                      { ru: 'Дыхание с сопротивлением на выдохе',                     en: 'Breathing with Expiratory Resistance' },
  pullups:                                { ru: 'Подтягивания',                                           en: 'Pull-ups' },
  lat_pulldown:                           { ru: 'Тяга верхнего блока',                                    en: 'Lat Pulldown' },
  shrugs:                                 { ru: 'Шраги со штангой/гантелями',                             en: 'Barbell/Dumbbell Shrugs' },
  y_raises_prone:                         { ru: 'Y-подъёмы лежа на животе',                               en: 'Prone Y-Raises' },
  upright_row:                            { ru: 'Тяга к подбородку',                                      en: 'Upright Row' },
  rows_to_waist:                          { ru: 'Тяга к поясу',                                           en: 'Row to Waist' },
  band_pull_apart:                        { ru: 'Разведение рук с резинкой',                              en: 'Band Pull-Apart' },
  reverse_fly_machine:                    { ru: 'Reverse fly в тренажере',                                en: 'Reverse Fly Machine' },
  hyperextension:                         { ru: 'Гиперэкстензия',                                         en: 'Hyperextension' },
  deadlift:                               { ru: 'Становая тяга',                                          en: 'Deadlift' },
  bend_with_db:                           { ru: 'Наклон вперёд с гантелью',                               en: 'Dumbbell Forward Bend' },
  side_bend_db:                           { ru: 'Наклоны в сторону с гантелью',                           en: 'Dumbbell Side Bend' },
  farmers_walk:                           { ru: 'Фермерская прогулка',                                    en: 'Farmer\'s Walk' },
  overhead_press_db:                      { ru: 'Жим гантелей сидя/стоя вверх',                           en: 'Seated/Standing Dumbbell Overhead Press' },
  front_raise:                            { ru: 'Подъём гантелей перед собой',                            en: 'Front Raise' },
  lateral_raise:                          { ru: 'Махи гантелями в стороны',                               en: 'Dumbbell Lateral Raise' },
  lateral_raise_band:                     { ru: 'Разведение резинкой в стороны',                          en: 'Band Lateral Raise' },
  bent_reverse_fly:                       { ru: 'Разведение гантелей в наклоне',                          en: 'Bent-Over Reverse Fly' },
  reverse_pec_deck:                       { ru: 'Обратные разведения в тренажере/с резинкой',             en: 'Reverse Pec Deck / Band Reverse Fly' },
  arm_abduction_band:                     { ru: 'Отведение руки с резинкой',                              en: 'Band Arm Abduction' },
  rotator_cuff_rot:                       { ru: 'Внутренняя/внешняя ротация с резинкой',                  en: 'Internal/External Rotation with Band' },
  crunches:                               { ru: 'Скручивания',                                            en: 'Crunches' },
  crunches_weighted:                      { ru: 'Скручивания с весом/на блоке',                           en: 'Weighted/Cable Crunches' },
  leg_raise_hanging:                      { ru: 'Подъём ног в висе',                                      en: 'Hanging Leg Raise' },
  leg_raise_lying:                        { ru: 'Подъём ног лежа',                                        en: 'Lying Leg Raise' },
  reverse_crunches:                       { ru: 'Обратные скручивания',                                   en: 'Reverse Crunches' },
  russian_twist:                          { ru: 'Русские скручивания',                                    en: 'Russian Twist' },
  side_plank:                             { ru: 'Боковая планка',                                         en: 'Side Plank' },
  plank:                                  { ru: 'Планка',                                                 en: 'Plank' },
  stomach_vacuum:                         { ru: 'Вакуум живота',                                          en: 'Stomach Vacuum' },
  knee_raise_hanging:                     { ru: 'Подъём коленей в висе',                                  en: 'Hanging Knee Raise' },
  leg_raise_band:                         { ru: 'Подъём ноги с резинкой стоя/лежа',                       en: 'Standing/Lying Leg Raise with Band' },
  kegel:                                  { ru: 'Упражнения Кегеля',                                      en: 'Kegel Exercises' },
  neck_flexion:                           { ru: 'Сгибание шеи с сопротивлением',                          en: 'Neck Flexion with Resistance' },
  neck_side:                              { ru: 'Наклоны головы в сторону с сопротивлением',              en: 'Neck Side Bend with Resistance' },
  shoulder_shrug_band:                    { ru: 'Подъём ключиц/плеч с резинкой',                          en: 'Band Shoulder Shrug/Clavicle Raise' },
  neck_extension:                         { ru: 'Разгибание шеи с сопротивлением',                        en: 'Neck Extension with Resistance' },
  neck_extension_prone:                   { ru: 'Подъём головы лежа на животе',                           en: 'Prone Neck Extension' },
  supination_db:                          { ru: 'Супинация с гантелью',                                   en: 'Dumbbell Supination' },
  pronation_db:                           { ru: 'Пронация с гантелью',                                    en: 'Dumbbell Pronation' },
  scapular_elevation:                     { ru: 'Подъём лопаток с резинкой/штангой',                      en: 'Scapular Elevation with Band/Barbell' },
  arm_adduction_band:                     { ru: 'Приведение руки через тело с резинкой',                  en: 'Band Arm Adduction Across Body' },
  thumb_ip_flexion:                       { ru: 'Сгибание большого пальца с резинкой',                    en: 'Band Thumb IP Flexion' },
  finger_extension_single:                { ru: 'Разгибание пальцев по одному с резинкой',                en: 'Single-Finger Extension with Band' },
  thumb_extension_band:                   { ru: 'Разгибание и отведение большого пальца с резинкой',      en: 'Band Thumb Extension and Abduction' },
  anconeus_extension:                     { ru: 'Разгибание предплечья с резинкой',                       en: 'Band Forearm Extension (Anconeus)' },
  thumb_pinch:                            { ru: 'Сжатие большого пальца (pinch grip)',                    en: 'Thumb Pinch Grip' },
  pinky_grip:                             { ru: 'Сжатие мизинца с сопротивлением',                        en: 'Pinky Grip Squeeze' },
  finger_spread:                          { ru: 'Разведение пальцев с резинкой',                          en: 'Band Finger Spread' },
  cable_crossover:                        { ru: 'Сведение рук на блоке (кроссовер)',                      en: 'Cable Crossover' },
  pinch_grip_hang:                        { ru: 'Щипковый хват на пальцы (удержание блина/диска)',        en: 'Pinch Grip Plate Hold' },
  cable_hook_imitation:                   { ru: 'Имитация борьбы в крюк на блоке',                        en: 'Cable Hook Grip Imitation' },
  rolling_thunder:                        { ru: 'Ролик Тандер (Rolling Thunder) на удержание',            en: 'Rolling Thunder Hold' },
  diamond_pushups:                        { ru: 'Алмазные отжимания (узкий хват)',                        en: 'Diamond Push-ups' },
  clap_pushups:                           { ru: 'Отжимания с хлопком (плиометрика)',                      en: 'Clap Push-ups' },
  handstand_pushups:                      { ru: 'Отжимания в стойке на руках',                            en: 'Handstand Push-ups' },
  wide_pushups:                           { ru: 'Отжимания с широкой постановкой рук',                    en: 'Wide Push-ups' },
  chin_ups:                               { ru: 'Подтягивания обратным хватом',                           en: 'Chin-ups' },
  neutral_pullups:                        { ru: 'Подтягивания нейтральным хватом',                        en: 'Neutral-Grip Pull-ups' },
  muscle_ups:                             { ru: 'Выходы силой на турнике',                                en: 'Muscle-ups' },
  l_sit_pullups:                          { ru: 'Подтягивания уголком (L-sit)',                           en: 'L-Sit Pull-ups' },
  jump_squats:                            { ru: 'Выпрыгивания из приседа',                                en: 'Jump Squats' },
  box_jumps:                              { ru: 'Запрыгивания на тумбу',                                  en: 'Box Jumps' },
  jumping_lunges:                         { ru: 'Выпады с выпрыгиванием (разножка)',                      en: 'Jumping Lunges' },
  broad_jumps:                            { ru: 'Прыжки в длину с места',                                 en: 'Broad Jumps' },
  single_leg_hops:                        { ru: 'Прыжки на одной ноге',                                   en: 'Single-Leg Hops' },
  towel_pullups:                          { ru: 'Подтягивания с полотенцем',                              en: 'Towel Pull-ups' },
  hammer_strength_press:                  { ru: 'Жим на тренажере Хаммер',                                en: 'Hammer Strength Press' },
  front_lever:                            { ru: 'Выход в горизонт на турнике (Front Lever)',              en: 'Front Lever' },
  hammer_strength_row:                    { ru: 'Тяга на тренажере Хаммер',                               en: 'Hammer Strength Row' },
  pullup_wide:                            { ru: 'Подтягивания широким хватом',                            en: 'Wide-Grip Pull-ups' },
  typewriter_pullups:                     { ru: 'Подтягивания «Печатная машинка»',                        en: 'Typewriter Pull-ups' },
  dragon_flag:                            { ru: 'Флаг дракона (Dragon Flag)',                             en: 'Dragon Flag' },
  hanging_windshield_wipers:              { ru: 'Дворники в висе на турнике',                             en: 'Hanging Windshield Wipers' },
  fat_grip_hold:                          { ru: 'Удержание толстой рукоятки (Fat Grip)',                  en: 'Fat Grip Hold' },
  one_arm_hang:                           { ru: 'Вис на одной руке',                                      en: 'One-Arm Hang' },
  archer_pushups:                         { ru: 'Отжимания лучника',                                      en: 'Archer Push-ups' },
  pseudo_planche_pushups:                 { ru: 'Псевдо-планше отжимания',                                en: 'Pseudo Planche Push-ups' },
  spiderman_pushups:                      { ru: 'Отжимания Человека-паука',                               en: 'Spider-Man Push-ups' },
  explosive_pullups:                      { ru: 'Взрывные подтягивания с хлопком',                        en: 'Explosive Clap Pull-ups' },
  back_lever:                             { ru: 'Выход в горизонт спиной (Back Lever)',                   en: 'Back Lever' },
  pistol_squats:                          { ru: 'Приседания «Пистолетик» на одной ноге',                  en: 'Pistol Squats' },
  db_forearm_lever:                       { ru: 'Рычаг с гантелью на скамье (пронация/супинация)',         en: 'Dumbbell Forearm Lever (Pronation/Supination)' },
  db_hip_abduction:                       { ru: 'Отведение ноги с гантелью/блином в упоре',               en: 'Dumbbell Hip Abduction' },
  db_arm_adduction:                       { ru: 'Приведение руки через тело с гантелью',                  en: 'Dumbbell Arm Adduction Across Body' },
  db_thumb_flexion:                       { ru: 'Сгибание большого пальца с гантелью/блином',             en: 'Dumbbell Thumb Flexion' },
  plate_finger_extension:                 { ru: 'Разгибание пальцев под блином/гантелью',                 en: 'Plate Finger Extension' },
  db_thumb_extension:                     { ru: 'Разгибание/отведение большого пальца с гантелью',        en: 'Dumbbell Thumb Extension/Abduction' },
  plate_pinky_grip:                       { ru: 'Сжатие мизинца с блином/гантелью',                       en: 'Plate Pinky Grip' },
  plate_finger_spread:                    { ru: 'Удержание блина пальцами в разведённом положении',       en: 'Plate Finger Spread Hold' },
  weighted_breathing:                     { ru: 'Дыхание с блином на груди',                              en: 'Weighted Breathing with Plate' },
  cable_wrist_curl:                       { ru: 'Заворот кисти на блоке',                                 en: 'Cable Wrist Curl' },
  pronation_forearm_free_weight:          { ru: 'Пронация предплечья, свободный вес',                     en: 'Free-Weight Forearm Pronation' },
  radial_ulnar_deviation_free_weight:     { ru: 'Луч через кисть, свободный вес ',                        en: 'Free-Weight Radial/Ulnar Deviation' },
  isolated_wrist_abduction_free_weight:   { ru: 'Изолированное отведение кисти свободный вес',            en: 'Free-Weight Isolated Wrist Abduction' },
  wrist_curl_extension_free_weight:       { ru: 'Кисть с гантелью свободный вес',                          en: 'Free-Weight Wrist Curl/Extension' },
  finger_hold_strap_handle:               { ru: 'Удержание рукоятки на лямках пальцами (Finger Hold)',     en: 'Finger Hold on Strap Handle' },
  bent_over_row_chest:                    { ru: 'Тяга к груди в наклоне (штанга/гантели)',                 en: 'Bent-Over Row to Chest (Barbell/Dumbbells)' },
  bent_over_row_waist:                    { ru: 'Тяга к поясу в наклоне (штанга/гантели)',                 en: 'Bent-Over Row to Waist (Barbell/Dumbbells)' },
  calf_jumps:                             { ru: 'Прыжки на носках стоя',                                  en: 'Calf Jumps' },
  neck_extension_side:                    { ru: 'Разгибание шеи лежа на боку (в обе стороны)',             en: 'Side-Lying Neck Extension' },
  close_grip_pullups:                     { ru: 'Подтягивания узким хватом',                              en: 'Close-Grip Pull-ups' },
  dumbbell_flyes:                         { ru: 'Сведение гантелей лежа',                                 en: 'Dumbbell Flyes' },
  finger_pushups:                         { ru: 'Отжимания на пальцах',                                   en: 'Finger Push-ups' },
  seated_external_rotation:               { ru: 'Внешняя ротация плеча сидя (с резинкой/гантелью)',        en: 'Seated Shoulder External Rotation' },
  standing_shoulder_rotation:             { ru: 'Боковые повороты плеч стоя (с гантелями)',                en: 'Standing Shoulder Rotation' },
  side_lying_external_rotation:           { ru: 'Боковая ротация лёжа (внешняя ротация плеча)',            en: 'Side-Lying External Rotation' },
};
const MARKER_I18N = {
  'Гантели/Штанга/Гиря': { ru: 'Гантели/Штанга/Гиря', en: 'Dumbbells/Barbell/Kettlebell' },
  'Волейбол':            { ru: 'Волейбол',            en: 'Volleyball' },
  'Собственный вес':     { ru: 'Собственный вес',     en: 'Bodyweight' },
  'Тренажер':            { ru: 'Тренажер',            en: 'Machine' },
  'Резинка':             { ru: 'Резинка',             en: 'Band' },
  'Армрестлинг':         { ru: 'Армрестлинг',         en: 'Armwrestling' }
};
Object.entries(BW_FACTORS).forEach(([id, f]) => {
  if(EX[id]) EX[id].bwFactor = f;
});
