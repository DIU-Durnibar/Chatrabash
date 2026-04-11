import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { apiGet, apiPut } from "../../lib/api";
import ManagerPageFrame from "../../layouts/ManagerPageFrame";

export default function UpdateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    roomNumber: "",
    floorNo: "",
    seatCapacity: "",
    monthlyRent: "",
    estimatedMonthlyCost: "",
    isAttachedBathroomAvailable: false,
    isBalconyAvailable: false,
    isAcAvailable: false,
    isActive: true,
  });

  useEffect(() => {
    (async () => {
      const { ok, json } = await apiGet("/api/manager/rooms");
      if (ok && json?.success && Array.isArray(json.data)) {
        const row = json.data.find((r) => r.id === id);
        if (!row) {
          alert("রুম পাওয়া যায়নি");
          setFetching(false);
          return;
        }
        setForm({
          roomNumber: row.roomNumber || "",
          floorNo: String(row.floorNo ?? ""),
          seatCapacity: String(row.seatCapacity ?? ""),
          monthlyRent: String(row.monthlyRent ?? "0"),
          estimatedMonthlyCost:
            row.estimatedMonthlyCost != null ? String(row.estimatedMonthlyCost) : "",
          isAttachedBathroomAvailable: !!row.isAttachedBathroomAvailable,
          isBalconyAvailable: !!row.isBalconyAvailable,
          isAcAvailable: !!row.isAcAvailable,
          isActive: row.isActive !== false,
        });
      } else {
        alert("ডাটা লোড ব্যর্থ");
      }
      setFetching(false);
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const rent = Number(form.monthlyRent);
    if (Number.isNaN(rent) || rent < 0) {
      alert("সঠিক রুম ভাড়া দিন।");
      return;
    }
    const estRaw = String(form.estimatedMonthlyCost ?? "").trim();
    const est = estRaw === "" ? null : Number(estRaw);
    if (estRaw !== "" && (Number.isNaN(est) || est < 0)) {
      alert("আনুমানিক ব্যয় সঠিক দিন বা খালি রাখুন।");
      return;
    }

    setLoading(true);
    const payload = {
      roomNumber: form.roomNumber,
      floorNo: parseInt(form.floorNo, 10),
      seatCapacity: parseInt(form.seatCapacity, 10),
      monthlyRent: rent,
      estimatedMonthlyCost: est,
      isAttachedBathroomAvailable: form.isAttachedBathroomAvailable,
      isBalconyAvailable: form.isBalconyAvailable,
      isAcAvailable: form.isAcAvailable,
      isActive: form.isActive,
    };
    const { ok, json } = await apiPut(`/api/manager/rooms/${id}`, payload);
    setLoading(false);
    if (ok && json?.success) {
      alert(json.message || "আপডেট সফল");
      navigate("/home/rooms");
    } else {
      alert(json?.message || "ব্যর্থ");
    }
  };

  if (fetching) {
    return (
      <ManagerPageFrame title="রুম আপডেট" subtitle="">
        <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
      </ManagerPageFrame>
    );
  }

  return (
    <ManagerPageFrame title="রুম সম্পাদনা" subtitle={`রুম আইডি: ${id?.slice(0, 8)}…`}>
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--cb-sidebar)] to-[var(--cb-primary)] px-6 py-5 text-white">
          <RefreshCw className={`h-8 w-8 shrink-0 ${loading ? "animate-spin" : ""}`} />
          <div>
            <h2 className="text-lg font-bold">ভাড়া ও সুবিধা আপডেট</h2>
            <p className="text-xs text-white/85">বিলিং «রুম ভাড়া» ফিল্ড ব্যবহার করে</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-500">রুম নম্বর</label>
              <input
                required
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">ফ্লোর</label>
              <input
                type="number"
                required
                value={form.floorNo}
                onChange={(e) => setForm({ ...form, floorNo: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">সিট ক্ষমতা</label>
              <input
                type="number"
                required
                value={form.seatCapacity}
                onChange={(e) => setForm({ ...form, seatCapacity: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">রুম ভাড়া (মাসিক/সিট) ৳</label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.monthlyRent}
                onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500">আনুমানিক মোট মাসিক ৳ (ঐচ্ছিক)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.estimatedMonthlyCost}
                onChange={(e) => setForm({ ...form, estimatedMonthlyCost: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                placeholder="খালি = শুধু ভাড়া দেখানো হবে"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500">অ্যাটাচ বাথ</label>
              <select
                value={form.isAttachedBathroomAvailable ? "true" : "false"}
                onChange={(e) => setForm({ ...form, isAttachedBathroomAvailable: e.target.value === "true" })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option value="false">না</option>
                <option value="true">হ্যাঁ</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 rounded-xl bg-slate-50 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isBalconyAvailable}
                onChange={(e) => setForm({ ...form, isBalconyAvailable: e.target.checked })}
              />
              বারান্দা
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isAcAvailable}
                onChange={(e) => setForm({ ...form, isAcAvailable: e.target.checked })}
              />
              এসি
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              সক্রিয়
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/home/rooms")}
              className="w-1/3 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 rounded-xl bg-[var(--cb-primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "সংরক্ষণ..." : "সেভ করুন"}
            </button>
          </div>
        </form>
      </div>
    </ManagerPageFrame>
  );
}
