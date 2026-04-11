import React, { useState, useEffect } from "react";
import { X, Bed, CheckCircle2, RefreshCcw } from "lucide-react";

const UpdateRoom = ({ isOpen, onClose, refresh, roomId }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
      } else {
        alert(result.message || "আপডেট করা সম্ভব হয়নি।");
      }
    } catch (error) {
      alert("সার্ভার কানেকশন এরর!");
    } finally {
      setLoading(false);
    }
  };

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
            </div>
          </form>
        )}

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
      </div>
    </div>
  );
};

export default UpdateRoom;