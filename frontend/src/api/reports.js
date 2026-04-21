// TODO: Заменить все функции на реальные вызовы REST API бэкенда

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let mockTaskCounter = 0;

// TODO: Заменить на POST /api/reports/generate  Body: { mo_id, horizon }
export async function generateReport({ moId, horizon, regionName, moName }) {
  await delay(400);
  mockTaskCounter += 1;
  return { task_id: `task-${Date.now()}-${mockTaskCounter}` };
}

// TODO: Заменить на GET /api/reports/status/{task_id}
export async function pollReportStatus(taskId) {
  await delay(300);
  // Simulate progressive completion based on task age encoded in ID
  const createdAt = parseInt(taskId.split("-")[1], 10) || Date.now();
  const elapsed = Date.now() - createdAt;

  if (elapsed < 2000) return { status: "pending" };
  if (elapsed < 5000) return { status: "processing", progress: Math.min(90, Math.round((elapsed / 5000) * 100)) };
  return { status: "completed" };
}

// TODO: Заменить на GET /api/reports/download/{task_id}?format={format}
// Возвращает blob (PDF или DOCX файл)
export async function downloadReport(taskId, format = "pdf") {
  await delay(500);
  // Stub: return mock HTML content representing the report
  return null;
}

// TODO: Заменить на GET /api/reports/content/{task_id}  (preview HTML)
export async function fetchReportContent(taskId, { regionName, moName, horizon } = {}) {
  await delay(300);
  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const displayName = moName || regionName || "Тюменская область";

  return `
<div class="report-content">
  <h1>Аналитическая демографическая справка</h1>
  <p class="meta">Муниципальное образование: <strong>${displayName}</strong> &nbsp;|&nbsp; Дата: ${today} &nbsp;|&nbsp; Горизонт прогноза: ${horizon} лет</p>

  <h2>1. Демографическая ситуация</h2>
  <p>По состоянию на 2024 год численность населения ${displayName} составляет порядка <strong>1 500 000 человек</strong>.
  За последние пять лет наблюдается умеренный прирост населения в размере <strong>+3,5%</strong>, обусловленный
  положительным сальдо миграции и незначительным улучшением рождаемости.</p>

  <h2>2. Тенденции рождаемости и смертности</h2>
  <p>Общий коэффициент рождаемости составляет <strong>9,8 на 1 000 жителей</strong>, что ниже среднероссийского
  уровня (10,5). Смертность составляет <strong>13,1 на 1 000 жителей</strong>. Естественный прирост отрицателен:
  <strong>−3,3‰</strong>. Основные причины смертности — сердечно-сосудистые заболевания (52%) и онкология (17%).</p>

  <h2>3. Миграционная динамика</h2>
  <p>Сальдо внешней миграции в 2020–2024 гг. сохраняется положительным: <strong>+2,1‰</strong>. Преобладающий
  поток — трудовая миграция из других субъектов РФ (62%) и государств СНГ (28%). Внутренняя миграция направлена
  преимущественно в региональный центр.</p>

  <h2>4. Прогноз на ${horizon} лет (Prophet, 95% ДИ)</h2>
  <p>Модель прогнозирует <strong>умеренный рост</strong> численности населения с темпом около 0,5% в год.
  К ${2024 + horizon} году ожидаемая численность составит <strong>1 580 000 – 1 620 000 человек</strong>
  (базовый сценарий — 1 597 000). Пессимистичный сценарий (снижение) возможен при усилении оттока
  трудоспособного населения.</p>

  <h2>5. Стратегические рекомендации</h2>
  <ul>
    <li>Разработка программ поддержки молодых семей для стимулирования рождаемости.</li>
    <li>Инвестиции в здравоохранение для снижения преждевременной смертности.</li>
    <li>Создание рабочих мест в несырьевом секторе для удержания трудоспособного населения.</li>
    <li>Развитие инфраструктуры привлечения квалифицированных специалистов.</li>
    <li>Мониторинг миграционных потоков с квартальной периодичностью.</li>
  </ul>

  <p class="disclaimer"><em>Справка сформирована автоматически на основе данных Росстата и результатов работы
  демографической модели Prophet (Meta AI). Для официального использования требуется верификация специалистом.</em></p>
</div>
  `.trim();
}
