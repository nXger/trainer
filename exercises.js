const EX = {
  barbell_squat: { name:'Приседания со штангой', sets:4, reps:'12-15',
    muscles:{quads:41,glutes:24,adductors:16,hamstrings:7,erectors:12},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  bulgarian_split: { name:'Болгарский сплит-присед', sets:4, reps:'12-15',
    muscles:{quads:44,glutes:30,adductors:11,hamstrings:9,erectors:6},
    markers:['Гантели/Штанга/Гиря','Собственный вес','Волейбол'] },

  romanian_deadlift: { name:'Румынская тяга', sets:4, reps:'12-15',
    muscles:{hamstrings:40,glutes:37,erectors:17,adductors:6},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  leg_curl_machine: { name:'Сгибание ног лежа в тренажере', sets:4, reps:'12-15',
    muscles:{hamstrings:91,calves:9},
    markers:['Тренажер','Волейбол'] },

  leg_curl_band: { name:'Сгибание ноги с резинкой лежа', sets:4, reps:'12-15',
    muscles:{hamstrings:94,calves:6},
    markers:['Резинка'] },

  glute_bridge_weighted: { name:'Ягодичный мост со штангой/гантелью', sets:4, reps:'12-15',
    muscles:{glutes:48,hamstrings:27,pelvic_floor:11,erectors:9,quads:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  glute_bridge_hold: { name:'Ягодичный мост с удержанием (тазовое дно)', sets:4, reps:'12-15',
    muscles:{glutes:61,hamstrings:17,pelvic_floor:17,erectors:5},
    markers:['Собственный вес'] },

  leg_abduction_band: { name:'Отведение ноги в сторону с резинкой/в кроссовере', sets:4, reps:'12-15',
    muscles:{abductors:89,glutes:11},
    markers:['Резинка','Тренажер'] },

  sumo_squat_db: { name:'Приседания сумо с гантелью', sets:4, reps:'12-15',
    muscles:{adductors:33,quads:28,glutes:28,hamstrings:6,erectors:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  leg_adduction_machine: { name:'Сведение ног в тренажере', sets:4, reps:'12-15',
    muscles:{adductors:100},
    markers:['Тренажер'] },

  leg_adduction_band: { name:'Сведение ног с резинкой', sets:4, reps:'12-15',
    muscles:{adductors:100},
    markers:['Резинка'] },

  leg_abduction_machine: { name:'Разведение ног в тренажере', sets:4, reps:'12-15',
    muscles:{abductors:95,glutes:5},
    markers:['Тренажер'] },

  side_steps_band: { name:'Боковые шаги с резинкой', sets:4, reps:'12-15',
    muscles:{abductors:82,glutes:12,quads:6},
    markers:['Резинка','Волейбол'] },

  calf_raise_standing: { name:'Подъём на носки стоя', sets:4, reps:'12-15',
    muscles:{calves:87,foot:13},
    markers:['Собственный вес','Волейбол'] },

  calf_raise_seated: { name:'Подъём на носки сидя', sets:4, reps:'12-15',
    muscles:{calves:87,foot:13},
    markers:['Тренажер','Гантели/Штанга/Гиря','Волейбол'] },

  walk_toes_heels: { name:'Ходьба на носках/пятках', sets:4, reps:'12-15',
    muscles:{foot:53,calves:47},
    markers:['Собственный вес','Волейбол'] },

  toe_curl_towel: { name:'Сгибание пальцев ног с полотенцем/резинкой', sets:4, reps:'12-15',
    muscles:{foot:90,calves:10},
    markers:['Резинка'] },

  biceps_barbell: { name:'Подъём штанги/гантелей на бицепс', sets:4, reps:'12-15',
    muscles:{biceps:56,brachialis:22,brachioradialis:17,supinator:5},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  hammer_curl: { name:'«Молот» с гантелями', sets:4, reps:'12-15',
    muscles:{brachialis:33,brachioradialis:28,biceps:22,supinator:6,pronators:6,fcr:5},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  overhead_triceps: { name:'Разгибание рук из-за головы', sets:4, reps:'12-15',
    muscles:{triceps:93,delts:7},
    markers:['Гантели/Штанга/Гиря'] },

  close_pushups: { name:'Отжимания узким хватом', sets:4, reps:'12-15',
    muscles:{triceps:40,pectoralis_major:34,delts:14,coracobrachialis:6,serratus:6},
    markers:['Собственный вес'] },

  wrist_curl: { name:'Сгибание запястий со штангой/гантелями', sets:4, reps:'12-15',
    muscles:{fcr:33,fcu:28,fds:20,fdp:13,fpl:6},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  wrist_extension: { name:'Разгибание запястий', sets:4, reps:'12-15',
    muscles:{finger_extensors:40,ecrl:20,ecrb:18,ecu:16,ei:6},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  hand_gripper: { name:'Сжимание эспандера', sets:4, reps:'12-15',
    muscles:{fds:29,fdp:26,fcr:21,fcu:18,fpb:6},
    markers:['Армрестлинг'] },
   hang_bar: { name:'Вис на турнике', sets:4, reps:'30-60 сек',
    muscles:{fds:24,fdp:18,fcr:15,fcu:13,brachioradialis:10,biceps:7,lats:8,traps:5},
    markers:['Собственный вес','Армрестлинг'] },

  incline_db_press: { name:'Жим на наклонной вверх', sets:4, reps:'12-15',
    muscles:{pectoralis_major:40,delts:22,triceps:20,coracobrachialis:8,serratus:5,rotator_cuff:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  incline_feet_pushups: { name:'Отжимания с ногами на возвышении', sets:4, reps:'12-15',
    muscles:{pectoralis_major:42,delts:25,triceps:20,serratus:7,coracobrachialis:6},
    markers:['Собственный вес'] },

  bench_press: { name:'Жим лежа', sets:4, reps:'12-15',
    muscles:{pectoralis_major:48,triceps:23,delts:18,coracobrachialis:6,serratus:5},
    markers:['Гантели/Штанга/Гиря'] },

  pushups: { name:'Отжимания от пола', sets:4, reps:'12-15',
    muscles:{pectoralis_major:44,triceps:28,delts:16,coracobrachialis:7,serratus:5},
    markers:['Собственный вес'] },

  decline_press: { name:'Жим на наклонной вниз', sets:4, reps:'12-15',
    muscles:{pectoralis_major:60,triceps:25,delts:10,coracobrachialis:5},
    markers:['Гантели/Штанга/Гиря'] },

  dips: { name:'Отжимания на брусьях', sets:4, reps:'12-15',
    muscles:{pectoralis_major:42,triceps:37,delts:15,coracobrachialis:6},
    markers:['Собственный вес'] },

  hands_elevated_pushups: { name:'Отжимания с руками на возвышении', sets:4, reps:'12-15',
    muscles:{pectoralis_major:50,triceps:35,delts:10,coracobrachialis:5},
    markers:['Собственный вес'] },

  pushup_plus: { name:'Отжимания с протракцией лопаток', sets:4, reps:'12-15',
    muscles:{serratus:45,pectoralis_minor:30,pectoralis_major:15,delts:10},
    markers:['Собственный вес','Волейбол'] },

  pullover_db: { name:'Пуловер с гантелью лежа', sets:4, reps:'12-15',
    muscles:{pectoralis_major:25,pectoralis_minor:20,serratus:15,lats:20,teres:10,triceps:5,intercostals:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  plank_protraction: { name:'Планка с протракцией лопаток', sets:4, reps:'30-60 сек',
    muscles:{serratus:45,transverse:25,rectus_abdominis:15,obliques:10,pectoralis_minor:5},
    markers:['Собственный вес','Волейбол'] },

  breath_resistance: { name:'Дыхание с сопротивлением на выдохе', sets:4, reps:'10-15',
    muscles:{intercostals:60,transverse:20,rectus_abdominis:10,obliques:10},
    markers:['Собственный вес','Волейбол'] },

  pullups: { name:'Подтягивания', sets:4, reps:'12-15',
    muscles:{lats:40,biceps:20,teres:12,rhomboids:10,traps:8,brachioradialis:5,rear_delts:5},
    markers:['Собственный вес','Волейбол'] },

  lat_pulldown: { name:'Тяга верхнего блока', sets:4, reps:'12-15',
    muscles:{lats:44,biceps:21,teres:12,rhomboids:10,traps:8,rear_delts:5},
    markers:['Тренажер','Волейбол'] },

  shrugs: { name:'Шраги со штангой/гантелями', sets:4, reps:'12-15',
    muscles:{traps:70,levator_scapulae:15,rhomboids:10,rear_delts:5},
    markers:['Гантели/Штанга/Гиря'] },

  y_raises_prone: { name:'Y-подъёмы лежа на животе', sets:4, reps:'12-15',
    muscles:{traps:50,rear_delts:20,rhomboids:15,levator_scapulae:10,rotator_cuff:5},
    markers:['Собственный вес','Волейбол'] },

  upright_row: { name:'Тяга к подбородку', sets:4, reps:'12-15',
    muscles:{traps:35,delts:25,rear_delts:15,rhomboids:10,biceps:8,brachioradialis:7},
    markers:['Гантели/Штанга/Гиря'] },

  rows_to_waist: { name:'Тяга к поясу', sets:4, reps:'12-15',
    muscles:{rhomboids:35,lats:30,rear_delts:15,traps:10,biceps:10},
    markers:['Тренажер'] },

  band_pull_apart: { name:'Разведение рук с резинкой', sets:4, reps:'12-15',
    muscles:{rear_delts:40,rhomboids:25,traps:20,rotator_cuff:10,levator_scapulae:5},
    markers:['Резинка','Волейбол'] },

  reverse_fly_machine: { name:'Reverse fly в тренажере', sets:4, reps:'12-15',
    muscles:{rear_delts:45,rhomboids:25,traps:15,rotator_cuff:10,levator_scapulae:5},
    markers:['Тренажер','Волейбол'] },

  hyperextension: { name:'Гиперэкстензия', sets:4, reps:'12-15',
    muscles:{erectors:45,glutes:30,hamstrings:15,ql:5,obliques:5},
    markers:['Собственный вес','Волейбол'] },

  deadlift: { name:'Становая тяга', sets:4, reps:'12-15',
    muscles:{erectors:35,glutes:27,hamstrings:18,quads:10,traps:5,lats:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  bend_with_db: { name:'Наклон вперёд с гантелью', sets:4, reps:'12-15',
    muscles:{erectors:40,glutes:30,hamstrings:20,ql:5,obliques:5},
    markers:['Гантели/Штанга/Гиря'] },

  side_bend_db: { name:'Наклоны в сторону с гантелью', sets:4, reps:'12-15',
    muscles:{ql:55,obliques:35,erectors:10},
    markers:['Гантели/Штанга/Гиря'] },

  farmers_walk: { name:'Фермерская прогулка', sets:4, reps:'30-60 сек',
    muscles:{ql:25,erectors:25,fcr:15,fcu:15,traps:10,rectus_abdominis:5,obliques:5},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

 overhead_press_db: { name:'Жим гантелей сидя/стоя вверх', sets:4, reps:'12-15',
    muscles:{delts:62,triceps:15,traps:8,rotator_cuff:5,serratus:5,pectoralis_major:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  front_raise: { name:'Подъём гантелей перед собой', sets:4, reps:'12-15',
    muscles:{delts:60,pectoralis_major:20,coracobrachialis:8,serratus:7,traps:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  lateral_raise: { name:'Махи гантелями в стороны', sets:4, reps:'12-15',
    muscles:{delts:75,rotator_cuff:10,traps:10,levator_scapulae:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  lateral_raise_band: { name:'Разведение резинкой в стороны', sets:4, reps:'12-15',
    muscles:{delts:55,traps:25,rotator_cuff:10,levator_scapulae:5,rhomboids:5},
    markers:['Резинка','Волейбол'] },

  bent_reverse_fly: { name:'Разведение гантелей в наклоне', sets:4, reps:'12-15',
    muscles:{rear_delts:45,rhomboids:20,traps:15,rotator_cuff:10,levator_scapulae:5,teres:5},
    markers:['Гантели/Штанга/Гиря','Волейбол'] },

  reverse_pec_deck: { name:'Обратные разведения в тренажере/с резинкой', sets:4, reps:'12-15',
    muscles:{rear_delts:50,rhomboids:25,traps:10,rotator_cuff:10,levator_scapulae:5},
    markers:['Тренажер','Резинка','Волейбол'] },

  arm_abduction_band: { name:'Отведение руки с резинкой', sets:4, reps:'12-15',
    muscles:{rotator_cuff:60,delts:25,traps:10,levator_scapulae:5},
    markers:['Резинка','Армрестлинг','Волейбол'] },

  rotator_cuff_rot: { name:'Внутренняя/внешняя ротация с резинкой', sets:4, reps:'12-15',
    muscles:{rotator_cuff:85,delts:10,teres:5},
    markers:['Резинка','Армрестлинг','Волейбол'] },

  crunches: { name:'Скручивания', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:55,obliques:30,transverse:10,iliopsoas:5},
    markers:['Собственный вес','Волейбол'] },

  crunches_weighted: { name:'Скручивания с весом/на блоке', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:55,obliques:30,transverse:10,iliopsoas:5},
    markers:['Гантели/Штанга/Гиря','Тренажер','Волейбол'] },

  leg_raise_hanging: { name:'Подъём ног в висе', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:35,iliopsoas:35,obliques:10,transverse:10,lats:5,fds:5},
    markers:['Собственный вес','Волейбол'] },

  leg_raise_lying: { name:'Подъём ног лежа', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:45,iliopsoas:35,obliques:10,transverse:10},
    markers:['Собственный вес','Волейбол'] },

  reverse_crunches: { name:'Обратные скручивания', sets:4, reps:'12-15',
    muscles:{rectus_abdominis:50,obliques:25,transverse:10,iliopsoas:15},
    markers:['Собственный вес','Волейбол'] },

  russian_twist: { name:'Русские скручивания', sets:4, reps:'12-15',
    muscles:{obliques:50,rectus_abdominis:30,transverse:10,iliopsoas:10},
    markers:['Собственный вес','Волейбол'] },

  side_plank: { name:'Боковая планка', sets:4, reps:'30-60 сек',
    muscles:{obliques:40,transverse:20,ql:20,rectus_abdominis:10,glutes:5,abductors:5},
    markers:['Собственный вес','Волейбол'] },

  plank: { name:'Планка', sets:4, reps:'30-60 сек',
    muscles:{transverse:35,rectus_abdominis:30,obliques:20,serratus:5,delts:5,glutes:5},
    markers:['Собственный вес','Волейбол'] },

  stomach_vacuum: { name:'Вакуум живота', sets:4, reps:'10-15',
    muscles:{transverse:80,obliques:10,rectus_abdominis:10},
    markers:['Собственный вес'] },

  knee_raise_hanging: { name:'Подъём коленей в висе', sets:4, reps:'12-15',
    muscles:{iliopsoas:40,rectus_abdominis:35,obliques:10,transverse:10,lats:5},
    markers:['Собственный вес','Волейбол'] },

  leg_raise_band: { name:'Подъём ноги с резинкой стоя/лежа', sets:4, reps:'12-15',
    muscles:{iliopsoas:60,quads:20,rectus_abdominis:10,transverse:5,obliques:5},
    markers:['Резинка'] },

  kegel: { name:'Упражнения Кегеля', sets:4, reps:'12-15',
    muscles:{pelvic_floor:75,transverse:15,glutes:10},
    markers:['Собственный вес'] },

  neck_flexion: { name:'Сгибание шеи с сопротивлением', sets:4, reps:'12-15',
    muscles:{scm:55,scalenes:35,neck_extensors:10},
    markers:['Собственный вес'] },

  neck_side: { name:'Наклоны головы в сторону с сопротивлением', sets:4, reps:'12-15',
    muscles:{scm:55,scalenes:30,neck_extensors:15},
    markers:['Собственный вес'] },

  shoulder_shrug_band: { name:'Подъём ключиц/плеч с резинкой', sets:4, reps:'12-15',
    muscles:{traps:65,scalenes:20,levator_scapulae:10,rhomboids:5},
    markers:['Резинка'] },

  neck_extension: { name:'Разгибание шеи с сопротивлением', sets:4, reps:'12-15',
    muscles:{neck_extensors:85,scm:10,scalenes:5},
    markers:['Собственный вес'] },

  neck_extension_prone: { name:'Подъём головы лежа на животе', sets:4, reps:'12-15',
    muscles:{neck_extensors:85,traps:10,scm:5},
    markers:['Собственный вес'] },

   supination_db: { name:'Супинация с гантелью', sets:3, reps:'12-15',
    muscles:{supinator:60,biceps:25,brachioradialis:10,brachialis:5},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  pronation_db: { name:'Пронация с гантелью', sets:3, reps:'12-15',
    muscles:{pronators:70,fcr:10,fcu:10,brachioradialis:5,supinator:5},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  scapular_elevation: { name:'Подъём лопаток с резинкой/штангой', sets:4, reps:'12-15',
    muscles:{levator_scapulae:45,traps:35,rhomboids:10,scalenes:5,neck_extensors:5},
    markers:['Резинка','Гантели/Штанга/Гиря','Волейбол'] },

  arm_adduction_band: { name:'Приведение руки через тело с резинкой', sets:4, reps:'12-15',
    muscles:{coracobrachialis:35,pectoralis_major:30,lats:15,teres:10,delts:10},
    markers:['Резинка','Армрестлинг'] },

  thumb_ip_flexion: { name:'Сгибание большого пальца с резинкой', sets:3, reps:'12-15',
    muscles:{fpl:45,fpb:25,adductor_pollicis:15,opponens_pollicis:10,fds:5},
    markers:['Резинка','Армрестлинг'] },

  finger_extension_single: { name:'Разгибание пальцев по одному с резинкой', sets:3, reps:'12-15',
    muscles:{ei:30,edm:25,finger_extensors:35,lumbricals:5,interossei:5},
    markers:['Резинка','Армрестлинг'] },

  thumb_extension_band: { name:'Разгибание и отведение большого пальца с резинкой', sets:3, reps:'12-15',
    muscles:{apl:30,thumb_extensors:55,apb:10,interossei:5},
    markers:['Резинка','Армрестлинг'] },

  anconeus_extension: { name:'Разгибание предплечья с резинкой', sets:3, reps:'12-15',
    muscles:{triceps:90,brachialis:5,delts:5},
    markers:['Резинка','Армрестлинг'] },

  thumb_pinch: { name:'Сжатие большого пальца (pinch grip)', sets:3, reps:'10-15',
    muscles:{fpb:25,apb:20,opponens_pollicis:20,adductor_pollicis:25,fpl:10},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  pinky_grip: { name:'Сжатие мизинца с сопротивлением', sets:3, reps:'12-15',
    muscles:{adm:25,fdm:25,opponens_digiti_minimi:30,fds:10,fdp:10},
    markers:['Резинка','Армрестлинг'] },

  finger_spread: { name:'Разведение пальцев с резинкой', sets:3, reps:'12-15',
    muscles:{lumbricals:35,interossei:55,finger_extensors:10},
    markers:['Резинка','Армрестлинг'] },

  cable_crossover: { name:'Сведение рук на блоке (кроссовер)', sets:4, reps:'12-15',
    muscles:{pectoralis_major:60,delts:20,coracobrachialis:10,serratus:5,pectoralis_minor:5},
    markers:['Тренажер','Волейбол'] },

  pinch_grip_hang: { name:'Щипковый хват на пальцы (удержание блина/диска)', sets:4, reps:'30-60 сек',
    muscles:{fds:30,fdp:30,fcr:10,fcu:10,fpl:10,adductor_pollicis:10},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  cable_hook_imitation: { name:'Имитация борьбы в крюк на блоке', sets:4, reps:'12-15',
    muscles:{brachialis:30,brachioradialis:25,fcr:15,fcu:15,biceps:10,pronators:5},
    markers:['Тренажер','Армрестлинг'] },

  rolling_thunder: { name:'Ролик Тандер (Rolling Thunder) на удержание', sets:4, reps:'30-60 сек',
    muscles:{fds:30,fdp:30,fcr:15,fcu:15,fpl:5,adductor_pollicis:5},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },

  diamond_pushups: { name:'Алмазные отжимания (узкий хват)', sets:4, reps:'12-15',
    muscles:{triceps:55,pectoralis_major:25,delts:10,serratus:5,coracobrachialis:5},
    markers:['Собственный вес','Волейбол'] },

  clap_pushups: { name:'Отжимания с хлопком (плиометрика)', sets:4, reps:'8-12',
    muscles:{pectoralis_major:35,triceps:35,delts:15,serratus:10,coracobrachialis:5},
    markers:['Собственный вес','Волейбол'] },

  handstand_pushups: { name:'Отжимания в стойке на руках', sets:4, reps:'6-10',
    muscles:{delts:50,triceps:25,pectoralis_major:10,traps:5,serratus:5,rotator_cuff:5},
    markers:['Собственный вес','Волейбол'] },

  wide_pushups: { name:'Отжимания с широкой постановкой рук', sets:4, reps:'12-15',
    muscles:{pectoralis_major:60,delts:20,triceps:10,serratus:5,coracobrachialis:5},
    markers:['Собственный вес','Волейбол'] },

  chin_ups: { name:'Подтягивания обратным хватом', sets:4, reps:'8-12',
    muscles:{lats:35,biceps:30,rhomboids:10,teres:10,traps:5,brachialis:5,rear_delts:5},
    markers:['Собственный вес','Волейбол'] },

  neutral_pullups: { name:'Подтягивания нейтральным хватом', sets:4, reps:'8-12',
    muscles:{lats:40,brachialis:20,biceps:15,rhomboids:10,teres:5,traps:5,rear_delts:5},
    markers:['Собственный вес','Волейбол'] },

  muscle_ups: { name:'Выходы силой на турнике', sets:4, reps:'4-8',
    muscles:{lats:30,triceps:20,pectoralis_major:15,delts:15,biceps:10,rhomboids:5,serratus:5},
    markers:['Собственный вес','Волейбол'] },

  l_sit_pullups: { name:'Подтягивания уголком (L-sit)', sets:4, reps:'6-10',
    muscles:{lats:35,rectus_abdominis:25,iliopsoas:15,biceps:10,obliques:5,transverse:5,fds:5},
    markers:['Собственный вес','Волейбол'] },

  // ========== ВЫПРЫГИВАНИЯ ==========
jump_squats: { name:'Выпрыгивания из приседа', sets:4, reps:'12-15',
  muscles:{quads:40,glutes:30,calves:20,hamstrings:5,transverse:5},
  markers:['Собственный вес', 'Волейбол'] },
box_jumps: { name:'Запрыгивания на тумбу', sets:4, reps:'8-12',
  muscles:{quads:35,glutes:35,calves:20,hamstrings:5,transverse:5},
  markers:['Тренажер', 'Волейбол', 'Собственный вес'] },
jumping_lunges: { name:'Выпады с выпрыгиванием (разножка)', sets:4, reps:'12-15',
  muscles:{quads:45,glutes:25,hamstrings:15,calves:10,transverse:5},
  markers:['Собственный вес', 'Волейбол'] },
broad_jumps: { name:'Прыжки в длину с места', sets:4, reps:'6-10',
  muscles:{glutes:35,quads:30,calves:20,hamstrings:10,transverse:5},
  markers:['Собственный вес', 'Волейбол'] },
single_leg_hops: { name:'Прыжки на одной ноге', sets:4, reps:'10-15',
  muscles:{quads:35,calves:25,glutes:25,hamstrings:5,transverse:5,abductors:5},
  markers:['Собственный вес', 'Волейбол'] },
  
towel_pullups: { name:'Подтягивания с полотенцем', sets:4, reps:'8-12',
  muscles:{lats:35,biceps:18,brachialis:9,brachioradialis:9,fcr:8,fcu:8,fds:7,fdp:6},
  markers:['Армрестлинг', 'Волейбол', 'Собственный вес'] },
hammer_strength_press: { name:'Жим на тренажере Хаммер', sets:4, reps:'12-15',
  muscles:{pectoralis_major:50,triceps:25,delts:15,serratus:5,rotator_cuff:5},
  markers:['Тренажер'] },
front_lever: { name:'Выход в горизонт на турнике (Front Lever)', sets:4, reps:'15-30 сек',
  muscles:{rectus_abdominis:30,lats:25,transverse:20,obliques:10,iliopsoas:10,serratus:5},
  markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

// ========== ДОПОЛНИТЕЛЬНЫЕ ПОЛЕЗНЫЕ УПРАЖНЕНИЯ ==========
// Спина и плечи (Тренажеры)
hammer_strength_row: { name:'Тяга на тренажере Хаммер', sets:4, reps:'12-15',
  muscles:{lats:40,rhomboids:25,rear_delts:15,traps:10,biceps:5,brachialis:5},
  markers:['Тренажер'] },
pullup_wide: { name:'Подтягивания широким хватом', sets:4, reps:'8-12',
  muscles:{lats:50,teres:15,rhomboids:10,traps:5,biceps:10,brachialis:5,brachioradialis:5},
  markers:['Волейбол', 'Собственный вес'] },
typewriter_pullups: { name:'Подтягивания «Печатная машинка»', sets:3, reps:'6-10',
  muscles:{lats:40,biceps:20,obliques:15,brachialis:10,rhomboids:5,teres:5,brachioradialis:5},
  markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

// Кор и пресс (Продвинутые)
dragon_flag: { name:'Флаг дракона (Dragon Flag)', sets:4, reps:'8-12',
  muscles:{rectus_abdominis:45,transverse:20,obliques:15,iliopsoas:10,lats:5,erectors:5},
  markers:['Волейбол', 'Собственный вес'] },
hanging_windshield_wipers: { name:'Дворники в висе на турнике', sets:4, reps:'8-12',
  muscles:{obliques:40,rectus_abdominis:25,transverse:15,iliopsoas:10,lats:5,fcr:5},
  markers:['Волейбол', 'Собственный вес'] },

// Хват и предплечья (для Армрестлинга)
fat_grip_hold: { name:'Удержание толстой рукоятки (Fat Grip)', sets:4, reps:'30-60 сек',
  muscles:{fds:30,fdp:30,fcr:15,fcu:15,brachioradialis:10},
  markers:['Армрестлинг', 'Гантели/Штанга/Гиря'] },

one_arm_hang: { name:'Вис на одной руке', sets:4, reps:'10-30 сек',
  muscles:{fcr:25,fcu:25,fds:20,fdp:20,brachioradialis:10},
  markers:['Армрестлинг', 'Собственный вес'] },
  
archer_pushups: { name:'Отжимания лучника', sets:4, reps:'10-12',
  muscles:{pectoralis_major:40,triceps:30,delts:10,serratus:10,transverse:5,obliques:5},
  markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

// Дополнительные упражнения на грудь и трицепс (Калистеника)
pseudo_planche_pushups: { name:'Псевдо-планше отжимания', sets:4, reps:'8-12',
  muscles:{pectoralis_major:35,delts:25,triceps:20,serratus:10,rectus_abdominis:5,rotator_cuff:5},
  markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },
spiderman_pushups: { name:'Отжимания Человека-паука', sets:4, reps:'12-15',
  muscles:{pectoralis_major:40,triceps:25,obliques:15,rectus_abdominis:10,serratus:5,delts:5},
  markers:['Волейбол', 'Собственный вес'] },

// Дополнительные упражнения на спину и турник
explosive_pullups: { name:'Взрывные подтягивания с хлопком', sets:4, reps:'6-10',
  muscles:{lats:40,biceps:20,rhomboids:15,traps:10,brachialis:5,brachioradialis:5,erectors:5},
  markers:['Волейбол', 'Собственный вес'] },
back_lever: { name:'Выход в горизонт спиной (Back Lever)', sets:4, reps:'15-30 сек',
  muscles:{lats:30,rectus_abdominis:25,erectors:20,transverse:10,obliques:5,delts:5,rotator_cuff:5},
  markers:['Волейбол', 'Армрестлинг', 'Собственный вес'] },

// Дополнительные упражнения на ноги (Односторонняя сила)
pistol_squats: { name:'Приседания «Пистолетик» на одной ноге', sets:4, reps:'8-12',
  muscles:{quads:45,glutes:25,hamstrings:10,calves:10,transverse:5,abductors:5},
  markers:['Волейбол', 'Собственный вес'] },

// Специфично для Армрестлинга (Предплечье)
db_forearm_lever: { name:'Рычаг с гантелью на скамье (пронация/супинация)', sets:4, reps:'12-15',
  muscles:{pronators:45,supinator:35,fcr:5,fcu:5,brachioradialis:5,fds:5},
  markers:['Гантели/Штанга/Гиря','Армрестлинг'] },
db_hip_abduction: { name:'Отведение ноги с гантелью/блином в упоре', sets:4, reps:'12-15',
  muscles:{abductors:80,glutes:10,ql:5,transverse:5},
  markers:['Гантели/Штанга/Гиря'] },

  // Руки и предплечья (Свободный вес / Армрестлинг)
  db_arm_adduction: { name:'Приведение руки через тело с гантелью', sets:4, reps:'12-15',
    muscles:{coracobrachialis:45,pectoralis_major:30,delts:15,rotator_cuff:10},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
  db_thumb_flexion: { name:'Сгибание большого пальца с гантелью/блином', sets:4, reps:'12-15',
    muscles:{fpl:45,fpb:25,adductor_pollicis:20,opponens_pollicis:10},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
  plate_finger_extension: { name:'Разгибание пальцев под блином/гантелью', sets:4, reps:'12-15',
    muscles:{finger_extensors:40,ei:30,edm:30},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
  db_thumb_extension: { name:'Разгибание/отведение большого пальца с гантелью', sets:4, reps:'12-15',
    muscles:{apl:40,thumb_extensors:60},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
  plate_pinky_grip: { name:'Сжатие мизинца с блином/гантелью', sets:4, reps:'12-15',
    muscles:{adm:25,fdm:25,opponens_digiti_minimi:30,fds:10,fdp:10},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
  plate_finger_spread: { name:'Удержание блина пальцами в разведённом положении', sets:4, reps:'12-15',
    muscles:{lumbricals:35,interossei:55,adm:10},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },

  // Грудь (Дыхательные)
  weighted_breathing: { name:'Дыхание с блином на груди', sets:4, reps:'10-15',
    muscles:{intercostals:100},
    markers:['Гантели/Штанга/Гиря'] },
  cable_wrist_curl: { name:'Заворот кисти на блоке', sets:4, reps:'12-15',
    muscles:{fcr:32,fcu:32,fds:15,fdp:15,biceps:6},
    markers:['Тренажер', 'Армрестлинг'] },
    pronation_forearm_free_weight: { name:'Пронация предплечья, свободный вес', sets:4, reps:'12-15',
    muscles:{pronators:55,brachioradialis:15,biceps:30},
    markers:['Гантели/Штанга/Гиря','Армрестлинг'] },
  radial_ulnar_deviation_free_weight: { name:'Луч через кисть, свободный вес ', sets:4, reps:'12-15',
    muscles:{fcr:25,ecrl:25,ecrb:15,fcu:20,ecu:15},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
    isolated_wrist_abduction_free_weight: { 
    name:'Изолированное отведение кисти свободный вес', 
    sets:4, reps:'12-15',
    muscles:{ecrl:40, ecrb:30, fcr:20, apl:10},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
  wrist_curl_extension_free_weight: { name:'Кисть с гантелью свободный вес', sets:4, reps:'12-15',
    muscles:{fcr:25,fcu:25,ecrl:20,ecrb:15,ecu:15},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
  finger_hold_strap_handle: { name:'Удержание рукоятки на лямках пальцами (Finger Hold)', sets:4, reps:'30 сек',
    muscles:{fds:40,fdp:40,fpl:10,fcr:5,fcu:5},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] },
      // --- Тяги в наклоне (Свободный вес) ---
  bent_over_row_chest: { 
    name:'Тяга к груди в наклоне (штанга/гантели)', 
    sets:4, reps:'12-15',
    // Акцент на верхнюю часть спины (ромбовидные, трапеции, задние дельты)
    muscles:{rhomboids:25, traps:20, rear_delts:15, biceps:15, brachialis:10, lats:10, teres:5},
    markers:['Гантели/Штанга/Гиря', 'Волейбол'] },
  bent_over_row_waist: { 
    name:'Тяга к поясу в наклоне (штанга/гантели)', 
    sets:4, reps:'12-15',
    // Акцент на широчайшие мышцы (как в старой db_row)
    muscles:{lats:40, rhomboids:15, rear_delts:10, biceps:15, brachialis:10, teres:5, traps:5},
    markers:['Гантели/Штанга/Гиря', 'Армрестлинг'] 
  },
  calf_jumps: { 
    name:'Прыжки на носках стоя', 
    sets:4, reps:'15-20',
    muscles:{calves:45, foot:25, quads:15, glutes:10, hamstrings:5},
    markers:['Собственный вес', 'Волейбол'] 
  },
    neck_extension_side: { 
    name:'Разгибание шеи лежа на боку (в обе стороны)', 
    sets:3, reps:'12-15',
    muscles:{scm:35, scalenes:25, neck_extensors:30, levator_scapulae:10},
    markers:['Собственный вес'] 
  },
    close_grip_pullups: { 
    name:'Подтягивания узким хватом', 
    sets:4, reps:'8-12',
    muscles:{lats:40, biceps:20, brachialis:15, rhomboids:10, brachioradialis:5, teres:5, traps:5},
    markers:['Собственный вес', 'Волейбол'] 
  },
    dumbbell_flyes: { name:'Сведение гантелей лежа', sets:4, reps:'12-15',
    muscles:{pectoralis_major:65,delts:10,pectoralis_minor:5,coracobrachialis:10,serratus:10},
    markers:['Гантели/Штанга/Гиря', 'Волейбол'] },
    finger_pushups: { name:'Отжимания на пальцах', sets:4, reps:'6-12',
    muscles:{fds:20,fdp:20,interossei:15,lumbricals:10,fcr:5,fcu:5,pectoralis_major:10,triceps:10,delts:5},
    markers:['Собственный вес', 'Волейбол', 'Армрестлинг'] },
      seated_external_rotation: { name:'Внешняя ротация плеча сидя (с резинкой/гантелью)', sets:4, reps:'12-15',
    muscles:{rotator_cuff:75, delts:25},
    markers:['Резинка', 'Гантели/Штанга/Гиря', 'Волейбол'] },

  standing_shoulder_rotation: { name:'Боковые повороты плеч стоя (с гантелями)', sets:4, reps:'12-15',
    muscles:{rotator_cuff:85, delts:15},
    markers:['Гантели/Штанга/Гиря', 'Волейбол'] },

  side_lying_external_rotation: { name:'Боковая ротация лёжа (внешняя ротация плеча)', sets:4, reps:'12-15',
    muscles:{rotator_cuff:75, delts:25},
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
  neck_flexion: 0.10, neck_side: 0.08, neck_extension: 0.10,
  neck_extension_prone: 0.08, neck_extension_side: 0.08,
};

Object.entries(BW_FACTORS).forEach(([id, f]) => {
  if(EX[id]) EX[id].bwFactor = f;
});
