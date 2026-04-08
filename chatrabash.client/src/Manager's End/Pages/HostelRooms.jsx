import React, { useState, useEffect } from "react";
import { HiOutlineOfficeBuilding, HiOutlineCheckCircle, HiOutlineXCircle, HiEye, HiClipboardCopy } from "react-icons/hi";

const HostelRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRoomIds, setVisibleRoomIds] = useState({}); // রুম আইডি দেখানোর স্টেট
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5091/api/manager/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) setRooms(result.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [token]);

  // আইডি দেখানো বা লুকানোর ফাংশন
  const toggleRoomId = (roomId) => {
    setVisibleRoomIds(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };

  // আইডি কপি করার ফাংশন
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    alert("রুম আইডি কপি করা হয়েছে!");
  };

  if (loading) return <div className="p-10 text-center font-bold text-blue-900">রুম ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#001f3f] flex items-center gap-2">
              <HiOutlineOfficeBuilding /> হোস্টেল রুম ইনভেন্টরি
            </h2>
            <p className="text-2xl text-green-700 uppercase tracking-wider mt-1 pt-4 font-bold">Chatrabash Super Hostel</p>
          </div>
        </header>

        <div className="bg-white shadow-sm rounded-sm overflow-hidden border border-gray-200">
          <table className="table w-full border-collapse">
            <thead className="bg-[#001f3f] text-white uppercase text-[11px] tracking-widest">
              <tr>
                <th className="p-4 text-left">ফ্লোর</th>
                <th className="p-4 text-left">রুম ও আইডি</th>
                <th className="p-4 text-center">সিট ক্ষমতা</th>
                <th className="p-4 text-center">ফাঁকা সিট</th>
                <th className="p-4 text-center">এসি সুবিধা</th>
                <th className="p-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-black">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-gray-500">{room.floorNo} তলা</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-blue-700 font-extrabold text-base">রুম: {room.roomNumber}</span>
                      {visibleRoomIds[room.id] && (
                        <div className="flex items-center gap-2 animate-fade-in">
                          <code className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600 border border-gray-200">
                            {room.id}
                          </code>
                          <button onClick={() => copyToClipboard(room.id)} title="আইডি কপি করুন">
                            <HiClipboardCopy className="text-blue-500 hover:text-blue-700 cursor-pointer" size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center font-semibold">{room.seatCapacity} জন</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.seatAvailable > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {room.seatAvailable} টি বাকি
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {room.isAcAvailable ? (
                      <span className="text-green-600 font-bold flex justify-center items-center gap-1"><HiOutlineCheckCircle /> আছে</span>
                    ) : (
                      <span className="text-gray-300 flex justify-center items-center gap-1"><HiOutlineXCircle /> নেই</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleRoomId(room.id)}
                      className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50 flex items-center gap-1 mx-auto"
                    >
                      <HiEye size={14} /> {visibleRoomIds[room.id] ? "আইডি লুকান" : "রুম আইডি দেখুন"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostelRooms;