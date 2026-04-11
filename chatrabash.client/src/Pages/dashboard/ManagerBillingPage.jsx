import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../lib/api";

export default function ManagerBillingPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [platMonth, setPlatMonth] = useState(now.getMonth() + 1);
  const [platYear, setPlatYear] = useState(now.getFullYear());
  const [utility, setUtility] = useState(0);
  const [additional, setAdditional] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [platLoading, setPlatLoading] = useState(false);
  const [platMsg, setPlatMsg] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = async () => {
    const r = await apiGet(`/api/billing/analytics?month=${month}&year=${year}`);
    if (r.ok && r.json?.success) setAnalytics(r.json.data);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const payPlatform = async (e) => {
    e.preventDefault();
    setPlatLoading(true);
    setPlatMsg("");
    const r = await apiPost("/api/manager/mock-platform-payment", {
      month: platMonth,
      year: platYear,
      paymentMethod: "Card",
    });
    setPlatLoading(false);
    if (r.ok && r.json?.success) {
      setPlatMsg(r.json.message + (r.json.data?.transactionId ? ` · ${r.json.data.transactionId}` : ""));
    } else {
      setPlatMsg(r.json?.message || "ব্যর্থ");
    }
  };

  const bulkGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const r = await apiPost("/api/billing/generate-bulk", {
      month,
      year,
      utilityCharge: Number(utility),
      additionalCharge: Number(additional),
    });
    setLoading(false);
    if (r.ok && r.json?.success) {
      setMsg(r.json.message);
      refresh();
    } else {
      setMsg(r.json?.message || "সমস্যা হয়েছে");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">বিলিং ও পেমেন্ট</h1>
        <p className="text-sm text-slate-500">মাসিক বিল জেনারেশন ও সারাংশ</p>
      </header>

      <div className="p-6">
        <div className="mb-8 max-w-xl rounded-2xl border border-violet-100 bg-violet-50/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">প্ল্যাটফর্ম মাসিক ফি (মক গেটওয়ে)</h2>
          <p className="mt-1 text-xs text-slate-600">
            সুপার অ্যাডমিনকে রিপোর্ট হয়। পেইড প্যাকেজে মাস প্রতি একবার।
          </p>
          <form onSubmit={payPlatform} className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">মাস</label>
              <select
                value={platMonth}
                onChange={(e) => setPlatMonth(Number(e.target.value))}
                className="mt-1 block rounded-lg border border-slate-200 px-2 py-2 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">বছর</label>
              <input
                type="number"
                value={platYear}
                onChange={(e) => setPlatYear(Number(e.target.value))}
                className="mt-1 w-28 rounded-lg border border-slate-200 px-2 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={platLoading}
              className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {platLoading ? "..." : "মক পে করুন"}
            </button>
          </form>
          {platMsg && <p className="mt-3 text-sm text-slate-800">{platMsg}</p>}
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">মোট বিল</p>
            <p className="text-xl font-bold text-[var(--cb-primary)]">
              ৳{Number(analytics?.totalBilled || 0).toLocaleString("bn-BD")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">আদায়কৃত</p>
            <p className="text-xl font-bold text-emerald-700">
              ৳{Number(analytics?.totalCollected || 0).toLocaleString("bn-BD")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">বকেয়া</p>
            <p className="text-xl font-bold text-red-600">
              ৳{Number(analytics?.totalDue || 0).toLocaleString("bn-BD")}
            </p>
          </div>
        </div>

        <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">বাল্ক বিল জেনারেশন</h2>
          <form onSubmit={bulkGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">মাস</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">বছর</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">ইউটিলিটি চার্জ (প্রতি বোর্ডার)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={utility}
                onChange={(e) => setUtility(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">অতিরিক্ত চার্জ</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={additional}
                onChange={(e) => setAdditional(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--cb-primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "প্রসেসিং..." : "সব বোর্ডারের জন্য বিল তৈরি করুন"}
            </button>
          </form>
          {msg && <p className="mt-4 text-sm text-slate-700">{msg}</p>}
          <p className="mt-4 text-xs text-slate-500">
            একক বিল তৈরি ও পেমেন্ট গ্রহণ API দিয়ে সম্ভব; পরবর্তীতে এখানে ফর্ম যুক্ত করা যাবে।
          </p>
        </div>
      </div>
    </div>
  );
}
