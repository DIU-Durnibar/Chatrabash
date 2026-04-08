import React from "react";
import { NavLink } from "react-router-dom";
import { 
  HiOutlineHome, 
  HiOutlineOfficeBuilding, 
  HiOutlineUsers, 
  HiOutlinePlusCircle,
  HiOutlineLogout 
} from "react-icons/hi"; 

const Sidebar = () => {
  
  const userEmail = localStorage.getItem("userEmail");
  const isManager = userEmail === "khaled@test.com";

  const handleSignOut = () => {
    localStorage.clear(); 
    window.location.href = "/signIn"; // লগআউটের সময়ও রিফ্রেশ হবে
  };

  const navLinkStyles = ({ isActive }) => {
    return `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? "bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-700 shadow-sm" 
        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 min-h-screen pt-10">
      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/home" className={navLinkStyles} end>
          <HiOutlineHome size={20} />
          <span>হোম</span>
        </NavLink>

        {isManager && (
          <>
            <div className="pt-4 pb-1 px-4 text-[16px] font-bold text-blue-900 uppercase">ম্যানেজমেন্ট</div>
            <NavLink to="/home/pending-users" className={navLinkStyles}>
              <HiOutlineUsers size={20} />
              <span>পেন্ডিং ইউজার</span>
            </NavLink>
            <NavLink to="/home/rooms" className={navLinkStyles}>
              <HiOutlineOfficeBuilding size={20} />
              <span>হোস্টেল রুমস</span>
            </NavLink>
            <NavLink to="/home/create-room" className={navLinkStyles}>
              <HiOutlinePlusCircle size={20} />
              <span>রুম তৈরি করুন</span>
            </NavLink>
          </>
        )}

        <NavLink to="/home/availablehostels" className={navLinkStyles}>
          <HiOutlineOfficeBuilding size={20} />
          <span>সব হোস্টেল</span>
        </NavLink>


        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-bold"
          >
            <HiOutlineLogout size={20} />
            <span>সাইন আউট</span>
          </button>
        </div>
      </nav>

      
    </aside>
  );
};

export default Sidebar;