import React, { useEffect } from 'react';
import { Search, Home, CreditCard, ShieldCheck, Zap, Globe } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const KivabeKajKore = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* --- Header Section --- */}
      <section className="py-20 bg-blue-50 text-center px-4" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-6">
          ছাত্রাবাস কিভাবে কাজ করে?
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          বাংলাদেশে হোস্টেল খোঁজা এবং ম্যানেজ করার ঝামেলা কমাতে আমরা নিয়ে এসেছি সম্পূর্ণ ডিজিটাল সমাধান। 
          জানুন কিভাবে ছাত্রাবাস আপনার জীবনকে আরও সহজ করে তোলে।
        </p>
      </section>

      {/* --- How to Use (Steps) --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800">মাত্র ৩টি সহজ ধাপে</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">১</div>
            <Search className="mx-auto text-blue-700" size={40} />
            <h3 className="text-xl font-bold">হোস্টেল খুঁজুন</h3>
            <p className="text-slate-500 text-sm">আপনার পছন্দের এলাকা সিলেক্ট করে ভেরিফাইড হোস্টেলগুলোর তালিকা দেখুন।</p>
          </div>

          <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">২</div>
            <Home className="mx-auto text-blue-700" size={40} />
            <h3 className="text-xl font-bold">সিট বুক করুন</h3>
            <p className="text-slate-500 text-sm">পছন্দের সিট বা রুমের ছবি দেখে সরাসরি অনলাইনে বুকিং রিকোয়েস্ট পাঠান।</p>
          </div>

          <div className="space-y-4" data-aos="fade-up" data-aos-delay="300">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">৩</div>
            <CreditCard className="mx-auto text-blue-700" size={40} />
            <h3 className="text-xl font-bold">নিশ্চিন্তে থাকুন</h3>
            <p className="text-slate-500 text-sm">ডিজিটাল পেমেন্ট করুন এবং অ্যাপের মাধ্যমেই আপনার মিল ও বিল ম্যানেজ করুন।</p>
          </div>
        </div>
      </section>

      {/* --- Why Different (Bangladesh Aspect) - Shorter Version --- */}
<section className="py-12 bg-slate-900 text-white px-6 overflow-hidden">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <div data-aos="fade-right">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
        কেন ছাত্রাবাস বাংলাদেশের প্রেক্ষাপটে <span className="text-blue-500">অনন্য?</span>
      </h2>
      <div className="space-y-5"> {/* গ্যাপ কমানো হয়েছে */}
        <div className="flex gap-4">
          <div className="mt-1 bg-blue-500/20 p-2 rounded-lg h-fit"><Zap size={18} className="text-blue-500" /></div>
          <div>
            <h4 className="text-lg font-bold">ডিজিটাল মিল ম্যানেজমেন্ট</h4>
            <p className="text-slate-400 text-xs leading-relaxed">খাতা-কলমে হিসাবের দিন শেষ। এক ক্লিকেই মিল অফ/অন।</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="mt-1 bg-blue-500/20 p-2 rounded-lg h-fit"><ShieldCheck size={18} className="text-blue-500" /></div>
          <div>
            <h4 className="text-lg font-bold">ভেরিফাইড ও নিরাপদ আবাসন</h4>
            <p className="text-slate-400 text-xs leading-relaxed">প্রতিটি হোস্টেল ফিজিক্যালি ভেরিফাইড, যা লোকাল বিজ্ঞাপনে অসম্ভব।</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="mt-1 bg-blue-500/20 p-2 rounded-lg h-fit"><Globe size={18} className="text-blue-500" /></div>
          <div>
            <h4 className="text-lg font-bold">স্বচ্ছ পেমেন্ট সিস্টেম</h4>
            <p className="text-slate-400 text-xs leading-relaxed">বিকাশ/নগদ পেমেন্ট ও অটো-রিসিট যা স্বচ্ছতা নিশ্চিত করে।</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="relative" data-aos="fade-left">
      <div className="bg-blue-600 rounded-2xl p-6 shadow-xl relative z-10"> {/* Padding কমানো হয়েছে */}
        <h3 className="text-xl font-bold mb-3">আমাদের লক্ষ্য</h3>
        <p className="text-blue-50 text-xs leading-relaxed italic opacity-90">
          "বাংলাদেশের প্রতিটি স্টুডেন্ট যেন তার শহর থেকে দূরে থেকেও একটি নিরাপদ এবং সুন্দর পরিবেশে পড়াশোনা করতে পারে।"
        </p>
        <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
           <div className="w-8 h-8 rounded-full bg-white/20"></div>
           <div>
             <p className="font-bold text-xs">টিম ছাত্রাবাস</p>
             <p className="text-[9px] opacity-70 uppercase tracking-wider">ঢাকা, বাংলাদেশ</p>
           </div>
        </div>
      </div>
      {/* Smaller Decoration */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
    </div>
  </div>
</section>

      {/* --- Call to Action --- */}
      <section className="py-20 text-center px-4" data-aos="zoom-in">
        <h2 className="text-3xl font-bold mb-6">আপনি কি আপনার হোস্টেল তালিকাভুক্ত করতে চান?</h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">আজই আমাদের প্ল্যাটফর্মে যুক্ত হোন এবং আপনার হোস্টেল ম্যানেজমেন্টকে করুন স্মার্ট ও ঝামেলামুক্ত।</p>
        <button className="bg-blue-700 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">
          মালিক হিসেবে শুরু করুন
        </button>
      </section>
    </div>
  );
};

export default KivabeKajKore;