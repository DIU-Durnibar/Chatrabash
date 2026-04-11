<<<<<<< Updated upstream
import React, { useState } from "react";
import { X, Bed, CheckCircle2 } from "lucide-react";

const CreateRoom = ({ isOpen, onClose, refresh }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    roomNumber: "",
    floorNo: "",
    seatCapacity: "",
=======
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
>>>>>>> Stashed changes
    isAttachedBathroomAvailable: false,
    isBalconyAvailable: false,
    isAcAvailable: false,
    isActive: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
=======
    if (!localStorage.getItem("token")) {
      alert("সেশন শেষ — আবার লগইন করুন।");
      return;
    }

    const rent = Number(form.monthlyRent);
    if (Number.isNaN(rent) || rent < 0) {
      alert("সঠিক রুম ভাড়া (মাসিক) দিন।");
      return;
    }

    const estRaw = form.estimatedMonthlyCost.trim();
    const est = estRaw === "" ? null : Number(estRaw);
    if (estRaw !== "" && (Number.isNaN(est) || est < 0)) {
      alert("আনুমানিক ব্যয় সঠিক সংখ্যায় দিন বা খালি রাখুন।");
      return;
    }

>>>>>>> Stashed changes
    setLoading(true);
    const payload = {
<<<<<<< Updated upstream
      ...formData,
      floorNo: parseInt(formData.floorNo),
      seatCapacity: parseInt(formData.seatCapacity),
    };
=======
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream

      const result = await response.json();
      if (result.success) {
        alert("রুম সফলভাবে তৈরি হয়েছে!");
        refresh();
        onClose();
      } else {
        alert(result.message || "এরর হয়েছে!");
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    } finally {
      setLoading(false);
=======
    } else {
      alert(json?.message || "রুম তৈরি ব্যর্থ।");
>>>>>>> Stashed changes
    }
  };

  if (!isOpen) return null;

  return (
<<<<<<< Updated upstream
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* মেইন কন্টেইনারে flex flex-col এবং h-11/12 ব্যবহার করা হয়েছে */}
      <div className="bg-white w-full max-w-lg rounded-[32px] h-11/12 flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300 shadow-2xl">
        
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-8 text-white relative flex-shrink-0">
          <button onClick={onClose} className="absolute right-6 top-6 text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Bed size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">নতুন রুম যুক্ত করুন</h2>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">API 3.4 — Create / Update Room</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">রুম নম্বর *</label>
              <input 
                required type="text" placeholder="যেমন: ১০১, A-২"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                value={formData.roomNumber}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">তলা *</label>
              <select 
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold appearance-none"
                value={formData.floorNo}
                onChange={(e) => setFormData({...formData, floorNo: e.target.value})}
              >
                <option value="">সিলেক্ট করুন</option>
                {[1,2,3,4,5,6,7,8,9,10].map(f => <option key={f} value={f}>{f}ম তলা</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">সিট সংখ্যা *</label>
            <input 
              required type="number" placeholder="১-২০"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
              value={formData.seatCapacity}
              onChange={(e) => setFormData({...formData, seatCapacity: e.target.value})}
            />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase ml-1">সুযোগ-সুবিধা (Amenities)</label>
             <div className="space-y-2">
                {[
                  { label: "AC / এয়ার কন্ডিশনার", key: "isAcAvailable" },
                  { label: "সংযুক্ত বাথরুম", key: "isAttachedBathroomAvailable" },
                  { label: "বারান্দা", key: "isBalconyAvailable" },
                  { label: "ওয়াইফাই (WiFi)", key: "isWifiAvailable" }, // এক্সট্রা কিছু সুবিধা ডিজাইন ম্যাপ করতে
                  { label: "জেনারেল জেনারেটর", key: "isPowerBackupAvailable" }
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                    <input 
                      type="checkbox" className="w-5 h-5 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                      checked={formData[item.key] || false}
                      onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                    />
                  </label>
                ))}
             </div>
=======
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
>>>>>>> Stashed changes
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

        {/* Fixed Footer Buttons */}
        <div className="p-8 border-t border-slate-50 bg-white flex-shrink-0 flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors">বাতিল করুন</button>
             <button 
              onClick={handleSubmit} // বাটনটি এখন ফর্মের বাইরে আসায় এক্সপ্লিসিটলি কল করা হয়েছে
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
             >
               <CheckCircle2 size={18} /> {loading ? "সেভ হচ্ছে..." : "রুম সেট করুন"}
             </button>
        </div>
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
