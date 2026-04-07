import React from 'react';
import Footer from '../Components/Footer';
import HomePage from '../Home/HomePage';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const HomeLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Sidebar></Sidebar>
            <HomePage></HomePage>

            <Footer></Footer>


        </div>
    );
};

export default HomeLayout;


