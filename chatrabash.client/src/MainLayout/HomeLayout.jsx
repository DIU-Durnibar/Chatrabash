import React from 'react';
import Footer from '../Components/Footer';
import HomePage from '../Home/HomePage';
import Navbar from '../Components/Navbar';

const HomeLayout = () => {
    return (
        <div>
            <Navbar></Navbar>

            <HomePage></HomePage>

            <Footer></Footer>
        </div>
    );
};

export default HomeLayout;