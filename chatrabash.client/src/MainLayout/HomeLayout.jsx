import { Outlet } from "react-router-dom";
import AppSidebar from "../layouts/AppSidebar";

/** @deprecated Prefer AppShellLayout via /home routes; kept for any legacy imports. */
const HomeLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HomeLayout;
