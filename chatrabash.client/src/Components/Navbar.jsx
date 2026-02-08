// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* Sticky Navbar */}
       <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-700">Chatrabash-ছাত্রাবাস</h1>
          <nav className="space-x-4">
            <Link to="/home" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/hostels" className="text-gray-700 hover:text-blue-600">Hostels</Link>
            <Link to="/students" className="text-gray-700 hover:text-blue-600">Students</Link>
            <Link to="/staff" className="text-gray-700 hover:text-blue-600">Staff</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
          </nav>

          <Link to={`/signIn`}>
         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold 
  hover:bg-blue-700 
  active:scale-95 
  active:shadow-inner 
  transition-all duration-150">
    সাইন ইন
  </button>
</Link>


        </div>
      </header>

      {/* Spacer (VERY IMPORTANT) */}
      {/* <div className=""></div> */}
    </>
  );
};

export default Navbar;
