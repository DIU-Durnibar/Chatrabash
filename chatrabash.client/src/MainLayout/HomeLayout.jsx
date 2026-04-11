import React from 'react';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
        
      </div>
    );
};

export default HomeLayout;