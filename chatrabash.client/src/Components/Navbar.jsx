import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const Navbar = () => {
  const token = localStorage.getItem("token");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex justify-between items-center py-4 px-6">
        <BrandLogo to="/home" imgClassName="max-w-[13rem]" />
       
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