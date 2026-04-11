import React from 'react';
import Footer from '../Components/Footer';
import HomePage from '../Home/HomePage';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
<<<<<<< Updated upstream
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
=======
       <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* <HomePage></HomePage> */}
          <Outlet></Outlet>
          <Footer></Footer>
>>>>>>> Stashed changes
        </main>
      </div>
    </div>
    );
};

export default HomeLayout;


