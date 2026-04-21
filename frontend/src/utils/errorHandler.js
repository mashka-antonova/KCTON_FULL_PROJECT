export const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  GATEWAY_TIMEOUT: 504,
};

export function getErrorMessage(error) {
  if (!error) return "Неизвестная ошибка";
  if (typeof error === "string") return error;

  const status = error.status ?? error.statusCode;

  switch (status) {
    case ERROR_CODES.BAD_REQUEST:
      return error.message ?? "Некорректный запрос. Проверьте параметры фильтров.";
    case ERROR_CODES.NOT_FOUND:
      return "Данные отсутствуют для выбранного периода или территории.";
    case ERROR_CODES.UNPROCESSABLE:
      return "Недостаточно данных для построения прогноза.";
    case ERROR_CODES.TOO_MANY_REQUESTS:
      return "Сервис перегружен. Попробуйте через минуту.";
    case ERROR_CODES.SERVER_ERROR:
      return "Ошибка сервера. Попробуйте повторить запрос.";
    case ERROR_CODES.GATEWAY_TIMEOUT:
      return "Нейросеть не ответила. Попробуйте снова.";
    default:
      return error.message ?? "Произошла ошибка при загрузке данных.";
  }
}

export function isNotFoundError(error) {
  return (error?.status ?? error?.statusCode) === ERROR_CODES.NOT_FOUND;
}
