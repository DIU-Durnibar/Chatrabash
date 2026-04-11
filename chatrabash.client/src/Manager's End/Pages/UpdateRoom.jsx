<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import { X, Bed, CheckCircle2, RefreshCcw } from "lucide-react";

const UpdateRoom = ({ isOpen, onClose, refresh, roomId }) => {
=======
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { apiGet, apiPut } from "../../lib/api";
import ManagerPageFrame from "../../layouts/ManagerPageFrame";

export default function UpdateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // নির্দিষ্ট রুমের ডাটা ফেচ করা (Endpoint 3.5 এর জন্য প্রস্তুতি)
  useEffect(() => {
    if (isOpen && roomId) {
      const fetchRoomDetails = async () => {
        setFetching(true);
        try {
          const response = await fetch(`http://localhost:5091/api/manager/rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await response.json();
          if (result.success) {
            setFormData({
              roomNumber: result.data.roomNumber || "",
              floorNo: result.data.floorNo || "",
              seatCapacity: result.data.seatCapacity || "",
              isAttachedBathroomAvailable: result.data.isAttachedBathroomAvailable ?? false,
              isBalconyAvailable: result.data.isBalconyAvailable ?? false,
              isAcAvailable: result.data.isAcAvailable ?? false,
              isActive: result.data.isActive ?? true,
            });
          }
        } catch (error) {
          console.error("Error fetching room:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchRoomDetails();
    }
  }, [isOpen, roomId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      floorNo: parseInt(formData.floorNo),
      seatCapacity: parseInt(formData.seatCapacity),
    };

    try {
      const response = await fetch(`http://localhost:5091/api/manager/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("রুম সফলভাবে আপডেট হয়েছে!");
        refresh();
        onClose();
=======
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
>>>>>>> Stashed changes
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
    const estRaw = form.estimatedMonthlyCost.trim();
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

<<<<<<< Updated upstream
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] h-11/12 flex flex-col overflow-hidden border border-slate-100 shadow-2xl animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-8 text-white relative flex-shrink-0">
          <button onClick={onClose} className="absolute right-6 top-6 text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <RefreshCcw size={24} className={fetching ? "animate-spin" : ""} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">রুম আপডেট করুন</h2>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Room ID: {roomId?.slice(-6)}</p>
            </div>
          </div>
        </div>

        {fetching ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">ডাটা লোড হচ্ছে...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">রুম নম্বর</label>
                <input 
                  required type="text"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">তলা</label>
                <input 
                  required type="number"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  value={formData.floorNo}
                  onChange={(e) => setFormData({...formData, floorNo: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">সিট সংখ্যা</label>
              <input 
                required type="number"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                value={formData.seatCapacity}
                onChange={(e) => setFormData({...formData, seatCapacity: e.target.value})}
              />
            </div>

            {/* Amenities Boxes */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase ml-1">সুযোগ-সুবিধা</label>
               <div className="space-y-2">
                  {[
                    { label: "AC / এয়ার কন্ডিশনার", key: "isAcAvailable" },
                    { label: "সংযুক্ত বাথরুম", key: "isAttachedBathroomAvailable" },
                    { label: "বারান্দা", key: "isBalconyAvailable" },
                    { label: "রুমটি অ্যাক্টিভ রাখুন", key: "isActive", color: "text-emerald-600" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                      <span className={`text-sm font-bold ${item.color || "text-slate-600"}`}>{item.label}</span>
                      <input 
                        type="checkbox" className="w-5 h-5 rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData[item.key]}
                        onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                      />
                    </label>
                  ))}
               </div>
=======
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
>>>>>>> Stashed changes
            </div>
          </form>
        )}

<<<<<<< Updated upstream
        {/* Footer */}
        <div className="p-8 border-t border-slate-50 bg-white flex-shrink-0 flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors">বাতিল</button>
             <button 
              onClick={handleSubmit}
              disabled={loading || fetching}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
             >
               <CheckCircle2 size={18} /> {loading ? "আপডেট হচ্ছে..." : "পরিবর্তন সেভ করুন"}
             </button>
        </div>
=======
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
>>>>>>> Stashed changes
      </div>
    </ManagerPageFrame>
  );
}
