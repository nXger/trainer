
// ============================================================
// CHANGELOG (История версий приложения)
// ============================================================
// Добавляйте новые записи в начало этого массива.
// Текущая версия = первая запись (CHANGELOG[0].version).
// Формат даты: 'ДД.ММ.ГГГГ'.
// Для каждого изменения указывайте русский и английский варианты.
// ============================================================

const CHANGELOG = [
  {
    version: '1.1.1',
    date: '23.11.2026',
    changes: [
      {
        ru: 'Исправлены мелкие ошибки интерфейса',
        en: 'Fixed minor interface issues'
      },
      {
        ru: 'Добавлено обучение',
        en: 'Added the interactive tutorial'
      },
      {
        ru: 'Исправлены мелкие ошибки в блоках',
        en: 'Fixed minor issues with blocks'
      },
      {
        ru: 'Добавлена поддержка английского языка',
        en: 'Added English-language support'
      }
    ]
  },
  {
    version: '1.1.0',
    date: '21.11.2026',
    changes: [
      {
        ru: 'Исправлена логика вычитания усталости (теперь учитывается, если вчера мышца не тренировалась)',
        en: 'Fixed fatigue reduction logic (muscles that were not trained yesterday are now taken into account)'
      },
      {
        ru: 'Дополнительный вес теперь корректно суммируется с собственным весом в упражнениях',
        en: 'Additional weight is now correctly added to bodyweight in exercises'
      },
      {
        ru: 'Исправлены мелкие баги в расчёте дневного тоннажа и отображении рекордов',
        en: 'Fixed minor bugs in daily tonnage calculations and record display'
      }
    ]
  },
  {
    version: '1.0.2',
    date: '19.11.2026',
    changes: [
      {
        ru: 'Улучшена стабильность работы приложения и исправлены мелкие ошибки интерфейса',
        en: 'Improved app stability and fixed minor interface issues'
      }
    ]
  },
  {
    version: '1.0.1',
    date: '17.11.2026',
    changes: [
      {
        ru: 'Добавлена поддержка новых пользовательских упражнений и меток',
        en: 'Added support for new custom exercises and tags'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '15.11.2026',
    changes: [
      {
        ru: 'Первый релиз приложения',
        en: 'Initial release'
      },
      {
        ru: 'Базовый трекинг тренировок, усталости и прогресса',
        en: 'Basic workout, fatigue, and progress tracking'
      }
    ]
  }
];

// Текущая версия приложения
const APP_VERSION = CHANGELOG[0].version;
