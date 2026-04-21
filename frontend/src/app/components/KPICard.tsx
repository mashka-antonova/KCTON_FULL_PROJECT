import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { BentoCard } from "./ui/bento-card";
import { cn } from "../lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useId } from "react";

interface KPICardProps {
  title: string;
  value: string | number | null;
  change: number | null;
  data?: { value: number }[];
  color: "neon-blue" | "neon-mint" | "neon-coral" | "neutral";
  unit?: string;
  isLoading?: boolean;
}

const colorMap = {
  "neon-blue": {
    text: "text-blue-400",
    gradient: ["#60A5FA", "rgba(96,165,250,0)"],
    stroke: "#60A5FA",
  },
  "neon-mint": {
    text: "text-emerald-400",
    gradient: ["#34D399", "rgba(52,211,153,0)"],
    stroke: "#34D399",
  },
  "neon-coral": {
    text: "text-rose-400",
    gradient: ["#FB7185", "rgba(251,113,133,0)"],
    stroke: "#FB7185",
  },
  neutral: {
    text: "text-slate-300",
    gradient: ["#94A3B8", "rgba(148,163,184,0)"],
    stroke: "#94A3B8",
  },
};

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white/10 rounded", className)} />
  );
}

export function KPICard({ title, value, change, data = [], color, unit, isLoading }: KPICardProps) {
  const uid = useId();
  const gradientId = `gradient-${uid.replace(/:/g, "")}`;

  const isPositive = change !== null && change > 0;
  const isNegative = change !== null && change < 0;
  const isNeutral = change === 0;

  const displayValue = value === null || value === undefined ? "н/д" : `${value}${unit ?? ""}`;
  const displayChange = change === null || change === undefined ? null : change;

  if (isLoading) {
    return (
      <BentoCard className="p-5 flex flex-col justify-between h-[160px]">
        <div>
          <SkeletonPulse className="h-4 w-3/4 mb-2" />
          <SkeletonPulse className="h-8 w-1/2 mt-2" />
        </div>
        <SkeletonPulse className="h-4 w-1/3" />
      </BentoCard>
    );
  }

  return (
    <BentoCard className="p-5 flex flex-col justify-between group cursor-default hover:border-white/20 transition-colors h-[160px]">
      {data.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-2/3 opacity-30 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorMap[color].gradient[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colorMap[color].gradient[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={colorMap[color].stroke}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <h2 className="text-3xl font-bold tracking-tight text-white font-sans">
          {displayValue}
        </h2>
      </div>

      <div className="relative z-10 flex items-center gap-1 mt-auto">
        {displayChange !== null ? (
          <>
            {isPositive && <TrendingUp className="w-4 h-4 text-emerald-400" />}
            {isNegative && <TrendingDown className="w-4 h-4 text-rose-400" />}
            {isNeutral && <Minus className="w-4 h-4 text-slate-400" />}
            <span
              className={cn(
                "text-sm font-semibold",
                isPositive ? "text-emerald-400" : isNegative ? "text-rose-400" : "text-slate-400"
              )}
            >
              {displayChange > 0 ? "+" : ""}
              {displayChange}%
            </span>
            <span className="text-xs text-slate-500 ml-1">к прошлому году</span>
          </>
        ) : (
          <span className="text-xs text-slate-500">нет данных об изменении</span>
        )}
      </div>
    </BentoCard>
  );
}
