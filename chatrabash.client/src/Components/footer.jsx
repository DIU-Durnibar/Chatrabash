// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-12 border-t">
  <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
    
    {/* Left Section */}
    <div className="text-center md:text-left">
      <h2 className="font-semibold text-lg text-blue-700">
        Chatrabash-ছাত্রাবাস
      </h2>
      <p className="text-sm mt-1 max-w-md">
        A smart SaaS hostel management system helping hostels manage
        student fees, billing, staff payments, and daily operations efficiently.
      </p>
      <p className="text-xs mt-2 text-gray-500">
        © {new Date().getFullYear()} Chatrabash. All rights reserved.
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
