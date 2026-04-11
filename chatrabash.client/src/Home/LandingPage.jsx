import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Search,
  Shield,
  Zap,
  Smartphone,
  Building2,
  Users,
  Check,
  ArrowRight,
} from "lucide-react";
import PublicNav from "../Components/public/PublicNav";
import PublicFooter from "../Components/public/PublicFooter";
import BrandHeroStack from "../Components/BrandHeroStack";
import { apiGet } from "../lib/api";
import { publicUrl } from "../lib/assets";

const quickAreas = ["বনানী", "মিরপুর", "ধানমন্ডি", "উত্তরা", "গুলশান"];

export default function LandingPage() {
  const [stats, setStats] = useState({
    hostels: 0,
    boarders: 0,
    reviewCount: 0,
    averageRating: null,
  });
  const [featured, setFeatured] = useState([]);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    (async () => {
      const s = await apiGet("/api/public/landing-stats");
      if (s.ok && s.json?.success && s.json.data) {
        const d = s.json.data;
        setStats({
          hostels: Number(d.hostels) || 0,
          boarders: Number(d.boarders) || 0,
          reviewCount: Number(d.reviewCount) || 0,
          averageRating: d.averageRating != null ? Number(d.averageRating) : null,
        });
      }
      const f = await apiGet("/api/public/featured-hostels");
      if (f.ok && f.json?.success && Array.isArray(f.json.data)) {
        setFeatured(f.json.data);
      }
    })();
  }, []);

  const goSearch = (e) => {
    e.preventDefault();
    const q = searchQ.trim();
    const url = q ? `/explore?q=${encodeURIComponent(q)}` : "/explore";
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--cb-sidebar)] via-[var(--cb-primary)] to-[var(--cb-secondary)] px-4 py-14 text-white md:px-6 md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6">
            <BrandHeroStack variant="light" />
          </div>
          <h1 className="mb-4 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            এক প্ল্যাটফর্মে হোস্টেল ম্যানেজমেন্ট এবং সিট বুকিং
          </h1>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-lg">
            মালিকদের জন্য স্মার্ট ম্যানেজমেন্ট, বোর্ডারদের জন্য নিরাপদ আবাসন — সবই এক জায়গায়।
          </p>

          <form onSubmit={goSearch} className="mb-4 max-w-2xl">
            <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row sm:items-stretch">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <MapPin className="h-5 w-5 shrink-0 text-[var(--cb-primary)]" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="আপনার পছন্দের এলাকা/লোকেশন দিয়ে খুঁজুন..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--cb-primary)] px-6 py-3 text-sm font-bold text-white hover:opacity-95"
              >
                <Search className="h-4 w-4" />
                খুঁজুন
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {quickAreas.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setSearchQ(a);
                  window.location.href = `/explore?q=${encodeURIComponent(a)}`;
                }}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium hover:bg-white/15"
              >
                {a}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-emerald-200">হোস্টেল মালিক</p>
              <p className="mt-2 text-lg font-bold">সহজে ম্যানেজ করুন আপনার হোস্টেল</p>
              <Link
                to="/register-hostel"
                className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-bold text-[var(--cb-primary)]"
              >
                মালিক হিসেবে রেজিস্ট্রেশন
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-amber-200">স্টুডেন্ট / পেয়িং গেস্ট</p>
              <p className="mt-2 text-lg font-bold">পছন্দের এলাকার সিট খুঁজে নিন</p>
              <Link
                to="/explore"
                className="mt-4 inline-block rounded-lg border border-white/40 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
              >
                সিট খুঁজুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-slate-200/80 bg-gradient-to-b from-slate-50 to-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">আপনার প্রয়োজন অনুযায়ী শুরু করুন</h2>
            <p className="mt-3 text-slate-600">হোস্টেল মালিক ও বোর্ডার — দুই পক্ষের জন্য আলাদা, পরিষ্কার পথ</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-12px_rgba(45,82,157,0.18)]">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--cb-primary)] to-[var(--cb-primary-dark)] text-white shadow-md">
                <Building2 className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">হোস্টেল মালিক</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                বিল, রুম, বোর্ডার অনুরোধ — সব এক ড্যাশবোর্ডে। সময় বাঁচান, হিসাব পরিষ্কার রাখুন।
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {[
                  "ডিজিটাল বিলিং ও পেমেন্ট ট্র্যাকিং",
                  "রুম ও সিট ম্যানেজমেন্ট",
                  "নতুন বোর্ডারের অনুরোধ অনুমোদন",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--cb-primary)]">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span className="pt-0.5">{t}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register-hostel"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cb-primary)] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--cb-primary-dark)]"
              >
                মালিক হিসেবে শুরু করুন
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

            <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-12px_rgba(0,151,167,0.15)]">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--cb-secondary)] to-teal-700 text-white shadow-md">
                <Users className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">বোর্ডার / স্টুডেন্ট</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                যাচাইকৃত হোস্টেল, লোকেশন ফিল্টার ও স্বচ্ছ বিল — নিরাপদ থাকুন, সিদ্ধান্ত নিন সহজে।
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {[
                  "যাচাইকৃত হোস্টেল লিস্ট",
                  "লোকেশন ভিত্তিক খোঁজা",
                  "বিল ও পেমেন্ট হিস্ট্রি",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[var(--cb-secondary)]">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span className="pt-0.5">{t}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/explore"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--cb-secondary)] bg-white px-5 py-3 text-sm font-bold text-[var(--cb-secondary)] shadow-sm transition hover:bg-teal-50"
              >
                সিট খুঁজুন
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">আপনার এলাকার জনপ্রিয় হোস্টেলসমূহ</h2>
            <Link to="/explore" className="text-sm font-semibold text-[var(--cb-primary)]">
              সব হোস্টেল দেখুন
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.length === 0
              ? [1, 2, 3].map((i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                ))
              : featured.map((h) => (
                  <article
                    key={h.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
                  >
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                      {h.mainPhotoUrl ? (
                        <img
                          src={publicUrl(h.mainPhotoUrl)}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-bold text-slate-900">{h.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {h.location}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {h.hasAc && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            ওয়াইফাই / AC
                          </span>
                        )}
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          মিল সুবিধা
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-lg font-bold text-[var(--cb-primary)]">
                          ৳{Number(h.startingPrice).toLocaleString("bn-BD")}/মাস
                        </span>
                        <Link
                          to={`/hostels/${h.id}`}
                          className="rounded-lg bg-[var(--cb-primary)] px-3 py-1.5 text-xs font-bold text-white"
                        >
                          বিস্তারিত
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
          আপনার হোস্টেল বিজনেসকে আরও সহজ করুন
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { t: "সহজ হিসাব-নিকাশ", d: "মাসিক বিল, বকেয়া ও আদায় এক নজরে।", c: "bg-blue-50 text-blue-700" },
            { t: "নিরাপদ অ্যাক্সেস", d: "রোল ভিত্তিক লগইন ও অনুমোদন প্রক্রিয়া।", c: "bg-emerald-50 text-emerald-700" },
            { t: "রুম ব্যবস্থাপনা", d: "সিট ক্যাপাসিটি ও রুম টাইপ ট্র্যাক করুন।", c: "bg-violet-50 text-violet-700" },
            { t: "দ্রুত অনবোর্ডিং", d: "বোর্ডার রেজিস্ট্রেশন ও ম্যানেজার অনুমোদন।", c: "bg-amber-50 text-amber-700" },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className={`mb-3 inline-flex rounded-xl p-3 ${x.c}`}>
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">{x.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--cb-primary)] px-4 py-16 text-white md:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">হোস্টেল ম্যানেজমেন্টের নতুন যুগে স্বাগতম</h2>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register-hostel"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[var(--cb-primary)] shadow-lg"
            >
              হোস্টেল মালিকদের জন্য — রেজিস্ট্রেশন
            </Link>
            <Link
              to="/explore"
              className="rounded-xl border-2 border-white/60 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              স্টুডেন্টদের জন্য — সিট খুঁজুন
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-3xl font-extrabold tabular-nums">{stats.hostels.toLocaleString("bn-BD")}</p>
              <p className="text-sm text-blue-200">সক্রিয় হোস্টেল</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-3xl font-extrabold tabular-nums">{stats.boarders.toLocaleString("bn-BD")}</p>
              <p className="text-sm text-blue-200">নিবন্ধিত বোর্ডার</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 backdrop-blur-sm">
              {stats.reviewCount > 0 && stats.averageRating != null ? (
                <>
                  <p className="text-3xl font-extrabold tabular-nums">
                    {Number(stats.averageRating).toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    /৫
                  </p>
                  <p className="text-sm text-blue-200">
                    গড় রেটিং · {stats.reviewCount.toLocaleString("bn-BD")} রিভিউ
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-extrabold tabular-nums">—</p>
                  <p className="text-sm text-blue-200">রিভিউ ডেটাবেস থেকে গণনা হবে</p>
                </>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> নিরাপদ ও এনক্রিপ্টেড লগ-ইন
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> তাৎক্ষণিক ম্যানেজমেন্ট
            </span>
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> মোবাইল ফ্রেন্ডলি
            </span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
