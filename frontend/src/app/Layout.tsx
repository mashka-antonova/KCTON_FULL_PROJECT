import { Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { useTheme } from "../hooks/useTheme";

export function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.35); }
      `}} />
      <div
        className="h-screen w-screen flex overflow-hidden bg-slate-100 text-slate-800 dark:bg-[#0F172A] dark:text-slate-200"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <Sidebar theme={theme} onToggleTheme={toggleTheme} />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}
