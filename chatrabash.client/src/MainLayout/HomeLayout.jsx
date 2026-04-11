import React from 'react';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
      /* h-screen দিয়ে পুরো স্ক্রিন হাইট নেওয়া হয়েছে এবং bg-slate-50 দিয়ে ব্যাকগ্রাউন্ড ফিক্স করা হয়েছে */
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        
        {/* সাইডবার নিজের হাইট (h-screen) বজায় রাখবে */}
        <Sidebar />

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
        
      </div>
    );
};

export default HomeLayout;