import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  BedDouble 
} from 'lucide-react';

// StatCard Component (Fixed icon prop and rendering)
const StatCard = ({ title, value, color, trend, icon: Icon }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
      {/* Icon রেন্ডারিং ফিক্স করা হয়েছে */}
      <Icon size={24} className="text-current" />
    </div>
    <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-tight">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-black text-slate-800">{value}</h3>
      <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {trend > 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
        {Math.abs(trend)}%
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-current opacity-5 group-hover:opacity-20 transition-opacity"></div>
  </div>
);

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
      
      try {
        // ৩.১ এবং ৩.৩ এপিআই কল করা হচ্ছে
        const [roomsRes, usersRes] = await Promise.all([
          fetch("http://localhost:5091/api/manager/rooms", { headers }),
          fetch("http://localhost:5091/api/manager/pending-users", { headers })
        ]);

        const roomsData = await roomsRes.json();
        const usersData = await usersRes.json();
        
        if (roomsData.success) setRooms(roomsData.data || []);
        if (usersData.success) setPendingUsers(usersData.data || []);
      } catch (e) { 
        console.error("Dashboard Fetch Error:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchStats();
  }, []);

  // ডাইনামিক ক্যালকুলেশন
  const totalSeats = rooms.reduce((acc, room) => acc + (room.seatCapacity || 0), 0);
  const availableSeats = rooms.reduce((acc, room) => acc + (room.seatAvailable || 0), 0);
  const bookedSeats = totalSeats - availableSeats;

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 font-bold italic">
      লোডিং হচ্ছে, একটু অপেক্ষা করো রাইসা...
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">ড্যাশবোর্ড ওভারভিউ</h2>
          <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">
            Dashboard Overview — {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="এই মাসের মোট বিল" 
          value="৳ ১,২৫,০০০" 
          icon={Wallet} 
          color="bg-blue-50 text-blue-600" 
          trend={8.5} 
        />
        <StatCard 
          title="মোট আদায়কৃত" 
          value="৳ ১,০০,০০০" 
          icon={CheckCircle} 
          color="bg-emerald-50 text-emerald-600" 
          trend={12} 
        />
        <StatCard 
          title="মোট বকেয়া" 
          value="৳ ২৫,০০০" 
          icon={AlertCircle} 
          color="bg-red-50 text-red-600" 
          trend={-3} 
        />
        <StatCard 
          title="অপেক্ষমান রিকোয়েস্ট" 
          value={`${pendingUsers.length} Users`} 
          icon={Users} 
          color="bg-orange-50 text-orange-600" 
          trend={2} 
        />
      </div>

      {/* Room Status Section (Figma Style) */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <BedDouble size={20}/>
          </div>
          <div>
            <h3 className="font-black text-slate-800 leading-none">রুম স্ট্যাটাস</h3>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Room Availability</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-10">
          <h4 className="text-6xl font-black text-slate-800 tracking-tighter">{totalSeats}</h4>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">মোট সিট (Total Seats)</p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Booked Progress */}
          <div>
            <div className="flex justify-between mb-2 text-[10px] font-black uppercase">
              <span className="text-blue-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"/> বুকড (Booked)
              </span>
              <span className="text-slate-400">{bookedSeats} / {totalSeats}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${totalSeats > 0 ? (bookedSeats/totalSeats)*100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Available Progress */}
          <div>
            <div className="flex justify-between mb-2 text-[10px] font-black uppercase">
              <span className="text-emerald-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"/> খালি আছে (Available)
              </span>
              <span className="text-slate-400">{availableSeats} / {totalSeats}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${totalSeats > 0 ? (availableSeats/totalSeats)*100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;