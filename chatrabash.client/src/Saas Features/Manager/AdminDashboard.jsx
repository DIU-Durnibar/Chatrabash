import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Home, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { managerId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Analytics Fetching
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    fetch(`http://localhost:5091/api/billing/analytics?month=${currentMonth}&year=${currentYear}`)
      .then(res => res.json())
      .then(res => setAnalytics(res.data));

    // Pending Users Fetching
    fetch(`http://localhost:5091/api/manager/pending-users`)
      .then(res => res.json())
      .then(res => setPendingCount(res.data?.length || 0));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">শুভ সকাল, অ্যাডমিন! 👋</h1>
        <p className="text-slate-500 font-medium">আপনার হোস্টেলের আজকের সারসংক্ষেপ এখানে।</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="মোট বোর্ডাস" value="৪৫" icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="ফাঁকা সীট" value="১২" icon={<Home className="text-green-600" />} color="bg-green-50" />
        <StatCard title="পেন্ডিং রিকোয়েস্ট" value={pendingCount} icon={<AlertCircle className="text-orange-600" />} color="bg-orange-50" />
        <StatCard title="চলতি মাসে আয়" value={`৳${analytics?.totalPaid || 0}`} icon={<TrendingUp className="text-purple-600" />} color="bg-purple-50" />
      </div>

      {/* Layout for Table and Stats (Images you provided) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="font-black mb-6">সাম্প্রতিক পেমেন্ট হিস্ট্রি</h3>
          {/* এখানে পেমেন্ট টেবিল আসবে */}
          <div className="text-center text-slate-400 py-20 text-sm italic">ডেটা লোড হচ্ছে...</div>
        </div>
        
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="font-black mb-6">রুম স্ট্যাটাস</h3>
          {/* এখানে সার্কেল চার্ট বা রুমের লিস্ট আসবে */}
          <div className="space-y-4">
             <RoomProgress label="Floor 1" occupied={8} total={10} />
             <RoomProgress label="Floor 2" occupied={5} total={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for clean code
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
  </div>
);

const RoomProgress = ({ label, occupied, total }) => (
    <div>
        <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wide">
            <span>{label}</span>
            <span>{occupied}/{total}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${(occupied/total)*100}%` }}></div>
        </div>
    </div>
)

export default AdminDashboard;