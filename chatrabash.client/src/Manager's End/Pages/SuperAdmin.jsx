import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Hotel, Users, DollarSign, Search, Filter, MoreVertical } from 'lucide-react';

const SuperAdmin = () => {
  const [analytics, setAnalytics] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      try {
        // 8.1: Platform Analytics Fetch
        const analyticsRes = await fetch("http://localhost:5091/api/superadmin/analytics", { headers });
        const analyticsData = await analyticsRes.json();
        if (analyticsData.success) setAnalytics(analyticsData.data);

        // 8.2: All Registered Hostels Fetch
        const hostelsRes = await fetch("http://localhost:5091/api/superadmin/hostels", { headers });
        const hostelsData = await hostelsRes.json();
        if (hostelsData.success){
            console.log(hostelsData.data)
            setHostels(hostelsData.data);
        }

      } catch (error) {
        console.error("Data fetching failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center font-black text-slate-400 animate-pulse">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* 8.1 Platform Analytics Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Platform Analytics</h2>
          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-full uppercase tracking-widest">Live Updates</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Hostels" value={analytics?.totalHostels} icon={<Hotel size={20}/>} color="bg-blue-600" />
          <StatCard title="Active Units" value={analytics?.activeHostels} icon={<LayoutDashboard size={20}/>} color="bg-emerald-500" />
          <StatCard title="Total Boarders" value={analytics?.totalBoarders} icon={<Users size={20}/>} color="bg-purple-500" />
          <StatCard title="Monthly Revenue" value={`৳${analytics?.monthlySaaSRevenue}`} icon={<DollarSign size={20}/>} color="bg-orange-500" />
        </div>
      </section>

      {/* 8.2 Registered Hostels Table Section */}
      <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Registered Hostels</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Directory of all SaaS partners</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                <input placeholder="Search hostels..." className="pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-500 w-64"/>
             </div>
             <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-colors"><Filter size={18}/></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hostel Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manager</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subscription</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {hostels.map((hostel) => (
                <tr key={hostel.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 text-sm">{hostel.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 capitalize">{hostel.location || 'Dhaka, Bangladesh'}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{hostel.managerName || 'N/A'}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${
                      hostel.isActive 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-red-50 text-red-600'
                    }`}>
                      {hostel.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-blue-600 uppercase">{hostel.subscriptionPlan || 'Starter'}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-300 group-hover:text-slate-600 transition-colors"><MoreVertical size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Internal StatCard Component for scannability
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
    <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value || '0'}</h3>
  </div>
);

export default SuperAdmin;