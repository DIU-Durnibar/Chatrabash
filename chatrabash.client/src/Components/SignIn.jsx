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
        alert("লগইন সফল হয়েছে!");
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-black">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-sm overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* Left Side - Navy Blue Info Panel */}
        <div className="md:w-1/3 bg-[#001f3f] p-8 text-white flex flex-col justify-center items-center text-center">
          <div className="mb-6">
             {/* এখানে তুমি তোমার লোগো বা আইকন দিতে পারো */}
             <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">🔑</div>
             <h2 className="text-2xl font-bold uppercase tracking-tighter">Welcome Back</h2>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed opacity-80 italic">
            আপনার অ্যাকাউন্টে লগইন করে হোস্টেলের সকল সুবিধা উপভোগ করুন।
          </p>
        </div>

        {/* Right Side - Form Body */}
        <div className="md:w-2/3 p-8 md:p-12">
          <div className="bg-[#1a8a5a] text-white p-4 mb-8 rounded-t-md">
             <h3 className="text-xl font-bold uppercase tracking-wide">স্টুডেন্ট সাইন ইন</h3>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">ইমেইল ঠিকানা</label>
              <input
                name="email"
                type="email"
                placeholder="example@mail.com"
                required
                className="input h-10 mt-1 input-bordered w-full focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f] rounded-sm pl-3 bg-gray-50 text-sm transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <div className="flex justify-between items-center">
                <label className="label text-sm font-bold text-gray-500 uppercase">পাসওয়ার্ড</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] text-blue-600 hover:underline uppercase font-bold">পাসওয়ার্ড ভুলে গেছেন?</Link>
              </div>
              <input
                name="password"
                type="password"
                placeholder="********"
                required
                className="input h-10 mt-1 input-bordered w-full focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f] rounded-sm pl-3 bg-gray-50 text-sm transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#001f3f] hover:bg-[#002d5c] text-white py-3 rounded-sm font-bold uppercase tracking-widest transition-all shadow-md active:scale-[0.98] ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "প্রসেসিং..." : "লগইন করুন"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 font-semibold uppercase">
            নতুন ব্যবহারকারী?{" "}
            <Link to="/signUp" className="text-blue-700 hover:underline ml-1">অ্যাকাউন্ট তৈরি করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;