import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail, ArrowRight, Lock, Lightbulb } from "lucide-react";
import { apiPost } from "../lib/api";
import { getRolesFromStorage } from "../lib/auth";
import BrandLogo from "./BrandLogo";
import BrandHeroStack from "./BrandHeroStack";

const demoFill = (e) => {
  e.preventDefault();
  const form = e.target.closest("form");
  if (!form) return;
  form.email.value = "demo@chatrabash.local";
  form.password.value = "Demo@123";
};

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { ok, json } = await apiPost("/api/account/login", { email, password });

      if (ok && json.success) {
        localStorage.setItem("token", json.data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("user", JSON.stringify(json.data));

        const roles = getRolesFromStorage();
        if (roles.includes("SuperAdmin")) navigate("/home/admin", { replace: true });
        else if (roles.includes("Boarder")) navigate("/home/boarder", { replace: true });
        else if (roles.includes("Manager")) navigate(from === "/signIn" ? "/home" : from, { replace: true });
        else navigate("/home", { replace: true });
      } else {
        alert(json.message || "ইমেইল বা পাসওয়ার্ড ভুল!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div lang="bn" className="flex min-h-dvh w-full flex-col overflow-hidden bg-slate-100 font-sans antialiased text-slate-900 md:flex-row">
      <div
        className="relative flex min-h-[42vh] w-full flex-col justify-between bg-gradient-to-br from-[var(--cb-sidebar)] via-[var(--cb-primary)] to-[var(--cb-secondary)] px-6 py-8 text-white sm:px-10 md:min-h-dvh md:w-[42%] md:shrink-0 lg:w-[40%] xl:px-14"
        style={{ fontFamily: '"Hind Siliguri", system-ui, sans-serif' }}
      >
          <div className="pointer-events-none absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1522708323300-5bd6081a3721?w=1200&q=60')] bg-cover bg-center mix-blend-overlay" />
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white">
              ← হোমে ফিরুন
            </Link>
            <div className="mt-8">
              <BrandHeroStack variant="light" />
            </div>
            <h1 className="mt-6 text-2xl font-extrabold leading-tight md:text-3xl">
              আপনার হোস্টেল জীবন হোক আরও গোছানো এবং সহজ
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-blue-100">
              মালিকদের জন্য স্মার্ট ম্যানেজমেন্ট, বোর্ডারদের জন্য নিরাপদ আবাসন — সবই এক জায়গায়।
            </p>
            <ul className="mt-8 space-y-3 text-sm text-blue-50">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0" /> নিরাপদ ও এনক্রিপ্টেড লগ-ইন
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 shrink-0 rotate-[-45deg]" /> তাৎক্ষণিক হোস্টেল ম্যানেজমেন্ট
              </li>
            </ul>
          </div>
          <p className="relative z-10 text-xs text-blue-200/80">© ছাত্রাবাস.কম · সমস্ত অধিকার সংরক্ষিত</p>
      </div>

      <div
        className="flex min-h-0 w-full flex-1 flex-col justify-center bg-white px-6 py-10 sm:px-10 md:min-h-dvh md:px-12 lg:px-16 xl:px-24"
        style={{ fontFamily: '"Hind Siliguri", system-ui, sans-serif' }}
      >
          <div className="mb-4">
            <BrandLogo to="/" imgClassName="max-w-[13rem]" />
          </div>
          <div className="mb-6 flex justify-between gap-4">
            <div />
            <Link to="/signUp" className="text-sm font-semibold text-[var(--cb-primary)] hover:underline">
              নতুন অ্যাকাউন্ট →
            </Link>
          </div>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cb-primary)] text-white shadow-md">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">প্রবেশ করুন</h2>
          <p className="mt-1 text-sm text-slate-500">আপনার অ্যাকাউন্টে লগ-ইন করুন</p>

          <button
            type="button"
            onClick={demoFill}
            className="mt-6 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-left text-xs text-blue-900"
          >
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              ডেমো বোর্ডার: demo@chatrabash.local / Demo@123 — সুপার অ্যাডমিন: admin@chatrabash.com / Pa$$w0rd
            </span>
          </button>

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">ইমেইল এড্রেস</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[var(--cb-primary)] focus:ring-1 focus:ring-[var(--cb-primary)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">পাসওয়ার্ড</label>
                <span className="text-[10px] font-bold text-slate-400">পাসওয়ার্ড ভুলে গেছেন?</span>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="আপনার পাসওয়ার্ড"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-[var(--cb-primary)] focus:ring-1 focus:ring-[var(--cb-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" name="remember" className="rounded border-slate-300" />
              আমাকে মনে রাখুন
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--cb-primary)] py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "প্রসেসিং..." : "প্রবেশ করুন"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link to="/signUp" className="font-bold text-[var(--cb-primary)] hover:underline">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
          <p className="mt-4 flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Lock className="h-3 w-3" />
            আপনার তথ্য SSL এনক্রিপশন দ্বারা সুরক্ষিত
          </p>
      </div>
    </div>
  );
}
