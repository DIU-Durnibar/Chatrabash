import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CreditCard, LayoutDashboard, ScrollText, Users } from "lucide-react";
import { apiGet } from "../../lib/api";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/superadmin/analytics");
      if (r.ok && r.json?.success) setData(r.json.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">সুপার অ্যাডমিন ড্যাশবোর্ড</h1>
        <p className="text-sm text-slate-500">প্ল্যাটফর্ম ওভারভিউ ও দ্রুত নেভিগেশন</p>
      </header>

      <div className="p-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Building2 className="mb-2 h-8 w-8 text-[var(--cb-primary)]" />
            <p className="text-2xl font-bold text-slate-900">{data?.totalHostels ?? "—"}</p>
            <p className="text-xs text-slate-500">মোট হোস্টেল</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <LayoutDashboard className="mb-2 h-8 w-8 text-emerald-600" />
            <p className="text-2xl font-bold text-emerald-700">{data?.activeHostels ?? "—"}</p>
            <p className="text-xs text-slate-500">সক্রিয় হোস্টেল</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Users className="mb-2 h-8 w-8 text-amber-600" />
            <p className="text-2xl font-bold text-amber-700">{data?.totalBoarders ?? "—"}</p>
            <p className="text-xs text-slate-500">বোর্ডার (হোস্টেল আইডি সহ)</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <CreditCard className="mb-2 h-8 w-8 text-violet-600" />
            <p className="text-2xl font-bold text-violet-700">
              ৳{Number(data?.monthlySaaSRevenue || 0).toLocaleString("bn-BD")}
            </p>
            <p className="text-xs text-slate-500">প্যাকেজ মাসিক মূল্য (সামগ্রিক)</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/home/admin/hostels", icon: Building2, label: "হোস্টেল ব্যবস্থাপনা", desc: "স্ট্যাটাস, তালিকা" },
            { to: "/home/admin/logs", icon: ScrollText, label: "অ্যাক্টিভিটি লগ", desc: "ম্যানেজার ও ইউজার" },
            { to: "/home/admin/manager-payments", icon: CreditCard, label: "ম্যানেজার পেমেন্ট", desc: "প্ল্যাটফর্ম ফি" },
            { to: "/home/admin/settings", icon: LayoutDashboard, label: "সেটিংস", desc: "প্ল্যাটফর্ম পছন্দ" },
          ].map((x) => (
            <Link
              key={x.to}
              to={x.to}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[var(--cb-primary)] hover:shadow-md"
            >
              <x.icon className="mb-3 h-8 w-8 text-[var(--cb-primary)] opacity-90 group-hover:opacity-100" />
              <span className="font-bold text-slate-900">{x.label}</span>
              <span className="mt-1 text-xs text-slate-500">{x.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
