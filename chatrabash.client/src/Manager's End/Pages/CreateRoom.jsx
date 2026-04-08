import React, { useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";

const CreateRoom = () => {
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

    if (!token) {
      alert("আপনার সেশন শেষ হয়ে গেছে। দয়া করে আবার লগইন করুন।");
      return;
    }

    setLoading(true);

    const payload = {
  roomNumber: formData.roomNumber,
  floorNo: parseInt(formData.floorNo),
  seatCapacity: parseInt(formData.seatCapacity),
  isAttachedBathroomAvailable: formData.isAttachedBathroomAvailable == 1,
  isBalconyAvailable: formData.isBalconyAvailable == 1,
  isAcAvailable: formData.isAcAvailable, 
  isActive: formData.isActive,  
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

      if (response.ok && result.success) {
        alert(result.message || "রুম সফলভাবে তৈরি হয়েছে!");
        setFormData({
          roomNumber: "",
          floorNo: "",
          seatCapacity: "",
          isAttachedBathroomAvailable: 0,
          isBalconyAvailable: 0,
          isAcAvailable: false,
          isActive: true,
        });
      } else {
        alert(result.message || "রুম তৈরি করা যায়নি। রুম নম্বরটি আগে থেকেই আছে কি না চেক করুন।");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("সার্ভার কানেকশন এরর!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200">
        
        {/* হেডার */}
        <div className="bg-[#001f3f] p-6 text-white flex items-center gap-3">
          <HiOutlinePlusCircle size={30} />
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider pb-2">নতুন রুম যোগ করুন</h2>
            <p className="text-xs text-blue-100 opacity-80">হোস্টেল ইনভেন্টরিতে নতুন রুমের তথ্য প্রদান করুন</p>
          </div>
        </div>

        {/* ফর্ম বডি */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-black">
          <div className="grid grid-cols-1 gap-6">
            
            {/* রুম নম্বর */}
            <div className="form-control  justify-center items-center">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">রুম নম্বর</label>
              <input
                type="text"
                placeholder="যেমন: ১০৫"
                required
                className="input input-bordered h-10 rounded-sm focus:border-[#001f3f] border border-gray-300 pl-3"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              />
            </div>

            {/* ফ্লোর নম্বর */}
            <div className="form-control justify-center items-center">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">ফ্লোর নম্বর</label>
              <input
                type="number"
                placeholder="যেমন: ১"
                required
                className="input input-bordered h-10 rounded-sm focus:border-[#001f3f] border border-gray-300 pl-3"
                value={formData.floorNo}
                onChange={(e) => setFormData({ ...formData, floorNo: e.target.value })}
              />
            </div>

            {/* সিট ক্ষমতা */}
            <div className="form-control justify-center items-center">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">সিট ক্ষমতা (Seat Capacity)</label>
              <input
                type="number"
                placeholder="যেমন: ৪"
                required
                className="input input-bordered h-10 rounded-sm focus:border-[#001f3f] border border-gray-300 pl-3"
                value={formData.seatCapacity}
                onChange={(e) => setFormData({ ...formData, seatCapacity: e.target.value })}
              />
            </div>

            {/* অ্যাটাচড বাথরুম */}
            <div className="form-control justify-center items-center">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">অ্যাটাচড বাথরুম?</label>

              <select
                 value={formData.isAttachedBathroomAvailable}
                 onChange={(e) =>
                 setFormData({ ...formData,isAttachedBathroomAvailable: e.target.value === "true",})
                 }>
                   <option value="false">না</option>
                   <option value="true">হ্যাঁ</option>
              </select>



            </div>
          </div>

          {/* চেক বক্স এরিয়া */}
          <div className="flex flex-wrap gap-6 bg-slate-50 p-4 rounded-sm border border-slate-100">


            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={formData.isAcAvailable}
                onChange={(e) => setFormData({ ...formData, isAcAvailable: e.target.checked })}
              />
              <span className="text-sm font-semibold">এসি (AC) সুবিধা</span>
            </label>



            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="text-sm font-semibold text-green-700">রুমটি অ্যাক্টিভ করুন</span>
            </label>
          </div>



          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#1a8a5a] hover:bg-[#146e48] text-white py-3 rounded-sm font-bold uppercase tracking-widest transition-all shadow-md active:scale-[0.98] ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "সেভ হচ্ছে..." : "রুম তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;