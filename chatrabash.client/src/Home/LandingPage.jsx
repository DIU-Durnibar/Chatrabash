import React, { useState,useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const [activeTab, setActiveTab] = useState('registration');

  return (
    <div className="font-sans text-slate-900 overflow-x-hidden">




      {/* --- Navbar --- */}
      <nav className="flex items-center justify-between px-20 py-4 bg-white sticky top-0 z-50 shadow-sm">

        
        <div className="flex items-center gap-2">
          <div className="bg-blue-700 p-1.5 rounded-lg">
            <span className="text-white font-bold text-xl">ছা</span>
          </div>
          <span className="text-blue-900 font-bold text-2xl">ছাত্রাবাস</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#" className="hover:text-blue-700 transition">হোস্টেল খুঁজুন</a>
          <a href="#" className="hover:text-blue-700 transition">কিভাবে কাজ করে</a>
          <a href="#" className="hover:text-blue-700 transition">সাহায্য</a>
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

export default LandingPage;