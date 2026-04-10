import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Key, ArrowRight } from "lucide-react";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;
    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:5091/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("user", JSON.stringify(result.data));
        alert("লগইন সফল হয়েছে!");
        window.location.href = "/home";
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
    <div className="min-h-screen flex items-center justify-center font-sans p-3 md:p-10">
      <div className="flex w-11/12 min-h-screen overflow-hidden">
        
        {/* Left Side - Dark Panel (Inspiration matched) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1e3a8a] relative p-16 flex-col justify-between text-white">
          <div className="absolute inset-0 bg-black/20 z-0"></div>
          <div 
            className="absolute inset-0 opacity-40 z-0" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80')", backgroundSize: 'cover' }}
          ></div>

          <div className="relative z-10">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
              🏠 বাংলাদেশের #১ হোস্টেল প্ল্যাটফর্ম
            </span>
            <h1 className="text-5xl font-black mt-8 leading-[1.1] tracking-tight">
              আপনার হোস্টেল জীবন হোক <br />
              <span className="text-blue-300">আরও গোছানো এবং সহজ</span>
            </h1>
            <p className="mt-6 text-blue-100/80 text-lg max-w-md font-medium leading-relaxed">
              মালিকদের জন্য স্মার্ট ম্যানেজমেন্ট, বোর্ডারদের জন্য নিরাপদ আবাসন — সবই এক জায়গায়।
            </p>
          </div>

          <div className="relative z-10 space-y-6 mb-10">
            {[
              { icon: "🔐", text: "নিরাপদ ও এনক্রিপ্টেড লগ-ইন" },
              { icon: "⚡", text: "তাৎক্ষণিক হোস্টেল ম্যানেজমেন্ট" },
              { icon: "📱", text: "মোবাইলেও সমান সুবিধা" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
                  {item.icon}
                </div>
                <span className="font-bold text-sm tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex gap-12 pt-8 border-t border-white/10">
            <div><p className="text-2xl font-black">৫০০+</p><p className="text-[10px] uppercase font-bold text-blue-300">হোটেল</p></div>
            <div><p className="text-2xl font-black">১০ হাজার+</p><p className="text-[10px] uppercase font-bold text-blue-300">বোর্ডার</p></div>
            <div><p className="text-2xl font-black">৯৮%</p><p className="text-[10px] uppercase font-bold text-blue-300">সন্তুষ্টি</p></div>
          </div>
          
          <p className="relative z-10 text-[10px] opacity-40 font-medium">© ২০২৬ Chatrabash.com · সর্বস্বত্ব সংরক্ষিত</p>
        </div>

        {/* Right Side - Form Body (Same as Figma) */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 md:p-20">
          <div className="w-full max-w-md">
            
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 mb-6 mx-auto lg:mx-0">
                <Key size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">প্রবেশ করুন</h2>
              <p className="text-slate-400 font-medium text-sm mt-1">আপনার অ্যাকাউন্টে লগ-ইন করুন</p>
            </div>

           
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">ইমেইল এড্রেস</label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm outline-none focus:ring-2 ring-blue-500 transition-all font-medium text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.15em]">পাসওয়ার্ড</label>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="আপনার পাসওয়ার্ড"
                    required
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm outline-none focus:ring-2 ring-blue-500 transition-all font-medium text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-4 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">আমাকে মনে রাখুন</span>
                </label>
                <Link to="/forgot-password" size="sm" className="text-[11px] text-blue-600 hover:underline uppercase font-black tracking-wide">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "প্রসেসিং..." : (
                  <>
                    প্রবেশ করুন <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="my-10 flex items-center gap-4">
              <div className="h-px bg-slate-400 flex-1"></div>
              <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.2em]">অথবা</span>
              <div className="h-px bg-slate-400 flex-1 "></div>
            </div>

            <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              অ্যাকাউন্ট নেই? <Link to="/signUp" className="text-blue-700 hover:underline ml-1 font-black">রেজিস্ট্রেশন করুন</Link>
            </p>
            
            <div className="mt-10 flex justify-center border-t border-slate-50 pt-8">
              <span className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase">
                🔒 আপনার তথ্য SSL এনক্রিপশন দ্বারা সুরক্ষিত
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;