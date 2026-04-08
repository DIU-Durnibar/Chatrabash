import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineRefresh } from "react-icons/hi";

const UpdateRoom = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
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

  // ১. রুমের বর্তমান ডাটা এপিআই থেকে আনা
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5091/api/manager/rooms/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) {
          // এখানে ডাটা Destructure করা হয়েছে যাতে ফর্মে ঠিকমতো বসে
          const { 
            roomNumber, 
            floorNo, 
            seatCapacity, 
            isAttachedBathroomAvailable, 
            isBalconyAvailable, 
            isAcAvailable, 
            isActive 
          } = result.data;

          setFormData({
            roomNumber: roomNumber || "",
            floorNo: floorNo || "",
            seatCapacity: seatCapacity || "",
            isAttachedBathroomAvailable: isAttachedBathroomAvailable ?? false,
            isBalconyAvailable: isBalconyAvailable ?? false,
            isAcAvailable: isAcAvailable ?? false,
            isActive: isActive ?? true,
          });
        } else {
          alert("রুমের তথ্য পাওয়া যায়নি!");
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchRoomDetails();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      roomNumber: formData.roomNumber,
      floorNo: parseInt(formData.floorNo),
      seatCapacity: parseInt(formData.seatCapacity),
      isAttachedBathroomAvailable: formData.isAttachedBathroomAvailable,
      isBalconyAvailable: formData.isBalconyAvailable,
      isAcAvailable: formData.isAcAvailable,
      isActive: formData.isActive,
    };

    try {
      const response = await fetch(`http://localhost:5091/api/manager/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("রুম সফলভাবে আপডেট হয়েছে!");
        navigate("/home/rooms"); 
      } else {
        alert(result.message || "আপডেট করা সম্ভব হয়নি।");
      }
    } catch (error) {
      alert("সার্ভার কানেকশন এরর!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center font-bold">ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start font-medium font-sans">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200">
        
        {/* হেডার */}
        <div className="bg-[#001f3f] p-6 text-white flex items-center gap-3">
          <HiOutlineRefresh size={30} className={loading ? "animate-spin" : ""} />
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider">রুম তথ্য আপডেট</h2>
            <p className="text-xs text-blue-100 opacity-80 underline">ID: {id}</p>
          </div>
        </div>

        {/* ফর্ম */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="form-control">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">রুম নম্বর</label>
              <input
                type="text"
                required
                className="input input-bordered h-10 rounded-sm focus:border-[#001f3f] border border-gray-300 pl-3"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">ফ্লোর নম্বর</label>
              <input
                type="number"
                required
                className="input input-bordered h-10 rounded-sm focus:border-[#001f3f] border border-gray-300 pl-3"
                value={formData.floorNo}
                onChange={(e) => setFormData({ ...formData, floorNo: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">সিট ক্ষমতা</label>
              <input
                type="number"
                required
                className="input input-bordered h-10 rounded-sm focus:border-[#001f3f] border border-gray-300 pl-3"
                value={formData.seatCapacity}
                onChange={(e) => setFormData({ ...formData, seatCapacity: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold text-gray-500 uppercase mr-3">অ্যাটাচড বাথরুম?</label>
              <select
                 className="select select-bordered h-10 min-h-0 rounded-sm border border-gray-300 px-3"
                 value={formData.isAttachedBathroomAvailable}
                 onChange={(e) => setFormData({ ...formData, isAttachedBathroomAvailable: e.target.value === "true" })}
              >
                <option value="false">না</option>
                <option value="true">হ্যাঁ</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 bg-slate-100 p-4 rounded-sm border border-slate-200">
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
              <span className="text-sm font-bold text-green-700">রুমটি অ্যাক্টিভ রাখুন</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/home/rooms")}
              className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-sm font-bold uppercase transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-2/3 bg-[#001f3f] hover:bg-blue-900 text-white py-3 rounded-sm font-bold uppercase tracking-widest transition-all shadow-md ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "আপডেট হচ্ছে..." : "পরিবর্তন সেভ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoom;