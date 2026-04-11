import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Star } from "lucide-react";
import { apiGet } from "../lib/api";
import { publicUrl } from "../lib/assets";
import UserAvatar from "../Components/UserAvatar";

export default function HostelDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const r = await apiGet(`/api/hostels/${id}`);
      if (r.ok && r.json?.success) {
        setData(r.json.data);
        setErr("");
      } else {
        setData(null);
        setErr(r.json?.message || "হোস্টেল পাওয়া যায়নি।");
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</div>
    );
  }

  if (err || !data) {
    return (
      <div className="mx-auto max-w-lg p-10 text-center">
        <p className="text-slate-600">{err}</p>
        <Link to="/explore" className="mt-4 inline-block text-[var(--cb-primary)] font-semibold">
          ← লিস্টে ফিরুন
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-100/80 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/explore"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--cb-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          হোস্টেল লিস্ট
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-56 bg-gradient-to-br from-[var(--cb-primary)] to-slate-800">
            {(data.photos || []).length > 0 ? (
              <img
                src={publicUrl((data.photos || []).find((p) => p.isMain)?.url || data.photos[0]?.url)}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = publicUrl("");
                }}
              />
            ) : null}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{Number(data.rating || 0).toFixed(1)}</span>
              <span className="text-white/80">({data.reviewCount || 0} রিভিউ)</span>
            </div>
          </div>
          {(data.photos || []).length > 1 && (
            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50 px-3 py-2">
              {data.photos.map((p) => (
                <img
                  key={p.id}
                  src={publicUrl(p.url)}
                  alt=""
                  className={`h-16 w-24 shrink-0 rounded-lg object-cover ${p.isMain ? "ring-2 ring-[var(--cb-primary)]" : ""}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = publicUrl("");
                  }}
                />
              ))}
            </div>
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-slate-900">{data.name}</h1>
            <p className="mt-2 flex items-start gap-2 text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {data.fullAddress}
            </p>

            <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <UserAvatar url={data.managerInfo?.profilePictureUrl} className="h-14 w-14 border-white shadow-sm" />
                <div>
                  <p className="text-xs text-slate-500">ম্যানেজার</p>
                  <p className="font-semibold text-slate-900">{data.managerInfo?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <Phone className="h-5 w-5 text-[var(--cb-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">ফোন</p>
                  <p className="font-semibold text-slate-900">{data.managerInfo?.phone}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-800">
                রুম ভাড়া (সিট) থেকে ৳{Number(data.startingPrice).toLocaleString("bn-BD")}
              </span>
              {Number(data.estimatedMonthlyFrom || 0) > 0 && (
                <span className="rounded-full bg-cyan-50 px-3 py-1 font-semibold text-[var(--cb-secondary)]">
                  আনুমানিক মাসিক থেকে ৳{Number(data.estimatedMonthlyFrom).toLocaleString("bn-BD")}
                </span>
              )}
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
                মোট খালি সিট {data.totalAvailableSeats}
              </span>
              {data.amenities?.hasAc && (
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-800">AC রুম আছে</span>
              )}
            </div>

            {(data.recentReviews || []).length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-bold text-slate-900">সাম্প্রতিক রিভিউ</h2>
                <div className="space-y-3">
                  {data.recentReviews.map((rev, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 font-semibold text-slate-800">
                          <UserAvatar url={rev.authorProfilePictureUrl} className="h-9 w-9 border-slate-200" />
                          {rev.author}
                        </span>
                        <span className="text-amber-600">{"★".repeat(rev.rating)}</span>
                      </div>
                      <p className="mt-2 text-slate-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">উপলব্ধ রুম</h2>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">রুম নং</th>
                    <th className="px-4 py-3">ফ্লোর</th>
                    <th className="px-4 py-3">খালি সিট</th>
                    <th className="px-4 py-3">রুম ভাড়া/সিট</th>
                    <th className="px-4 py-3">আনুমানিক মাসিক</th>
                    <th className="px-4 py-3">টাইপ</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.availableRooms || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                        এখন কোনো খালি রুম নেই
                      </td>
                    </tr>
                  ) : (
                    data.availableRooms.map((r) => (
                      <tr key={r.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium">{r.roomNumber}</td>
                        <td className="px-4 py-3">{r.floorNo}</td>
                        <td className="px-4 py-3">{r.seatAvailable}</td>
                        <td className="px-4 py-3 font-medium">৳{Number(r.monthlyRent).toLocaleString("bn-BD")}</td>
                        <td className="px-4 py-3 text-[var(--cb-secondary)]">
                          ৳{Number(r.effectiveEstimatedMonthly ?? r.monthlyRent).toLocaleString("bn-BD")}
                        </td>
                        <td className="px-4 py-3">{r.type}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/signUp"
                className="inline-block rounded-xl bg-[var(--cb-primary)] px-8 py-3 text-sm font-bold text-white shadow-lg"
              >
                এই হোস্টেলে রেজিস্ট্রেশন করুন
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
