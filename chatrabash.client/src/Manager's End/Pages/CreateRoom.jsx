import React, { useState } from "react";
import { X, Bed, CheckCircle2 } from "lucide-react";

const CreateRoom = ({ isOpen, onClose, refresh }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    roomNumber: "",
    floorNo: "",
    seatCapacity: "",
    isAttachedBathroomAvailable: false,
    isBalconyAvailable: false,
    isAcAvailable: false,
    isActive: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      floorNo: parseInt(formData.floorNo),
      seatCapacity: parseInt(formData.seatCapacity),
    };

    try {
      const response = await fetch("http://localhost:5091/api/manager/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

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
    }
  };

  if (!isOpen) return null;

  return (
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
          </div>
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
    </div>
  );
};

export default CreateRoom;