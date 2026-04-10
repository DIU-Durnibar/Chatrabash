import React, { useEffect } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, ChevronRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Help = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const faqs = [
    { q: "কিভাবে সিট বুক করব?", a: "প্রথমে হোস্টেল খুঁজুন পেজ থেকে আপনার পছন্দের হোস্টেল সিলেক্ট করুন এবং 'বুক নাও' বাটনে ক্লিক করুন।" },
    { q: "পেমেন্ট কি নিরাপদ?", a: "হ্যাঁ, আমরা সরাসরি বিকাশ বা নগদের অফিসিয়াল গেটওয়ে ব্যবহার করি যা সম্পূর্ণ নিরাপদ।" },
    { q: "মিল কিভাবে বন্ধ করব?", a: "আপনার ড্যাশবোর্ড থেকে 'Meal Management' সেকশনে গিয়ে এক ক্লিকেই মিল অন বা অফ করতে পারবেন।" },
    { q: "মালিকের সাথে কথা বলব কিভাবে?", a: "প্রতিটি হোস্টেল ডিটেইলস পেজে মালিকের ভেরিফাইড ফোন নম্বর দেওয়া থাকে।" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-3xl font-black text-blue-900 mb-3">আমরা কিভাবে সাহায্য করতে পারি?</h1>
          <p className="text-slate-600 text-sm">সাধারণ জিজ্ঞাসাগুলোর উত্তর এখানে পাবেন অথবা সরাসরি যোগাযোগ করুন।</p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-4 mb-16" data-aos="fade-up">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition group cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-start">
                  <HelpCircle className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{faq.q}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition" />
              </div>
            </div>
          ))}
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="zoom-in">
          <div className="bg-blue-600 p-6 rounded-2xl text-white text-center shadow-lg hover:scale-105 transition">
            <Phone className="mx-auto mb-3" size={24} />
            <h5 className="font-bold text-sm mb-1">সরাসরি কল</h5>
            <p className="text-[10px] opacity-80">+৮৮০ ১৮০০-৪২৩-৪৫৬৭</p>
          </div>

          <div className="bg-white p-6 rounded-2xl text-slate-800 text-center border border-slate-200 shadow-sm hover:scale-105 transition">
            <Mail className="mx-auto mb-3 text-blue-600" size={24} />
            <h5 className="font-bold text-sm mb-1">ইমেইল করুন</h5>
            <p className="text-[10px] text-slate-500">support@chatrabash.com</p>
          </div>

          <div className="bg-white p-6 rounded-2xl text-slate-800 text-center border border-slate-200 shadow-sm hover:scale-105 transition">
            <MessageSquare className="mx-auto mb-3 text-blue-600" size={24} />
            <h5 className="font-bold text-sm mb-1">লাইভ চ্যাট</h5>
            <p className="text-[10px] text-slate-500">সকাল ১০টা - রাত ৮টা</p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-400 text-[10px] mt-16">
          © ২০২৬ ছাত্রাবাস সাপোর্ট টিম | আপনার নিরাপত্তা আমাদের অগ্রাধিকার
        </p>
      </div>
    </div>
  );
};

export default Help;