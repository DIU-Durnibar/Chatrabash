import { Outlet, useParams } from "react-router-dom";
import { LayoutDashboard, Users, DoorOpen, CreditCard, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLayout = () => {
  const { managerId } = useParams();

  const menuItems = [
    { name: 'ড্যাশবোর্ড', icon: <LayoutDashboard size={20}/>, path: `/admin/${managerId}` },
    { name: 'পেন্টিং মেম্বার', icon: <Users size={20}/>, path: `/admin/pending-users` },
    { name: 'রুম ম্যানেজমেন্ট', icon: <DoorOpen size={20}/>, path: `/admin/rooms` },
    { name: 'বিলিং রিপোর্ট', icon: <CreditCard size={20}/>, path: `/admin/billing` },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col">
        <div className="text-2xl font-black text-blue-600 mb-10">Chatrabash</div>
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 p-3 text-slate-600 font-bold hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-sm">
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
        <button className="p-3 text-red-500 font-bold text-sm flex items-center gap-3">
            লগআউট
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;