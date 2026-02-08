import React, { useState } from "react";

const dummyStudents = [
  {
    id: 1,
    name: "রাহিম উদ্দিন",
    email: "rahim@example.com",
    hostel: "A.H. Hostel",
    room: "101",
    status: "Active",
  },
  {
    id: 2,
    name: "সারা ইসলাম",
    email: "sara@example.com",
    hostel: "Younic Home",
    room: "202",
    status: "Inactive",
  },
  {
    id: 3,
    name: "আফ্রোজা খাতুন",
    email: "afroza@example.com",
    hostel: "Afroza Girls Hostel",
    room: "303",
    status: "Active",
  },
];

const StudentDashboard = () => {
  const [students] = useState(dummyStudents);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white min-h-screen p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8">Chatrabash</h1>
        <nav className="flex flex-col space-y-4">
          {["হোম", "ছাত্র ব্যবস্থাপনা", "হোস্টেল তথ্য", "রিপোর্ট", "সেটিংস"].map((item, i) => (
            <button
              key={i}
              className="text-left hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">ছাত্র ব্যবস্থাপনা</h2>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition-all active:scale-95">
            নতুন ছাত্র যোগ করুন
          </button>
        </div>

        {/* Student Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition relative"
            >
              <h3 className="text-lg font-semibold text-blue-700">{student.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{student.email}</p>
              <p className="text-gray-600 text-sm mt-1">
                হোস্টেল: <span className="font-medium">{student.hostel}</span>
              </p>
              <p className="text-gray-600 text-sm mt-1">
                রুম: <span className="font-medium">{student.room}</span>
              </p>
              <span
                className={`inline-block px-3 py-1 mt-2 rounded-full text-xs font-semibold ${
                  student.status === "Active"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {student.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </span>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <button className="flex-1 bg-blue-100 text-blue-700 py-1.5 rounded-lg font-medium hover:bg-blue-200 transition">
                  সম্পাদনা
                </button>
                <button className="flex-1 bg-red-100 text-red-700 py-1.5 rounded-lg font-medium hover:bg-red-200 transition">
                  মুছে ফেলুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
