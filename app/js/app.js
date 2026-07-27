/* ============================================================
   * ПЛАНИРОВЩИК СПЛАВА ПО РЕКАМ ПЕРМСКОГО КРАЯ
   * Архитектура: IIFE-модули (Data, Utils, RoutePlanner, …)
   * ============================================================ */

  (function () {
    'use strict';

    /* ===== МОДУЛЬ Data: данные о реках, продуктах, снаряжении ===== */
    var Data = (function () {
      /* Парсинг рекомендуемого числа дней из строки «3–5 дней» */
      function parseRecommendedDays(durationStr) {
        var match = (durationStr || '').match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 3;
      }

      /* Генерация набора маршрутов для каждой реки (экспресс, классический, расширенный) */
      function buildRoutesForRiver(cfg) {
        var base = cfg.routeLength;
        var diff = cfg.difficulty;
        var recMenu = diff === 'лёгкая' ? 'kids' : (diff === 'сложная' ? 'comfort' : 'standard');
        var classicDays = parseRecommendedDays(cfg.duration);
        var expressKm = Math.max(15, Math.round(base * 0.35));
        var expressDays = Math.max(1, Math.min(2, Math.ceil(expressKm / 22)));
        var extendedKm = Math.round(base * 1.25);
        var extendedDays = classicDays + Math.min(2, Math.ceil(base / 80));

        return [
          {
            id: cfg.id + '-express',
            name: 'Экспресс — «' + cfg.name + '»',
            lengthKm: expressKm,
            duration: expressDays + ' дн.',
            recommendedDays: expressDays,
            difficulty: diff === 'сложная' ? 'средняя' : 'лёгкая',
            description: 'Короткий маршрут для сплава на выходные. Участок с минимальным набором порогов и удобными стоянками.',
            attractions: cfg.attractions.slice(0, Math.min(2, cfg.attractions.length)),
            dailyKm: cfg.dailyKm.slice(0, expressDays),
            gpsPoints: cfg.gpsPoints.slice(0, Math.min(2, cfg.gpsPoints.length)),
            campsites: cfg.campsites.slice(0, 1),
            recommendedMenu: diff === 'лёгкая' ? 'economy' : 'standard'
          },
          {
            id: cfg.id + '-classic',
            name: 'Классический — «' + cfg.name + '»',
            lengthKm: base,
            duration: cfg.duration,
            recommendedDays: classicDays,
            difficulty: diff,
            description: 'Основной туристический маршрут по реке ' + cfg.name + '. Наиболее популярный вариант среди сплавщиков Пермского края.',
            attractions: cfg.attractions.slice(),
            dailyKm: cfg.dailyKm.slice(),
            gpsPoints: cfg.gpsPoints.slice(),
            campsites: cfg.campsites.slice(),
            recommendedMenu: recMenu
          },
          {
            id: cfg.id + '-extended',
            name: 'Расширенный — «' + cfg.name + '»',
            lengthKm: extendedKm,
            duration: extendedDays + ' дн.',
            recommendedDays: extendedDays,
            difficulty: diff,
            description: 'Полный маршрут с дополнительными остановками, осмотром всех достопримечательностей и запасом времени на рыбалку.',
            attractions: cfg.attractions.slice(),
            dailyKm: cfg.dailyKm.concat([25, 28, 30]).slice(0, extendedDays),
            gpsPoints: cfg.gpsPoints.slice(),
            campsites: cfg.campsites.slice(),
            recommendedMenu: 'comfort'
          }
        ];
      }

      /* Базовый шаблон для создания записи реки */
      function makeRiver(cfg) {
        var river = {
          id: cfg.id,
          name: cfg.name,
          description: cfg.description,
          difficulty: cfg.difficulty,
          season: cfg.season,
          duration: cfg.duration,
          routeLength: cfg.routeLength,
          dailyKm: cfg.dailyKm,
          attractions: cfg.attractions,
          gpsPoints: cfg.gpsPoints,
          campsites: cfg.campsites,
          photos: cfg.photos,
          recommendations: cfg.recommendations,
          lat: cfg.lat,
          lon: cfg.lon,
          routes: cfg.routes || buildRoutesForRiver(cfg)
        };
        return river;
      }

      /* Полный каталог рек Пермского края (25 рек) */
      var rivers = [
        makeRiver({
          id: 'usva', name: 'Усьва',
          description: 'Живописная горная река с порогами II–III класса. Каменистое дно, сосновые берега, скалы «Столбы». Один из лучших сплавов Урала для опытных туристов.',
          difficulty: 'сложная', season: ['май','июнь','июль'], duration: '3–5 дней',
          routeLength: 120, dailyKm: [25,30,35,30],
          attractions: ['Скалы Столбы', 'Пороги «Каменный» и «Ракитный»', 'Усть-Усьва', 'Водопад на притоке'],
          gpsPoints: [{name:'Усть-Усьва',lat:58.905,lng:57.548},{name:'Скалы Столбы',lat:58.712,lng:57.421},{name:'с. Усьва',lat:58.601,lng:57.312}],
          campsites: ['Мыс у Столбов', 'Песчаный залив после порога Ракитный', 'Устье р. Яйва'],
          photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Usva_river.jpg/640px-Usva_river.jpg','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=640'],
          recommendations: ['Обязательны шлемы и спасжилеты', 'Проверяйте уровень воды весной', 'Берите ремонтный набор для катамарана'],
          lat: 58.75, lon: 57.45
        }),
        makeRiver({
          id: 'chusovaya', name: 'Чусовая',
          description: 'Легендарная река с богатой историей. Скалы, пещеры, старинные пристани. Пороги I–II класса, подходит для семейных и начинающих групп.',
          difficulty: 'средняя', season: ['май','июнь','июль','август','сентябрь'], duration: '5–10 дней',
          routeLength: 280, dailyKm: [30,35,30,28,32,30,28,25],
          attractions: ['Скала «Столбы»', 'Пещера Дружба', 'Пристань «Камень»', 'Скала «Белая»', 'с. Сылва'],
          gpsPoints: [{name:'п. Сылва',lat:58.383,lng:58.150},{name:'Скала Столбы',lat:58.652,lng:57.892},{name:'п. Чусовой',lat:58.283,lng:57.817}],
          campsites: ['Пристань Камень', 'Мыс у Скалы Белой', 'Устье р. Сылва', 'п. Чусовой'],
          photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Chusovaya_river.jpg/640px-Chusovaya_river.jpg','https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=640'],
          recommendations: ['Классический маршрут — берите фотоаппарат', 'Запаситесь картой порогов', 'В августе возможна низкая вода'],
          lat: 58.55, lon: 57.95
        }),
        makeRiver({
          id: 'vishera', name: 'Вишера',
          description: 'Дикая таёжная река с порогами до III класса. Мало населённых пунктов, первозданная природа, бобры и рыбалка.',
          difficulty: 'сложная', season: ['июнь','июль','август'], duration: '7–12 дней',
          routeLength: 350, dailyKm: [30,35,32,30,28,30,32,30,28,25],
          attractions: ['Порог «Большой»', 'Таёжные берега', 'Устье р. Колва', 'Старое с. Вишера'],
          gpsPoints: [{name:'с. Вишера',lat:60.383,lng:57.217},{name:'Порог Большой',lat:60.150,lng:57.450},{name:'устье',lat:59.850,lng:57.680}],
          campsites: ['Высокий берег после порога', 'Устье Колвы', 'Песчаная коса км 180'],
          photos: ['https://images.unsplash.com/photo-1439856345065-606368832ea4?w=640','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640'],
          recommendations: ['Спутниковая связь обязательна', 'Запас еды на 2 дня', 'Защита от комаров'],
          lat: 60.2, lon: 57.4
        }),
        makeRiver({
          id: 'koyva', name: 'Койва',
          description: 'Спокойная лесная река, идеальна для семей с детьми. Песчаные пляжи, рыбалка, минимум препятствий.',
          difficulty: 'лёгкая', season: ['июнь','июль','август'], duration: '2–4 дня',
          routeLength: 80, dailyKm: [20,25,22,18],
          attractions: ['Песчаные пляжи', 'Лесные берега', 'Мост через Койву', 'Деревня на берегу'],
          gpsPoints: [{name:'с. Койва',lat:59.150,lng:57.980},{name:'середина маршрута',lat:59.080,lng:57.850},{name:'устье',lat:59.020,lng:57.720}],
          campsites: ['Песчаный пляж км 25', 'Лесная поляна км 50', 'Устье'],
          photos: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=640','https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=640'],
          recommendations: ['Отличный первый сплав', 'Берите надувные матрасы', 'Купание безопасно'],
          lat: 59.1, lon: 57.85
        }),
        makeRiver({
          id: 'berezovaya', name: 'Берёзовая',
          description: 'Небольшая притоковая река с пологими берегами. Подходит для однодневных и двухдневных выходов.',
          difficulty: 'лёгкая', season: ['июнь','июль','август','сентябрь'], duration: '1–2 дня',
          routeLength: 45, dailyKm: [22,23],
          attractions: ['Берёзовые рощи', 'Старое село', 'Мост через реку'],
          gpsPoints: [{name:'исток',lat:58.950,lng:56.800},{name:'устье',lat:58.880,lng:56.650}],
          campsites: ['Поляна у моста', 'Песчаный берег'],
          photos: ['https://images.unsplash.com/photo-1448375240586-882707db889b?w=640'],
          recommendations: ['Короткий маршрут для новичков', 'Можно без палаток — однодневка'],
          lat: 58.92, lon: 56.72
        }),
        makeRiver({
          id: 'yayva', name: 'Яйва',
          description: 'Горная река с умеренными порогами. Живописные ущелья, хвойный лес, хорошая рыбалка на хариуса.',
          difficulty: 'средняя', season: ['май','июнь','июль','август'], duration: '3–5 дней',
          routeLength: 110, dailyKm: [22,28,25,30,20],
          attractions: ['Яйвинский водопад', 'Ущелье', 'г. Яйва', 'Порог «Редут»'],
          gpsPoints: [{name:'г. Яйва',lat:59.350,lng:57.250},{name:'водопад',lat:59.280,lng:57.180},{name:'устье',lat:59.150,lng:57.050}],
          campsites: ['У водопада', 'Пляж км 60', 'Устье в Каму'],
          photos: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=640','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=640'],
          recommendations: ['Весной высокий уровень воды', 'Шлемы на порогах', 'Фото водопада — must have'],
          lat: 59.25, lon: 57.15
        }),
        makeRiver({
          id: 'kosa', name: 'Коса',
          description: 'Тихая река для семейного отдыха. Мало порогов, много живописных мест для купания и рыбалки.',
          difficulty: 'лёгкая', season: ['июнь','июль','август','сентябрь'], duration: '2–3 дня',
          routeLength: 65, dailyKm: [20,25,20],
          attractions: ['с. Коса', 'Пляжи', 'Рыболовные места', 'Лесные берега'],
          gpsPoints: [{name:'с. Коса',lat:59.550,lng:57.700},{name:'устье',lat:59.480,lng:57.550}],
          campsites: ['Пляж у села', 'Береговая поляна'],
          photos: ['https://images.unsplash.com/photo-1433086966358-54859d0a4b43?w=640'],
          recommendations: ['Идеально для детей от 5 лет', 'Сап и каяки — отличный выбор'],
          lat: 59.52, lon: 57.62
        }),
        makeRiver({
          id: 'kolva', name: 'Колва',
          description: 'Правый приток Вишеры. Пороги II класса, красивые скальные берега, таёжная тишина.',
          difficulty: 'средняя', season: ['июнь','июль','август'], duration: '4–6 дней',
          routeLength: 140, dailyKm: [25,28,30,27,25,20],
          attractions: ['Скальные берега', 'Порог «Широкий»', 'с. Колва', 'Слияние с Вишерой'],
          gpsPoints: [{name:'с. Колва',lat:60.550,lng:57.050},{name:'порог',lat:60.350,lng:57.200},{name:'устье',lat:60.150,lng:57.350}],
          campsites: ['Высокий берег у порога', 'Устье Вишеры'],
          photos: ['https://images.unsplash.com/photo-1511497584788-876760111969?w=640'],
          recommendations: ['Комбинируйте с Вишерой', 'Запас топлива для костра'],
          lat: 60.35, lon: 57.15
        }),
        makeRiver({
          id: 'kosva', name: 'Косьва',
          description: 'Горная река с порогами III класса. Для опытных сплавщиков. Кристально чистая вода, скалы, водопады.',
          difficulty: 'сложная', season: ['июнь','июль'], duration: '3–4 дня',
          routeLength: 95, dailyKm: [25,30,25,15],
          attractions: ['Порог «Китай-город»', 'Водопады', 'Скалы', 'г. Красновишерск'],
          gpsPoints: [{name:'Красновишерск',lat:60.417,lng:57.083},{name:'Китай-город',lat:60.350,lng:57.050},{name:'устье',lat:60.250,lng:56.950}],
          campsites: ['После порога Китай-город', 'Устье в Вишеру'],
          photos: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640'],
          recommendations: ['Только для опытных!', 'Обязательна страховка', 'Проверяйте прогноз'],
          lat: 60.35, lon: 57.05
        }),
        makeRiver({
          id: 'kama', name: 'Кама',
          description: 'Крупнейшая река региона. Широкая, спокойная, подходит для больших катамаранов и семейных экспедиций.',
          difficulty: 'лёгкая', season: ['май','июнь','июль','август','сентябрь'], duration: '3–7 дней',
          routeLength: 200, dailyKm: [30,35,30,28,32,30,25],
          attractions: ['Чусовской залив', 'Устье Усьвы', 'Березники', 'Чайковский', 'Пермь'],
          gpsPoints: [{name:'Чайковский',lat:56.083,lng:54.117},{name:'Березники',lat:59.417,lng:56.817},{name:'Пермь',lat:58.010,lng:56.250}],
          campsites: ['Берег у Березников', 'Пляж у Чайковского', 'Остров на заливе'],
          photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Kama_river_Perm.jpg/640px-Kama_river_Perm.jpg','https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=640'],
          recommendations: ['Следите за судами', 'Якоря для стоянки', 'Ветрено — берите тенты'],
          lat: 58.5, lon: 56.5
        }),
        makeRiver({
          id: 'sylva', name: 'Сылва',
          description: 'Живописный приток Чусовой. Скалы, пещеры, умеренные пороги. Популярный маршрут выходного дня.',
          difficulty: 'средняя', season: ['май','июнь','июль','август'], duration: '2–4 дня',
          routeLength: 90, dailyKm: [22,25,28,20],
          attractions: ['Пещера Дружба', 'Скалы', 'с. Сылва', 'Слияние с Чусовой'],
          gpsPoints: [{name:'с. Сылва',lat:58.383,lng:58.150},{name:'пещера',lat:58.420,lng:58.050},{name:'устье',lat:58.450,lng:57.950}],
          campsites: ['У пещеры', 'Песчаный берег', 'Устье'],
          photos: ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=640'],
          recommendations: ['Посетите пещеру с фонарём', 'Фото на скалах'],
          lat: 58.4, lon: 58.05
        }),
        makeRiver({
          id: 'iren', name: 'Ирень',
          description: 'Спокойная степная река южнее Перми. Широкие поймы, песчаные отмели, отличная рыбалка.',
          difficulty: 'лёгкая', season: ['июнь','июль','август','сентябрь'], duration: '2–3 дня',
          routeLength: 70, dailyKm: [25,25,20],
          attractions: ['Пойменные луга', 'Песчаные отмели', 'Птицы', 'Рыбалка'],
          gpsPoints: [{name:'исток',lat:57.800,lng:56.200},{name:'устье',lat:57.650,lng:55.900}],
          campsites: ['Песчаная отмель', 'Береговая роща'],
          photos: ['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=640'],
          recommendations: ['Лёгкий сплав для новичков', 'Бинокль для наблюдения за птицами'],
          lat: 57.72, lon: 56.05
        }),
        makeRiver({
          id: 'obva', name: 'Обва',
          description: 'Небольшая река с пологим течением. Хороша для обучения и семейных походов.',
          difficulty: 'лёгкая', season: ['июнь','июль','август'], duration: '1–2 дня',
          routeLength: 40, dailyKm: [20,20],
          attractions: ['Луга', 'Мост', 'Деревня'],
          gpsPoints: [{name:'исток',lat:58.200,lng:56.500},{name:'устье',lat:58.150,lng:56.350}],
          campsites: ['Поляна у моста'],
          photos: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=640'],
          recommendations: ['Однодневка или с ночёвкой', 'Подходит для сап-доски'],
          lat: 58.17, lon: 56.42
        }),
        makeRiver({
          id: 'inva', name: 'Иньва',
          description: 'Приток Камы с умеренным течением. Лесные берега, рыбалка, доступность из Перми.',
          difficulty: 'лёгкая', season: ['июнь','июль','август','сентябрь'], duration: '2–3 дня',
          routeLength: 55, dailyKm: [18,20,17],
          attractions: ['Лесные массивы', 'Рыбалка', 'Село на берегу'],
          gpsPoints: [{name:'исток',lat:58.600,lng:55.800},{name:'устье',lat:58.500,lng:55.600}],
          campsites: ['Лесная поляна', 'Песчаный берег'],
          photos: ['https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=640'],
          recommendations: ['Близко к Перми', 'Хороший вариант на выходные'],
          lat: 58.55, lon: 55.7
        }),
        makeRiver({
          id: 'vels', name: 'Велс',
          description: 'Дикая таёжная река с порогами II класса. Мало туристов, чистая природа.',
          difficulty: 'средняя', season: ['июнь','июль','август'], duration: '4–5 дней',
          routeLength: 100, dailyKm: [20,25,22,25,18],
          attractions: ['Тайга', 'Пороги', 'Рыбалка', 'Бобры'],
          gpsPoints: [{name:'исток',lat:60.800,lng:57.500},{name:'устье',lat:60.600,lng:57.300}],
          campsites: ['Высокий берег', 'Устье'],
          photos: ['https://images.unsplash.com/photo-1518173941763-c0667f4165be?w=640'],
          recommendations: ['Берите запас еды', 'Спутниковая связь'],
          lat: 60.7, lon: 57.4
        }),
        makeRiver({
          id: 'uls', name: 'Улс',
          description: 'Малоизвестная река с живописными берегами. Спокойное течение, подходит для начинающих.',
          difficulty: 'лёгкая', season: ['июнь','июль','август'], duration: '2–3 дня',
          routeLength: 60, dailyKm: [20,22,18],
          attractions: ['Лесные берега', 'Песчаные пляжи'],
          gpsPoints: [{name:'исток',lat:59.800,lng:57.200},{name:'устье',lat:59.700,lng:57.000}],
          campsites: ['Пляж', 'Лесная поляна'],
          photos: ['https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=640'],
          recommendations: ['Тихий маршрут без толп', 'Отличная рыбалка'],
          lat: 59.75, lon: 57.1
        }),
        makeRiver({
          id: 'vizhay', name: 'Вижай',
          description: 'Горная река с порогами II–III класса. Красивые скалы и водопады на притоках.',
          difficulty: 'сложная', season: ['июнь','июль'], duration: '3–5 дней',
          routeLength: 105, dailyKm: [22,28,25,22,18],
          attractions: ['Скалы', 'Водопады', 'Пороги', 'Тайга'],
          gpsPoints: [{name:'исток',lat:60.200,lng:57.600},{name:'устье',lat:60.000,lng:57.400}],
          campsites: ['После порога', 'Устье'],
          photos: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640'],
          recommendations: ['Опыт обязателен', 'Проверяйте уровень воды'],
          lat: 60.1, lon: 57.5
        }),
        makeRiver({
          id: 'yazva', name: 'Язьва',
          description: 'Правый приток Камы. Спокойная, широкая, с песчаными пляжами. Популярна у семей.',
          difficulty: 'лёгкая', season: ['июнь','июль','август','сентябрь'], duration: '2–4 дня',
          routeLength: 85, dailyKm: [20,25,22,18],
          attractions: ['Пляжи', 'Рыбалка', 'Леса', 'Сёла'],
          gpsPoints: [{name:'исток',lat:58.900,lng:55.500},{name:'устье',lat:58.750,lng:55.200}],
          campsites: ['Песчаный пляж', 'Береговая роща'],
          photos: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640'],
          recommendations: ['Семейный маршрут', 'Купание и рыбалка'],
          lat: 58.82, lon: 55.35
        }),
        makeRiver({
          id: 'vilva', name: 'Вильва',
          description: 'Река с умеренными порогами II класса. Живописные берега, хвойный лес, рыбалка.',
          difficulty: 'средняя', season: ['июнь','июль','август'], duration: '3–4 дня',
          routeLength: 95, dailyKm: [22,28,25,20],
          attractions: ['Пороги', 'Лес', 'Рыбалка', 'Село Вильва'],
          gpsPoints: [{name:'с. Вильва',lat:59.200,lng:57.400},{name:'устье',lat:59.050,lng:57.200}],
          campsites: ['У порога', 'Песчаный берег'],
          photos: ['https://images.unsplash.com/photo-1511497584788-876760111969?w=640'],
          recommendations: ['Хороший баланс сложности', 'Берите снасти для рыбалки'],
          lat: 59.12, lon: 57.3
        }),
        makeRiver({
          id: 'chikman', name: 'Чикман',
          description: 'Малая горная река с техническими порогами. Для опытных каякеров и байдарочников.',
          difficulty: 'сложная', season: ['июнь','июль'], duration: '2–3 дня',
          routeLength: 55, dailyKm: [18,22,15],
          attractions: ['Пороги III класса', 'Скалы', 'Водопад'],
          gpsPoints: [{name:'исток',lat:60.500,lng:57.800},{name:'устье',lat:60.400,lng:57.650}],
          campsites: ['После каньона'],
          photos: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640'],
          recommendations: ['Только для экспертов', 'Обязательны шлем и спасжилет'],
          lat: 60.45, lon: 57.72
        }),
        makeRiver({
          id: 'osa', name: 'Оса',
          description: 'Спокойная река в северной части края. Песчаные берега, лёгкое течение, семейный формат.',
          difficulty: 'лёгкая', season: ['июнь','июль','август','сентябрь'], duration: '2–3 дня',
          routeLength: 60, dailyKm: [20,22,18],
          attractions: ['с. Оса', 'Пляжи', 'Леса', 'Рыбалка'],
          gpsPoints: [{name:'с. Оса',lat:59.700,lng:57.900},{name:'устье',lat:59.620,lng:57.750}],
          campsites: ['Пляж у села', 'Береговая поляна'],
          photos: ['https://images.unsplash.com/photo-1433086966358-54859d0a4b43?w=640'],
          recommendations: ['Отличный семейный маршрут', 'Мало туристов'],
          lat: 59.66, lon: 57.82
        }),
        makeRiver({
          id: 'yug', name: 'Юг',
          description: 'Небольшая река с тихим течением. Идеальна для первого опыта и детских групп.',
          difficulty: 'лёгкая', season: ['июнь','июль','август'], duration: '1–2 дня',
          routeLength: 35, dailyKm: [18,17],
          attractions: ['с. Юг', 'Лесные берега', 'Мост'],
          gpsPoints: [{name:'с. Юг',lat:59.850,lng:57.650},{name:'устье',lat:59.800,lng:57.550}],
          campsites: ['Пляж'],
          photos: ['https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=640'],
          recommendations: ['Самый простой маршрут', 'Подходит для детей'],
          lat: 59.82, lon: 57.6
        }),
        makeRiver({
          id: 'belaya', name: 'Белая',
          description: 'Живописная река с белыми известняковыми берегами. Спокойное течение, красивые пейзажи.',
          difficulty: 'лёгкая', season: ['июнь','июль','август','сентябрь'], duration: '2–3 дня',
          routeLength: 50, dailyKm: [18,20,17],
          attractions: ['Белые скалы', 'Известняк', 'Деревня Белая', 'Рыбалка'],
          gpsPoints: [{name:'д. Белая',lat:59.600,lng:57.500},{name:'устье',lat:59.520,lng:57.380}],
          campsites: ['У белых скал', 'Песчаный берег'],
          photos: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=640'],
          recommendations: ['Фото белых берегов', 'Спокойный отдых'],
          lat: 59.56, lon: 57.44
        }),
        makeRiver({
          id: 'vesyolanka', name: 'Весёланка',
          description: 'Река с весёлым названием и спокойным характером. Песчаные пляжи, лес, рыбалка.',
          difficulty: 'лёгкая', season: ['июнь','июль','август'], duration: '2–3 дня',
          routeLength: 55, dailyKm: [18,20,17],
          attractions: ['с. Весёлый', 'Пляжи', 'Леса'],
          gpsPoints: [{name:'с. Весёлый',lat:59.750,lng:57.550},{name:'устье',lat:59.680,lng:57.420}],
          campsites: ['Пляж', 'Лесная поляна'],
          photos: ['https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=640'],
          recommendations: ['Хороший выходной маршрут', 'Купание безопасно'],
          lat: 59.71, lon: 57.48
        }),
        makeRiver({
          id: 'yulva', name: 'Юлва',
          description: 'Приток Усы с порогами II класса. Живописные берега, лес, умеренная сложность.',
          difficulty: 'средняя', season: ['июнь','июль','август'], duration: '3–4 дня',
          routeLength: 80, dailyKm: [20,25,22,18],
          attractions: ['Пороги', 'Лес', 'Село Юлва', 'Слияние с Усой'],
          gpsPoints: [{name:'с. Юлва',lat:58.700,lng:57.200},{name:'устье',lat:58.600,lng:57.050}],
          campsites: ['После порога', 'Устье'],
          photos: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=640'],
          recommendations: ['Комбинируйте с Усьвой', 'Средний уровень подготовки'],
          lat: 58.65, lon: 57.12
        })
      ];

      /* Шаблоны блюд для меню */
      var mealTemplates = {
        breakfast: ['Каша овсяная с сухофруктами','Гречневая каша с маслом','Омлет с зеленью','Блины с вареньем','Рисовая каша с изюмом','Мюсли с молоком','Яичница с беконом'],
        lunch: ['Уха из свежей рыбы','Суп-пюре из чечевицы','Плов на костре','Лагман','Борщ с сухарями','Гороховый суп','Паста с томатным соусом'],
        dinner: ['Шашлык из свинины','Рыба на гриле','Тушёное мясо с картофелем','Пельмени','Голубцы','Котлеты с гарниром','Стейк из говядины'],
        snacks: ['Орехи и сухофрукты','Шоколад и батончики','Сыр и колбаса','Хлеб с маслом','Фрукты','Печенье','Семечки'],
        drinks: ['Чай','Кофе','Компот','Какао','Вода','Сок','Морс']
      };

      /* Варианты готового меню с коэффициентами расчёта продуктов */
      var menuPresets = {
        economy: {
          label: 'Эконом',
          description: 'Минимальный набор продуктов: крупы, консервы, хлеб, чай.',
          quantityFactor: 0.75,
          priceFactor: 0.85,
          caloriesFactor: 0.85,
          templates: {
            breakfast: ['Гречневая каша с маслом', 'Чай с сахаром', 'Хлеб с маслом'],
            lunch: ['Гороховый суп', 'Макароны с тушёнкой', 'Хлеб'],
            dinner: ['Рис с консервами', 'Чай', 'Печенье'],
            snacks: ['Сухарики', 'Сахар', 'Семечки'],
            drinks: ['Чай', 'Вода', 'Компот']
          },
          excludeProducts: ['Мясо говядина', 'Рыба свежая', 'Сыр', 'Пельмени', 'Сметана']
        },
        standard: {
          label: 'Стандарт',
          description: 'Сбалансированное походное меню для большинства групп.',
          quantityFactor: 1,
          priceFactor: 1,
          caloriesFactor: 1,
          templates: mealTemplates,
          excludeProducts: []
        },
        comfort: {
          label: 'Комфорт',
          description: 'Разнообразное меню с мясом, рыбой, свежими овощами и десертами.',
          quantityFactor: 1.25,
          priceFactor: 1.35,
          caloriesFactor: 1.2,
          templates: {
            breakfast: ['Омлет с зеленью', 'Блины с вареньем', 'Кофе и сок', 'Фрукты'],
            lunch: ['Уха из свежей рыбы', 'Плов на костре', 'Салат из свежих овощей', 'Хлеб'],
            dinner: ['Шашлык из свинины', 'Рыба на гриле', 'Картофель с сметаной', 'Компот'],
            snacks: ['Сыр и колбаса', 'Шоколад', 'Орехи и сухофрукты', 'Фрукты'],
            drinks: ['Чай', 'Кофе', 'Сок', 'Морс', 'Вода']
          },
          excludeProducts: []
        },
        vegetarian: {
          label: 'Вегетарианское',
          description: 'Без мяса и рыбы: крупы, овощи, яйца, молочные продукты, бобовые.',
          quantityFactor: 0.95,
          priceFactor: 0.9,
          caloriesFactor: 0.95,
          templates: {
            breakfast: ['Овсяная каша с сухофруктами', 'Омлет с овощами', 'Чай', 'Хлеб с сыром'],
            lunch: ['Суп-пюре из чечевицы', 'Гречка с грибами', 'Салат из овощей'],
            dinner: ['Овощное рагу', 'Паста с томатным соусом', 'Компот'],
            snacks: ['Орехи', 'Фрукты', 'Печенье', 'Сухофрукты'],
            drinks: ['Чай', 'Компот', 'Вода', 'Сок']
          },
          excludeProducts: ['Мясо свинина', 'Мясо говядина', 'Курица', 'Рыба свежая', 'Колбаса', 'Консервы мясные', 'Консервы рыбные', 'Сосиски', 'Пельмени']
        },
        kids: {
          label: 'Детское',
          description: 'Простые и привычные блюда для семей с детьми, без острого и сложного.',
          quantityFactor: 0.85,
          priceFactor: 0.95,
          caloriesFactor: 0.9,
          templates: {
            breakfast: ['Рисовая каша с изюмом', 'Блины с вареньем', 'Какао', 'Бананы'],
            lunch: ['Вермишель с курицей', 'Суп с фрикадельками', 'Хлеб', 'Сок'],
            dinner: ['Макароны с сыром', 'Котлеты с гарниром', 'Компот', 'Печенье'],
            snacks: ['Фрукты', 'Печенье', 'Шоколад', 'Сок в маленьких пакетах'],
            drinks: ['Какао', 'Компот', 'Вода', 'Сок', 'Чай']
          },
          excludeProducts: ['Кофе']
        },
        custom: {
          label: 'Пользовательское',
          description: 'Меню задаётся вручную в форме ниже.',
          quantityFactor: 1,
          priceFactor: 1,
          caloriesFactor: 1,
          templates: mealTemplates,
          excludeProducts: []
        }
      };

      /* Калорийность продуктов (ккал на единицу измерения из каталога) */
      var caloriesMap = {
        'Гречка': 330, 'Рис': 360, 'Овсянка': 370, 'Макароны': 350, 'Мука': 330,
        'Сахар': 400, 'Соль': 0, 'Масло подсолнечное': 900, 'Масло сливочное': 750,
        'Картофель': 80, 'Лук': 40, 'Морковь': 35, 'Капуста': 25, 'Помидоры': 20,
        'Огурцы': 15, 'Яйца': 150, 'Молоко': 60, 'Сыр': 350, 'Колбаса': 280,
        'Мясо свинина': 260, 'Мясо говядина': 250, 'Курица': 170, 'Рыба свежая': 120,
        'Консервы рыбные': 200, 'Консервы мясные': 220, 'Хлеб': 250, 'Лаваш': 280,
        'Чай': 0, 'Кофе': 0, 'Какао': 380, 'Печенье': 450, 'Шоколад': 550,
        'Орехи': 600, 'Сухофрукты': 280, 'Вода питьевая': 0, 'Сок': 45,
        'Специи набор': 0, 'Пельмени': 230, 'Сосиски': 260, 'Сметана': 200
      };

      /* Базовый список продуктов с единицами и весом */
      var productCatalog = [
        { name: 'Гречка', unit: 'кг', weightPerUnit: 1, pricePerUnit: 120 },
        { name: 'Рис', unit: 'кг', weightPerUnit: 1, pricePerUnit: 110 },
        { name: 'Овсянка', unit: 'кг', weightPerUnit: 1, pricePerUnit: 90 },
        { name: 'Макароны', unit: 'кг', weightPerUnit: 1, pricePerUnit: 100 },
        { name: 'Мука', unit: 'кг', weightPerUnit: 1, pricePerUnit: 60 },
        { name: 'Сахар', unit: 'кг', weightPerUnit: 1, pricePerUnit: 70 },
        { name: 'Соль', unit: 'кг', weightPerUnit: 1, pricePerUnit: 30 },
        { name: 'Масло подсолнечное', unit: 'л', weightPerUnit: 0.92, pricePerUnit: 150 },
        { name: 'Масло сливочное', unit: 'кг', weightPerUnit: 1, pricePerUnit: 550 },
        { name: 'Картофель', unit: 'кг', weightPerUnit: 1, pricePerUnit: 45 },
        { name: 'Лук', unit: 'кг', weightPerUnit: 1, pricePerUnit: 40 },
        { name: 'Морковь', unit: 'кг', weightPerUnit: 1, pricePerUnit: 50 },
        { name: 'Капуста', unit: 'кг', weightPerUnit: 1, pricePerUnit: 35 },
        { name: 'Помидоры', unit: 'кг', weightPerUnit: 1, pricePerUnit: 180 },
        { name: 'Огурцы', unit: 'кг', weightPerUnit: 1, pricePerUnit: 120 },
        { name: 'Яйца', unit: 'шт', weightPerUnit: 0.06, pricePerUnit: 10 },
        { name: 'Молоко', unit: 'л', weightPerUnit: 1.03, pricePerUnit: 80 },
        { name: 'Сыр', unit: 'кг', weightPerUnit: 1, pricePerUnit: 650 },
        { name: 'Колбаса', unit: 'кг', weightPerUnit: 1, pricePerUnit: 450 },
        { name: 'Мясо свинина', unit: 'кг', weightPerUnit: 1, pricePerUnit: 400 },
        { name: 'Мясо говядина', unit: 'кг', weightPerUnit: 1, pricePerUnit: 550 },
        { name: 'Курица', unit: 'кг', weightPerUnit: 1, pricePerUnit: 280 },
        { name: 'Рыба свежая', unit: 'кг', weightPerUnit: 1, pricePerUnit: 350 },
        { name: 'Консервы рыбные', unit: 'банка', weightPerUnit: 0.25, pricePerUnit: 150 },
        { name: 'Консервы мясные', unit: 'банка', weightPerUnit: 0.33, pricePerUnit: 200 },
        { name: 'Хлеб', unit: 'шт', weightPerUnit: 0.4, pricePerUnit: 50 },
        { name: 'Лаваш', unit: 'шт', weightPerUnit: 0.2, pricePerUnit: 40 },
        { name: 'Чай', unit: 'уп', weightPerUnit: 0.1, pricePerUnit: 120 },
        { name: 'Кофе', unit: 'уп', weightPerUnit: 0.25, pricePerUnit: 350 },
        { name: 'Какао', unit: 'уп', weightPerUnit: 0.2, pricePerUnit: 180 },
        { name: 'Печенье', unit: 'уп', weightPerUnit: 0.3, pricePerUnit: 90 },
        { name: 'Шоколад', unit: 'шт', weightPerUnit: 0.1, pricePerUnit: 120 },
        { name: 'Орехи', unit: 'кг', weightPerUnit: 1, pricePerUnit: 800 },
        { name: 'Сухофрукты', unit: 'кг', weightPerUnit: 1, pricePerUnit: 450 },
        { name: 'Вода питьевая', unit: 'л', weightPerUnit: 1, pricePerUnit: 40 },
        { name: 'Сок', unit: 'л', weightPerUnit: 1, pricePerUnit: 120 },
        { name: 'Специи набор', unit: 'уп', weightPerUnit: 0.15, pricePerUnit: 100 },
        { name: 'Пельмени', unit: 'кг', weightPerUnit: 1, pricePerUnit: 320 },
        { name: 'Сосиски', unit: 'кг', weightPerUnit: 1, pricePerUnit: 380 },
        { name: 'Сметана', unit: 'кг', weightPerUnit: 1, pricePerUnit: 200 }
      ];

      /* Категории снаряжения */
      var gearCategories = {
        personal: ['Спасательный жилет','Шлем (на порогах)','Неопреновые носки','Кроксы/сандалии','Купальник/плавки','Футболки (2 шт)','Шорты/штаны для похода','Флисовая кофта','Дождевик/пончо','Термобельё','Носки (3 пары)','Головной убор','Солнцезащитные очки','Крем от солнца 50+','Комариная сетка','Фонарик/налобник','Нож персональный','Бутылка для воды','Гермомешок для документов','Аптечка персональная'],
        group: ['Палатка (2–3 местная)','Спальник','Коврик туристический','Тент групповой','Сиденья пенополиуретановые','Верёвка 20 м','Карабины (4 шт)','Мешки для мусора','Сухой паёк резервный','Карта маршрута','Компас/навигатор','Портативная батарея','Рация (2 шт)','Свисток','Флаг группы'],
        firstAid: ['Бинт стерильный','Лейкопластырь','Перекись водорода','Йод','Обезболивающее','Антигистаминное','Средство от ожогов','Жаропонижающее','Активированный уголь','Ножницы','Пинцет','Термометр','Эластичный бинт','Перчатки медицинские','Инструкция по первой помощи'],
        campfire: ['Топор','Пила складная','Сухие спички','Бензин для розжига','Угли/уголь','Решётка для гриля','Котелок 5 л','Костерная перчатка','Скребок для чистки'],
        repair: ['Заплатки для ПВХ','Клей для лодок','Насос ручной','Латки для байдарки','Изолента','Скотч армированный','Запасные клапаны','Набор для ремонта катамарана'],
        tools: ['Мультитул','Открывалка','Штопор','Нож кухонный','Разделочная доска','Кружки/миски','Ложки/вилки','Кастрюля','Сковорода','Термос 1 л','Пакеты с застёжкой','Контейнеры для еды'],
        gas: ['Газовый баллон 230 г','Горелка туристическая','Подставка под баллон','Запасной баллон','Зажигалка','Ветрозащита для горелки']
      };

      /* Тарифы трансфера и аренды */
      var transferRates = { none: 0, personal: 3000, bus: 8000, minibus: 15000, custom: 12000 };
      var craftRates = { catamaran2: 2000, catamaran4: 3500, catamaran6: 5000, baidarka: 1500, kayak: 1200, sup: 800, raft: 6000 };
      var craftLabels = { catamaran2: 'Катамаран 2-местный', catamaran4: 'Катамаран 4-местный', catamaran6: 'Катамаран 6-местный', baidarka: 'Байдарка', kayak: 'Каяк', sup: 'Сапборд', raft: 'Рафт (8-местный)' };
      var transferLabels = { none: 'Без трансфера', personal: 'Личный автомобиль', bus: 'Автобус', minibus: 'Микроавтобус', custom: 'Свой вариант' };

      return {
        rivers: rivers,
        mealTemplates: mealTemplates,
        menuPresets: menuPresets,
        caloriesMap: caloriesMap,
        productCatalog: productCatalog,
        gearCategories: gearCategories,
        transferRates: transferRates,
        craftRates: craftRates,
        craftLabels: craftLabels,
        transferLabels: transferLabels,
        getRiverById: function (id) { return rivers.find(function (r) { return r.id === id; }); },
        getRoute: function (riverId, routeId) {
          var river = rivers.find(function (r) { return r.id === riverId; });
          if (!river || !river.routes) return null;
          if (!routeId) return river.routes[1] || river.routes[0];
          return river.routes.find(function (rt) { return rt.id === routeId; }) || river.routes[0];
        }
      };
    })();

    /* ===== МОДУЛЬ Utils: вспомогательные функции ===== */
    var Utils = (function () {
      /* Форматирование даты в dd.mm.yyyy */
      function formatDate(d) {
        var dd = String(d.getDate()).padStart(2, '0');
        var mm = String(d.getMonth() + 1).padStart(2, '0');
        return dd + '.' + mm + '.' + d.getFullYear();
      }
      /* Добавление дней к дате */
      function addDays(date, n) {
        var r = new Date(date);
        r.setDate(r.getDate() + n);
        return r;
      }
      /* Парсинг строки времени HH:MM в минуты от полуночи */
      function timeToMinutes(t) {
        var p = t.split(':');
        return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
      }
      /* Минуты в строку HH:MM */
      function minutesToTime(m) {
        var h = Math.floor(m / 60) % 24;
        var min = m % 60;
        return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
      }
      /* Случайный элемент массива по seed (детерминированный) */
      function pickFromArray(arr, seed) {
        return arr[Math.abs(seed) % arr.length];
      }
      /* Простой хеш строки для seed */
      function hashStr(s) {
        var h = 0;
        for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
        return h;
      }
      /* Форматирование числа с разделителями */
      function formatMoney(n) {
        return Math.round(n).toLocaleString('ru-RU') + ' ₽';
      }
      /* Форматирование веса */
      function formatWeight(kg) {
        if (kg >= 1) return kg.toFixed(1) + ' кг';
        return Math.round(kg * 1000) + ' г';
      }
      /* Класс сложности для CSS-бейджа */
      function difficultyClass(d) {
        if (d === 'лёгкая') return 'badge--easy';
        if (d === 'средняя') return 'badge--medium';
        return 'badge--hard';
      }
      /* Скачивание файла в браузере */
      function downloadFile(content, filename, mime) {
        var blob = new Blob([content], { type: mime });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      /* Показ toast-уведомления */
      function showToast(msg) {
        var t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(function () { t.remove(); }, 3000);
      }
      /* Экранирование HTML */
      function escapeHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
      }
      return {
        formatDate: formatDate, addDays: addDays, timeToMinutes: timeToMinutes,
        minutesToTime: minutesToTime, pickFromArray: pickFromArray, hashStr: hashStr,
        formatMoney: formatMoney, formatWeight: formatWeight, difficultyClass: difficultyClass,
        downloadFile: downloadFile, showToast: showToast, escapeHtml: escapeHtml
      };
    })();

    /* ===== МОДУЛЬ RoutePlanner: построение маршрута по дням ===== */
    var RoutePlanner = (function () {
      /* Средняя скорость сплава (км/ч) в зависимости от типа судна */
      var speedMap = { catamaran2: 5, catamaran4: 4.5, catamaran6: 4, baidarka: 5.5, kayak: 6, sup: 3.5, raft: 4 };
      /* Распределение километров по дням */
      function distributeKm(totalKm, days, dailyTemplate) {
        var result = [];
        var template = dailyTemplate.slice(0, days);
        while (template.length < days) template.push(Math.round(totalKm / days));
        var sum = template.reduce(function (a, b) { return a + b; }, 0);
        var factor = totalKm / sum;
        for (var i = 0; i < days; i++) {
          result.push(Math.round(template[i] * factor));
        }
        /* Корректировка последнего дня для точной суммы */
        var diff = totalKm - result.reduce(function (a, b) { return a + b; }, 0);
        result[days - 1] += diff;
        return result;
      }
      /* Построение плана маршрута с учётом выбранного варианта маршрута */
      function build(params) {
        var river = Data.getRiverById(params.river);
        if (!river) return null;
        var routeVariant = Data.getRoute(params.river, params.routeId);
        if (!routeVariant) return null;
        var days = params.days;
        var totalRouteKm = routeVariant.lengthKm;
        var kmPerDay = distributeKm(totalRouteKm, days, routeVariant.dailyKm);
        var speed = speedMap[params.craft] || 4.5;
        var startMin = Utils.timeToMinutes(params.startTime);
        var endMin = params.endTime ? Utils.timeToMinutes(params.endTime) : 17 * 60;
        var startDate = new Date(params.startDate);
        var dailyPlans = [];
        var totalKm = 0;
        for (var d = 0; d < days; d++) {
          var km = kmPerDay[d];
          totalKm += km;
          var paddleHours = km / speed;
          var paddleMin = Math.round(paddleHours * 60);
          var dayDate = Utils.addDays(startDate, d);
          var isLast = d === days - 1;
          var departMin = d === 0 ? startMin : 9 * 60;
          var lunchMin = departMin + Math.round(paddleMin * 0.45);
          var arriveMin = departMin + paddleMin + 60;
          if (isLast && arriveMin > endMin) arriveMin = endMin;
          var campsite = Utils.pickFromArray(routeVariant.campsites, Utils.hashStr(params.routeId + d));
          var attraction = Utils.pickFromArray(routeVariant.attractions, Utils.hashStr(params.routeId + 'attr' + d));
          var gpsStart = routeVariant.gpsPoints[Math.min(d, routeVariant.gpsPoints.length - 1)];
          var gpsEnd = routeVariant.gpsPoints[Math.min(d + 1, routeVariant.gpsPoints.length - 1)];
          dailyPlans.push({
            day: d + 1,
            date: Utils.formatDate(dayDate),
            km: km,
            departure: Utils.minutesToTime(departMin),
            lunch: Utils.minutesToTime(lunchMin),
            arrival: Utils.minutesToTime(arriveMin),
            paddleHours: paddleHours.toFixed(1),
            campsite: campsite,
            attraction: attraction,
            gpsStart: gpsStart,
            gpsEnd: gpsEnd,
            schedule: buildSchedule(departMin, lunchMin, arriveMin, paddleMin, attraction)
          });
        }
        return {
          river: river,
          routeVariant: routeVariant,
          days: days,
          totalKm: totalKm,
          dailyPlans: dailyPlans,
          tips: buildTips(river, routeVariant, params)
        };
      }
      /* Расписание одного дня */
      function buildSchedule(depart, lunch, arrive, paddleMin, attraction) {
        return [
          { time: Utils.minutesToTime(depart), event: 'Выход на воду, проверка снаряжения' },
          { time: Utils.minutesToTime(depart + 30), event: 'Начало сплава' },
          { time: Utils.minutesToTime(lunch), event: 'Обед на берегу (1 час)' },
          { time: Utils.minutesToTime(lunch + 60), event: 'Продолжение сплава' },
          { time: Utils.minutesToTime(arrive - 30), event: 'Осмотр: ' + attraction },
          { time: Utils.minutesToTime(arrive), event: 'Прибытие на стоянку, установка лагеря' },
          { time: Utils.minutesToTime(arrive + 90), event: 'Ужин, отдых у костра' }
        ];
      }
      /* Советы по маршруту с учётом варианта и меню */
      function buildTips(river, routeVariant, params) {
        var tips = river.recommendations.slice();
        tips.unshift('Маршрут: «' + routeVariant.name + '» (' + routeVariant.lengthKm + ' км, ' + routeVariant.difficulty + ')');
        var menuPreset = Data.menuPresets[params.menuType] || Data.menuPresets.standard;
        tips.push('Меню: ' + menuPreset.label);
        tips.push('Плавсредство: ' + Data.craftLabels[params.craft]);
        tips.push('Трансфер: ' + Data.transferLabels[params.transfer] + ' (' + Utils.formatMoney(params.transferCost || 0) + ')');
        tips.push('Аренда: ' + Data.craftLabels[params.craft] + ' (' + Utils.formatMoney(params.craftRentCost || 0) + ')');
        tips.push('Участников: ' + params.participants + ', дней: ' + params.days);
        if (routeVariant.difficulty === 'сложная') tips.push('Рекомендуем опыт прохождения порогов не ниже II класса');
        if (params.craft === 'sup') tips.push('На сапборде закладывайте меньше километров и больше времени на отдых');
        if (params.menuType === 'vegetarian') tips.push('Вегетарианское меню — проверьте наличие белковых альтернатив (яйца, бобовые, сыр)');
        if (params.menuType === 'kids') tips.push('Детское меню — возьмите запас любимых перекусов для детей');
        tips.push('Берите запас еды на 1 день на случай задержки');
        tips.push('Сообщите близким маршрут и сроки возвращения');
        return tips;
      }
      return { build: build };
    })();

    /* ===== МОДУЛЬ MenuBuilder: конструктор меню и шаблоны ===== */
    var MenuBuilder = (function () {
      var STORAGE_KEY = 'splav-menu-templates';
      var MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks'];
      var MEAL_LABELS = {
        breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин',
        snacks: 'Перекусы', drinks: 'Напитки'
      };

      /* Пустой день меню */
      function createEmptyDay() {
        return { breakfast: [], lunch: [], dinner: [], snacks: [], drinks: [] };
      }

      /* День с базовым набором блюд */
      function createDefaultDay(dayIndex) {
        var presets = [
          { breakfast: ['Каша овсяная', 'Чай', 'Бутерброды'], lunch: ['Суп', 'Гарнир', 'Хлеб'], dinner: ['Горячее на костре', 'Чай'], snacks: ['Орехи', 'Шоколад'], drinks: ['Вода', 'Сок'] },
          { breakfast: ['Гречневая каша', 'Кофе'], lunch: ['Уха', 'Рис'], dinner: ['Тушёнка с картофелем'], snacks: ['Сухарики'], drinks: ['Вода', 'Чай'] },
          { breakfast: ['Омлет', 'Хлеб'], lunch: ['Лагман'], dinner: ['Котлеты с гарниром'], snacks: ['Фрукты'], drinks: ['Компот', 'Вода'] }
        ];
        var p = presets[dayIndex % presets.length];
        return {
          breakfast: p.breakfast.slice(),
          lunch: p.lunch.slice(),
          dinner: p.dinner.slice(),
          snacks: p.snacks.slice(),
          drinks: p.drinks.slice()
        };
      }

      /* Синхронизация числа дней в состоянии меню */
      function syncDaysCount(state, days) {
        while (state.length < days) {
          state.push(createDefaultDay(state.length));
        }
        while (state.length > days) {
          state.pop();
        }
        return state;
      }

      /* Загрузка шаблонов из localStorage */
      function getTemplates() {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) {
          return {};
        }
      }

      /* Сохранение шаблона */
      function saveTemplate(name, state) {
        if (!name || !name.trim()) return false;
        var templates = getTemplates();
        templates[name.trim()] = JSON.parse(JSON.stringify(state));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        return true;
      }

      /* Загрузка шаблона по имени */
      function loadTemplate(name) {
        var templates = getTemplates();
        return templates[name] ? JSON.parse(JSON.stringify(templates[name])) : null;
      }

      /* Удаление шаблона */
      function deleteTemplate(name) {
        var templates = getTemplates();
        delete templates[name];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
      }

      /* Список имён шаблонов */
      function listTemplateNames() {
        return Object.keys(getTemplates()).sort(function (a, b) { return a.localeCompare(b, 'ru'); });
      }

      /* Объединение блюд в строку для таблицы */
      function dishesToString(dishes) {
        if (!dishes || !dishes.length) return '—';
        return dishes.join(', ');
      }

      /* Ключевые слова блюд → продукты (норма на 1 человека за 1 упоминание) */
      var dishKeywords = [
        { keys: ['греч', 'гречн'], product: 'Гречка', norm: 0.08 },
        { keys: ['овсян', 'мюсли'], product: 'Овсянка', norm: 0.06 },
        { keys: ['рис', 'плов'], product: 'Рис', norm: 0.07 },
        { keys: ['макарон', 'паста', 'вермиш', 'лагман', 'спагетти'], product: 'Макароны', norm: 0.1 },
        { keys: ['картоф', 'пюре'], product: 'Картофель', norm: 0.2 },
        { keys: ['яичн', 'омлет', 'яйц'], product: 'Яйца', norm: 1 },
        { keys: ['молок', 'каша'], product: 'Молоко', norm: 0.15 },
        { keys: ['хлеб', 'бутерброд', 'лаваш', 'тост'], product: 'Хлеб', norm: 0.15 },
        { keys: ['шашлык', 'свинин', 'мясо', 'стейк', 'котлет', 'колбас'], product: 'Мясо свинина', norm: 0.15 },
        { keys: ['куриц', 'курин'], product: 'Курица', norm: 0.12 },
        { keys: ['говядин'], product: 'Мясо говядина', norm: 0.12 },
        { keys: ['рыб', 'уха', 'хариус'], product: 'Рыба свежая', norm: 0.12 },
        { keys: ['тушён', 'тушен', 'консерв', 'тушонк'], product: 'Консервы мясные', norm: 0.33 },
        { keys: ['сыр'], product: 'Сыр', norm: 0.05 },
        { keys: ['сосиск', 'сардель'], product: 'Сосиски', norm: 0.1 },
        { keys: ['пельмен'], product: 'Пельмени', norm: 0.2 },
        { keys: ['суп', 'борщ', 'щи', 'уха'], product: 'Картофель', norm: 0.08 },
        { keys: ['суп', 'борщ'], product: 'Морковь', norm: 0.03 },
        { keys: ['суп', 'борщ', 'салат'], product: 'Лук', norm: 0.03 },
        { keys: ['салат', 'овощ'], product: 'Помидоры', norm: 0.05 },
        { keys: ['салат'], product: 'Огурцы', norm: 0.05 },
        { keys: ['чай'], product: 'Чай', norm: 0.01 },
        { keys: ['кофе'], product: 'Кофе', norm: 0.008 },
        { keys: ['какао'], product: 'Какао', norm: 0.02 },
        { keys: ['вода'], product: 'Вода питьевая', norm: 1.5 },
        { keys: ['сок', 'компот', 'морс'], product: 'Сок', norm: 0.3 },
        { keys: ['орех'], product: 'Орехи', norm: 0.03 },
        { keys: ['шоколад', 'батончик'], product: 'Шоколад', norm: 0.04 },
        { keys: ['печень', 'печенье', 'сухар'], product: 'Печенье', norm: 0.04 },
        { keys: ['сухофрукт', 'изюм', 'курага'], product: 'Сухофрукты', norm: 0.03 },
        { keys: ['фрукт', 'банан', 'яблок'], product: 'Сухофрукты', norm: 0.05 },
        { keys: ['масло'], product: 'Масло подсолнечное', norm: 0.02 },
        { keys: ['сметан'], product: 'Сметана', norm: 0.05 },
        { keys: ['блин', 'мука'], product: 'Мука', norm: 0.05 },
        { keys: ['сахар', 'варень'], product: 'Сахар', norm: 0.02 }
      ];

      /* Анализ пользовательского меню для расчёта продуктов */
      function calcProductQuantities(customMenuDays, people) {
        var qtyMap = {};
        var dishCount = 0;

        customMenuDays.forEach(function (day) {
          MEAL_TYPES.forEach(function (meal) {
            (day[meal] || []).forEach(function (dish) {
              dishCount++;
              var lower = dish.toLowerCase();
              dishKeywords.forEach(function (rule) {
                var matched = rule.keys.some(function (k) { return lower.indexOf(k) >= 0; });
                if (matched) {
                  qtyMap[rule.product] = (qtyMap[rule.product] || 0) + rule.norm * people;
                }
              });
            });
          });
        });

        /* Базовый минимум на каждый день */
        var days = customMenuDays.length;
        qtyMap['Соль'] = (qtyMap['Соль'] || 0) + 0.005 * people * days;
        qtyMap['Специи набор'] = (qtyMap['Специи набор'] || 0) + 0.01 * people * days;
        qtyMap['Вода питьевая'] = (qtyMap['Вода питьевая'] || 0) + 1.5 * people * days;

        /* Если блюд мало — добавляем базовый набор */
        if (dishCount < days * 3) {
          qtyMap['Гречка'] = (qtyMap['Гречка'] || 0) + 0.06 * people * days;
          qtyMap['Хлеб'] = (qtyMap['Хлеб'] || 0) + 0.2 * people * days;
          qtyMap['Консервы мясные'] = (qtyMap['Консервы мясные'] || 0) + 0.25 * people * days;
        }

        return qtyMap;
      }

      return {
        MEAL_TYPES: MEAL_TYPES,
        MEAL_LABELS: MEAL_LABELS,
        createEmptyDay: createEmptyDay,
        createDefaultDay: createDefaultDay,
        syncDaysCount: syncDaysCount,
        getTemplates: getTemplates,
        saveTemplate: saveTemplate,
        loadTemplate: loadTemplate,
        deleteTemplate: deleteTemplate,
        listTemplateNames: listTemplateNames,
        dishesToString: dishesToString,
        calcProductQuantities: calcProductQuantities
      };
    })();

    /* ===== МОДУЛЬ MenuPlanner: меню по дням с учётом пресета ===== */
    var MenuPlanner = (function () {
      function build(params) {
        var days = params.days;
        var preset = Data.menuPresets[params.menuType] || Data.menuPresets.standard;
        var templates = preset.templates;
        var menu = [];

        for (var d = 0; d < days; d++) {
          var seed = Utils.hashStr(params.river + params.routeId + params.menuType + params.startDate + d);
          var dayMenu;

          if (params.menuType === 'custom' && params.customMenuDays && params.customMenuDays[d]) {
            var customDay = params.customMenuDays[d];
            dayMenu = {
              breakfast: MenuBuilder.dishesToString(customDay.breakfast),
              lunch: MenuBuilder.dishesToString(customDay.lunch),
              dinner: MenuBuilder.dishesToString(customDay.dinner),
              snacks: MenuBuilder.dishesToString(customDay.snacks),
              drinks: MenuBuilder.dishesToString(customDay.drinks),
              breakfastList: customDay.breakfast.slice(),
              lunchList: customDay.lunch.slice(),
              dinnerList: customDay.dinner.slice(),
              snacksList: customDay.snacks.slice(),
              drinksList: customDay.drinks.slice()
            };
          } else {
            dayMenu = {
              breakfast: Utils.pickFromArray(templates.breakfast, seed),
              lunch: Utils.pickFromArray(templates.lunch, seed + 1),
              dinner: Utils.pickFromArray(templates.dinner, seed + 2),
              snacks: Utils.pickFromArray(templates.snacks, seed + 3),
              drinks: Utils.pickFromArray(templates.drinks, seed + 4)
            };
          }

          menu.push({
            day: d + 1,
            date: Utils.formatDate(Utils.addDays(new Date(params.startDate), d)),
            menuType: preset.label,
            breakfast: dayMenu.breakfast,
            lunch: dayMenu.lunch,
            dinner: dayMenu.dinner,
            snacks: dayMenu.snacks,
            drinks: dayMenu.drinks
          });
        }
        return menu;
      }
      return { build: build };
    })();

    /* ===== МОДУЛЬ ProductsCalc: расчёт продуктов ===== */
    var ProductsCalc = (function () {
      /* Нормы потребления на человека в день (кг/шт) */
      var norms = {
        'Гречка': 0.08, 'Рис': 0.07, 'Овсянка': 0.06, 'Макароны': 0.1,
        'Картофель': 0.25, 'Лук': 0.05, 'Морковь': 0.05, 'Яйца': 2,
        'Молоко': 0.3, 'Хлеб': 0.3, 'Мясо свинина': 0.2, 'Курица': 0.15,
        'Рыба свежая': 0.15, 'Колбаса': 0.08, 'Сыр': 0.05, 'Сахар': 0.03,
        'Соль': 0.005, 'Масло подсолнечное': 0.03, 'Масло сливочное': 0.02,
        'Чай': 0.02, 'Кофе': 0.01, 'Вода питьевая': 2, 'Печенье': 0.05,
        'Шоколад': 0.05, 'Орехи': 0.03, 'Сухофрукты': 0.03, 'Консервы рыбные': 0.5,
        'Консервы мясные': 0.33, 'Специи набор': 0.01, 'Сосиски': 0.15,
        'Помидоры': 0.1, 'Огурцы': 0.1, 'Капуста': 0.1, 'Сок': 0.5
      };
      function build(params) {
        var people = params.participants;
        var days = params.days;
        var preset = Data.menuPresets[params.menuType] || Data.menuPresets.standard;
        var pFactor = preset.priceFactor;
        var cFactor = preset.caloriesFactor;
        var exclude = preset.excludeProducts || [];
        var items = [];
        var catalog = Data.productCatalog;

        /* Пользовательское меню — расчёт по блюдам конструктора */
        if (params.menuType === 'custom' && params.customMenuDays && params.customMenuDays.length) {
          var qtyMap = MenuBuilder.calcProductQuantities(params.customMenuDays, people);
          catalog.forEach(function (prod) {
            if (exclude.indexOf(prod.name) >= 0) return;
            var qty = qtyMap[prod.name];
            if (!qty || qty <= 0) return;
            qty = Math.ceil(qty * 10) / 10;
            var weight = qty * prod.weightPerUnit;
            var cost = qty * prod.pricePerUnit * pFactor;
            var calories = Math.round(qty * (Data.caloriesMap[prod.name] || 0) * cFactor);
            items.push({ name: prod.name, unit: prod.unit, qty: qty, weight: weight, cost: cost, calories: calories });
          });
          items.sort(function (a, b) { return a.name.localeCompare(b.name, 'ru'); });
          return items;
        }

        /* Готовые пресеты меню */
        var qFactor = preset.quantityFactor;
        catalog.forEach(function (prod) {
          if (exclude.indexOf(prod.name) >= 0) return;
          var norm = norms[prod.name];
          if (!norm) return;
          var qty = Math.ceil(norm * people * days * qFactor * 10) / 10;
          if (qty <= 0) return;
          var weight = qty * prod.weightPerUnit;
          var cost = qty * prod.pricePerUnit * pFactor;
          var calories = Math.round(qty * (Data.caloriesMap[prod.name] || 0) * cFactor);
          items.push({ name: prod.name, unit: prod.unit, qty: qty, weight: weight, cost: cost, calories: calories });
        });
        items.sort(function (a, b) { return a.name.localeCompare(b.name, 'ru'); });
        return items;
      }
      function totals(items) {
        return items.reduce(function (acc, it) {
          acc.weight += it.weight;
          acc.cost += it.cost;
          acc.calories += it.calories || 0;
          return acc;
        }, { weight: 0, cost: 0, calories: 0 });
      }
      return { build: build, totals: totals };
    })();

    /* ===== МОДУЛЬ GearPlanner: списки снаряжения ===== */
    var GearPlanner = (function () {
      function build(params) {
        var people = params.participants;
        var days = params.days;
        var craft = params.craft;
        var result = {};
        Object.keys(Data.gearCategories).forEach(function (cat) {
          result[cat] = Data.gearCategories[cat].map(function (item) {
            var qty = 1;
            if (cat === 'personal') qty = people;
            if (cat === 'group') {
              if (item.indexOf('Палатка') >= 0) qty = Math.ceil(people / 3);
              if (item.indexOf('Спальник') >= 0) qty = people;
              if (item.indexOf('Рация') >= 0) qty = 2;
            }
            if (cat === 'gas') {
              qty = Math.ceil(days / 3);
              if (item.indexOf('Запасной') >= 0) qty = Math.ceil(days / 5);
            }
            return { name: item, qty: qty };
          });
        });
        /* Дополнения по типу судна */
        if (craft === 'kayak' || craft === 'baidarka') {
          result.repair.push({ name: 'Спрей-юбка / юбка байдарочная', qty: people });
        }
        if (craft.indexOf('catamaran') >= 0) {
          result.repair.push({ name: 'Насос электрический 12V', qty: 1 });
        }
        if (craft === 'sup') {
          result.personal.push({ name: 'Насадка для сап-доски (если есть)', qty: people });
        }
        return result;
      }
      return { build: build };
    })();

    /* ===== МОДУЛЬ BudgetCalc: расчёт бюджета ===== */
    var BudgetCalc = (function () {
      function build(params, products, route) {
        var people = params.participants;
        var days = params.days;
        var food = ProductsCalc.totals(products).cost;
        /* Стоимость трансфера и аренды — из полей, введённых пользователем */
        var transport = parseFloat(params.transferCost) || 0;
        var rent = parseFloat(params.craftRentCost) || 0;
        var gas = Math.ceil(days / 3) * 350 + 500;
        var other = 2000 + people * 300;
        var total = food + transport + rent + gas + other;
        var perPerson = total / people;
        if (params.budget && params.budget > 0 && total > params.budget) {
          other = Math.max(500, params.budget - food - transport - rent - gas);
          total = food + transport + rent + gas + other;
          perPerson = total / people;
        }
        return {
          food: food, transport: transport, rent: rent,
          gas: gas, other: other, total: total, perPerson: perPerson,
          details: [
            { category: 'Продукты', amount: food },
            { category: 'Трансфер (указано вручную)', amount: transport },
            { category: 'Аренда «' + Data.craftLabels[params.craft] + '» (указано вручную)', amount: rent },
            { category: 'Газ и расходники', amount: gas },
            { category: 'Прочее (аптечка, связь, мелочи)', amount: other }
          ]
        };
      }
      return { build: build };
    })();

    /* ===== МОДУЛЬ WeatherService: погода Open-Meteo + fallback ===== */
    var WeatherService = (function () {
      var weatherCodes = {
        0: { icon: '☀️', desc: 'Ясно' },
        1: { icon: '🌤', desc: 'Преимущественно ясно' },
        2: { icon: '⛅', desc: 'Переменная облачность' },
        3: { icon: '☁️', desc: 'Пасмурно' },
        45: { icon: '🌫', desc: 'Туман' },
        51: { icon: '🌦', desc: 'Морось' },
        61: { icon: '🌧', desc: 'Дождь' },
        63: { icon: '🌧', desc: 'Дождь' },
        65: { icon: '🌧', desc: 'Сильный дождь' },
        71: { icon: '🌨', desc: 'Снег' },
        80: { icon: '🌦', desc: 'Ливень' },
        95: { icon: '⛈', desc: 'Гроза' }
      };
      /* Симуляция погоды на основе даты и реки */
      function simulate(params, river) {
        var days = params.days;
        var start = new Date(params.startDate);
        var forecast = [];
        for (var d = 0; d < days; d++) {
          var date = Utils.addDays(start, d);
          var seed = Utils.hashStr(river.id + date.toISOString());
          var month = date.getMonth();
          /* Базовая температура по сезону */
          var baseTemp = month >= 5 && month <= 7 ? 22 : month === 4 || month === 8 ? 16 : 10;
          var temp = baseTemp + (seed % 8) - 3;
          var codeKeys = [0, 1, 2, 3, 61, 80, 95];
          var code = codeKeys[Math.abs(seed) % codeKeys.length];
          var w = weatherCodes[code] || weatherCodes[0];
          forecast.push({
            date: Utils.formatDate(date),
            tempMax: temp,
            tempMin: temp - 5,
            icon: w.icon,
            desc: w.desc,
            source: 'симуляция'
          });
        }
        return forecast;
      }
      /* Запрос к Open-Meteo API */
      function fetchWeather(params, river) {
        var start = params.startDate;
        var endDate = Utils.addDays(new Date(start), params.days - 1);
        var end = endDate.toISOString().split('T')[0];
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + river.lat +
          '&longitude=' + river.lon + '&daily=temperature_2m_max,temperature_2m_min,weathercode' +
          '&timezone=Europe%2FMoscow&start_date=' + start + '&end_date=' + end;
        return window.fetch(url).then(function (resp) {
          if (!resp.ok) throw new Error('API error');
          return resp.json();
        }).then(function (data) {
          if (!data.daily) throw new Error('No data');
          var forecast = [];
          for (var i = 0; i < data.daily.time.length; i++) {
            var code = data.daily.weathercode[i];
            var w = weatherCodes[code] || weatherCodes[0];
            var parts = data.daily.time[i].split('-');
            forecast.push({
              date: parts[2] + '.' + parts[1] + '.' + parts[0],
              tempMax: Math.round(data.daily.temperature_2m_max[i]),
              tempMin: Math.round(data.daily.temperature_2m_min[i]),
              icon: w.icon,
              desc: w.desc,
              source: 'Open-Meteo'
            });
          }
          return forecast;
        });
      }
      /* Рекомендации по одежде */
      function clothingRecommendations(forecast) {
        var recs = [];
        var avgTemp = forecast.reduce(function (s, f) { return s + f.tempMax; }, 0) / forecast.length;
        var hasRain = forecast.some(function (f) { return f.desc.indexOf('дождь') >= 0 || f.desc.indexOf('Ливень') >= 0 || f.desc.indexOf('Гроза') >= 0; });
        if (avgTemp >= 20) {
          recs.push('Лёгкая одежда: футболки, шорты, купальник');
          recs.push('Солнцезащитный крем с фактором 50+');
        } else if (avgTemp >= 12) {
          recs.push('Флисовая кофта + ветровка');
          recs.push('Термобельё для утренних часов');
        } else {
          recs.push('Тёплая куртка, термобельё, шапка');
          recs.push('Перчатки для утренних сплавов');
        }
        if (hasRain) {
          recs.push('Обязательно: непромокаемый дождевик или пончо');
          recs.push('Гермомешки для одежды и электроники');
        }
        recs.push('Сменная обувь: кроксы + сухие носки в гермомешке');
        recs.push('Неопреновые носки или сандалии для сплава');
        return recs;
      }
      return { fetchWeather: fetchWeather, simulate: simulate, clothingRecommendations: clothingRecommendations };
    })();

    /* ===== МОДУЛЬ ExportService: экспорт данных ===== */
    var ExportService = (function () {
      function getPlanData() { return window.__currentPlan || null; }
      /* Печать / PDF через диалог печати браузера */
      function printPlan() { window.print(); }
      function pdfPlan() { window.print(); }
      /* Экспорт CSV для Excel */
      function exportCSV(plan) {
        if (!plan) return;
        var lines = ['\uFEFFРаздел;Параметр;Значение'];
        lines.push('Поход;Река;' + plan.params.riverName);
        lines.push('Поход;Маршрут;' + (plan.params.routeName || ''));
        lines.push('Поход;Меню;' + (plan.params.menuType || ''));
        lines.push('Поход;Трансфер (₽);' + (plan.params.transferCost || 0));
        lines.push('Поход;Аренда (₽);' + (plan.params.craftRentCost || 0));
        lines.push('Поход;Участников;' + plan.params.participants);
        lines.push('Поход;Дней;' + plan.params.days);
        lines.push('');
        lines.push('Продукт;Ед.;Кол-во;Вес;Ккал;Стоимость');
        plan.products.forEach(function (p) {
          lines.push(p.name + ';' + p.unit + ';' + p.qty + ';' + p.weight.toFixed(2) + ';' + (p.calories || 0) + ';' + p.cost.toFixed(0));
        });
        lines.push('');
        lines.push('Бюджет;Категория;Сумма');
        plan.budget.details.forEach(function (b) {
          lines.push(';' + b.category + ';' + b.amount.toFixed(0));
        });
        Utils.downloadFile(lines.join('\n'), 'splav-plan.csv', 'text/csv;charset=utf-8');
      }
      /* SpreadsheetML для Excel */
      function exportSpreadsheetML(plan) {
        if (!plan) return;
        var xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
        xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
        xml += '<Worksheet ss:Name="Продукты"><Table>';
        xml += '<Row><Cell><Data ss:Type="String">Продукт</Data></Cell><Cell><Data ss:Type="String">Ед.</Data></Cell><Cell><Data ss:Type="String">Кол-во</Data></Cell><Cell><Data ss:Type="String">Вес</Data></Cell><Cell><Data ss:Type="String">Ккал</Data></Cell><Cell><Data ss:Type="String">Стоимость</Data></Cell></Row>';
        plan.products.forEach(function (p) {
          xml += '<Row><Cell><Data ss:Type="String">' + Utils.escapeHtml(p.name) + '</Data></Cell>';
          xml += '<Cell><Data ss:Type="String">' + p.unit + '</Data></Cell>';
          xml += '<Cell><Data ss:Type="Number">' + p.qty + '</Data></Cell>';
          xml += '<Cell><Data ss:Type="Number">' + p.weight.toFixed(2) + '</Data></Cell>';
          xml += '<Cell><Data ss:Type="Number">' + (p.calories || 0) + '</Data></Cell>';
          xml += '<Cell><Data ss:Type="Number">' + p.cost.toFixed(0) + '</Data></Cell></Row>';
        });
        xml += '</Table></Worksheet>';
        xml += '<Worksheet ss:Name="Бюджет"><Table>';
        plan.budget.details.forEach(function (b) {
          xml += '<Row><Cell><Data ss:Type="String">' + Utils.escapeHtml(b.category) + '</Data></Cell>';
          xml += '<Cell><Data ss:Type="Number">' + b.amount.toFixed(0) + '</Data></Cell></Row>';
        });
        xml += '</Table></Worksheet></Workbook>';
        Utils.downloadFile(xml, 'splav-plan.xls', 'application/vnd.ms-excel');
      }
      /* Сохранение JSON */
      function exportJSON(plan) {
        if (!plan) return;
        Utils.downloadFile(JSON.stringify(plan, null, 2), 'splav-plan.json', 'application/json');
      }
      /* Загрузка JSON */
      function loadJSON(file, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
          try {
            var data = JSON.parse(e.target.result);
            callback(null, data);
          } catch (err) { callback(err); }
        };
        reader.readAsText(file);
      }
      return {
        getPlanData: getPlanData, printPlan: printPlan, pdfPlan: pdfPlan,
        exportCSV: exportCSV, exportSpreadsheetML: exportSpreadsheetML,
        exportJSON: exportJSON, loadJSON: loadJSON
      };
    })();

    /* ===== МОДУЛЬ UI: управление интерфейсом ===== */
    var UI = (function () {
      var els = {};
      var menuManualOverride = false;
      var updateTimer = null;
      var planGeneratedOnce = false;
      var transferCostManual = false;
      var craftRentManual = false;
      /* Состояние конструктора меню: массив дней с блюдами */
      var customMenuState = [];

      /* Кеширование DOM-элементов */
      function cacheElements() {
        els.riversGrid = document.getElementById('rivers-grid');
        els.riverSearch = document.getElementById('river-search');
        els.riverFilterDiff = document.getElementById('river-filter-difficulty');
        els.riverFilterSeason = document.getElementById('river-filter-season');
        els.riverSelect = document.getElementById('river-select');
        els.tripForm = document.getElementById('trip-form');
        els.results = document.getElementById('results');
        els.selectedRiverInfo = document.getElementById('selected-river-info');
        els.routesSection = document.getElementById('routes-section');
        els.routesList = document.getElementById('routes-list');
        els.routeSelect = document.getElementById('route-select');
        els.menuSelect = document.getElementById('menu-select');
        els.menuHint = document.getElementById('menu-recommendation-hint');
        els.customMenuPanel = document.getElementById('custom-menu-panel');
        els.menuBuilderDays = document.getElementById('menu-builder-days');
        els.menuTemplateSelect = document.getElementById('menu-template-select');
        els.menuTemplateName = document.getElementById('menu-template-name');
        els.transferCostInput = document.getElementById('transfer-cost');
        els.craftRentInput = document.getElementById('craft-rent-cost');
        els.transferCostHint = document.getElementById('transfer-cost-hint');
        els.craftRentHint = document.getElementById('craft-rent-hint');
        els.routeOutput = document.getElementById('route-output');
        els.weatherOutput = document.getElementById('weather-output');
        els.clothingOutput = document.getElementById('clothing-output');
        els.menuOutput = document.getElementById('menu-output');
        els.productsOutput = document.getElementById('products-output');
        els.gearOutput = document.getElementById('gear-output');
        els.budgetOutput = document.getElementById('budget-output');
        els.budgetDetailOutput = document.getElementById('budget-detail-output');
        els.tipsOutput = document.getElementById('tips-output');
        els.themeToggle = document.getElementById('theme-toggle');
        els.startDate = document.getElementById('start-date');
        els.daysInput = document.getElementById('days');
        els.craftSelect = document.getElementById('craft');
        els.transferSelect = document.getElementById('transfer');
      }
      /* Переключение тёмной темы */
      function initTheme() {
        var saved = localStorage.getItem('splav-theme') || 'light';
        document.body.setAttribute('data-theme', saved);
        els.themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
        els.themeToggle.addEventListener('click', function () {
          var cur = document.body.getAttribute('data-theme');
          var next = cur === 'dark' ? 'light' : 'dark';
          document.body.setAttribute('data-theme', next);
          localStorage.setItem('splav-theme', next);
          els.themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
        });
      }
      /* Сворачиваемые секции */
      function initCollapsibles() {
        document.querySelectorAll('.collapsible__header').forEach(function (hdr) {
          hdr.addEventListener('click', function () {
            var parent = hdr.closest('.collapsible');
            if (parent) parent.classList.toggle('open');
          });
        });
      }
      /* Заполнение select реками */
      function populateRiverSelect() {
        els.riverSelect.innerHTML = '<option value="">— выберите реку —</option>';
        Data.rivers.forEach(function (r) {
          var opt = document.createElement('option');
          opt.value = r.id;
          opt.textContent = r.name + ' (' + r.difficulty + ', ' + r.routeLength + ' км)';
          els.riverSelect.appendChild(opt);
        });
      }
      /* Рендер карточки реки */
      function renderRiverCard(river) {
        var photo = river.photos[0] || '';
        var seasonStr = river.season.join(', ');
        return '<article class="card" role="listitem" data-river-id="' + river.id + '">' +
          (photo ? '<img class="card__img" src="' + photo + '" alt="' + Utils.escapeHtml(river.name) + '" loading="lazy">' : '') +
          '<div class="card__title">🌊 ' + Utils.escapeHtml(river.name) + '</div>' +
          '<div class="card__meta">' +
            '<span class="badge ' + Utils.difficultyClass(river.difficulty) + '">' + river.difficulty + '</span>' +
            '<span class="badge">' + river.routeLength + ' км</span>' +
            '<span class="badge">' + river.duration + '</span>' +
          '</div>' +
          '<p>' + Utils.escapeHtml(river.description) + '</p>' +
          '<p><strong>Сезон:</strong> ' + seasonStr + '</p>' +
          '<p><strong>Достопримечательности:</strong> ' + river.attractions.slice(0, 3).map(Utils.escapeHtml).join(', ') + '</p>' +
          '<button type="button" class="btn btn--primary btn--sm select-river-btn" data-id="' + river.id + '">Выбрать</button>' +
          '</article>';
      }
      /* Рендер сетки рек с фильтрацией */
      function renderRiversGrid() {
        var query = (els.riverSearch.value || '').toLowerCase();
        var diff = els.riverFilterDiff.value;
        var season = els.riverFilterSeason.value;
        var filtered = Data.rivers.filter(function (r) {
          var text = (r.name + ' ' + r.description + ' ' + r.attractions.join(' ')).toLowerCase();
          if (query && text.indexOf(query) < 0) return false;
          if (diff && r.difficulty !== diff) return false;
          if (season && r.season.indexOf(season) < 0) return false;
          return true;
        });
        els.riversGrid.innerHTML = filtered.map(renderRiverCard).join('');
        els.riversGrid.querySelectorAll('.select-river-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            els.riverSelect.value = btn.getAttribute('data-id');
            onRiverChange(false);
            els.tripForm.scrollIntoView({ behavior: 'smooth' });
          });
        });
      }

      /* Рендер карточек маршрутов для выбранной реки */
      function renderRoutesPanel(riverId, selectedRouteId) {
        var river = Data.getRiverById(riverId);
        if (!river || !river.routes || !river.routes.length) {
          els.routesSection.classList.add('hidden');
          els.routeSelect.value = '';
          return;
        }
        els.routesSection.classList.remove('hidden');
        var html = '';
        river.routes.forEach(function (rt) {
          var isSelected = rt.id === selectedRouteId;
          var menuLabel = Data.menuPresets[rt.recommendedMenu] ? Data.menuPresets[rt.recommendedMenu].label : rt.recommendedMenu;
          html += '<div class="route-card' + (isSelected ? ' selected' : '') + '" data-route-id="' + rt.id + '" role="button" tabindex="0">' +
            '<div class="route-card__title">' + Utils.escapeHtml(rt.name) + '</div>' +
            '<div class="route-card__meta">' +
              '<span>📏 ' + rt.lengthKm + ' км</span>' +
              '<span>⏱ ' + rt.duration + '</span>' +
              '<span class="badge ' + Utils.difficultyClass(rt.difficulty) + '">' + rt.difficulty + '</span>' +
              '<span>🍽 ' + menuLabel + '</span>' +
            '</div>' +
            '<p class="route-card__desc">' + Utils.escapeHtml(rt.description) + '</p>' +
            '<p class="route-card__attr"><strong>Достопримечательности:</strong> ' +
              rt.attractions.map(Utils.escapeHtml).join(', ') + '</p>' +
            '</div>';
        });
        els.routesList.innerHTML = html;
        els.routesList.querySelectorAll('.route-card').forEach(function (card) {
          card.addEventListener('click', function () {
            selectRoute(card.getAttribute('data-route-id'));
          });
          card.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault();
              selectRoute(card.getAttribute('data-route-id'));
            }
          });
        });
      }

      /* Выбор маршрута пользователем */
      function selectRoute(routeId, skipMenuRecommend) {
        els.routeSelect.value = routeId;
        var river = Data.getRiverById(els.riverSelect.value);
        if (!river) return;
        renderRoutesPanel(river.id, routeId);
        var route = Data.getRoute(river.id, routeId);
        if (route) {
          els.daysInput.value = route.recommendedDays;
          updateMenuRecommendationHint(route);
          updateCraftRentSuggestion();
          if (!skipMenuRecommend && !menuManualOverride) {
            applyRecommendedMenu(route.recommendedMenu);
          }
        }
        scheduleUpdate();
      }

      /* Подстановка рекомендуемого меню для маршрута */
      function applyRecommendedMenu(menuType) {
        if (Data.menuPresets[menuType]) {
          els.menuSelect.value = menuType;
          toggleCustomMenuPanel();
        }
      }

      /* Подсказка о рекомендуемом меню */
      function updateMenuRecommendationHint(route) {
        if (!route) {
          els.menuHint.classList.add('hidden');
          return;
        }
        var preset = Data.menuPresets[route.recommendedMenu];
        if (!preset) {
          els.menuHint.classList.add('hidden');
          return;
        }
        els.menuHint.classList.remove('hidden');
        els.menuHint.innerHTML = 'Рекомендуемое меню для этого маршрута: <strong>' + preset.label + '</strong> — ' + preset.description;
      }

      /* Подсказка и автоподстановка стоимости трансфера */
      function updateTransferCostSuggestion() {
        var type = els.transferSelect.value;
        var suggested = Data.transferRates[type] || 0;
        els.transferCostHint.textContent = 'Подсказка для «' + Data.transferLabels[type] + '»: ~' + Utils.formatMoney(suggested);
        if (!transferCostManual) {
          els.transferCostInput.value = suggested;
        }
      }

      /* Подсказка и автоподстановка стоимости аренды */
      function updateCraftRentSuggestion() {
        var craft = els.craftSelect.value;
        var days = parseInt(els.daysInput.value, 10) || 1;
        var rate = Data.craftRates[craft] || 2000;
        var suggested = rate * days;
        els.craftRentHint.textContent = 'Подсказка: ' + Utils.formatMoney(rate) + '/день × ' + days + ' = ~' + Utils.formatMoney(suggested);
        if (!craftRentManual) {
          els.craftRentInput.value = suggested;
        }
      }

      /* Обновление списка шаблонов меню в select */
      function refreshMenuTemplateSelect() {
        var names = MenuBuilder.listTemplateNames();
        els.menuTemplateSelect.innerHTML = '<option value="">— загрузить шаблон —</option>';
        names.forEach(function (name) {
          var opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          els.menuTemplateSelect.appendChild(opt);
        });
      }

      /* Синхронизация состояния меню с числом дней */
      function syncCustomMenuState() {
        var days = parseInt(els.daysInput.value, 10) || 1;
        customMenuState = MenuBuilder.syncDaysCount(customMenuState, days);
      }

      /* Рендер конструктора меню по дням */
      function renderMenuBuilder() {
        syncCustomMenuState();
        var html = '';
        customMenuState.forEach(function (day, dayIndex) {
          html += '<div class="menu-day-block" data-day-index="' + dayIndex + '">';
          html += '<h4>День ' + (dayIndex + 1) + '</h4>';
          MenuBuilder.MEAL_TYPES.forEach(function (meal) {
            html += '<div class="meal-section" data-meal="' + meal + '">';
            html += '<div class="meal-section__title">' + MenuBuilder.MEAL_LABELS[meal] + '</div>';
            html += '<ul class="dish-list">';
            (day[meal] || []).forEach(function (dish, dishIndex) {
              html += '<li class="dish-item" data-dish-index="' + dishIndex + '">' +
                '<input type="text" class="dish-edit-input" value="' + Utils.escapeHtml(dish) + '" data-day="' + dayIndex + '" data-meal="' + meal + '" data-dish="' + dishIndex + '">' +
                '<button type="button" class="dish-item__btn dish-item__btn--delete" data-action="delete" data-day="' + dayIndex + '" data-meal="' + meal + '" data-dish="' + dishIndex + '" title="Удалить">✕</button>' +
                '</li>';
            });
            html += '</ul>';
            html += '<div class="dish-add-row">' +
              '<input type="text" class="dish-add-input" placeholder="Новое блюдо…" data-day="' + dayIndex + '" data-meal="' + meal + '">' +
              '<button type="button" class="btn btn--secondary btn--sm dish-add-btn" data-day="' + dayIndex + '" data-meal="' + meal + '">+ Добавить</button>' +
              '</div></div>';
          });
          html += '</div>';
        });
        els.menuBuilderDays.innerHTML = html;
        bindMenuBuilderEvents();
      }

      /* Обработчики конструктора меню */
      function bindMenuBuilderEvents() {
        els.menuBuilderDays.querySelectorAll('.dish-edit-input').forEach(function (input) {
          input.addEventListener('change', function () {
            var d = parseInt(input.getAttribute('data-day'), 10);
            var meal = input.getAttribute('data-meal');
            var i = parseInt(input.getAttribute('data-dish'), 10);
            customMenuState[d][meal][i] = input.value.trim();
            scheduleUpdate();
          });
        });
        els.menuBuilderDays.querySelectorAll('[data-action="delete"]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var d = parseInt(btn.getAttribute('data-day'), 10);
            var meal = btn.getAttribute('data-meal');
            var i = parseInt(btn.getAttribute('data-dish'), 10);
            customMenuState[d][meal].splice(i, 1);
            renderMenuBuilder();
            scheduleUpdate();
          });
        });
        els.menuBuilderDays.querySelectorAll('.dish-add-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var d = parseInt(btn.getAttribute('data-day'), 10);
            var meal = btn.getAttribute('data-meal');
            var row = btn.previousElementSibling;
            if (row && row.classList.contains('dish-add-input')) {
              var val = row.value.trim();
              if (val) {
                customMenuState[d][meal].push(val);
                row.value = '';
                renderMenuBuilder();
                scheduleUpdate();
              }
            }
          });
        });
        els.menuBuilderDays.querySelectorAll('.dish-add-input').forEach(function (input) {
          input.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') {
              ev.preventDefault();
              var btn = input.nextElementSibling;
              if (btn) btn.click();
            }
          });
        });
      }

      /* Сохранение шаблона меню */
      function saveMenuTemplate() {
        var name = els.menuTemplateName.value.trim();
        if (!name) {
          Utils.showToast('Введите название шаблона');
          return;
        }
        syncCustomMenuState();
        MenuBuilder.saveTemplate(name, customMenuState);
        refreshMenuTemplateSelect();
        els.menuTemplateSelect.value = name;
        Utils.showToast('Шаблон «' + name + '» сохранён');
      }

      /* Загрузка шаблона меню */
      function loadMenuTemplate(name) {
        if (!name) return;
        var loaded = MenuBuilder.loadTemplate(name);
        if (!loaded) {
          Utils.showToast('Шаблон не найден');
          return;
        }
        customMenuState = loaded;
        els.daysInput.value = customMenuState.length;
        renderMenuBuilder();
        scheduleUpdate();
        Utils.showToast('Шаблон «' + name + '» загружен');
      }

      /* Удаление шаблона меню */
      function deleteMenuTemplate() {
        var name = els.menuTemplateSelect.value;
        if (!name) {
          Utils.showToast('Выберите шаблон для удаления');
          return;
        }
        MenuBuilder.deleteTemplate(name);
        refreshMenuTemplateSelect();
        Utils.showToast('Шаблон «' + name + '» удалён');
      }

      /* Показ/скрытие панели пользовательского меню */
      function toggleCustomMenuPanel() {
        if (els.menuSelect.value === 'custom') {
          els.customMenuPanel.classList.remove('hidden');
          if (!customMenuState.length) {
            customMenuState = [MenuBuilder.createDefaultDay(0)];
          }
          renderMenuBuilder();
        } else {
          els.customMenuPanel.classList.add('hidden');
        }
      }

      /* Обработчик смены реки */
      function onRiverChange(preserveRoute) {
        var riverId = els.riverSelect.value;
        showSelectedRiverInfo(riverId);
        menuManualOverride = false;
        if (!riverId) {
          els.routesSection.classList.add('hidden');
          els.routeSelect.value = '';
          scheduleUpdate();
          return;
        }
        var river = Data.getRiverById(riverId);
        var defaultRoute = river.routes[1] || river.routes[0];
        renderRoutesPanel(riverId, preserveRoute ? els.routeSelect.value : defaultRoute.id);
        if (!preserveRoute || !els.routeSelect.value) {
          selectRoute(defaultRoute.id, false);
        } else {
          selectRoute(els.routeSelect.value, true);
        }
      }
      /* Информация о выбранной реке */
      function showSelectedRiverInfo(riverId) {
        var river = Data.getRiverById(riverId);
        if (!river) { els.selectedRiverInfo.classList.add('hidden'); return; }
        els.selectedRiverInfo.classList.remove('hidden');
        var gpsHtml = river.gpsPoints.map(function (g) {
          return g.name + ' (' + g.lat.toFixed(3) + ', ' + g.lng.toFixed(3) + ')';
        }).join(' → ');
        els.selectedRiverInfo.innerHTML =
          '<h3>📍 ' + Utils.escapeHtml(river.name) + '</h3>' +
          '<p>' + Utils.escapeHtml(river.description) + '</p>' +
          '<p><strong>Маршрут:</strong> ' + river.routeLength + ' км | <strong>Сложность:</strong> ' + river.difficulty +
          ' | <strong>Сезон:</strong> ' + river.season.join(', ') + '</p>' +
          '<p><strong>GPS:</strong> ' + gpsHtml + '</p>' +
          '<p><strong>Стоянки:</strong> ' + river.campsites.map(Utils.escapeHtml).join(', ') + '</p>' +
          '<p><strong>Рекомендации:</strong> ' + river.recommendations.map(Utils.escapeHtml).join('; ') + '</p>';
      }
      /* Сбор параметров из формы */
      function getFormParams() {
        var river = Data.getRiverById(els.riverSelect.value);
        var route = Data.getRoute(els.riverSelect.value, els.routeSelect.value);
        if (els.menuSelect.value === 'custom') {
          syncCustomMenuState();
        }
        return {
          river: els.riverSelect.value,
          riverName: river ? river.name : '',
          routeId: els.routeSelect.value,
          routeName: route ? route.name : '',
          menuType: els.menuSelect.value,
          customMenuDays: els.menuSelect.value === 'custom' ? JSON.parse(JSON.stringify(customMenuState)) : null,
          participants: parseInt(document.getElementById('participants').value, 10),
          days: parseInt(document.getElementById('days').value, 10),
          startDate: els.startDate.value,
          startTime: document.getElementById('start-time').value,
          endTime: document.getElementById('end-time').value,
          budget: parseFloat(document.getElementById('budget').value) || 0,
          transfer: document.getElementById('transfer').value,
          transferCost: parseFloat(els.transferCostInput.value) || 0,
          craft: document.getElementById('craft').value,
          craftRentCost: parseFloat(els.craftRentInput.value) || 0
        };
      }
      /* Рендер маршрута */
      function renderRoute(route) {
        var rv = route.routeVariant;
        var html = '<p><strong>Маршрут:</strong> ' + Utils.escapeHtml(rv.name) + '</p>' +
          '<p><strong>Общая дистанция:</strong> ' + route.totalKm + ' км за ' + route.days + ' дн. | ' +
          '<strong>Сложность:</strong> ' + rv.difficulty + '</p>';
        route.dailyPlans.forEach(function (day) {
          html += '<div class="day-card card">' +
            '<h4>День ' + day.day + ' — ' + day.date + ' (' + day.km + ' км, ~' + day.paddleHours + ' ч на воде)</h4>' +
            '<p>🚣 Выход: <strong>' + day.departure + '</strong> → Обед: <strong>' + day.lunch + '</strong> → Финиш: <strong>' + day.arrival + '</strong></p>' +
            '<p>🏕 Стоянка: ' + Utils.escapeHtml(day.campsite) + ' | 🏛 ' + Utils.escapeHtml(day.attraction) + '</p>' +
            '<p>📍 GPS: ' + day.gpsStart.name + ' → ' + day.gpsEnd.name + '</p>' +
            '<h5>Расписание:</h5>';
          day.schedule.forEach(function (s) {
            html += '<div class="schedule-item"><span class="schedule-item__time">' + s.time + '</span><span>' + Utils.escapeHtml(s.event) + '</span></div>';
          });
          html += '</div>';
        });
        els.routeOutput.innerHTML = html;
      }
      /* Рендер погоды */
      function renderWeather(forecast, clothing) {
        var html = '<div class="weather-card">';
        forecast.forEach(function (f) {
          html += '<div class="weather-day">' +
            '<div class="weather-day__icon">' + f.icon + '</div>' +
            '<div>' + f.date + '</div>' +
            '<div class="weather-day__temp">' + f.tempMax + '° / ' + f.tempMin + '°</div>' +
            '<div>' + f.desc + '</div>' +
            '<small>(' + f.source + ')</small></div>';
        });
        html += '</div>';
        els.weatherOutput.innerHTML = html;
        els.clothingOutput.innerHTML = '<h4>👕 Рекомендации по одежде</h4><ul class="tips-list">' +
          clothing.map(function (c) { return '<li>' + Utils.escapeHtml(c) + '</li>'; }).join('') + '</ul>';
      }
      /* Рендер меню */
      function renderMenu(menu) {
        var menuLabel = menu.length ? menu[0].menuType : '';
        var html = menuLabel ? '<p><strong>Тип меню:</strong> ' + Utils.escapeHtml(menuLabel) + '</p>' : '';
        html += '<div class="table-wrap"><table><thead><tr><th>День</th><th>Дата</th><th>Завтрак</th><th>Обед</th><th>Ужин</th><th>Перекус</th><th>Напитки</th></tr></thead><tbody>';
        menu.forEach(function (m) {
          html += '<tr><td>' + m.day + '</td><td>' + m.date + '</td>' +
            '<td>' + Utils.escapeHtml(m.breakfast) + '</td><td>' + Utils.escapeHtml(m.lunch) + '</td>' +
            '<td>' + Utils.escapeHtml(m.dinner) + '</td><td>' + Utils.escapeHtml(m.snacks) + '</td>' +
            '<td>' + Utils.escapeHtml(m.drinks) + '</td></tr>';
        });
        html += '</tbody></table></div>';
        els.menuOutput.innerHTML = html;
      }
      /* Рендер продуктов с калорийностью */
      function renderProducts(products) {
        var totals = ProductsCalc.totals(products);
        var html = '<table><thead><tr><th>Наименование</th><th>Ед.</th><th>Кол-во</th><th>Вес</th><th>Ккал</th><th>Стоимость</th></tr></thead><tbody>';
        products.forEach(function (p) {
          html += '<tr><td>' + Utils.escapeHtml(p.name) + '</td><td>' + p.unit + '</td>' +
            '<td>' + p.qty + '</td><td>' + Utils.formatWeight(p.weight) + '</td>' +
            '<td>' + (p.calories || 0).toLocaleString('ru-RU') + '</td>' +
            '<td>' + Utils.formatMoney(p.cost) + '</td></tr>';
        });
        html += '</tbody><tfoot><tr><td colspan="3"><strong>Итого</strong></td>' +
          '<td><strong>' + Utils.formatWeight(totals.weight) + '</strong></td>' +
          '<td><strong>' + totals.calories.toLocaleString('ru-RU') + ' ккал</strong></td>' +
          '<td><strong>' + Utils.formatMoney(totals.cost) + '</strong></td></tr></tfoot></table>';
        var perPerson = Math.round(totals.calories / (parseInt(document.getElementById('participants').value, 10) || 1));
        html += '<p style="margin-top:.5rem;font-size:.85rem;color:var(--text-muted);">Калорийность на человека за весь поход: ~' + perPerson.toLocaleString('ru-RU') + ' ккал</p>';
        els.productsOutput.innerHTML = html;
      }
      /* Рендер снаряжения */
      function renderGear(gear) {
        var labels = {
          personal: '👤 Личное', group: '👥 Групповое', firstAid: '🏥 Аптечка',
          campfire: '🔥 Костёр', repair: '🔧 Ремонт', tools: '🍳 Кухня и инструменты', gas: '⛽ Газ'
        };
        var html = '';
        Object.keys(gear).forEach(function (cat) {
          html += '<h4>' + (labels[cat] || cat) + '</h4><div class="table-wrap"><table><thead><tr><th>Предмет</th><th>Кол-во</th></tr></thead><tbody>';
          gear[cat].forEach(function (g) {
            html += '<tr><td>' + Utils.escapeHtml(g.name) + '</td><td>' + g.qty + '</td></tr>';
          });
          html += '</tbody></table></div>';
        });
        els.gearOutput.innerHTML = html;
      }
      /* Рендер бюджета */
      function renderBudget(budget, people) {
        els.budgetOutput.innerHTML =
          '<div class="budget-item"><div class="budget-item__value">' + Utils.formatMoney(budget.food) + '</div><div class="budget-item__label">🍽 Продукты</div></div>' +
          '<div class="budget-item"><div class="budget-item__value">' + Utils.formatMoney(budget.transport) + '</div><div class="budget-item__label">🚌 Трансфер</div></div>' +
          '<div class="budget-item"><div class="budget-item__value">' + Utils.formatMoney(budget.rent) + '</div><div class="budget-item__label">🛶 Аренда</div></div>' +
          '<div class="budget-item"><div class="budget-item__value">' + Utils.formatMoney(budget.gas) + '</div><div class="budget-item__label">⛽ Газ</div></div>' +
          '<div class="budget-item"><div class="budget-item__value">' + Utils.formatMoney(budget.other) + '</div><div class="budget-item__label">📦 Прочее</div></div>' +
          '<div class="budget-item"><div class="budget-item__value">' + Utils.formatMoney(budget.total) + '</div><div class="budget-item__label">💰 Итого</div></div>' +
          '<div class="budget-item"><div class="budget-item__value">' + Utils.formatMoney(budget.perPerson) + '</div><div class="budget-item__label">👤 На человека (' + people + ' чел.)</div></div>';
        var detailHtml = '<table><thead><tr><th>Категория</th><th>Сумма</th></tr></thead><tbody>';
        budget.details.forEach(function (d) {
          detailHtml += '<tr><td>' + Utils.escapeHtml(d.category) + '</td><td>' + Utils.formatMoney(d.amount) + '</td></tr>';
        });
        detailHtml += '</tbody></table>';
        els.budgetDetailOutput.innerHTML = detailHtml;
      }
      /* Рендер советов */
      function renderTips(tips) {
        els.tipsOutput.innerHTML = tips.map(function (t) { return '<li>' + Utils.escapeHtml(t) + '</li>'; }).join('');
      }
      /* Отложенное автообновление плана (debounce 350 мс) */
      function scheduleUpdate() {
        clearTimeout(updateTimer);
        updateTimer = setTimeout(function () {
          updatePlan(false);
        }, 350);
      }

      /* Автообновление плана без перезагрузки страницы */
      function updatePlan(scrollToResults) {
        var params = getFormParams();
        if (!params.river || !params.startDate || !params.routeId) {
          return;
        }
        var route = RoutePlanner.build(params);
        if (!route) return;
        var menu = MenuPlanner.build(params);
        var products = ProductsCalc.build(params);
        var gear = GearPlanner.build(params);
        var budget = BudgetCalc.build(params, products, route);
        var plan = {
          params: params, route: route, menu: menu, products: products,
          gear: gear, budget: budget, weather: window.__currentPlan ? window.__currentPlan.weather : null,
          generatedAt: new Date().toISOString()
        };
        window.__currentPlan = plan;
        renderRoute(route);
        renderMenu(menu);
        renderProducts(products);
        renderGear(gear);
        renderBudget(budget, params.participants);
        renderTips(route.tips);
        els.results.classList.add('visible');
        if (scrollToResults && !planGeneratedOnce) {
          els.results.scrollIntoView({ behavior: 'smooth' });
        }
        planGeneratedOnce = true;
        /* Погода обновляется при смене даты или реки */
        var river = Data.getRiverById(params.river);
        els.weatherOutput.innerHTML = '<span class="loading"></span> Загрузка прогноза…';
        WeatherService.fetchWeather(params, river).then(function (forecast) {
          plan.weather = forecast;
          renderWeather(forecast, WeatherService.clothingRecommendations(forecast));
        }).catch(function () {
          var forecast = WeatherService.simulate(params, river);
          plan.weather = forecast;
          renderWeather(forecast, WeatherService.clothingRecommendations(forecast));
        });
      }

      /* Главная функция генерации плана (кнопка «Сформировать») */
      function generatePlan(e) {
        if (e) e.preventDefault();
        var params = getFormParams();
        if (!params.river || !params.startDate) {
          Utils.showToast('Выберите реку и дату начала');
          return;
        }
        if (!params.routeId) {
          Utils.showToast('Выберите маршрут');
          return;
        }
        updatePlan(true);
        Utils.showToast('План сплава сформирован!');
      }
      /* Загрузка плана из JSON */
      function loadPlan(data) {
        if (!data || !data.params) { Utils.showToast('Некорректный файл'); return; }
        menuManualOverride = true;
        els.riverSelect.value = data.params.river || '';
        onRiverChange(true);
        if (data.params.routeId) {
          els.routeSelect.value = data.params.routeId;
          renderRoutesPanel(data.params.river, data.params.routeId);
        }
        document.getElementById('participants').value = data.params.participants || 4;
        document.getElementById('days').value = data.params.days || 3;
        els.startDate.value = data.params.startDate || '';
        document.getElementById('start-time').value = data.params.startTime || '09:00';
        document.getElementById('end-time').value = data.params.endTime || '17:00';
        document.getElementById('budget').value = data.params.budget || 50000;
        document.getElementById('transfer').value = data.params.transfer || 'none';
        document.getElementById('craft').value = data.params.craft || 'catamaran4';
        if (data.params.menuType) {
          els.menuSelect.value = data.params.menuType;
          toggleCustomMenuPanel();
        }
        if (data.params.customMenuDays) {
          customMenuState = JSON.parse(JSON.stringify(data.params.customMenuDays));
          renderMenuBuilder();
        }
        if (data.params.transferCost != null) {
          els.transferCostInput.value = data.params.transferCost;
          transferCostManual = true;
        }
        if (data.params.craftRentCost != null) {
          els.craftRentInput.value = data.params.craftRentCost;
          craftRentManual = true;
        }
        window.__currentPlan = data;
        if (data.route) renderRoute(data.route);
        if (data.menu) renderMenu(data.menu);
        if (data.products) renderProducts(data.products);
        if (data.gear) renderGear(data.gear);
        if (data.budget) renderBudget(data.budget, data.params.participants);
        if (data.route && data.route.tips) renderTips(data.route.tips);
        if (data.weather) renderWeather(data.weather, WeatherService.clothingRecommendations(data.weather));
        els.results.classList.add('visible');
        planGeneratedOnce = true;
        Utils.showToast('План загружен из файла');
      }

      /* Привязка автообновления к полям формы */
      function bindAutoUpdate() {
        var autoFields = ['participants', 'days', 'start-date', 'start-time', 'end-time', 'budget',
          'transfer-cost', 'craft-rent-cost'];
        autoFields.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) {
            el.addEventListener('input', function () {
              if (id === 'transfer-cost') transferCostManual = true;
              if (id === 'craft-rent-cost') craftRentManual = true;
              if (id === 'days') {
                if (els.menuSelect.value === 'custom') renderMenuBuilder();
                updateCraftRentSuggestion();
              }
              scheduleUpdate();
            });
            el.addEventListener('change', scheduleUpdate);
          }
        });
        els.transferSelect.addEventListener('change', function () {
          transferCostManual = false;
          updateTransferCostSuggestion();
          scheduleUpdate();
        });
        els.craftSelect.addEventListener('change', function () {
          craftRentManual = false;
          updateCraftRentSuggestion();
          scheduleUpdate();
        });
        els.transferCostInput.addEventListener('focus', function () { transferCostManual = true; });
        els.craftRentInput.addEventListener('focus', function () { craftRentManual = true; });
        els.menuSelect.addEventListener('change', function () {
          menuManualOverride = true;
          toggleCustomMenuPanel();
          scheduleUpdate();
        });
      }

      function bindMenuTemplateButtons() {
        document.getElementById('save-menu-template').addEventListener('click', saveMenuTemplate);
        document.getElementById('delete-menu-template').addEventListener('click', deleteMenuTemplate);
        els.menuTemplateSelect.addEventListener('change', function () {
          if (els.menuTemplateSelect.value) {
            loadMenuTemplate(els.menuTemplateSelect.value);
            els.menuSelect.value = 'custom';
            menuManualOverride = true;
            toggleCustomMenuPanel();
          }
        });
      }
      /* Инициализация всех обработчиков */
      function init() {
        cacheElements();
        initTheme();
        initCollapsibles();
        populateRiverSelect();
        renderRiversGrid();
        /* Дата по умолчанию — ближайшая суббота */
        var today = new Date();
        var daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
        var nextSat = Utils.addDays(today, daysUntilSat);
        els.startDate.value = nextSat.toISOString().split('T')[0];
        customMenuState = [MenuBuilder.createDefaultDay(0), MenuBuilder.createDefaultDay(1), MenuBuilder.createDefaultDay(2)];
        updateTransferCostSuggestion();
        updateCraftRentSuggestion();
        refreshMenuTemplateSelect();
        bindMenuTemplateButtons();
        els.riverSearch.addEventListener('input', renderRiversGrid);
        els.riverFilterDiff.addEventListener('change', renderRiversGrid);
        els.riverFilterSeason.addEventListener('change', renderRiversGrid);
        els.riverSelect.addEventListener('change', function () { onRiverChange(false); });
        bindAutoUpdate();
        els.tripForm.addEventListener('submit', generatePlan);
        document.getElementById('export-print').addEventListener('click', ExportService.printPlan);
        document.getElementById('export-pdf').addEventListener('click', ExportService.pdfPlan);
        document.getElementById('export-csv').addEventListener('click', function () { ExportService.exportCSV(window.__currentPlan); });
        document.getElementById('export-xlsx').addEventListener('click', function () { ExportService.exportSpreadsheetML(window.__currentPlan); });
        document.getElementById('export-json').addEventListener('click', function () { ExportService.exportJSON(window.__currentPlan); });
        document.getElementById('load-json-input').addEventListener('change', function (ev) {
          var file = ev.target.files[0];
          if (file) ExportService.loadJSON(file, function (err, data) {
            if (err) Utils.showToast('Ошибка чтения файла');
            else loadPlan(data);
          });
          ev.target.value = '';
        });
      }
      return { init: init, generatePlan: generatePlan, loadPlan: loadPlan, renderRiversGrid: renderRiversGrid };
    })();

    /* ===== ЗАПУСК ПРИЛОЖЕНИЯ ===== */
    document.addEventListener('DOMContentLoaded', function () {
      UI.init();
    });

  })();
