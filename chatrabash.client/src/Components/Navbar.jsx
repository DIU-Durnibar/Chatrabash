import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import "./Navbar.css";

const Navbar = () => {
  const { user, handleSignOut } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">

        {/* Brand */}
        <Link to="/home" className="text-2xl font-bold text-blue-700">
          Chatrabash-ছাত্রাবাস
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <NavLink to="/home" className="nav-link">Home</NavLink>
          <NavLink to="/hostels" className="nav-link">Hostels</NavLink>
          <NavLink to="/students" className="nav-link">Students</NavLink>
          <NavLink to="/staff" className="nav-link">Staff</NavLink>
          <NavLink to="/pricing" className="nav-link">Pricing</NavLink>
        </nav>

        {/* User Section */}
        {user?.email ? (
          <div className="flex items-center gap-4">

            {/* Profile Info */}
            <div className="flex items-center gap-3">

              <img
                src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-blue-600"
              />

              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-800">
                  {user?.displayName || "User"}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.email}
                </span>
              </div>

            </div>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150"
            >
              Logout
            </button>

          </div>
        ) : (
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
