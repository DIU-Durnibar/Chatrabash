import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  PlusCircle,
  CreditCard,
  MessageSquareWarning,
  Settings,
  LogOut,
  Home,
  ScrollText,
  Shield,
} from "lucide-react";
import { clearSession, getRolesFromStorage, parseJwt } from "../lib/auth";
import BrandLogo from "../Components/BrandLogo";
import UserAvatar from "../Components/UserAvatar";

function roleNav() {
  const roles = getRolesFromStorage();
  if (roles.includes("SuperAdmin")) return "superadmin";
  if (roles.includes("Manager")) return "manager";
  if (roles.includes("Boarder")) return "boarder";
  return "guest";
}

const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";

export default function AppSidebar({ mobileOpen = false, onCloseMobile }) {
  const location = useLocation();
  const mode = roleNav();
  const token = localStorage.getItem("token");
  const payload = parseJwt(token);
  const userObj = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const display = userObj.displayName || userObj.userName || payload?.unique_name || "ব্যবহারকারী";

  const logout = () => {
    clearSession();
    window.location.href = "/";
  };

  const itemClass = ({ isActive }) =>
    `${linkBase} ${isActive ? "bg-white/15 text-white" : "text-blue-100/90 hover:bg-white/10 hover:text-white"}`;

  useEffect(() => {
    onCloseMobile?.();
  }, [location.pathname, onCloseMobile]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] max-w-sm flex-col border-r border-white/10 bg-[var(--cb-sidebar)] text-white shadow-2xl transition-transform duration-200 ease-out md:static md:z-auto md:w-64 md:max-w-none md:shrink-0 md:shadow-none ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="border-b border-white/10 p-3">
        <div className="flex flex-col items-stretch gap-2">
          <div className="rounded-xl bg-white px-2 py-2 shadow-sm">
            <BrandLogo to="/" imgClassName="max-w-[11rem]" />
          </div>
          <p className="px-0.5 text-[10px] font-medium leading-snug text-blue-100/90">
            বাংলাদেশের হোস্টেল প্ল্যাটফর্ম
          </p>
        </div>
      </div>

      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <UserAvatar url={userObj.profilePictureUrl} className="h-10 w-10 border-white/30" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{display}</p>
            <p className="text-xs text-blue-200/80">
              {mode === "superadmin"
                ? "সুপার অ্যাডমিন"
                : mode === "manager"
                  ? "ম্যানেজার"
                  : mode === "boarder"
                    ? "বোর্ডার"
                    : ""}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {mode === "superadmin" && (
          <>
            <NavLink to="/home/admin" end className={itemClass}>
              <LayoutDashboard className="h-5 w-5 shrink-0 opacity-90" />
              ড্যাশবোর্ড
            </NavLink>
            <NavLink to="/home/admin/hostels" className={itemClass}>
              <Building2 className="h-5 w-5 shrink-0 opacity-90" />
              হোস্টেল
            </NavLink>
            <NavLink to="/home/admin/logs" className={itemClass}>
              <ScrollText className="h-5 w-5 shrink-0 opacity-90" />
              লগ
            </NavLink>
            <NavLink to="/home/admin/manager-payments" className={itemClass}>
              <CreditCard className="h-5 w-5 shrink-0 opacity-90" />
              ম্যানেজার পেমেন্ট
            </NavLink>
            <NavLink to="/home/admin/settings" className={itemClass}>
              <Shield className="h-5 w-5 shrink-0 opacity-90" />
              সেটিংস
            </NavLink>
          </>
        )}

        {mode === "manager" && (
          <>
            <NavLink to="/home" end className={itemClass}>
              <LayoutDashboard className="h-5 w-5 shrink-0 opacity-90" />
              ড্যাশবোর্ড
            </NavLink>
            <NavLink to="/home/Pending-users" className={itemClass}>
              <Users className="h-5 w-5 shrink-0 opacity-90" />
              আবেদনকারী রিকোয়েস্ট
            </NavLink>
            <NavLink to="/home/boarders" className={itemClass}>
              <Users className="h-5 w-5 shrink-0 opacity-90" />
              বোর্ডার তালিকা
            </NavLink>
            <NavLink to="/home/rooms" className={itemClass}>
              <Building2 className="h-5 w-5 shrink-0 opacity-90" />
              রুম ম্যানেজমেন্ট
            </NavLink>
            <NavLink to="/home/create-room" className={itemClass}>
              <PlusCircle className="h-5 w-5 shrink-0 opacity-90" />
              নতুন রুম
            </NavLink>
            <NavLink to="/home/billing" className={itemClass}>
              <CreditCard className="h-5 w-5 shrink-0 opacity-90" />
              বিলিং ও পেমেন্ট
            </NavLink>
            <NavLink to="/home/manager-logs" className={itemClass}>
              <ScrollText className="h-5 w-5 shrink-0 opacity-90" />
              লগ
            </NavLink>
            <NavLink to="/home/manager-settings" className={itemClass}>
              <Settings className="h-5 w-5 shrink-0 opacity-90" />
              সেটিংস
            </NavLink>
          </>
        )}

        {mode === "boarder" && (
          <>
            <NavLink to="/home/boarder" end className={itemClass}>
              <LayoutDashboard className="h-5 w-5 shrink-0 opacity-90" />
              ওভারভিউ
            </NavLink>
            <NavLink to="/home/boarder/bills" className={itemClass}>
              <CreditCard className="h-5 w-5 shrink-0 opacity-90" />
              আমার বিল ও পেমেন্ট
            </NavLink>
            <NavLink to="/home/boarder/complaints" className={itemClass}>
              <MessageSquareWarning className="h-5 w-5 shrink-0 opacity-90" />
              অভিযোগ বক্স
            </NavLink>
            <NavLink to="/home/boarder/settings" className={itemClass}>
              <Settings className="h-5 w-5 shrink-0 opacity-90" />
              সেটিংস
            </NavLink>
          </>
        )}

        {mode === "guest" && token && (
          <NavLink to="/home" className={itemClass}>
            <Home className="h-5 w-5 shrink-0 opacity-90" />
            হোম
          </NavLink>
        )}

        <div className="mt-auto border-t border-white/10 pt-3">
          <NavLink to="/explore" className={itemClass}>
            <Building2 className="h-5 w-5 shrink-0 opacity-90" />
            হোস্টেল খুঁজুন
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className={`${linkBase} w-full text-left text-red-200 hover:bg-red-500/20 hover:text-white`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            লগ আউট
          </button>
        </div>
      </nav>
    </aside>
  );
}
