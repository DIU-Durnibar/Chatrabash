import React from 'react';
import Footer from '../Components/Footer';
import HomePage from '../Home/HomePage';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';
import SuperAdmin from '../Manager\'s End/Pages/SuperAdmin';

const HomeLayout = () => {
    return (
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet></Outlet>
        </main>
        
      </div>
    );
};

export default HomeLayout;


