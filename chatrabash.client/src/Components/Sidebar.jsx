import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  Receipt, 
  Settings, 
  LogOut,
  ChevronRight,
  Hotel
} from "lucide-react";

// NavItem কে Sidebar এর বাইরে ডিফাইন করা হয়েছে যাতে 'Cannot create components during render' এরর না আসে
const NavItem = ({ to, label, icon: Icon, badge, isActive }) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-6 py-4 mb-2 transition-all duration-300 group ${
      isActive(to) 
        ? 'bg-blue-600/10 border-r-4 border-blue-400 text-white' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-4">
      <Icon size={20} className={isActive(to) ? 'text-blue-400' : 'group-hover:text-white'} />
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-[10px] text-white font-black px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
    {isActive(to) && !badge && <ChevronRight size={14} className="text-blue-400" />}
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  
  let role = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role; 
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    /* h-screen এবং h-full নিশ্চিত করা হয়েছে যাতে কোনো গ্যাপ না থাকে */
    <aside className="w-72 bg-[#1A233A] h-screen flex flex-col py-8 overflow-y-auto sticky top-0 left-0">
      {/* Logo Area */}
      <div className="px-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">ছ</div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tighter">Chatrabash</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ছাত্রাবাস</p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <p className="px-8 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">মেনু</p>
        
        <nav>
          {role === "Manager" && (
            <>
              <NavItem to="/home" icon={LayoutDashboard} label="ড্যাশবোর্ড" isActive={isActive} />
              <NavItem to="/home/Pending-users" icon={Users} label="অপেক্ষমান রিকোয়েস্ট" isActive={isActive} />
              <NavItem to="/home/rooms" icon={BedDouble} label="রুম ম্যানেজমেন্ট" isActive={isActive} />
              <NavItem to="/home/billing" icon={Receipt} label="বিলিং ও পেমেন্ট" isActive={isActive} />
              <NavItem to="/home/settings" icon={Settings} label="সেটিংস" isActive={isActive} />
            </>
          )}

          {role === "SuperAdmin" && (
            <>
              <NavItem to="/home" icon={LayoutDashboard} label="Dashboard Overview" isActive={isActive} />
              <NavItem to="/home/all-hostels" icon={Hotel} label="All Hostels" isActive={isActive} />
            </>
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6 pt-6 border-t border-white/5 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>লগ আউট</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;