import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";
import { formatBdDateTime } from "../../lib/datetime";

export default function ManagerLogsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const pageSize = 25;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await apiGet(`/api/manager/activity-logs?page=${page}&pageSize=${pageSize}`);
      if (r.ok && r.json?.success && r.json.data) {
        setData({ items: r.json.data.items || [], total: r.json.data.total || 0 });
      }
      setLoading(false);
    })();
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">হোস্টেল লগ</h1>
        <p className="text-sm text-slate-500">আপনার হোস্টেলের বোর্ডার ও কার্যকলাপ (সময়: বাংলাদেশ)</p>
      </header>
      <div className="p-6">
        {loading ? (
          <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">সময়</th>
                    <th className="px-3 py-3">ইমেইল</th>
                    <th className="px-3 py-3">রোল</th>
                    <th className="px-3 py-3">অ্যাকশন</th>
                    <th className="px-3 py-3">বিস্তারিত</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((l) => (
                    <tr key={l.id} className="border-t border-slate-100">
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                        {formatBdDateTime(l.createdAt)}
                      </td>
                      <td className="max-w-[160px] truncate px-3 py-2 text-xs">{l.actorEmail || "—"}</td>
                      <td className="px-3 py-2 text-xs">{l.actorRole}</td>
                      <td className="px-3 py-2 font-medium">{l.action}</td>
                      <td className="max-w-[220px] truncate px-3 py-2 text-xs text-slate-500">{l.details || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-slate-500">
                {data.total} টি · {page}/{totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border px-3 py-1 font-semibold disabled:opacity-40"
                >
                  আগে
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border px-3 py-1 font-semibold disabled:opacity-40"
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
