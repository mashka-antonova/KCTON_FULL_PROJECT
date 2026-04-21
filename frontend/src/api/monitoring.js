// TODO: Заменить все функции на реальные вызовы REST API бэкенда

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// TODO: Заменить на GET /api/filters/regions
export async function fetchRegions() {
  await delay(300);
  return [
    { id: 1, name: "Адыгея" },
    { id: 2, name: "Алтай" },
    { id: 3, name: "Алтайский край" },
    { id: 4, name: "Амурская область" },
    { id: 5, name: "Архангельская область" },
    { id: 6, name: "Астраханская область" },
    { id: 7, name: "Башкортостан" },
    { id: 8, name: "Белгородская область" },
    { id: 9, name: "Брянская область" },
    { id: 10, name: "Бурятия" },
    { id: 11, name: "Владимирская область" },
    { id: 12, name: "Волгоградская область" },
    { id: 13, name: "Вологодская область" },
    { id: 14, name: "Воронежская область" },
    { id: 15, name: "Дагестан" },
    { id: 16, name: "Еврейская АО" },
    { id: 17, name: "Забайкальский край" },
    { id: 18, name: "Ивановская область" },
    { id: 19, name: "Ингушетия" },
    { id: 20, name: "Иркутская область" },
    { id: 21, name: "Кабардино-Балкария" },
    { id: 22, name: "Калининградская область" },
    { id: 23, name: "Калмыкия" },
    { id: 24, name: "Калужская область" },
    { id: 25, name: "Камчатский край" },
    { id: 26, name: "Карачаево-Черкессия" },
    { id: 27, name: "Карелия" },
    { id: 28, name: "Кемеровская область" },
    { id: 29, name: "Кировская область" },
    { id: 30, name: "Коми" },
    { id: 31, name: "Костромская область" },
    { id: 32, name: "Краснодарский край" },
    { id: 33, name: "Красноярский край" },
    { id: 34, name: "Курганская область" },
    { id: 35, name: "Курская область" },
    { id: 36, name: "Ленинградская область" },
    { id: 37, name: "Липецкая область" },
    { id: 38, name: "Магаданская область" },
    { id: 39, name: "Марий Эл" },
    { id: 40, name: "Мордовия" },
    { id: 77, name: "Москва" },
    { id: 50, name: "Московская область" },
    { id: 41, name: "Мурманская область" },
    { id: 42, name: "Нижегородская область" },
    { id: 43, name: "Новгородская область" },
    { id: 44, name: "Новосибирская область" },
    { id: 45, name: "Омская область" },
    { id: 46, name: "Оренбургская область" },
    { id: 47, name: "Орловская область" },
    { id: 48, name: "Пензенская область" },
    { id: 49, name: "Пермский край" },
    { id: 51, name: "Приморский край" },
    { id: 52, name: "Псковская область" },
    { id: 53, name: "Ростовская область" },
    { id: 54, name: "Рязанская область" },
    { id: 55, name: "Самарская область" },
    { id: 78, name: "Санкт-Петербург" },
    { id: 56, name: "Саратовская область" },
    { id: 57, name: "Саха (Якутия)" },
    { id: 58, name: "Сахалинская область" },
    { id: 59, name: "Свердловская область" },
    { id: 60, name: "Северная Осетия" },
    { id: 61, name: "Смоленская область" },
    { id: 62, name: "Ставропольский край" },
    { id: 63, name: "Тамбовская область" },
    { id: 64, name: "Татарстан" },
    { id: 65, name: "Тверская область" },
    { id: 66, name: "Томская область" },
    { id: 67, name: "Тульская область" },
    { id: 68, name: "Тыва" },
    { id: 69, name: "Тюменская область" },
    { id: 70, name: "Удмуртия" },
    { id: 71, name: "Ульяновская область" },
    { id: 72, name: "Хабаровский край" },
    { id: 73, name: "Хакасия" },
    { id: 74, name: "Челябинская область" },
    { id: 75, name: "Чечня" },
    { id: 76, name: "Чувашия" },
    { id: 79, name: "Ярославская область" },
  ];
}

// TODO: Заменить на GET /api/filters/municipalities?region_id={region_id}
export async function fetchMunicipalities(regionId) {
  await delay(200);
  const mockByRegion = {
    77: [
      { id: 1001, region_id: 77, name: "Центральный АО" },
      { id: 1002, region_id: 77, name: "Северный АО" },
      { id: 1003, region_id: 77, name: "Северо-Восточный АО" },
      { id: 1004, region_id: 77, name: "Восточный АО" },
      { id: 1005, region_id: 77, name: "Юго-Восточный АО" },
      { id: 1006, region_id: 77, name: "Южный АО" },
      { id: 1007, region_id: 77, name: "Юго-Западный АО" },
      { id: 1008, region_id: 77, name: "Западный АО" },
      { id: 1009, region_id: 77, name: "Северо-Западный АО" },
      { id: 1010, region_id: 77, name: "Зеленоградский АО" },
    ],
    69: [
      { id: 2001, region_id: 69, name: "Тюмень" },
      { id: 2002, region_id: 69, name: "Тобольск" },
      { id: 2003, region_id: 69, name: "Ишим" },
      { id: 2004, region_id: 69, name: "Ялуторовск" },
      { id: 2005, region_id: 69, name: "Заводоуковск" },
    ],
    59: [
      { id: 3001, region_id: 59, name: "Екатеринбург" },
      { id: 3002, region_id: 59, name: "Нижний Тагил" },
      { id: 3003, region_id: 59, name: "Первоуральск" },
      { id: 3004, region_id: 59, name: "Каменск-Уральский" },
      { id: 3005, region_id: 59, name: "Серов" },
    ],
    50: [
      { id: 4001, region_id: 50, name: "Балашиха" },
      { id: 4002, region_id: 50, name: "Королёв" },
      { id: 4003, region_id: 50, name: "Подольск" },
      { id: 4004, region_id: 50, name: "Химки" },
      { id: 4005, region_id: 50, name: "Мытищи" },
    ],
  };
  return mockByRegion[regionId] ?? [
    { id: 9001, region_id: regionId, name: "Административный центр" },
    { id: 9002, region_id: regionId, name: "Городской округ №1" },
    { id: 9003, region_id: regionId, name: "Городской округ №2" },
    { id: 9004, region_id: regionId, name: "Муниципальный район №1" },
  ];
}

// TODO: Заменить на GET /api/filters/years
export async function fetchAvailableYears() {
  await delay(100);
  return Array.from({ length: 15 }, (_, i) => 2010 + i);
}

// TODO: Заменить на GET /api/monitoring/summary?start_year=...&end_year=...&region_id=...&mo_id=...
export async function fetchMonitoringSummary({ startYear, endYear, regionId, moId } = {}) {
  await delay(600);
  // Simulate slight variation based on filters
  const base = regionId ? 1500000 + regionId * 1000 : 146400000;
  return {
    population: base,
    population_change: Math.round(base * 0.0033),
    population_change_percent: 0.33,
    birth_rate: 9.8,
    death_rate: 13.1,
    natural_growth: -3.3,
    migration: 2.1,
  };
}

// TODO: Заменить на GET /api/monitoring/heatmap?start_year=...&end_year=...&region_id=...
export async function fetchHeatmapData({ startYear, endYear, regionId } = {}) {
  await delay(800);
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Центральный ФО", density: 2500, population: 40000000, region_id: 77, mo_id: 1001 },
        geometry: { type: "Polygon", coordinates: [[[37.0, 55.0], [37.0, 56.5], [40.5, 56.5], [40.5, 55.0], [37.0, 55.0]]] },
      },
      {
        type: "Feature",
        properties: { name: "Северо-Западный ФО", density: 320, population: 13800000, region_id: 78, mo_id: 2001 },
        geometry: { type: "Polygon", coordinates: [[[28.0, 59.0], [28.0, 61.0], [32.5, 61.0], [32.5, 59.0], [28.0, 59.0]]] },
      },
      {
        type: "Feature",
        properties: { name: "Приволжский ФО", density: 290, population: 28800000, region_id: 64, mo_id: 3001 },
        geometry: { type: "Polygon", coordinates: [[[48.0, 53.0], [48.0, 57.0], [56.0, 57.0], [56.0, 53.0], [48.0, 53.0]]] },
      },
      {
        type: "Feature",
        properties: { name: "Южный ФО", density: 350, population: 16400000, region_id: 32, mo_id: 4001 },
        geometry: { type: "Polygon", coordinates: [[[36.5, 44.0], [36.5, 47.5], [43.0, 47.5], [43.0, 44.0], [36.5, 44.0]]] },
      },
      {
        type: "Feature",
        properties: { name: "Уральский ФО", density: 70, population: 12300000, region_id: 59, mo_id: 5001 },
        geometry: { type: "Polygon", coordinates: [[[59.0, 55.0], [59.0, 61.0], [67.0, 61.0], [67.0, 55.0], [59.0, 55.0]]] },
      },
      {
        type: "Feature",
        properties: { name: "Сибирский ФО", density: 20, population: 17000000, region_id: 44, mo_id: 6001 },
        geometry: { type: "Polygon", coordinates: [[[73.0, 50.0], [73.0, 60.0], [92.0, 60.0], [92.0, 50.0], [73.0, 50.0]]] },
      },
      {
        type: "Feature",
        properties: { name: "Дальневосточный ФО", density: 1, population: 8100000, region_id: 57, mo_id: 7001 },
        geometry: { type: "Polygon", coordinates: [[[110.0, 45.0], [110.0, 60.0], [140.0, 60.0], [140.0, 45.0], [110.0, 45.0]]] },
      },
      {
        type: "Feature",
        properties: { name: "Северо-Кавказский ФО", density: 600, population: 9900000, region_id: 15, mo_id: 8001 },
        geometry: { type: "Polygon", coordinates: [[[40.0, 42.5], [40.0, 44.5], [48.0, 44.5], [48.0, 42.5], [40.0, 42.5]]] },
      },
    ],
  };
}

// TODO: Заменить на GET /api/monitoring/top-dynamics?start_year=...&end_year=...&limit=10&region_id=...
export async function fetchTopDynamics({ startYear, endYear, regionId } = {}) {
  await delay(500);
  return {
    growth: [
      { mo_id: 1, name: "Тюменская область", population: 3900000, changePercent: 3.2 },
      { mo_id: 2, name: "Москва", population: 13000000, changePercent: 2.8 },
      { mo_id: 3, name: "Санкт-Петербург", population: 5600000, changePercent: 2.5 },
      { mo_id: 4, name: "Татарстан", population: 4000000, changePercent: 2.1 },
      { mo_id: 5, name: "Краснодарский край", population: 5800000, changePercent: 1.9 },
      { mo_id: 6, name: "Свердловская область", population: 4300000, changePercent: 1.7 },
      { mo_id: 7, name: "Новосибирская область", population: 2800000, changePercent: 1.5 },
      { mo_id: 8, name: "Челябинская область", population: 3400000, changePercent: 1.2 },
      { mo_id: 9, name: "Самарская область", population: 3100000, changePercent: 0.9 },
      { mo_id: 10, name: "Башкортостан", population: 4000000, changePercent: 0.7 },
    ],
    decline: [
      { mo_id: 11, name: "Псковская область", population: 580000, changePercent: -2.8 },
      { mo_id: 12, name: "Смоленская область", population: 870000, changePercent: -2.5 },
      { mo_id: 13, name: "Тверская область", population: 1200000, changePercent: -2.3 },
      { mo_id: 14, name: "Тульская область", population: 1400000, changePercent: -2.0 },
      { mo_id: 15, name: "Ивановская область", population: 940000, changePercent: -1.8 },
      { mo_id: 16, name: "Владимирская область", population: 1320000, changePercent: -1.6 },
      { mo_id: 17, name: "Рязанская область", population: 1000000, changePercent: -1.5 },
      { mo_id: 18, name: "Тамбовская область", population: 950000, changePercent: -1.2 },
      { mo_id: 19, name: "Курганская область", population: 780000, changePercent: -1.1 },
      { mo_id: 20, name: "Орловская область", population: 700000, changePercent: -0.9 },
    ],
  };
}
