import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LanHeader = () => {

      const [activeTab, setActiveTab] = useState('registration');
    

    return (
        <div>
            {/* --- Navbar --- */}
      <nav className="flex items-center justify-between px-20 py-4 bg-white sticky top-0 z-50 shadow-sm">

        
        <div className="flex items-center gap-2">
          <div className="bg-blue-700 p-1.5 rounded-lg">
            <span className="text-white font-bold text-xl">ছা</span>
          </div>
          <span className="text-blue-900 font-bold text-2xl">ছাত্রাবাস</span>
        </div>


        <div className="hidden md:flex items-center gap-4 text-slate-600 font-medium">

  <NavLink
    to="/"
    className={({ isActive }) =>
      `px-5 py-2 rounded-md transition-all duration-300 ${
        isActive 
          ? 'bg-blue-700 text-white shadow-md' // Focused/Active state
          : 'hover:text-blue-700 hover:bg-blue-50' // Regular/Inactive state
      }`
    }
  >
    হোম
  </NavLink>


  <NavLink
    to="/availablehostels"
    className={({ isActive }) =>
      `px-5 py-2 rounded-md transition-all duration-300 ${
        isActive 
          ? 'bg-blue-700 text-white shadow-md' // Focused/Active state
          : 'hover:text-blue-700 hover:bg-blue-50' // Regular/Inactive state
      }`
    }
  >
    হোস্টেল খুঁজুন
  </NavLink>



  <NavLink
    to="/how-it-works"
    className={({ isActive }) =>
      `px-5 py-2 rounded-md transition-all duration-300 ${
        isActive 
          ? 'bg-blue-700 text-white shadow-md' 
          : 'hover:text-blue-700 hover:bg-blue-50'
      }`
    }
  >
    কিভাবে কাজ করে
  </NavLink>

  <NavLink
    to="/help"
    className={({ isActive }) =>
      `px-5 py-2 rounded-md transition-all duration-300 ${
        isActive 
          ? 'bg-blue-700 text-white shadow-md' 
          : 'hover:text-blue-700 hover:bg-blue-50'
      }`
    }
  >
    সাহায্য
  </NavLink>
</div>


        {/* Login/Registration Toggle Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('login')}
            className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 border ${
              activeTab === 'login' 
                ? 'bg-blue-700 text-white border-blue-700' // Focused State
                : 'bg-transparent text-blue-700 border-blue-700' // Unfocused State
            } hover:bg-blue-500 hover:text-white`} // Light blue hover for both
          >
            লগ-ইন
          </button>

          <button 
            onClick={() => setActiveTab('registration')}
            className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 border ${
              activeTab === 'registration'
                ? 'bg-blue-700 text-white border-blue-700' // Focused State
                : 'bg-transparent text-blue-700 border-blue-700' // Unfocused State
            } hover:bg-blue-500 hover:text-white`} // Light blue hover for both
          >
            রেজিস্ট্রেশন
          </button>
        </div>

        
      </nav>
        </div>
    );
};

export default LanHeader;