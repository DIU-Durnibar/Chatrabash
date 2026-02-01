// HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-700">Chatrabash-ছাত্রাবাস</h1>
          <nav className="space-x-4">
            <Link to="/home" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/hostels" className="text-gray-700 hover:text-blue-600">Hostels</Link>
            <Link to="/students" className="text-gray-700 hover:text-blue-600">Students</Link>
            <Link to="/staff" className="text-gray-700 hover:text-blue-600">Staff</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-100 py-20">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            তোমার ছাত্রাবাস এখন সহজ এবং ডিজিটাল
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Chatrabash দিয়ে তুমি তোমার ছাত্রাবাসের সমস্ত কাজ করতে পারবে—স্টুডেন্টের পেমেন্ট, স্টাফের সেলারি, মিল রেকর্ড এবং আরও অনেক কিছু।
          </p>
          <Link
            to="/signup"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            শুরু করো এখন
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-20 px-6">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">মূল সুবিধাসমূহ</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
            <h4 className="text-xl font-semibold text-blue-600 mb-2">স্টুডেন্ট ম্যানেজমেন্ট</h4>
            <p className="text-gray-600">
              ছাত্রদের রেকর্ড, মাসিক পেমেন্ট এবং মিল রেকর্ড সহজে ট্র্যাক করো।
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
            <h4 className="text-xl font-semibold text-blue-600 mb-2">স্টাফ ম্যানেজমেন্ট</h4>
            <p className="text-gray-600">
              স্টাফদের সেলারি এবং ডিউটি শিডিউল এক ক্লিকে পরিচালনা করো।
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
            <h4 className="text-xl font-semibold text-blue-600 mb-2">মাল্টি-হোস্টেল</h4>
            <p className="text-gray-600">
              এক প্ল্যাটফর্মে একাধিক ছাত্রাবাস পরিচালনা করার সুযোগ।
            </p>
          </div>
        </div>
      </section>

      {/* About / Bangladeshi Perception Section */}
      <section className="bg-blue-50 py-20 px-6">
        <div className="container mx-auto md:flex md:items-center md:gap-12">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src="https://images.pexels.com/photos/15517312/pexels-photo-15517312.jpeg?_gl=1*4zttlb*_ga*Nzk5MDc5Nzk1LjE3Njk5NzUxMDQ.*_ga_8JE65Q40S6*czE3Njk5NzUxMDQkbzEkZzEkdDE3Njk5NzU1MzIkajU5JGwwJGgw"
              alt="Hostel Illustration"
              className="rounded-lg shadow-lg object-cover w-full h-72 md:h-96"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">বাংলাদেশের প্রেক্ষাপটে ছাত্রাবাস</h3>
            <p className="text-gray-700 mb-4">
              আমাদের লক্ষ্য হলো বাংলাদেশের সব ছাত্রাবাসকে ডিজিটালাইজ করা। এখন থেকে মাসিক ভাড়া, স্টাফ পেমেন্ট এবং মিল ব্যবস্থাপনা সবকিছু একটি প্ল্যাটফর্ম থেকে করো।  
            </p>
            <p className="text-gray-700">
              স্থানীয় সমস্যা এবং চ্যালেঞ্জকে মাথায় রেখে তৈরি করা এই সিস্টেম সহজে ব্যবহারযোগ্য এবং সব ধরনের হোস্টেল পরিচালনার জন্য উপযুক্ত।
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-6 mt-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Chatrabash-ছাত্রাবাস. All rights reserved.</p>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-blue-600">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-600">Terms</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
