import { useEffect, useState } from "react";
import { apiFetch, apiGet } from "../../lib/api";
import { publicUrl } from "../../lib/assets";

export default function ManagerHostelPhotosPanel() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const r = await apiGet("/api/manager/hostel-photos");
    if (r.ok && r.json?.success) setPhotos(Array.isArray(r.json.data) ? r.json.data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("setAsMain", "true");
    const r = await apiFetch("/api/manager/hostel-photos", { method: "POST", body: fd });
    if (r.ok && r.json?.success) {
      alert(r.json.message || "আপলোড সফল");
      load();
    } else {
      alert(r.json?.message || "ব্যর্থ");
    }
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">হোস্টেল ছবি</h2>
      <p className="mt-1 text-sm text-slate-500">পাবলিক হোস্টেল পেজে দেখাবে। প্রথম ছবি মূল হিসেবে সেট হবে।</p>
      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-4 py-2 text-sm font-bold text-white">
        নতুন ছবি আপলোড
        <input type="file" accept="image/*" className="hidden" onChange={upload} />
      </label>

      {loading ? (
        <p className="mt-6 text-[var(--cb-primary)]">লোড হচ্ছে...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.length === 0 ? (
            <p className="text-sm text-slate-500">এখনও কোনো ছবি নেই।</p>
          ) : (
            photos.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                <img src={publicUrl(p.url)} alt="" className="h-40 w-full object-cover" />
                {p.isMain && (
                  <p className="px-2 py-1 text-center text-xs font-bold text-[var(--cb-primary)]">মূল ছবি</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
