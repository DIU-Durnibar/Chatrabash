import { useState } from "react";
import { Bell, Globe, Shield } from "lucide-react";

const tabs = [
  { id: "general", label: "সাধারণ", icon: Globe },
  { id: "security", label: "নিরাপত্তা", icon: Shield },
  { id: "notify", label: "নোটিফিকেশন", icon: Bell },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("general");
  const [lang, setLang] = useState(() => localStorage.getItem("cb_lang") || "bn");
  const [emailDigest, setEmailDigest] = useState(() => localStorage.getItem("cb_admin_digest") !== "off");

  const saveLang = () => {
    localStorage.setItem("cb_lang", lang);
    alert("ভাষা পছন্দ সংরক্ষিত (UI টেস্ট)।");
  };

  const saveDigest = () => {
    localStorage.setItem("cb_admin_digest", emailDigest ? "on" : "off");
    alert("নোটিফিকেশন পছন্দ সংরক্ষিত।");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">সেটিংস</h1>
        <p className="text-sm text-slate-500">প্ল্যাটফর্ম অপারেটর পছন্দ (লোকাল ডেমো)</p>
      </header>
      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === t.id ? "bg-[var(--cb-primary)] text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {tab === "general" && (
            <div className="space-y-4">
              <h2 className="font-bold text-slate-900">ভাষা ও প্রদর্শন</h2>
              <label className="block text-xs font-semibold text-slate-500">ইন্টারফেস ভাষা</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="bn">বাংলা</option>
                <option value="en">English (demo)</option>
              </select>
              <button
                type="button"
                onClick={saveLang}
                className="rounded-xl bg-[var(--cb-primary)] px-4 py-2 text-sm font-bold text-white"
              >
                সংরক্ষণ
              </button>
            </div>
          )}
          {tab === "security" && (
            <div className="space-y-3 text-sm text-slate-600">
              <h2 className="font-bold text-slate-900">নিরাপত্তা</h2>
              <p>JWT সেশন ব্রাউজারে সংরক্ষিত। প্রোডাকশনে HTTP-only কুকি ও রিফ্রেশ টোকেন ব্যবহার করুন।</p>
              <p className="rounded-lg bg-slate-50 p-3 text-xs">
                সুপার অ্যাডমিন রোল শুধুমাত্র বিশ্বস্ত অ্যাকাউন্টে দিন।
              </p>
            </div>
          )}
          {tab === "notify" && (
            <div className="space-y-4">
              <h2 className="font-bold text-slate-900">নোটিফিকেশন</h2>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={emailDigest} onChange={(e) => setEmailDigest(e.target.checked)} />
                সাপ্তাহিক সারসংক্ষেপ (ডেমো ফ্ল্যাগ)
              </label>
              <button
                type="button"
                onClick={saveDigest}
                className="rounded-xl bg-[var(--cb-primary)] px-4 py-2 text-sm font-bold text-white"
              >
                সংরক্ষণ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
