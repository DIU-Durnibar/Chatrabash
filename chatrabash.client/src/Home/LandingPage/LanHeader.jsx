import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LanHeader = () => {
  // Initial state logic keep as it is, but updated handle for 3 buttons
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div>
      {/* --- Navbar --- */}
      <nav className="flex items-center justify-between px-10 lg:px-20 py-4 bg-white sticky top-0 z-50 shadow-sm">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-blue-700 p-1.5 rounded-lg">
            <span className="text-white font-bold text-xl">ছা</span>
          </div>
          <span className="text-blue-900 font-bold text-2xl">ছাত্রাবাস</span>
        </div>

        {/* Middle NavLinks - Smaller text and padding for better fit */}
        <div className="hidden md:flex items-center gap-2 text-slate-600 font-medium text-sm lg:text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 rounded-md transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'hover:text-blue-700 hover:bg-blue-50'
              }`
            }
          >
            হোম
          </NavLink>

          <NavLink
            to="/availablehostels"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 rounded-md transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'hover:text-blue-700 hover:bg-blue-50'
              }`
            }
          >
            হোস্টেল খুঁজুন
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 rounded-md transition-all duration-300 ${
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
              `px-3 lg:px-4 py-2 rounded-md transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'hover:text-blue-700 hover:bg-blue-50'
              }`
            }
          >
            সাহায্য
          </NavLink>
        </div>

        {/* Right Side Toggle Buttons - Fixed Logic */}
        <div className="flex items-center gap-2 lg:gap-3">
          <NavLink
            to="/signIn"
            onClick={() => setActiveTab('login')}
            className={`px-2 lg:px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 border ${
              activeTab === 'login' 
                ? 'bg-blue-700 text-white border-blue-700' 
                : 'bg-transparent text-blue-700 border-blue-700' 
            } hover:bg-blue-600 hover:text-white`}
          >
            লগ-ইন
          </NavLink>

          <NavLink
            to="/signUp"
            onClick={() => setActiveTab('registration')}
            className={`px-2 lg:px-2 py-2 rounded-md text-sm font-semibold transition-all duration-300 border ${
              activeTab === 'registration'
                ? 'bg-blue-700 text-white border-blue-700' 
                : 'bg-transparent text-blue-700 border-blue-700' 
            } hover:bg-blue-600 hover:text-white`}
          >
            রেজিস্ট্রেশন
          </NavLink>

          <NavLink
  to="/hostel-registration"
  onClick={() => setActiveTab('hostel')}
  className={`px-2 lg:px-2 py-2 rounded-md text-sm font-semibold transition-all duration-300 border whitespace-nowrap flex items-center justify-center gap-2 ${
    activeTab === 'hostel'
      ? 'bg-blue-700 text-white border-blue-700' 
      : 'bg-transparent text-blue-700 border-blue-700' 
  } hover:bg-blue-600 hover:text-white`}
>
  <Plus size={18} strokeWidth={3} />
  <span>হোস্টেল</span>
</NavLink>
        </div>
        
      </nav>
    </div>
  );
};

export default LanHeader;