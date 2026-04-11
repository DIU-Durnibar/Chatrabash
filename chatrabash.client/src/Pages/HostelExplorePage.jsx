import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Search, Star } from "lucide-react";
import { apiGet } from "../lib/api";
import { publicUrl } from "../lib/assets";

export default function HostelExplorePage() {
  const [searchParams] = useSearchParams();
  const qInit = searchParams.get("q") || "";

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [q, setQ] = useState(qInit);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(qInit);
  }, [qInit]);

  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/location/divisions");
      if (r.ok && r.json?.success) setDivisions(r.json.data || []);
    })();
  }, []);

  useEffect(() => {
    if (!divisionId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    (async () => {
      const r = await apiGet(`/api/location/districts/${divisionId}`);
      if (r.ok && r.json?.success) setDistricts(r.json.data || []);
    })();
  }, [divisionId]);

  useEffect(() => {
    if (!districtId) {
      setUpazilas([]);
      setUpazilaId("");
      return;
    }
    (async () => {
      const r = await apiGet(`/api/location/upazilas/${districtId}`);
      if (r.ok && r.json?.success) setUpazilas(r.json.data || []);
    })();
  }, [districtId]);

  const searchHostels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (divisionId) params.set("DivisionId", divisionId);
      if (districtId) params.set("DistrictId", districtId);
      if (upazilaId) params.set("UpazilaId", upazilaId);
      const r = await apiGet(`/api/hostels/search?${params.toString()}`);
      if (r.ok && r.json?.success && Array.isArray(r.json.data)) {
        let rows = r.json.data;
        if (q.trim()) {
          const needle = q.trim().toLowerCase();
          rows = rows.filter(
            (h) =>
              (h.name && h.name.toLowerCase().includes(needle)) ||
              (h.location && h.location.toLowerCase().includes(needle))
          );
        }
        setList(rows);
      } else {
        setList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchHostels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisionId, districtId, upazilaId]);

  const filtered = useMemo(() => list, [list]);

  return (
    <div className="min-h-full bg-slate-100/80 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">হোস্টেল খুঁজুন</h1>
        <p className="mb-8 text-sm text-slate-600">লোকেশন ফিল্টার দিয়ে খালি সিটসহ হোস্টেল দেখুন</p>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">বিভাগ</label>
              <select
                value={divisionId}
                onChange={(e) => {
                  setDivisionId(e.target.value);
                  setDistrictId("");
                  setUpazilaId("");
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
              >
                <option value="">সব</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.bengaliName || d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">জেলা</label>
              <select
                value={districtId}
                onChange={(e) => {
                  setDistrictId(e.target.value);
                  setUpazilaId("");
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
              >
                <option value="">সব</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.bengaliName || d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">উপজেলা</label>
              <select
                value={upazilaId}
                onChange={(e) => setUpazilaId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
              >
                <option value="">সব</option>
                {upazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.bengaliName || u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">কীওয়ার্ড</label>
              <div className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="নাম বা এলাকা..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                />
                <button
                  type="button"
                  onClick={() => searchHostels()}
                  className="flex shrink-0 items-center justify-center rounded-xl bg-[var(--cb-primary)] px-4 text-white"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
                কোনো হোস্টেল পাওয়া যায়নি। অন্য ফিল্টার চেষ্টা করুন।
              </div>
            ) : (
              filtered.map((h) => (
                <article
                  key={h.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-200 to-blue-100">
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
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{h.name}</h2>
                      {(h.rating > 0 || h.reviewCount > 0) && (
                        <span className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {Number(h.rating || 0).toFixed(1)} ({h.reviewCount || 0})
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {h.location}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {h.hasAc && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          AC
                        </span>
                      )}
                      {h.hasAttachedBath && (
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                          এটাচ বাথ
                        </span>
                      )}
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        খালি {h.availableSeats ?? 0} সিট
                      </span>
                    </div>
                    <div className="mt-auto flex flex-col gap-1 pt-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <span className="text-base font-bold text-[var(--cb-primary)]">
                          ভাড়া ৳{Number(h.startingPrice || 0).toLocaleString("bn-BD")} থেকে
                        </span>
                        {Number(h.estimatedMonthlyFrom || 0) > 0 &&
                          Number(h.estimatedMonthlyFrom) !== Number(h.startingPrice || 0) && (
                            <p className="text-xs font-semibold text-[var(--cb-secondary)]">
                              আনুমানিক ৳{Number(h.estimatedMonthlyFrom).toLocaleString("bn-BD")} থেকে
                            </p>
                          )}
                      </div>
                      <Link
                        to={`/hostels/${h.id}`}
                        className="rounded-lg bg-[var(--cb-primary)] px-3 py-1.5 text-xs font-bold text-white"
                      >
                        বিস্তারিত
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
