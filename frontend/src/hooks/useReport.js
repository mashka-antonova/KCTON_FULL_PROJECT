import { useState, useRef, useCallback } from "react";
import { generateReport, pollReportStatus, fetchReportContent, downloadReport } from "../api/reports";

const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 2000;

/**
 * Manages AI report generation lifecycle: submission → polling → completion.
 *
 * Status transitions:
 *   idle → pending (generateReport called) → processing (task queued)
 *       → completed | error
 *
 * @returns {object} Status, progress, HTML content, and action callbacks.
 */
export function useReport() {
  const [taskId, setTaskId] = useState(null);
  /** @type {["idle"|"pending"|"processing"|"completed"|"error", Function]} */
  const [reportStatus, setReportStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [reportHtml, setReportHtml] = useState(null);
  const [reportError, setReportError] = useState(null);
  const pollRef = useRef(null);
  const attemptsRef = useRef(0);

  /** Cancels the polling interval and resets the attempt counter. */
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    attemptsRef.current = 0;
  }, []);

  /**
   * Starts polling the report status endpoint every POLL_INTERVAL_MS ms.
   * Stops automatically on completion, error, or MAX_POLL_ATTEMPTS exceeded.
   *
   * @param {string} id - Task ID returned by generateReport.
   * @param {{ regionName?: string; moName?: string; horizon: number }} context
   */
  const startPolling = useCallback(
    (id, context) => {
      attemptsRef.current = 0;
      pollRef.current = setInterval(async () => {
        attemptsRef.current += 1;
        if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
          stopPolling();
          setReportStatus("error");
          setReportError("Нейросеть не ответила. Попробуйте снова.");
          return;
        }
        try {
          const statusResult = await pollReportStatus(id);
          if (statusResult.status === "processing") {
            setProgress(statusResult.progress ?? Math.min(90, attemptsRef.current * 3));
          }
          if (statusResult.status === "completed") {
            stopPolling();
            setProgress(100);
            const html = await fetchReportContent(id, context);
            setReportHtml(html);
            setReportStatus("completed");
          }
        } catch (err) {
          stopPolling();
          setReportStatus("error");
          setReportError(err.message ?? "Ошибка при получении статуса отчёта");
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  /**
   * Submits a new report generation request and starts polling.
   *
   * @param {{ moId: number|null; horizon: number; regionName?: string; moName?: string }} params
   */
  const generate = useCallback(
    async ({ moId, horizon, regionName, moName }) => {
      stopPolling();
      setReportStatus("pending");
      setReportHtml(null);
      setReportError(null);
      setProgress(0);
      try {
        const { task_id } = await generateReport({ moId, horizon, regionName, moName });
        setTaskId(task_id);
        setReportStatus("processing");
        startPolling(task_id, { regionName, moName, horizon });
      } catch (err) {
        setReportStatus("error");
        setReportError(err.message ?? "Ошибка при запуске генерации отчёта");
      }
    },
    [startPolling, stopPolling]
  );

  /**
   * Initiates a file download for the completed report.
   * Stub: alerts until the backend returns a real blob.
   *
   * @param {"pdf"|"docx"} format
   */
  const handleDownload = useCallback(
    async (format = "pdf") => {
      if (!taskId) return;
      try {
        await downloadReport(taskId, format);
        // TODO: when downloadReport returns a blob, create an object URL and trigger download:
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement("a"); a.href = url; a.download = `report.${format}`; a.click();
        alert(`Скачивание ${format.toUpperCase()} будет доступно после подключения бэкенда.`);
      } catch (err) {
        setReportError(err.message ?? "Ошибка при скачивании отчёта");
      }
    },
    [taskId]
  );

  return {
    taskId,
    reportStatus,
    progress,
    reportHtml,
    reportError,
    generate,
    handleDownload,
  };
}
