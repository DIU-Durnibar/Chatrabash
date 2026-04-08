import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ১. এপিআই পেলোড অনুযায়ী মূল স্টেট
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    hostelId: "",      
    preferredRoomId: "", 
    preferenceNote: "",  
  });

  // অতিরিক্ত ফিল্ডগুলোর জন্য স্টেট (যাতে ইনপুটে লেখা যায়)
  const [extraInfo, setExtraInfo] = useState({
    mobile: "",
    institution: "",
    bloodGroup: "",
    gender: "",
    religion: "",
    permanentAddress: ""
  });

  const [hostels, setHostels] = useState([]); 
  const [usernameStatus, setUsernameStatus] = useState({ isChecking: false, message: "", isAvailable: true });
  const [passwordError, setPasswordError] = useState("");

  // ২. এপিআই থেকে হোস্টেল লিস্ট নিয়ে আসা
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch("http://localhost:5091/api/hostels");
        const result = await response.json();
        
        if (Array.isArray(result)) {
          setHostels(result);
        } else if (result.success && Array.isArray(result.data)) {
          setHostels(result.data);
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };
    fetchHostels();
  }, []);

  // ৩. ইউজারনেম চেক
  const checkUsername = async (username) => {
    if (!username) return;
    setUsernameStatus({ ...usernameStatus, isChecking: true });
    try {
      const response = await fetch(`http://localhost:5091/api/account/check-username?username=${username}`);
      const result = await response.json();
      if (result.success) {
        setUsernameStatus({
          isChecking: false,
          isAvailable: result.data.isAvailable,
          message: result.data.isAvailable ? "ইউজারনেমটি অ্যাভেলেবল! " : "এই ইউজারনেমটি ইতিমধ্যে নেওয়া হয়েছে।"
        });
      }
    } catch (error) {
      console.error("Username check failed", error);
    }
  };

  // ৪. পাসওয়ার্ড ভ্যালিডেশন
  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (pass && !regex.test(pass)) {
      setPasswordError("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে (বড়+ছোট হাতের অক্ষর ও স্পেশাল ক্যারেক্টারসহ)");
    } else {
      setPasswordError("");
    }
  };

  // ৫. হ্যান্ডেল চেঞ্জ ফাংশন (ফিক্সড)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // চেক করা হচ্ছে নাম কি formData-তে আছে নাকি extraInfo-তে
    if (formData.hasOwnProperty(name)) {
      setFormData({ ...formData, [name]: value });
    } else {
      setExtraInfo({ ...extraInfo, [name]: value });
    }
    
    if (name === "username") setUsernameStatus({ ...usernameStatus, message: "" });
  };

  // ৬. সাবমিট হ্যান্ডেলার
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameStatus.isAvailable || passwordError) {
      alert("দয়া করে ইউজারনেম এবং পাসওয়ার্ড সঠিক করুন।");
      return;
    }

    setLoading(true);

    const payload = {
      displayName: formData.displayName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      hostelId: formData.hostelId,
      preferredRoomId: formData.preferredRoomId || null,
      preferenceNote: formData.preferenceNote || null,
    };

    try {
      const response = await fetch("http://localhost:5091/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        navigate("/signIn"); 
      } else {
        alert(result.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("সার্ভারে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-black">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-sm overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* Left Side Panel */}
        <div className="md:w-1/4 bg-[#001f3f] p-8 text-white flex flex-col justify-start">
          <h2 className="text-2xl font-bold mb-6 border-b border-blue-800 pb-2">ইনফরমেশন</h2>
          <p className="text-sm text-blue-100 leading-relaxed mb-6">
            সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন। আপনার আবেদনটি হোস্টেল অ্যাডমিন দ্বারা অ্যাপ্রুভ হওয়ার পর আপনি লগইন করতে পারবেন।
          </p>
          <ul className="space-y-3 text-xs opacity-80">
            <li>• ইমেইল ভেরিফিকেশন প্রয়োজন হতে পারে</li>
            <li>• পাসওয়ার্ড গোপন রাখুন</li>
            <li>• সঠিক হোস্টেল আইডি নির্বাচন করুন</li>
          </ul>
        </div>

        {/* Right Form Body */}
        <div className="md:w-3/4 p-6 md:p-10">
          <div className="bg-[#1a8a5a] text-white p-4 mb-8 rounded-t-md">
             <h3 className="text-xl font-bold uppercase tracking-wide">স্টুডেন্ট সাইন আপ</h3>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4" onSubmit={handleSubmit}>
            
            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">পূর্ণ নাম *</label>
              <input 
                type="text" name="displayName" value={formData.displayName} 
                onChange={handleChange}
                placeholder="Rahim Student" required
                className="input h-10 mt-1 input-bordered w-full focus:border-[#001f3f] rounded-sm pl-3 bg-gray-50 text-sm" 
              />
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">ইউজারনেম *</label>
              <input 
                type="text" name="username" value={formData.username} 
                onChange={handleChange}
                onBlur={() => checkUsername(formData.username)}
                placeholder="rahim123" required
                className={`input h-10 mt-1 input-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm ${!usernameStatus.isAvailable ? 'border-red-500' : ''}`} 
              />
              {usernameStatus.message && (
                <p className={`text-[10px] mt-1 font-bold ${usernameStatus.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {usernameStatus.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">ইমেইল *</label>
              <input 
                type="email" name="email" value={formData.email}
                onChange={handleChange}
                placeholder="rahim@test.com" required
                className="input h-10 mt-1 input-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm" 
              />
            </div>

            <div className="form-control relative">
  <label className="label text-sm font-bold text-gray-500 uppercase">পাসওয়ার্ড *</label>
  <div className="relative">
    <input 
      type={showPassword ? "text" : "password"} // স্টেট অনুযায়ী টাইপ চেঞ্জ হবে
      name="password" 
      value={formData.password} 
      onChange={handleChange} 
      onBlur={() => validatePassword(formData.password)}
      placeholder="********" 
      required
      className={`input h-10 mt-1 input-bordered w-full rounded-sm pl-3 pr-10 bg-gray-50 text-sm ${passwordError ? 'border-red-500' : ''}`} 
    />
    {/* আইকন বাটন */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
  {passwordError && (
    <p className="text-[10px] text-red-500 mt-1 font-bold leading-tight">
      {passwordError}
    </p>
  )}
</div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">মোবাইল নাম্বার *</label>
              <input 
                type="number" name="mobile" value={extraInfo.mobile}
                onChange={handleChange}
                placeholder="017XXXXXXXX" required
                className="input h-10 mt-1 input-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm focus:border-[#001f3f]" 
              />
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">হোস্টেল নির্বাচন করুন *</label>
              <select 
                name="hostelId" value={formData.hostelId} 
                onChange={handleChange} 
                required
                className="select h-10 min-h-[40px] mt-1 select-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm"
              >
                <option value="">নির্বাচন করুন</option>
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">শিক্ষা প্রতিষ্ঠান *</label>
              <input 
                type="text" name="institution" value={extraInfo.institution}
                onChange={handleChange}
                placeholder="আপনার শিক্ষা প্রতিষ্ঠান" required
                className="input h-10 mt-1 input-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm" 
              />
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">রক্তের গ্রুপ *</label>
              <select 
                name="bloodGroup" value={extraInfo.bloodGroup}
                onChange={handleChange} 
                required
                className="select h-10 min-h-10 mt-1 select-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm"
              >
                <option value="">সিলেক্ট করুন</option>
                <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
                <option>A-</option><option>B-</option><option>O-</option><option>AB-</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">লিঙ্গ *</label>
              <select 
                name="gender" value={extraInfo.gender}
                onChange={handleChange}
                required
                className="select h-10 min-h-[40px] mt-1 select-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm"
              >
                <option value="">সিলেক্ট করুন</option>
                <option>পুরুষ</option><option>মহিলা</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">ধর্ম *</label>
              <input type="text" name="religion" value={extraInfo.religion}
                onChange={handleChange} 
                required className="input h-10 mt-1 input-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm" />
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-500 uppercase">স্থায়ী ঠিকানা *</label>
              <input type="text" name="permanentAddress" value={extraInfo.permanentAddress}
                onChange={handleChange}
                required className="input h-10 mt-1 input-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm" />
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-400 uppercase italic">পছন্দের রুম (ঐচ্ছিক)</label>
              <input type="text" name="preferredRoomId" value={formData.preferredRoomId} 
                onChange={handleChange} 
                placeholder="room-guid" className="input h-10 mt-1 input-bordered w-full rounded-sm pl-3 bg-gray-50 text-sm" />
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-gray-400 uppercase italic">নোট (ঐচ্ছিক)</label>
              <textarea name="preferenceNote" value={formData.preferenceNote}
                onChange={handleChange} 
                className="textarea textarea-bordered min-h-10 mt-1 rounded-sm pl-3 bg-gray-50 w-full text-sm" placeholder="Need AC room"></textarea>
            </div>

            <div className="md:col-span-2 mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#001f3f] hover:bg-[#002d5c] text-white py-3 rounded-sm font-bold uppercase tracking-widest transition-all shadow-md active:scale-[0.98]"
              >
                {loading ? "প্রসেসিং..." : "রেজিস্ট্রেশন সম্পন্ন করুন"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500 font-semibold uppercase">
            ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/signIn" className="text-blue-700 hover:underline ml-1">লগইন</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;