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
      <div className="w-6 h-4 animate-pulse bg-white/10 rounded shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="flex justify-between">
          <div className="h-4 w-1/2 animate-pulse bg-white/10 rounded" />
          <div className="h-4 w-12 animate-pulse bg-white/10 rounded" />
        </div>
        <div className="h-1.5 w-full animate-pulse bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

export function LeaderList({ growthData, declineData, isLoading }: LeaderListProps) {
  const [tab, setTab] = useState<"growth" | "decline">("growth");
  const isGrowth = tab === "growth";
  const data = isGrowth ? growthData : declineData;
  const colorClass = isGrowth ? "bg-emerald-400" : "bg-rose-400";
  const textColor = isGrowth ? "text-emerald-400" : "text-rose-400";
  const shadowColor = isGrowth
    ? "shadow-[0_0_10px_rgba(52,211,153,0.3)]"
    : "shadow-[0_0_10px_rgba(251,113,133,0.3)]";

  const maxChange = data.length > 0 ? Math.max(...data.map((d) => Math.abs(d.changePercent))) : 1;

  return (
    <BentoCard className="flex flex-col flex-1 w-full overflow-hidden">
      {/* Header + Tabs */}
      <div className="px-6 pt-5 pb-0 shrink-0">
        <h3 className="text-base font-bold tracking-tight text-white mb-3">
          Динамика по муниципалитетам
        </h3>
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
          <button
            onClick={() => setTab("growth")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              isGrowth
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
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
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Наибольшая убыль
          </button>
        </div>
        <div className="mt-3 border-b border-white/10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : data.length === 0
          ? (
            <div className="flex items-center justify-center h-full py-8">
              <p className="text-sm text-slate-500">Нет данных</p>
            </div>
          )
          : data.map((item, index) => {
              const percentage = (Math.abs(item.changePercent) / maxChange) * 100;
              return (
                <div key={item.mo_id} className="group flex items-center gap-4">
                  <span className="w-6 text-sm font-semibold text-slate-500 group-hover:text-slate-300 transition-colors shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <span className={cn("font-bold", textColor)}>
                        {item.changePercent > 0 ? "+" : ""}
                        {item.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", colorClass, shadowColor)}
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
