import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const Navbar = () => {
  const token = localStorage.getItem("token");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex gap-3">
          <div className="bg-blue-700 text-white p-1.5 rounded-lg">
            <HiOutlineOfficeBuilding size={24} />
          </div>
          <Link to="/home" className="text-2xl font-bold text-blue-700">
            Chatrabash-ছাত্রাবাস
          </Link>
        </div>
       
        {!token && (
          <Link to="/signIn">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150">
              সাইন ইন
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;