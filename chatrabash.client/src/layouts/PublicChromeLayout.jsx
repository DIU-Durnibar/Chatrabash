import { Outlet } from "react-router-dom";
import PublicNav from "../Components/public/PublicNav";
import PublicFooter from "../Components/public/PublicFooter";

export default function PublicChromeLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PublicNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
