// HomePage.jsx
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/15517312/pexels-photo-15517312.jpeg?_gl=1*4zttlb*_ga*Nzk5MDc5Nzk1LjE3Njk5NzUxMDQ.*_ga_8JE65Q40S6*czE3Njk5NzUxMDQkbzEkZzEkdDE3Njk5NzU1MzIkajU5JGwwJGgw"
        alt="Hostel Hero"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/40 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-3">Welcome to Chatrabash-ছাত্রাবাস </h1>
        <p className="text-xl md:text-2xl mb-5">
          Manage your hostels, students, and staff seamlessly.
        </p>
        <div className="flex flex-col md:flex-row gap-4">

        <Link
          to="/home"
          className="relative inline-block px-8 py-4 rounded-full text-lg font-semibold text-white
                     bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                     shadow-lg shadow-blue-500/50
                     transform transition duration-300 hover:scale-105 hover:shadow-xl
                     active:scale-95"
        >
          Get Started
          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-20 transition duration-300"></span>
        </Link>
          
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
