import { memo } from "react";
import { BentoCard } from "./ui/bento-card";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
} from "recharts";
import { useId } from "react";
import { Loader2 } from "lucide-react";
import { getJunctionYear, formatRuNumber } from "../../utils/dataHelpers";
import type { ForecastChartPoint } from "../../types";

interface ForecastingChartProps {
  data: ForecastChartPoint[];
  isLoading?: boolean;
  error?: string | null;
}

function SkeletonChart() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-sm text-slate-400">Расчёт прогноза...</span>
      </div>
    </div>
  );
}

/**
 * Composed Recharts chart showing historical population data, a forecast line,
 * and a 95% confidence interval band.
 * Wrapped in React.memo — only re-renders when `data`, `isLoading`, or `error` change.
 */
export const ForecastingChart = memo(function ForecastingChart({
  data,
  isLoading,
  error,
}: ForecastingChartProps) {
  const uid = useId();
  const gradientId = `colorInterval-${uid.replace(/:/g, "")}`;
  const junctionYear = getJunctionYear(data);

  // Recharts Area needs [low, high] as array for confidence band
  const chartData = data.map((d) => ({
    ...d,
    interval: d.low !== null && d.high !== null ? [d.low, d.high] : undefined,
  }));

  return (
    <BentoCard className="flex flex-col flex-1 min-h-0 p-5">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Прогноз численности населения
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]" />
          <span className="text-xs font-medium text-[#10B981]">Модель обучена</span>
        </div>
      </div>

      {isLoading ? (
        <SkeletonChart />
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-rose-400 font-medium">{error}</p>
            <p className="text-sm text-slate-500">Попробуйте изменить параметры и пересчитать</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Выберите муниципалитет и нажмите «Рассчитать прогноз»</p>
        </div>
      ) : (
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="year"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "monospace" }}
                tickMargin={10}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "monospace" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tickMargin={10}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const hist = payload.find((p) => p.dataKey === "fact");
                  const fore = payload.find((p) => p.dataKey === "forecast");
                  const interval = payload.find((p) => p.dataKey === "interval");

                  return (
                    <div className="bg-[#0F172A]/90 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-xl">
                      <p className="text-white font-bold mb-2 font-mono text-lg">{label}</p>
                      {hist?.value != null && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full bg-blue-600" />
                          <span className="text-slate-300 text-sm">Факт:</span>
                          <span className="text-white font-mono font-medium ml-auto">
                            {formatRuNumber(hist.value as number)}
                          </span>
                        </div>
                      )}
                      {fore?.value != null && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full bg-cyan-400" />
                          <span className="text-slate-300 text-sm">Прогноз:</span>
                          <span className="text-cyan-400 font-mono font-bold ml-auto">
                            {formatRuNumber(fore.value as number)}
                          </span>
                        </div>
                      )}
                      {interval?.value != null && Array.isArray(interval.value) && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Верхняя граница:</span>
                            <span className="text-emerald-400 font-mono">
                              {formatRuNumber(interval.value[1])}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Нижняя граница:</span>
                            <span className="text-rose-400 font-mono">
                              {formatRuNumber(interval.value[0])}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              {junctionYear && (
                <ReferenceLine x={junctionYear} stroke="rgba(6,182,212,0.4)" strokeDasharray="3 3" />
              )}

              <Area
                type="monotone"
                dataKey="interval"
                stroke="none"
                fill={`url(#${gradientId})`}
                isAnimationActive
              />
              <Line
                type="monotone"
                dataKey="fact"
                stroke="#2563EB"
                strokeWidth={4}
                dot={{ r: 0 }}
                activeDot={{ r: 6, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
                isAnimationActive
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#22D3EE"
                strokeWidth={3}
                strokeDasharray="6 6"
                dot={{ r: 0 }}
                activeDot={{ r: 8, fill: "#22D3EE", strokeWidth: 3, stroke: "#0F172A" }}
                isAnimationActive
              />

              {junctionYear != null && (() => {
                const pt = data.find((d) => d.year === junctionYear);
                if (!pt?.fact) return null;
                return (
                  <>
                    <ReferenceDot x={junctionYear} y={pt.fact} r={6} fill="#0F172A" stroke="#22D3EE" strokeWidth={3} />
                    <ReferenceDot x={junctionYear} y={pt.fact} r={12} fill="rgba(34,211,238,0.2)" stroke="none" />
                  </>
                );
              })()}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoading && data.length > 0 && (
        <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#2563EB] rounded-full" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Исторические данные</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 border-b-2 border-dashed border-[#22D3EE]" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Линия прогноза</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-b from-[#06B6D4]/30 to-transparent border border-[#06B6D4]/20 rounded-sm" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">95% Доверительный интервал</span>
          </div>
        </div>
      )}
    </BentoCard>
  );
});
