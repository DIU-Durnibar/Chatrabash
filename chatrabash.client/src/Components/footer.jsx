// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-12">
  <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
    
    {/* Left Section */}
    <div className="text-center md:text-left">
      <BrandLogo to="/home" className="justify-center md:justify-start" imgClassName="max-w-[12rem]" />
      <p className="text-sm mt-3 max-w-md">
        A smart SaaS hostel management system helping hostels manage
        student fees, billing, staff payments, and daily operations efficiently.
      </p>
      <p className="text-xs mt-2 text-gray-500">
        © {new Date().getFullYear()} ছাত্রাবাস.কম। সর্বস্বত্ব সংরক্ষিত।
      </p>
    </div>

    {/* Right Section */}
    <div className="flex flex-col items-center md:items-end">
      
      {/* Navigation Links */}
      <div className="space-x-5 text-sm font-medium">
        <Link to="/privacy" className="hover:text-blue-600 transition">
          Privacy
        </Link>
        <Link to="/terms" className="hover:text-blue-600 transition">
          Terms
        </Link>
        <Link to="/contact" className="hover:text-blue-600 transition">
          Contact
        </Link>
      </div>

      {/* Support Info */}
      <p className="text-xs text-gray-500 mt-2">
        Support: support@chatrabash.com
      </p>
    </div>

  </div>
</footer>

  );
};

export default Footer;
