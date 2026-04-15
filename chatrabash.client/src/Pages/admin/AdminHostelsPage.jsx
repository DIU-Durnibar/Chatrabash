import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../lib/api";
import UserAvatar from "../../Components/UserAvatar";

export default function AdminHostelsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCardId, setOpenCardId] = useState(null);

  const load = async () => {
    setLoading(true);
    const r = await apiGet("/api/superadmin/hostels");
    if (r.ok && r.json?.success) setRows(Array.isArray(r.json.data) ? r.json.data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (id, next) => {
    // Optimistic UI Update (ক্লিক করার সাথে সাথে UI চেঞ্জ হবে)
    setRows(prev => prev.map(h => h.id === id ? { ...h, status: next ? "Active" : "Suspended" } : h));
    
    // URL-এর মাধ্যমে ডেটা পাঠাচ্ছি (বডিতে না)
    const res = await apiPatch(`/api/superadmin/hostels/${id}/status?isActive=${next}`);
    if (!res.ok || !res.json?.success) {
      alert(res.json?.message || "স্ট্যাটাস আপডেট ব্যর্থ হয়েছে");
      load(); // ফেইল করলে আগের ডাটা আবার আনবে
    }
  };

  const toggleFeatured = async (id, next) => {
    // Optimistic UI Update (ক্লিক করার সাথে সাথে UI চেঞ্জ হবে)
    setRows(prev => prev.map(h => h.id === id ? { ...h, isFeatured: next, isSponsored: next ? "Featured" : "Non Featured" } : h));

    // URL-এর মাধ্যমে ডেটা পাঠাচ্ছি (বডিতে না)
    const res = await apiPatch(`/api/superadmin/hostels/${id}/featured?isFeatured=${next}`);
    if (!res.ok || !res.json?.success) {
      alert(res.json?.message || "ফিচার্ড আপডেট ব্যর্থ হয়েছে");
      load(); // ফেইল করলে আগের ডাটা আবার আনবে
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">সব হোস্টেল</h1>
        <p className="text-sm text-slate-500">
          ম্যানেজারের ইমেইল, ফোন, ঠিকানা ও আসন সংখ্যাসহ সম্পূর্ণ তালিকা — সারি খুলে বিস্তারিত দেখুন
        </p>
      </header>
      
      <div className="p-6">
        {loading ? (
          <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
        ) : (
          <div className="space-y-3">
            {rows.map((h) => {
              const isCurrentlyFeatured = h.isFeatured === true || h.isSponsored === "Featured";
              const isCurrentlyActive = h.status === "Active";
              const isOpen = openCardId === h.id;

              return (
                <div
                  key={h.id}
                  className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all ${
                    isOpen ? "shadow-md" : "shadow-sm"
                  }`}
                >
                  <div
                    onClick={() => setOpenCardId(isOpen ? null : h.id)}
                    className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-4"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <UserAvatar url={h.managerProfilePictureUrl} className="h-12 w-12 border-slate-200" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900">{h.name}</p>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{h.location}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          ম্যানেজার: <span className="font-semibold">{h.managerName}</span>
                          {h.managerPhone ? ` · ${h.managerPhone}` : null}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {/* ফিচার্ড টগল বাটন */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFeatured(h.id, !isCurrentlyFeatured);
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                          isCurrentlyFeatured
                            ? "border-amber-400 bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {isCurrentlyFeatured ? "★ Featured" : "☆ Set Featured"}
                      </button>

                      {/* স্ট্যাটাস বাটন */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleStatus(h.id, !isCurrentlyActive);
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                          isCurrentlyActive 
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {h.status}
                      </button>

                      {/* অ্যারো আইকন */}
                      <span className="ml-2 text-xs font-semibold text-[var(--cb-primary)]">
                        {isOpen ? "সংকুচিত ▴" : "বিস্তারিত ▾"}
                      </span>
                    </div>
                  </div>

                  {/* বিস্তারিত অংশ */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-4 text-sm text-slate-700">
                      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">ম্যানেজার ইমেইল</dt>
                          <dd className="mt-0.5 break-all font-medium">{h.managerEmail || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">ম্যানেজার ইউজারনেম</dt>
                          <dd className="mt-0.5 font-mono text-xs">{h.managerUserName || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">ম্যানেজার ফোন</dt>
                          <dd className="mt-0.5 font-mono">{h.managerPhone || "—"}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-bold uppercase text-slate-400">পূর্ণ ঠিকানা</dt>
                          <dd className="mt-0.5">{h.fullAddress || h.areaDescription || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">বিভাগ / জেলা / উপজেলা</dt>
                          <dd className="mt-0.5">
                            {[h.division, h.district, h.upazila].filter(Boolean).join(" · ") || "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">সাবস্ক্রিপশন</dt>
                          <dd className="mt-0.5">
                            {h.package}
                            {h.monthlyPackagePrice != null && (
                              <span className="text-slate-500"> — ৳{Number(h.monthlyPackagePrice).toLocaleString("bn-BD")}/মাস</span>
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">হোস্টেল আইডি</dt>
                          <dd className="mt-0.5 break-all font-mono text-xs">{h.id}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">ম্যানেজার আইডি</dt>
                          <dd className="mt-0.5 break-all font-mono text-xs">{h.managerId || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">রুম / সিট</dt>
                          <dd className="mt-0.5">
                            রুম {h.roomCount ?? 0} · মোট সিট {h.totalSeats ?? 0} · খালি {h.availableSeats ?? 0}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase text-slate-400">বোর্ডার (অনুমোদিত)</dt>
                          <dd className="mt-0.5 font-bold text-[var(--cb-primary)]">{h.boarderCount ?? 0}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}