import React from "react";
import { NavLink } from "react-router-dom";
import { 
  HiOutlineHome, 
  HiOutlineOfficeBuilding, 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineTag 
} from "react-icons/hi"; 

const Sidebar = () => {

  // অ্যাক্টিভ লিংকের স্টাইল ফাংশন
  const navLinkStyles = ({ isActive }) => {
    return `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? "bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-700 shadow-sm" 
        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 min-h-screen overflow-y-auto pt-10">
      
      <nav className="flex-1 px-4 space-y-2">
        
        <NavLink to="/home" className={navLinkStyles} end>
          <HiOutlineHome size={20} />
          <span>হোম</span>
        </NavLink>

        <NavLink to="/home/availablehostels" className={navLinkStyles}>
          <HiOutlineOfficeBuilding size={20} />
          <span>সব হোস্টেল</span>
        </NavLink>

        <NavLink to="/home/students" className={navLinkStyles}>
          <HiOutlineUsers size={20} />
          <span>ছাত্ররা</span>
        </NavLink>

        <NavLink to="/home/staff" className={navLinkStyles}>
          <HiOutlineUserGroup size={20} />
          <span>স্টাফ</span>
        </NavLink>

        <NavLink to="/home/pricing" className={navLinkStyles}>
          <HiOutlineTag size={20} />
          <span>প্রাইসিং</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;