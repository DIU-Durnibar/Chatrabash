import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";
import { formatBdDateTime } from "../../lib/datetime";

const monthsBn = ["", "জানু", "ফেব", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগ", "সেপ", "অক্টো", "নভে", "ডিসে"];

export default function AdminManagerPaymentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/superadmin/manager-payments");
      if (r.ok && r.json?.success) setRows(Array.isArray(r.json.data) ? r.json.data : []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">ম্যানেজার প্ল্যাটফর্ম পেমেন্ট</h1>
        <p className="text-sm text-slate-500">মক গেটওয়ে দিয়ে রেকর্ড করা মাসিক ফি</p>
      </header>
      <div className="p-6">
        {loading ? (
          <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
        ) : rows.length === 0 ? (
          <p className="text-slate-500">এখনও কোনো পেমেন্ট রেকর্ড নেই।</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">তারিখ</th>
                  <th className="px-4 py-3">হোস্টেল</th>
                  <th className="px-4 py-3">ম্যানেজার</th>
                  <th className="px-4 py-3">পিরিয়ড</th>
                  <th className="px-4 py-3">পরিমাণ</th>
                  <th className="px-4 py-3">ট্রানজেকশন</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {formatBdDateTime(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.hostelName}</td>
                    <td className="px-4 py-3">{p.managerName}</td>
                    <td className="px-4 py-3">
                      {monthsBn[p.month]} {p.year}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700">৳{Number(p.amount).toLocaleString("bn-BD")}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
