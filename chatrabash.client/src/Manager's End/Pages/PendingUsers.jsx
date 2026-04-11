import React, { useState, useEffect } from "react";
import { Check, X, User, Clock, MessageSquare, ChevronRight } from "lucide-react";

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await fetch("http://localhost:5091/api/manager/pending-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) setPendingUsers(result.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, [token]);

  const handleApprove = async (userId, userName) => {
    const roomGuid = prompt(`বোর্ডার "${userName}"-এর জন্য রুম আইডি (GUID) দিন:`);
    if (!roomGuid) return;

    try {
      const response = await fetch(`http://localhost:5091/api/manager/approve-user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomGuid),
      });

      const result = await response.json();
      if (result.success) {
        setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      } else {
        alert(result.message || "অ্যাপ্রুভাল ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      alert("সার্ভারে সমস্যা হচ্ছে।");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 font-bold italic animate-pulse">
      রিকোয়েস্টগুলো চেক করছি...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">পেন্ডিং রেজিস্ট্রেশন</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Pending Approvals</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <span className="text-xs font-black text-slate-500 uppercase">মোট পেন্ডিং:</span>
          <span className="text-lg font-black text-blue-600">{pendingUsers.length}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">বোর্ডার</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">পছন্দের রুম ও নোট</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-8 py-20 text-center text-slate-300 font-bold italic">
                  সব রিকোয়েস্ট ক্লিয়ার! কোনো পেন্ডিং আবেদন নেই।
                </td>
              </tr>
            ) : (
              pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-sm group-hover:scale-110 transition-transform">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm leading-tight">{user.displayName}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-2 border border-blue-100/50">
                        <MessageSquare size={12} /> {user.preferenceNote || "কোনো বিশেষ পছন্দ নেই"}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleApprove(user.id, user.userName)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-sm shadow-emerald-200 transition-all hover:-translate-y-0.5"
                      >
                        <Check size={14} /> এপ্রুভ করুন
                      </button>
                      <button
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Footer info box */}
        <div className="bg-slate-50/50 p-6 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 font-bold text-center italic">
                * এপ্রুভ করার সময় রুম আইডি সঠিকভাবে ইনপুট দিন।
            </p>
        </div>
      </div>
    </div>
  );
};

export default PendingUsers;