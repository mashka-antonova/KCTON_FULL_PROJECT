import { Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { useTheme } from "../hooks/useTheme";

export function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.25); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>
      <div
        className="h-screen w-screen flex overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-200"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        <Sidebar theme={theme} onToggleTheme={toggleTheme} />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}
