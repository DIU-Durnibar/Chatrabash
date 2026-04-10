import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Check, ArrowRight, ArrowLeft, User, Home, ShieldCheck, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    hostelId: "",
    preferredRoomId: "",
    preferenceNote: "",
  });

  const [hostels, setHostels] = useState([]);
  const [usernameStatus, setUsernameStatus] = useState({ 
    isChecking: false, 
    message: "", 
    isAvailable: true 
  });

  const [passwordError, setPasswordError] = useState("");
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  useEffect(() => {
    fetch("http://localhost:5091/api/hostels")
      .then((res) => res.json())
      .then((result) => setHostels(Array.isArray(result) ? result : result.data || []))
      .catch((err) => console.error("Hostel fetch error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "username") {
      setUsernameStatus({ isChecking: false, message: "", isAvailable: true });
    }
    if (name === "password") {
      setPasswordError(""); 
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.displayName || !formData.password) {
        alert("সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন।");
        return;
      }

      if (!passwordRegex.test(formData.password)) {
        setPasswordError("পাসওয়ার্ডে কমপক্ষে ৮টি অক্ষর, ১টি বড় হাতের অক্ষর এবং ১টি সংখ্যা থাকতে হবে।");
        return;
      }

      setUsernameStatus({ ...usernameStatus, isChecking: true });
      try {
        const response = await fetch(`http://localhost:5091/api/account/check-username?username=${formData.username}`);
        const result = await response.json();

        if (result.success && result.data.isAvailable) {
          setStep(2);
          setUsernameStatus({ isChecking: false, message: "", isAvailable: true });
        } else {
          setUsernameStatus({
            isChecking: false,
            isAvailable: false,
            message: "এই ইউজারনেমটি ইতিমধ্যে নেওয়া হয়েছে। অন্য কিছু ট্রাই করো।"
          });
        }
      } catch (error) {
        alert("সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করো।");
        setUsernameStatus({ ...usernameStatus, isChecking: false });
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // API Payload structure অনুযায়ী ডাটা গুছিয়ে নেওয়া
    const payload = {
      displayName: formData.displayName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      hostelId: formData.hostelId, // GUID string
      preferredRoomId: formData.preferredRoomId || null, // Optional
      preferenceNote: formData.preferenceNote || "" // Optional
    };

    try {
      const response = await fetch("http://localhost:5091/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert("অভিনন্দন! রেজিস্ট্রেশন সফল হয়েছে। ম্যানেজারের অনুমোদনের জন্য অপেক্ষা করুন।");
        navigate("/signIn");
      } else {
        alert(result.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। ডাটা চেক করুন।");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("সার্ভার এরর! ব্যাকএন্ড কানেকশন চেক করো।");
    } finally {
      setLoading(false);
    }
  };

  // হোস্টেল লিস্ট থেকে সিলেক্টেড হোস্টেলের নাম খুঁজে বের করা
  const selectedHostelName = hostels.find(h => h.id === formData.hostelId)?.name || "সিলেক্ট করা হয়নি";

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-10 font-sans text-slate-900">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all">
        
        {/* Header Section */}
        <div className="bg-white px-8 md:px-16 pt-12 pb-8 text-center md:text-left">
          <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="text-slate-400 text-sm font-medium">
            ধাপ {step} / ৩ — {step === 1 ? 'ব্যক্তিগত তথ্য' : step === 2 ? 'হোস্টেল ও রুম বেছে নিন' : 'তথ্য যাচাই করুন'}
          </p>
          
          <div className="flex items-center justify-between mt-10 max-w-2xl mx-auto relative px-4">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 z-0"></div>
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                  {step > s ? <Check size={20} strokeWidth={3} /> : s}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter hidden md:block ${step >= s ? 'text-blue-600' : 'text-slate-300'}`}>
                  {s === 1 ? 'ব্যক্তিগত' : s === 2 ? 'হোস্টেল' : 'নিশ্চিতকরণ'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 md:px-16 pb-12">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wide">ডিসপ্লে নাম *</label>
                <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="আপনার পূর্ণ নাম লিখুন" className="w-full h-14 bg-slate-50 rounded-2xl px-6 text-sm outline-none focus:ring-2 ring-blue-500 transition-all border-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wide">ইমেইল *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" className="w-full h-14 bg-slate-50 rounded-2xl px-6 text-sm outline-none focus:ring-2 ring-blue-500 transition-all border-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wide">ইউজারনেম *</label>
                <div className="relative">
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="username" className={`w-full h-14 bg-slate-50 rounded-2xl px-6 text-sm outline-none focus:ring-2 transition-all border-none ${!usernameStatus.isAvailable ? 'ring-red-500' : 'ring-blue-500'}`} />
                  {usernameStatus.isChecking && <Loader2 className="absolute right-4 top-4 animate-spin text-blue-500" size={20} />}
                </div>
                {usernameStatus.message && <p className="text-[10px] text-red-500 font-bold ml-2 italic">{usernameStatus.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wide">পাসওয়ার্ড *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="কমপক্ষে ৮ অক্ষর" className={`w-full h-14 bg-slate-50 rounded-2xl px-6 text-sm outline-none focus:ring-2 transition-all border-none ${passwordError ? 'ring-red-500' : 'ring-blue-500'}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-slate-300 hover:text-slate-500 transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && <p className="text-[10px] text-red-500 font-bold ml-2 leading-tight">{passwordError}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wide">হোস্টেল নির্বাচন করুন *</label>
                <select name="hostelId" value={formData.hostelId} onChange={handleChange} className="w-full h-14 bg-slate-50 rounded-2xl px-6 text-sm outline-none focus:ring-2 ring-blue-500 border-none cursor-pointer">
                  <option value="">নির্বাচন করুন</option>
                  {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wide">পছন্দের রুম (ঐচ্ছিক)</label>
                <input type="text" name="preferredRoomId" value={formData.preferredRoomId} onChange={handleChange} placeholder="রুম নম্বর বা আইডি লিখুন" className="w-full h-14 bg-slate-50 rounded-2xl px-6 text-sm outline-none focus:ring-2 ring-blue-500 border-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-wide">বিশেষ অনুরোধ (ঐচ্ছিক)</label>
                <textarea name="preferenceNote" value={formData.preferenceNote} onChange={handleChange} placeholder="যেমন: জানালার পাশের সিট চাই..." className="w-full h-28 bg-slate-50 rounded-2xl p-6 text-sm outline-none focus:ring-2 ring-blue-500 border-none resize-none" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
              <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                <div className="flex items-center gap-2 text-blue-700 font-black text-xs mb-4 uppercase tracking-tighter"><User size={16}/> ব্যক্তিগত প্রোফাইল</div>
                <div className="grid grid-cols-2 gap-y-3 text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">নাম:</span> <span className="text-slate-800">{formData.displayName}</span>
                  <span className="text-slate-400 uppercase tracking-widest">ইউজারনেম:</span> <span className="text-slate-800">@{formData.username}</span>
                  <span className="text-slate-400 uppercase tracking-widest">ইমেইল:</span> <span className="text-slate-800">{formData.email}</span>
                </div>
              </div>
              <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs mb-4 uppercase tracking-tighter"><Home size={16}/> আবাসন তথ্য</div>
                <div className="grid grid-cols-2 gap-y-3 text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">হোস্টেল:</span> <span className="text-slate-800">{selectedHostelName}</span>
                  <span className="text-slate-400 uppercase tracking-widest">রুম:</span> <span className="text-slate-800">{formData.preferredRoomId || 'দেওয়া হয়নি'}</span>
                  <span className="text-slate-400 uppercase tracking-widest">অনুরোধ:</span> <span className="text-slate-800 italic">{formData.preferenceNote || 'নেই'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-12">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase hover:text-slate-800 transition-all">
                <ArrowLeft size={18} /> পেছনে
              </button>
            ) : <div />}

            <div className="flex gap-4">
              {step < 3 ? (
                <button onClick={handleNextStep} disabled={usernameStatus.isChecking} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
                  {usernameStatus.isChecking ? "চেকিং..." : "পরবর্তী ধাপ"} <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
                  {loading ? <Loader2 className="animate-spin" size={18}/> : <ShieldCheck size={18} />}
                  {loading ? "প্রসেসিং..." : "রেজিস্ট্রেশন সম্পন্ন করুন"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-5">
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/signIn" className="text-blue-600 hover:underline ml-1">লগ-ইন করুন</Link>
            </p>
            <div className="h-px w-8 bg-slate-200" />
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;