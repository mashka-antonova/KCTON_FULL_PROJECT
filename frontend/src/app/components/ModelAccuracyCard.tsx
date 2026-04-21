import { BentoCard } from "./ui/bento-card";
import { Activity } from "lucide-react";

interface ModelAccuracyCardProps {
  title: string;
  value: string;
  subtitle: string;
  colorClass: string;
  icon?: React.ReactNode;
}

export function ModelAccuracyCard({ title, value, subtitle, colorClass, icon }: ModelAccuracyCardProps) {
  return (
    <BentoCard className="p-3 px-4 flex items-center justify-between group hover:border-white/20 transition-all">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold font-mono tracking-tight text-white">{value}</span>
        </div>
        <span className="text-xs text-slate-500">{subtitle}</span>
      </div>

      <div className={"w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] " + colorClass}>
        {icon || <Activity className="w-6 h-6" />}
      </div>
    </BentoCard>
  );
}