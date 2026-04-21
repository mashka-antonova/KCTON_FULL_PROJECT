import { Users, LayoutDashboard, TrendingUp, FileSearch, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "../lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

function NavItem({ to, icon, label, exact }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        cn(
          "relative group flex items-center justify-center w-full p-3 rounded-xl transition-all",
          isActive
            ? "bg-blue-500/15 text-blue-500 dark:bg-white/10 dark:text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.15)]"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5"
        )
      }
    >
      {icon}
      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-lg text-xs font-medium text-slate-700 dark:bg-slate-800 dark:border-white/10 dark:text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 z-50">
        {label}
      </span>
    </NavLink>
  );
}

interface SidebarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function Sidebar({ theme, onToggleTheme }: SidebarProps) {
  const isDark = theme === "dark";

  return (
    <aside className="w-[72px] flex flex-col items-center py-8 gap-6 shrink-0 relative z-20 bg-white border-r border-slate-200 dark:bg-white/5 dark:border-white/10 backdrop-blur-md">
      {/* App icon */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2">
        <Users className="w-5 h-5 text-white" />
      </div>

      <nav className="flex flex-col gap-2 w-full px-2 flex-1">
        <NavItem
          to="/"
          exact
          icon={<LayoutDashboard className="w-6 h-6 stroke-1" />}
          label="Мониторинг численности"
        />
        <NavItem
          to="/forecasting"
          icon={<TrendingUp className="w-6 h-6 stroke-1" />}
          label="Прогнозирование численности"
        />
        <NavItem
          to="/ai-report"
          icon={<FileSearch className="w-6 h-6 stroke-1" />}
          label="Аналитическая ИИ-справка"
        />
      </nav>

      {/* Theme toggle — bottom of sidebar */}
      <button
        onClick={onToggleTheme}
        aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
        title={isDark ? "Светлая тема" : "Тёмная тема"}
        className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/10"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-500" />
        )}
        <span className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-lg text-xs font-medium text-slate-700 dark:bg-slate-800 dark:border-white/10 dark:text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 z-50">
          {isDark ? "Светлая тема" : "Тёмная тема"}
        </span>
      </button>
    </aside>
  );
}
