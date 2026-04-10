import React from 'react';
import { 
  Phone, 
  Mail
} from 'lucide-react';

const LanFooter = () => {
    return (
        <div>
          {/* --- Footer --- */}
                <footer className="bg-[#0b1120] text-slate-400 py-10 px-6">
            <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-1 rounded-md">
                    <span className="text-white font-bold text-base">ছা</span>
                  </div>
                  <span className="text-white font-bold text-lg">ছাত্রাবাস</span>
                </div>
                <p className="text-xs leading-relaxed max-w-xs">
                  হোস্টেল ম্যানেজমেন্ট এবং সিট বুকিং এর বিশ্বস্ত প্ল্যাটফর্ম। বাংলাদেশ জুড়ে হাজারো মালিক ও বর্ডারের আস্থার সাথী।
                </p>
              </div>
          
              {/* Platform Links */}
              <div>
                <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">প্ল্যাটফর্ম</h5>
                <ul className="space-y-2 text-xs">
                  <li className="hover:text-blue-500 cursor-pointer transition">হোস্টেল খুঁজুন</li>
                  <li className="hover:text-blue-500 cursor-pointer transition">মালিক হিসেবে যোগ দিন</li>
                  <li className="hover:text-blue-500 cursor-pointer transition">কিভাবে কাজ করে</li>
                </ul>
              </div>
          
              <div>
                <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">সাহায্য</h5>
                <ul className="space-y-2 text-xs">
                  <li className="hover:text-blue-500 cursor-pointer transition">আমাদের সম্পর্কে</li>
                  <li className="hover:text-blue-500 cursor-pointer transition">গোপনীয়তা নীতি</li>
                  <li className="hover:text-blue-500 cursor-pointer transition">শর্তাবলী</li>
                </ul>
              </div>
          
              <div className="space-y-4">
                <h5 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">যোগাযোগ</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/30">
                    <Phone size={16} className="text-blue-500" />
                    <p className="text-[11px] text-white font-medium">+৮৮০ ১৮০০-৪২৩-৪৫৬৭</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-800/30 p-2.5 rounded-lg border border-slate-700/30">
                    <Mail size={16} className="text-blue-500" />
                    <p className="text-[11px] text-white font-medium">info@chatrabash.com</p>
                  </div>
                </div>
              </div>
            </div>
          
            <div className="w-11/12 mx-auto border-t border-slate-800/60 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px]">
              <p>© ২০২৬ ছাত্রাবাস (Chatrabash.com)। সমস্ত অধিকার সংরক্ষিত।</p>
              <div className="flex gap-4 mt-3 md:mt-0 opacity-70">
                <a href="#" className="hover:text-white transition">গোপনীয়তা নীতি</a>
                <a href="#" className="hover:text-white transition">শর্তাবলী</a>
                <a href="#" className="hover:text-white transition">কুকি নীতি</a>
              </div>
            </div>
               </footer>  
        </div>
    );
};

export default LanFooter;