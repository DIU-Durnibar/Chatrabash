import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";
import { HiOutlineOfficeBuilding } from "react-icons/hi";


const Navbar = () => {

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">

        {/* Brand */}
        <div className="flex gap-3">
          <div className="bg-blue-700 text-white p-1.5 rounded-lg">
            <HiOutlineOfficeBuilding size={24} />
        </div>
        <Link to="/home" className="text-2xl font-bold text-blue-700">
          Chatrabash-ছাত্রাবাস
        </Link>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <NavLink to="/home" className="nav-link">Home</NavLink>
          <NavLink to="/hostels" className="nav-link">Hostels</NavLink>
          <NavLink to="/students" className="nav-link">Students</NavLink>
          <NavLink to="/staff" className="nav-link">Staff</NavLink>
          <NavLink to="/pricing" className="nav-link">Pricing</NavLink>
        </nav>

        {/* User Section */}
        
          <Link to="/signIn">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150">
              সাইন ইন
            </button>
          </Link>
      </div>
    </header>
  );
};

export default Navbar;
