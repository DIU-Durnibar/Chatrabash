import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:5091/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data));

        alert("লগইন সফল হয়েছে!");
        
        navigate("/"); 
      } else {
        alert(result.message || "ইমেইল বা পাসওয়ার্ড ভুল!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 bg-linear-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center px-4 min-h-screen">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-sm p-8 w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">সাইন ইন করুন</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">ইমেইল</label>
            <input
              name="email"
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">পাসওয়ার্ড</label>
            <input
              name="password"
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl font-semibold shadow-md transition-all duration-150 active:scale-95 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:opacity-95"
            }`}
          >
            {loading ? "প্রসেসিং..." : "সাইন ইন করুন"}
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-600">
          নতুন ব্যবহারকারী?{" "}
          <Link to="/signUp" className="text-blue-600 hover:underline font-medium">অ্যাকাউন্ট তৈরি করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;