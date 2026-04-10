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

      {/* --- Solution Section --- */}
      <section className="py-20 bg-white">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-blue-700 font-semibold bg-blue-50 px-4 py-1 rounded-full text-sm">দুটি আলাদা সমাধান</span>
          <h2 className="text-3xl font-bold mt-4 text-slate-800">আপনার প্রয়োজন অনুযায়ী শুরু করুন</h2>
          <p className="text-slate-500 mt-2">মালিক হোন বা বর্ডার — ছাত্রাবাস আপনার জন্য সঠিক সমাধান নিয়ে এসেছে</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-11/12 mx-auto">
  {/* Owner Box */}
  <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 relative overflow-hidden flex flex-col justify-between" data-aos="fade-up">
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 rounded-full -mr-8 -mt-8"></div>
    
    <div>
      <div className="bg-blue-900 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
        <CheckCircle size={20} className="text-white" />
      </div>
      <span className="bg-blue-800 text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">হোস্টেল মালিক</span>
      <h3 className="text-xl font-bold mt-3 mb-2">আপনি কি হোস্টেল মালিক?</h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">আপনার হোস্টেল পরিচালনাকে ডিজিটাল করুন — বিলিং, মিল, বর্ডার ম্যানেজমেন্ট সব এক জায়গায়।</p>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8">
        {['ডিজিটাল বিলিং', 'মিল ম্যানেজমেন্ট', 'বর্ডার রেকর্ড', 'রিপোর্ট ও অ্যানালিটিক্স'].map(list => (
          <li key={list} className="flex items-center gap-2 text-slate-700 text-xs font-medium">
            <CheckCircle size={14} className="text-blue-700 shrink-0" /> {list}
          </li>
        ))}
      </ul>
    </div>

    <button className="bg-blue-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition font-bold text-sm w-fit">
      রেজিস্ট্রেশন করুন <ArrowRight size={16} />
    </button>
  </div>

  {/* Student Box */}
  <div className="bg-green-50/50 p-8 rounded-2xl border border-green-100 relative overflow-hidden flex flex-col justify-between" data-aos="fade-up" data-aos-delay="200">
    <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/30 rounded-full -mr-8 -mt-8"></div>
    
    <div>
      <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
        <CheckCircle size={20} className="text-white" />
      </div>
      <span className="bg-green-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">স্টুডেন্ট বর্ডার</span>
      <h3 className="text-xl font-bold mt-3 mb-2">সিট খুঁজছেন?</h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">ভেরিফাইড হোস্টেল খুঁজুন, অনলাইনে বুক করুন এবং নিরাপদে ভাড়া পরিশোধ করুন।</p>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8">
        {['ভেরিফাইড হোস্টেল', 'ভাড়া পরিশোধ', 'রিভিউ সিস্টেম', 'সরাসরি যোগাযোগ'].map(list => (
          <li key={list} className="flex items-center gap-2 text-slate-700 text-xs font-medium">
            <CheckCircle size={14} className="text-green-600 shrink-0" /> {list}
          </li>
        ))}
      </ul>
    </div>

    <button className="bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 transition font-bold text-sm w-fit">
      সিট খুঁজুন <ArrowRight size={16} />
    </button>
  </div>
</div>
      </section>

      {/* --- Featured Hostels --- */}
      <section className="pt-10 pb-20 bg-slate-50 px-4">
        <div className="w-11/12 mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div data-aos="fade-right">
              <span className="text-blue-700 font-semibold bg-blue-100 px-3 py-1 rounded text-xs uppercase">জনপ্রিয় হোস্টেল</span>
              <h2 className="text-3xl font-bold mt-4 text-slate-800">আপনার এলাকার জনপ্রিয় হোস্টেলসমূহ</h2>
              <p className="text-slate-500 mt-1 text-sm">ভেরিফাইড ও রেটিং-নিশ্চিত হোস্টেলের তালিকা</p>
            </div>
            <button className="text-blue-700 font-bold flex items-center gap-1 hover:underline group" data-aos="fade-left">
              সব হোস্টেল দেখুন <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition duration-300" data-aos="fade-up">
              <div className="relative h-56">
                <img src="https://images.pexels.com/photos/633269/pexels-photo-633269.jpeg" alt="Hostel" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-blue-700 text-white text-xs px-3 py-1 rounded-full font-medium">সেরা পছন্দ</span>
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-green-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">● ভেরিফাইড</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-2">স্টুডেন্ট কেয়ার হোস্টেল</h4>
                <div className="flex items-center text-slate-400 text-sm gap-1 mb-4">
                  <MapPin size={14} /> ধানমন্ডি, ঢাকা
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['ওয়াইফাই', 'মিল সুবিধা', 'নিরাপত্তা'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100 font-medium">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-blue-900 font-extrabold text-xl">৳৩,৫০০<span className="text-slate-400 text-xs font-normal">/মাস</span></div>
                  <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition">বিস্তারিত</button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition duration-300" data-aos="fade-up" data-aos-delay="100">
              <div className="relative h-56">
                <img src="https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg" alt="Hostel" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">সাশ্রয়ী</span>
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-green-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">● ভেরিফাইড</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-2">আল-আমিন বোর্ডিং হাউস</h4>
                <div className="flex items-center text-slate-400 text-sm gap-1 mb-4">
                  <MapPin size={14} /> মিরপুর-১০, ঢাকা
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['ওয়াইফাই', 'লাইব্রেরি', 'পার্কিং'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100 font-medium">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-blue-900 font-extrabold text-xl">৳২,৮০০<span className="text-slate-400 text-xs font-normal">/মাস</span></div>
                  <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition">বিস্তারিত</button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="relative h-56">
                <img src="https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg" alt="Hostel" className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">প্রিমিয়াম</span>
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-green-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">● ভেরিফাইড</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-2">ভার্সিটি হোস্টেল কমপ্লেক্স</h4>
                <div className="flex items-center text-slate-400 text-sm gap-1 mb-4">
                  <MapPin size={14} /> মোহাম্মদপুর, ঢাকা
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['AC রুম', 'জিম', 'ক্যান্টিন'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100 font-medium">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-blue-900 font-extrabold text-xl">৳৪,২০০<span className="text-slate-400 text-xs font-normal">/মাস</span></div>
                  <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition">বিস্তারিত</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default LandingPage;