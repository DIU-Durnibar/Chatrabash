import { Link, NavLink } from "react-router-dom";
import { Building2 } from "lucide-react";
import BrandLogo from "../BrandLogo";

export default function PublicNav() {
  const token = localStorage.getItem("token");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <BrandLogo to="/" imgClassName="md:max-w-[13rem]" />

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "text-[var(--cb-primary)]" : "hover:text-[var(--cb-primary)]"
            }
          >
            হোস্টেল খুঁজুন
          </NavLink>
          <a href="#how" className="hover:text-[var(--cb-primary)]">
            কিভাবে কাজ করে
          </a>
          <a href="#help" className="hover:text-[var(--cb-primary)]">
            সাহায্য
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {!token ? (
            <>
              <Link
                to="/signIn"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline"
              >
                লগ-ইন
              </Link>
              <Link
                to="/signUp"
                className="rounded-lg border border-[var(--cb-primary)] px-3 py-2 text-sm font-semibold text-[var(--cb-primary)] hover:bg-slate-50"
              >
                রেজিস্ট্রেশন
              </Link>
              <Link
                to="/register-hostel"
                className="rounded-lg bg-[var(--cb-primary)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                <span className="hidden sm:inline">আপনার হোস্টেল যুক্ত করুন</span>
                <Building2 className="h-5 w-5 sm:hidden" />
              </Link>
            </>
          ) : (
            <Link
              to="/home"
              className="rounded-lg bg-[var(--cb-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              ড্যাশবোর্ড
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
