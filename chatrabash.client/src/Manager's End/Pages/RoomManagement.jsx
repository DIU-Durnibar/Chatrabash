import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Bed, Bath, Wind, Monitor, Edit2, Trash2 } from 'lucide-react';
import CreateRoom from './CreateRoom'; // Modal Component
import UpdateRoom from './UpdateRoom';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleUpdateClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsUpdateModalOpen(true);
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5091/api/manager/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) setRooms(result.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[12px] shadow-xs border border-slate-50">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">রুম ম্যানেজমেন্ট</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} strokeWidth={3} /> নতুন রুম যুক্ত করুন
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-slate-50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="রুম নম্বর খুঁজুন..." className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">সব রুম</button>
          <button className="px-4 py-2 bg-white text-slate-500 rounded-xl text-xs font-bold border border-slate-100">AC</button>
          <button className="px-4 py-2 bg-white text-slate-500 rounded-xl text-xs font-bold border border-slate-100">Non-AC</button>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Bed size={24}/></div>
          <div><p className="text-2xl font-black text-slate-800">{rooms.length}</p><p className="text-[10px] font-bold text-slate-400 uppercase">মোট রুম</p></div>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-[32px] border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Bed size={24}/></div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">রুম {room.roomNumber}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{room.floorNo}ম তলা</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black ${room.isAcAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  {room.isAcAvailable ? 'AC' : 'Non-AC'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-slate-400">সিট: {room.seatCapacity}টি</span>
                    <span className={room.seatAvailable === 0 ? 'text-red-500' : 'text-emerald-500'}>
                        {room.seatAvailable === 0 ? 'পূর্ণ' : `${room.seatAvailable}টি খালি`}
                    </span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all" style={{ width: `${((room.seatCapacity - room.seatAvailable) / room.seatCapacity) * 100}%` }}></div>
                 </div>
              </div>

              {/* Amenities */}
<div className="flex flex-wrap gap-3 mb-6">
  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold ${room.isAcAvailable ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300'}`}>
    <Wind size={14} strokeWidth={2.5} />
    <span>এসি</span>
  </div>

  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold ${room.isAttachedBathroomAvailable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
    <Bath size={14} strokeWidth={2.5} />
    <span>সংযুক্ত বাথরুম</span>
  </div>

  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold ${room.isBalconyAvailable ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300'}`}>
    <Monitor size={14} strokeWidth={2.5} />
    <span>বারান্দা</span>
  </div>
</div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${room.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{room.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                 </div>
                 <div className="flex gap-2">
                   <button 
        onClick={() => handleUpdateClick(room.id)}
        className="p-2 text-blue-950 hover:bg-blue-50 rounded-lg transition-colors flex justify-center items-center gap-1 bg-blue-200 text-xs"
      >
        আপডেট <Edit2 size={16}/>
      </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {isModalOpen && <CreateRoom isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refresh={fetchRooms} />}

      {isUpdateModalOpen && (
        <UpdateRoom
          isOpen={isUpdateModalOpen} 
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedRoomId(null);
          }} 
          refresh={fetchRooms} 
          roomId={selectedRoomId} 
        />
      )}
    </div>
  );
};

export default RoomManagement;