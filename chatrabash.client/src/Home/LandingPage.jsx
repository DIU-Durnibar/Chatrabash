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

      {/* --- Hero Section --- */}
      <section className="pt-24 px-4 text-center bg-linear-to-b from-blue-50 to-white">
        <div data-aos="fade-up">
          <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-200">
            ● বাংলাদেশের প্রথম হোস্টেল ম্যানেজমেন্ট প্ল্যাটফর্ম
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mt-8 text-slate-900 leading-tight">
            এক প্ল্যাটফর্মে হোস্টেল <span className="text-blue-700">ম্যানেজমেন্ট</span> এবং <br /> সিট <span className="text-blue-700">বুকিং</span>
          </h1>
          <p className="mt-6 text-slate-500 text-lg max-w-2xl mx-auto">
            হোস্টেল মালিকদের জন্য স্মার্ট সল্যুশন এবং ছাত্রছাত্রীদের জন্য নিরাপদ আবাসন খোঁজার বিশ্বস্ত মাধ্যম
          </p>
        </div>

       

        {/* Hero Bottom Cards */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-2 gap-6 w-11/12 mx-auto">

  {/* Card 1: Hostel Owner */}
  <div className="relative group overflow-hidden rounded-md h-72 shadow-lg" data-aos="fade-right">
    <img 
      src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg" 
      alt="Hostel Owner" 
      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
    />

    <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
    
    <div className="absolute inset-0 flex flex-col justify-end p-8 text-left text-white">
      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded w-fit text-xs mb-2 border border-white/30">
        🏢 হোস্টেল মালিক
      </span>
      <h3 className="text-2xl font-bold leading-tight">सहজে ম্যানেজ করুন আপনার হোস্টেল</h3>
    </div>
  </div>

  {/* Card 2: Border */}
  <div className="relative group overflow-hidden rounded-md h-72 shadow-lg" data-aos="fade-left">
    <img 
      src="https://images.pexels.com/photos/35531303/pexels-photo-35531303.jpeg?_gl=1*kkls5w*_ga*NDIzNjc2NDE1LjE3NTkyNDU1NzE.*_ga_8JE65Q40S6*czE3NzU4MzgwNDUkbzQkZzEkdDE3NzU4MzgyNDgkajE2JGwwJGgw" 
      alt="Student" 
      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
    />
    <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
    
    <div className="absolute inset-0 flex flex-col justify-end p-8 text-left text-white">
      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded w-fit text-xs mb-2 border border-white/30">
        📖 বোর্ডার
      </span>
      <h3 className="text-2xl font-bold leading-tight">আপনার পছন্দের সিট খুঁজে নিন</h3>
    </div>
  </div>
        </div>
        </section>

      
    </div>
  );
};

export default LandingPage;