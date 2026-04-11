import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { apiPost } from "../../lib/api";
import ManagerPageFrame from "../../layouts/ManagerPageFrame";

export default function CreateRoom() {
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      alert("সেশন শেষ — আবার লগইন করুন।");
      return;
    }

    const rent = Number(form.monthlyRent);
    if (Number.isNaN(rent) || rent < 0) {
      alert("সঠিক রুম ভাড়া (মাসিক) দিন।");
      return;
    }

    const estRaw = String(form.estimatedMonthlyCost ?? "").trim();
    const est = estRaw === "" ? null : Number(estRaw);
    if (estRaw !== "" && (Number.isNaN(est) || est < 0)) {
      alert("আনুমানিক ব্যয় সঠিক সংখ্যায় দিন বা খালি রাখুন।");
      return;
    }

    setLoading(true);
    const payload = {
      roomNumber: form.roomNumber,
      floorNo: parseInt(form.floorNo, 10),
      seatCapacity: parseInt(form.seatCapacity, 10),
      monthlyRent: rent,
      estimatedMonthlyCost: est,
      isAttachedBathroomAvailable: !!form.isAttachedBathroomAvailable,
      isBalconyAvailable: !!form.isBalconyAvailable,
      isAcAvailable: form.isAcAvailable,
      isActive: form.isActive,
    };

    const { ok, json } = await apiPost("/api/manager/rooms", payload);
    setLoading(false);

    if (ok && json?.success) {
      alert(json.message || "রুম তৈরি হয়েছে!");
      setForm({
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
    } else {
      alert(json?.message || "রুম তৈরি ব্যর্থ।");
    }
  };

  return (
    <ManagerPageFrame
      title="নতুন রুম যোগ করুন"
      subtitle="রুম ভাড়া বিলিংয়ে ব্যবহৃত হবে; আনুমানিক ব্যয় শুধু তালিকা ও বিস্তারিত পেজে দেখাবে"
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--cb-primary)] to-[var(--cb-secondary)] px-6 py-5 text-white">
          <PlusCircle className="h-9 w-9 shrink-0 opacity-95" />
          <div>
            <h2 className="text-lg font-bold">রুমের তথ্য</h2>
            <p className="text-xs text-white/85">সিট প্রতি মাসিক রুম ভাড়া অবশ্যই দিন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="রুম নম্বর"
              value={form.roomNumber}
              onChange={(v) => setForm({ ...form, roomNumber: v })}
              placeholder="যেমন: ১০৫"
              required
            />
            <Field
              label="ফ্লোর"
              type="number"
              value={form.floorNo}
              onChange={(v) => setForm({ ...form, floorNo: v })}
              placeholder="০"
              required
            />
            <Field
              label="সিট ক্ষমতা"
              type="number"
              value={form.seatCapacity}
              onChange={(v) => setForm({ ...form, seatCapacity: v })}
              placeholder="৪"
              required
            />
            <Field
              label="রুম ভাড়া (মাসিক, প্রতি সিট) ৳"
              type="number"
              min={0}
              step="0.01"
              value={form.monthlyRent}
              onChange={(v) => setForm({ ...form, monthlyRent: v })}
              placeholder="৫০০০"
              required
            />
            <div className="sm:col-span-2">
              <Field
                label="আনুমানিক মোট মাসিক ব্যয় ৳ (ঐচ্ছিক)"
                type="number"
                min={0}
                step="0.01"
                value={form.estimatedMonthlyCost}
                onChange={(v) => setForm({ ...form, estimatedMonthlyCost: v })}
                placeholder="খাবার+ইউটিলিটি ধরে — খালি রাখলে শুধু ভাড়া দেখাবে"
              />
              <p className="mt-1 text-xs text-slate-500">
                বোর্ডারদের জন্য আনুমানিক খরচ দেখাতে; বিলিংয়ে শুধু «রুম ভাড়া» যায়।
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <label className="mb-2 block text-xs font-bold text-slate-500">অ্যাটাচ বাথরুম</label>
            <select
              value={form.isAttachedBathroomAvailable ? "true" : "false"}
              onChange={(e) => setForm({ ...form, isAttachedBathroomAvailable: e.target.value === "true" })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="false">না</option>
              <option value="true">হ্যাঁ</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isBalconyAvailable}
                onChange={(e) => setForm({ ...form, isBalconyAvailable: e.target.checked })}
                className="rounded border-slate-300"
              />
              বারান্দা
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isAcAvailable}
                onChange={(e) => setForm({ ...form, isAcAvailable: e.target.checked })}
                className="rounded border-slate-300"
              />
              এসি
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-emerald-800">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded border-slate-300"
              />
              সক্রিয় রুম
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--cb-primary)] py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "সংরক্ষণ..." : "রুম তৈরি করুন"}
          </button>
        </form>
      </div>
    </ManagerPageFrame>
  );
}

function Field({ label, type = "text", value, onChange, ...rest }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
        {...rest}
      />
    </div>
  );
}
