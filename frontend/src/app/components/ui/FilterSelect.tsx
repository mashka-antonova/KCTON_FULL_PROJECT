import { ChevronDown, Loader2 } from "lucide-react";

interface FilterSelectOption {
  value: string | number;
  label: string;
}

interface FilterSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  ariaLabel?: string;
  minWidth?: number;
}

/** Reusable styled <select> for all dashboard filter headers. */
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  isLoading,
  ariaLabel,
  minWidth,
}: FilterSelectProps) {
  const selectClass =
    "appearance-none pl-4 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 " +
    "hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium " +
    "text-slate-300 focus:outline-none focus:border-white/20 " +
    "disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        className={selectClass}
        style={{ background: "rgba(255,255,255,0.05)", minWidth }}
        aria-label={ariaLabel}
      >
        {placeholder !== undefined && (
          <option value="" className="bg-[#0F172A]">
            {isLoading ? "Загрузка..." : placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0F172A]">
            {opt.label}
          </option>
        ))}
      </select>

      {isLoading ? (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin pointer-events-none" />
      ) : (
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      )}
    </div>
  );
}
