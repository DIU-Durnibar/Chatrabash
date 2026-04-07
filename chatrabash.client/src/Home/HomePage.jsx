import React from "react";
import { Link, NavLink } from "react-router-dom";

const HomePage = () => {
  const heroImageUrl = "https://images.pexels.com/photos/36086367/pexels-photo-36086367.jpeg?_gl=1*gsxssx*_ga*NDIzNjc2NDE1LjE3NTkyNDU1NzE.*_ga_8JE65Q40S6*czE3NzU1ODM4MzAkbzMkZzEkdDE3NzU1ODM5MDMkajU0JGwwJGgw";

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section with Background Image */}
      <section 
        className="relative py-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        {/* Overlay - টেক্সটকে ফুটিয়ে তোলার জন্য */}
        <div className="absolute inset-0 bg-blue-900/35 backdrop-blur-[1px]"></div>

        <div className="container mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl md:text-[54px] font-extrabold text-white mb-6 drop-shadow-lg">
            তোমার ছাত্রাবাস এখন সহজ এবং ডিজিটাল
          </h2>
          <p className="text-lg text-blue-50 mb-8 max-w-3xl mx-auto drop-shadow-md">
            ছাত্রাবাস দিয়ে তুমি তোমার ছাত্রাবাসের সমস্ত কাজ করতে পারবে—স্টুডেন্টের পেমেন্ট, স্টাফের সেলারি, মিল রেকর্ড এবং আরও অনেক কিছু।
          </p>
          <div className="flex justify-center gap-4">
             <NavLink 
                to="/home/availablehostels" 
                className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition shadow-lg">
                   রুম খুঁজুন
             </NavLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-20 px-6">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">মূল সুবিধাসমূহ</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">

          <Link to={`/home/studentDashboard`} className="bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <h4 className="text-xl font-bold text-blue-800 mb-2">স্টুডেন্ট ম্যানেজমেন্ট</h4>
            <p className="text-gray-600">
              ছাত্রদের রেকর্ড, মাসিক পেমেন্ট এবং মিল রেকর্ড সহজে ট্র্যাক করো।
            </p>
          </Link>

          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
            </div>
            <h4 className="text-xl font-bold text-blue-800 mb-2">স্টাফ ম্যানেজমেন্ট</h4>
            <p className="text-gray-600">
              স্টাফদের সেলারি এবং ডিউটি শিডিউল এক ক্লিকে পরিচালনা করো।
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
               </svg>
            </div>
            <h4 className="text-xl font-bold text-blue-800 mb-2">মাল্টি-হোস্টেল</h4>
            <p className="text-gray-600">
              এক প্ল্যাটফর্মে একাধিক ছাত্রাবাস পরিচালনা করার সুযোগ।
            </p>
          </div>
        </div>
      </section>

      {/* About / Bangladeshi Perception Section */}
      <section className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="container mx-auto md:flex md:items-center md:gap-16">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative">
               <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600 rounded-2xl -z-10"></div>
               <img
                 src="https://images.pexels.com/photos/15517312/pexels-photo-15517312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                 alt="Hostel Illustration"
                 className="rounded-2xl shadow-2xl object-cover w-full h-80 md:h-[450px]"
               />
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-full -z-10"></div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">বাংলাদেশের প্রেক্ষাপটে ছাত্রাবাস</h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              আমাদের লক্ষ্য হলো বাংলাদেশের সব ছাত্রাবাসকে ডিজিটালাইজ করা। এখন থেকে মাসিক ভাড়া, স্টাফ পেমেন্ট এবং মিল ব্যবস্থাপনা সবকিছু একটি প্ল্যাটফর্ম থেকে করো।  
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              স্থানীয় সমস্যা এবং চ্যালেঞ্জকে মাথায় রেখে তৈরি করা এই সিস্টেম সহজে ব্যবহারযোগ্য এবং সব ধরনের হোস্টেল পরিচালনার জন্য উপযুক্ত।
            </p>
            <button className="mt-8 text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
               আরও জানুন 
               <span>&rarr;</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;