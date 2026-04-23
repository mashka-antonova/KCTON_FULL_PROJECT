import { useState } from "react";
import { BentoCard } from "./ui/bento-card";
import { cn } from "../lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LeaderItem {
  mo_id: number;
  name: string;
  population: number;
  changePercent: number;
}

interface LeaderListProps {
  growthData: LeaderItem[];
  declineData: LeaderItem[];
  isLoading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-6 h-4 animate-pulse bg-slate-200 dark:bg-white/10 rounded shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="flex justify-between">
          <div className="h-4 w-1/2 animate-pulse bg-slate-200 dark:bg-white/10 rounded" />
          <div className="h-4 w-12 animate-pulse bg-slate-200 dark:bg-white/10 rounded" />
        </div>
        <div className="h-1.5 w-full animate-pulse bg-slate-100 dark:bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

export function LeaderList({ growthData, declineData, isLoading }: LeaderListProps) {
  const [tab, setTab] = useState<"growth" | "decline">("growth");
  const isGrowth = tab === "growth";
  const data = isGrowth ? growthData : declineData;

  const maxChange = data.length > 0 ? Math.max(...data.map((d) => Math.abs(d.changePercent))) : 1;

  return (
    <BentoCard className="flex flex-col flex-1 w-full overflow-hidden">
      {/* Header + Tabs */}
      <div className="px-5 pt-5 pb-0 shrink-0">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-white mb-3">
          Динамика по муниципалитетам
        </h3>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-fit">
          <button
            onClick={() => setTab("growth")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              isGrowth
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Лидеры роста
          </button>
          <button
            onClick={() => setTab("decline")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              !isGrowth
                ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Наибольшая убыль
          </button>
        </div>
        <div className="mt-3 border-b border-slate-200 dark:border-white/10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : data.length === 0
          ? (
            <div className="flex items-center justify-center h-full py-8">
              <p className="text-sm text-slate-400 dark:text-slate-500">Нет данных</p>
            </div>
          )
          : data.map((item, index) => {
              const percentage = (Math.abs(item.changePercent) / maxChange) * 100;
              const isGrowthItem = item.changePercent >= 0;
              return (
                <div key={item.mo_id} className="group flex items-center gap-4">
                  <span className="w-6 text-sm font-semibold text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <span
                        className={cn(
                          "font-bold text-xs",
                          isGrowthItem
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {item.changePercent > 0 ? "+" : ""}
                        {item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          isGrowthItem
                            ? "bg-emerald-500 dark:bg-emerald-400"
                            : "bg-rose-500 dark:bg-rose-400"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </BentoCard>
  );
}
