import React, { useState, useEffect } from "react";
import { HiCheck, HiTrash, HiUserCircle } from "react-icons/hi";

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ১. পেন্ডিং ইউজার লিস্ট ফেচ করা (Endpoint 3.1)
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await fetch("http://localhost:5091/api/manager/pending-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setPendingUsers(result.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, [token]);

  // ২. ইউজার অ্যাপ্রুভ করা (Endpoint 3.2)
  const handleApprove = async (userId, userName) => {
    const roomGuid = prompt(`ইউজার ${userName}-এর জন্য রুম আইডি (GUID) দিন:`);
    
    if (!roomGuid) {
      alert("রুম আইডি ছাড়া এপ্রুভ করা সম্ভব নয়।");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5091/api/manager/approve-user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomGuid), // এপিআই সরাসরি র স্ট্রিং চাচ্ছে
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        // লিস্ট থেকে ইউজার সরিয়ে ফেলা
        setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      } else {
        alert(result.message || "অ্যাপ্রুভাল ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      console.error("Approval Error:", error);
      alert("সার্ভারে সমস্যা হচ্ছে।");
    }
  };

  // ৩. রিকোয়েস্ট ডিক্লাইন/ডিলিট করা
  const handleDecline = (userId) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই রিকোয়েস্টটি ডিলিট করতে চান?")) {
      // এখানে এপিআই থাকলে কল করতে পারো, আপাতত লিস্ট থেকে সরিয়ে দিচ্ছি
      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      alert("রিকোয়েস্টটি সরিয়ে দেওয়া হয়েছে।");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">লোড হচ্ছে...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#001f3f]">পেন্ডিং রেজিস্ট্রেশন</h2>
            <p className="text-sm text-gray-500">নতুন স্টুডেন্টদের আবেদন রিভিউ করুন</p>
          </div>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            মোট: {pendingUsers.length}
          </span>
        </header>

        {pendingUsers.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-lg shadow">
            <p className="text-gray-400">কোনো পেন্ডিং রিকোয়েস্ট পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingUsers.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full text-gray-400">
                      <HiUserCircle size={30} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{user.displayName}</h3>
                      <p className="text-xs text-gray-500">@{user.userName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-xs">
                    <span className="font-bold text-gray-400 uppercase block">ইমেইল:</span>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-gray-400 uppercase block">নোট:</span>
                    <span className="text-gray-700 italic">
                      "{user.preferenceNote || "কোনো বিশেষ নোট নেই"}"
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(user.id, user.userName)}
                    className="flex-1 bg-[#1a8a5a] hover:bg-green-700 text-white py-2 rounded flex items-center justify-center space-x-1 text-sm font-bold transition-all"
                  >
                    <HiCheck /> <span>এপ্রুভ</span>
                  </button>
                  <button
                    onClick={() => handleDecline(user.id)}
                    className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 py-2 rounded flex items-center justify-center space-x-1 text-sm font-bold transition-all"
                  >
                    <HiTrash /> <span>ডিক্লাইন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingUsers;