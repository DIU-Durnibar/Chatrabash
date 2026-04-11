import React, { useState, useEffect } from 'react';
import { CheckCircle2, Home, User, CreditCard, ArrowRight, ArrowLeft, MapPin, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const HostelRegistration = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  
  // Location States
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  
  // Form Data
  const [formData, setFormData] = useState({
    hostelName: "",
    areaDescription: "",
    divisionId: "",
    districtId: "",
    upazilaId: "",
    subscriptionPackageId: null,
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    password: ""
  });

  useEffect(() => {
    fetch("http://localhost:5091/api/saas/packages").then(res => res.json()).then(res => setPackages(res.data));
    fetch("http://localhost:5091/api/location/divisions").then(res => res.json()).then(res => setDivisions(res.data));
  }, []);

  useEffect(() => {
    if (formData.divisionId) {
      fetch(`http://localhost:5091/api/location/districts/${formData.divisionId}`)
        .then(res => res.json()).then(res => setDistricts(res.data));
      setFormData(prev => ({ ...prev, districtId: "", upazilaId: "" }));
    }
  }, [formData.divisionId]);

  useEffect(() => {
    if (formData.districtId) {
      fetch(`http://localhost:5091/api/location/upazilas/${formData.districtId}`)
        .then(res => res.json()).then(res => setUpazilas(res.data));
      setFormData(prev => ({ ...prev, upazilaId: "" }));
    }
  }, [formData.districtId]);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5091/api/saas/register-hostel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success){
         setStep(4);
      }
      else alert(result.message);
    } catch (error) {
      alert("রেজিস্ট্রেশন ব্যর্থ হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    // যদি পেইড প্যাকেজ (ID 2 বা 3) হয়, তবে ধাপ ৫ (Contact Page)-এ পাঠাবে
    if (step === 1 && (formData.subscriptionPackageId === 2 || formData.subscriptionPackageId === 3)) {
      setStep(5);
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step === 5) setStep(1);
    else setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-sans text-slate-800">
      {/* Step Indicator - Hide on Contact & Success Page */}
      {step < 4 && (
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-blue-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                <span className={`text-[10px] uppercase font-black mt-2 tracking-widest ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s === 1 ? 'প্যাকেজ নির্বাচন' : s === 2 ? 'হোস্টেল তথ্য' : 'ম্যানেজার প্রোফাইল'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Choose Plan */}
      {step === 1 && (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900">আপনার হোস্টেলের জন্য সেরা প্ল্যান বেছে নিন</h2>
            <p className="text-slate-500 text-sm font-medium">সকল প্ল্যানে রয়েছে ১৫ দিনের ফ্রি ট্রায়াল।</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`bg-white border-2 p-8 rounded-[32px] transition-all cursor-pointer relative overflow-hidden ${formData.subscriptionPackageId === pkg.id ? 'border-blue-600 ring-4 ring-blue-50 shadow-2xl scale-105' : 'border-slate-100 hover:border-blue-200 shadow-sm'}`}
                onClick={() => setFormData({ ...formData, subscriptionPackageId: pkg.id })}>
                <div className="mb-6 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
                <h3 className="text-xl font-black mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black">৳{pkg.monthlyPrice}</span>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">/মাস</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    <CheckCircle2 size={16} className="text-blue-500" /> সর্বোচ্চ {pkg.maxBoarders} জন বোর্ডার
                  </li>
                  <li className="flex items-center gap-3 text-[11px] font-bold text-slate-600 uppercase tracking-wide leading-relaxed">
                    <CheckCircle2 size={16} className="text-blue-500" /> {pkg.features}
                  </li>
                </ul>
                <button className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${formData.subscriptionPackageId === pkg.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                  {formData.subscriptionPackageId === pkg.id ? 'নির্বাচিত' : 'প্ল্যান বেছে নিন'}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <button onClick={nextStep} disabled={!formData.subscriptionPackageId} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-20 flex items-center gap-3 hover:gap-5 transition-all shadow-xl shadow-slate-200">
              {formData.subscriptionPackageId === 2 || formData.subscriptionPackageId === 3 ? 'যোগাযোগ করুন' : 'পরবর্তী ধাপ'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Contact Page for ID 2 & 3 */}
      {step === 5 && (
        <div className="w-9/12 mx-auto text-center py-16 bg-white rounded-[20px] shadow-2xl shadow-blue-50 border border-slate-100 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner"><PhoneCall size={32} /></div>
          <h2 className="text-3xl font-black mb-4">আমাদের সাথে যোগাযোগ করুন</h2>
          <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
            {formData.subscriptionPackageId === 2 ? 'প্রফেশনাল' : 'এন্টারপ্রাইজ'} প্ল্যানটি সেটআপ করতে আমাদের সেলস টিমের সহায়তা প্রয়োজন। নিচের নম্বরে কল করুন বা ফিরে যান।
          </p>
          <div className="bg-slate-50 p-6 rounded-3xl mb-10 mx-10">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">সরাসরি কল করুন</span>
             <span className="text-2xl font-black text-blue-600">+৮৮০ ১৭১১-০০০০০০</span>
          </div>
          <button onClick={prevStep} className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-slate-600 transition-colors">
            <ArrowLeft size={16} /> অন্য প্ল্যান বেছে নিন
          </button>
        </div>
      )}

      {/* STEP 2: Hostel Info (Starter only) */}
      {step === 2 && (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 animate-in slide-in-from-right duration-500">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Home size={24} /></div>
            <div>
              <h2 className="text-xl font-black">হোস্টেলের তথ্য দিন</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ধাপ ২ / ৩ — হোস্টেল ও অবস্থান নিশ্চিত করুন</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">হোস্টেলের নাম</label>
              <input value={formData.hostelName} onChange={(e) => setFormData({...formData, hostelName: e.target.value})} placeholder="যেমন: সুপার স্টুডেন্ট হোস্টেল" className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-medium focus:ring-2 ring-blue-500 transition-all outline-none" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <select value={formData.divisionId} onChange={(e) => setFormData({...formData, divisionId: parseInt(e.target.value)})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-600 outline-none">
                <option value="">বিভাগ নির্বাচন করুন</option>
                {divisions.map(d => <option key={d.id} value={d.id}>{d.bengaliName}</option>)}
              </select>
              <select value={formData.districtId} disabled={!formData.divisionId} onChange={(e) => setFormData({...formData, districtId: parseInt(e.target.value)})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-600 disabled:opacity-50 outline-none">
                <option value="">জেলা নির্বাচন করুন</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={formData.upazilaId} disabled={!formData.districtId} onChange={(e) => setFormData({...formData, upazilaId: parseInt(e.target.value)})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-600 disabled:opacity-50 outline-none">
                <option value="">উপজেলা নির্বাচন করুন</option>
                {upazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">বিস্তারিত ঠিকানা</label>
              <textarea value={formData.areaDescription} onChange={(e) => setFormData({...formData, areaDescription: e.target.value})} placeholder="হাউজ নং, রোড নং, ল্যান্ডমার্ক উল্লেখ করুন..." className="w-full p-6 bg-slate-50 border-none rounded-2xl text-sm font-medium min-h-[100px] focus:ring-2 ring-blue-500 transition-all outline-none" />
            </div>
          </div>
          <div className="flex gap-4 mt-10">
            <button onClick={prevStep} className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"><ArrowLeft size={16}/> আগের ধাপ</button>
            <button onClick={nextStep} disabled={!formData.upazilaId || !formData.hostelName} className="flex-[2] h-14 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">পরবর্তী ধাপ <ArrowRight size={16}/></button>
          </div>
        </div>
      )}

      {/* STEP 3: Manager Profile */}
      {step === 3 && (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 animate-in slide-in-from-right duration-500">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50 text-center flex-col">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center shadow-lg shadow-blue-100"><User size={28} /></div>
             <div className="mt-4">
               <h2 className="text-2xl font-black tracking-tight">ম্যানেজার প্রোফাইল</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">অ্যাকাউন্ট অ্যাক্সেসের জন্য আপনার তথ্য দিন</p>
             </div>
          </div>
          <div className="space-y-5">
            <input placeholder="ম্যানেজারের সম্পূর্ণ নাম" onChange={(e)=>setFormData({...formData, managerName: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all" />
            <input placeholder="মোবাইল নম্বর" onChange={(e)=>setFormData({...formData, managerPhone: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all" />
            <input type="email" placeholder="ইমেইল এড্রেস" onChange={(e)=>setFormData({...formData, managerEmail: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all" />
            <input type="password" placeholder="পাসওয়ার্ড তৈরি করুন" onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-medium outline-none focus:ring-2 ring-blue-500 transition-all" />
            <label className="flex items-center gap-3 p-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-blue-600" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">আমি শর্তাবলী এবং প্রাইভেসি পলিসির সাথে একমত</span>
            </label>
          </div>
          <div className="flex gap-4 mt-10">
            <button onClick={prevStep} className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">আগের ধাপ</button>
            <button onClick={handleRegister} disabled={loading} className="flex-[2] h-14 bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all">
              {loading ? "প্রসেসিং..." : "অ্যাকাউন্ট তৈরি করুন"} <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success */}
      {step === 4 && (
        <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-[20px] shadow-2xl shadow-blue-50 border border-slate-50 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">✅</div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">স্বাগতম Chatrabash-এ!</h2>
          <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed text-sm">আপনার হোস্টেল রেজিস্ট্রেশন ও স্টার্টার প্যাকেজ সফলভাবে সম্পন্ন হয়েছে। শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।</p>
          <Link to="/signIn">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all flex items-center gap-3 mx-auto">
            এডমিন ড্যাশবোর্ডে যান <ArrowRight size={18} />
          </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HostelRegistration;