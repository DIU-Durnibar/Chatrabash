import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { MoreVertical, X } from "lucide-react";
import AppSidebar from "./AppSidebar";

export default function AppShellLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="মেনু বন্ধ করুন"
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={closeMobileNav}
        />
      )}

      <AppSidebar mobileOpen={mobileNavOpen} onCloseMobile={closeMobileNav} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:pl-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-3 shadow-sm md:hidden">
          <span className="text-sm font-bold text-[var(--cb-primary)]">ছাত্রাবাস ড্যাশবোর্ড</span>
          <button
            type="button"
            aria-label="মেনু খুলুন"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <MoreVertical className="h-6 w-6" />}
          </button>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
