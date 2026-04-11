import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { apiDelete, apiGet } from "../../lib/api";
import { formatBdDateTime } from "../../lib/datetime";

export default function AdminLogsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const pageSize = 30;

  const load = useCallback(async (pageNum) => {
    setLoading(true);
    const r = await apiGet(`/api/superadmin/activity-logs?page=${pageNum}&pageSize=${pageSize}`);
    if (r.ok && r.json?.success && r.json.data) {
      setData({
        items: r.json.data.items || [],
        total: r.json.data.total || 0,
      });
    }
    setLoading(false);
  }, [pageSize]);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const clearAll = async () => {
    if (!window.confirm("সমস্ত অ্যাক্টিভিটি লগ স্থায়ীভাবে মুছে ফেলবেন?")) return;
    setClearing(true);
    const r = await apiDelete("/api/superadmin/activity-logs");
    setClearing(false);
    if (r.ok && r.json?.success) {
      setPage(1);
      await load(1);
    } else {
      alert(r.json?.message || "মুছে ফেলা যায়নি।");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">প্ল্যাটফর্ম লগ</h1>
          <p className="text-sm text-slate-500">ম্যানেজার, বোর্ডার ও সিস্টেম কার্যকলাপ (সময়: বাংলাদেশ)</p>
        </div>
        <button
          type="button"
          disabled={clearing || data.total === 0}
          onClick={clearAll}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          {clearing ? "মুছে ফেলা হচ্ছে..." : "সব লগ মুছুন"}
        </button>
      </header>
      <div className="p-6">
        {loading ? (
          <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">সময়</th>
                    <th className="px-3 py-3">ইমেইল</th>
                    <th className="px-3 py-3">রোল</th>
                    <th className="px-3 py-3">অ্যাকশন</th>
                    <th className="px-3 py-3">ক্যাটাগরি</th>
                    <th className="px-3 py-3">হোস্টেল</th>
                    <th className="px-3 py-3">বিস্তারিত</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((l) => (
                    <tr key={l.id} className="border-t border-slate-100">
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                        {formatBdDateTime(l.createdAt)}
                      </td>
                      <td className="max-w-[140px] truncate px-3 py-2 text-xs">{l.actorEmail || "—"}</td>
                      <td className="px-3 py-2 text-xs">{l.actorRole}</td>
                      <td className="px-3 py-2 font-medium">{l.action}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{l.category}</td>
                      <td className="max-w-[100px] truncate px-3 py-2 text-xs">{l.hostelId || "—"}</td>
                      <td className="max-w-[200px] truncate px-3 py-2 text-xs text-slate-500">{l.details || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                মোট {data.total} · পৃষ্ঠা {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border px-3 py-1.5 font-semibold disabled:opacity-40"
                >
                  আগে
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border px-3 py-1.5 font-semibold disabled:opacity-40"
                >
                  পরে
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
