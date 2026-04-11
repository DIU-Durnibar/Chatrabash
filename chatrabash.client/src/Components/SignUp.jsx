import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";
import BrandLogo from "./BrandLogo";
import UserAvatar from "./UserAvatar";

const steps = [
  { n: 1, label: "অ্যাকাউন্ট" },
  { n: 2, label: "ব্যক্তিগত ও হোস্টেল" },
  { n: 3, label: "রুম ও নিশ্চিতকরণ" },
];

function validatePassword(pass) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
  return regex.test(pass);
}

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    hostelId: "",
    preferredRoomId: "",
    preferenceNote: "",
  });

  const [extraInfo, setExtraInfo] = useState({
    mobile: "",
    institution: "",
    bloodGroup: "",
    gender: "",
    religion: "",
    permanentAddress: "",
    emergencyContact: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [hostels, setHostels] = useState([]);
  const [usernameStatus, setUsernameStatus] = useState({ isChecking: false, message: "", isAvailable: true });
  const [passwordError, setPasswordError] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { ok, json: result } = await apiGet("/api/hostels");
      if (Array.isArray(result)) setHostels(result);
      else if (ok && result.success && Array.isArray(result.data)) setHostels(result.data);
    })();
  }, []);

  useEffect(() => {
    if (!formData.hostelId) {
      setAvailableRooms([]);
      return;
    }
    (async () => {
      setRoomsLoading(true);
      const r = await apiGet(`/api/hostels/search-rooms?hostelId=${encodeURIComponent(formData.hostelId)}`);
      if (r.ok && r.json?.success && Array.isArray(r.json.data)) setAvailableRooms(r.json.data);
      else setAvailableRooms([]);
      setRoomsLoading(false);
    })();
  }, [formData.hostelId]);

  const checkUsername = async (username) => {
    if (!username) return false;
    setUsernameStatus((s) => ({ ...s, isChecking: true }));
    try {
      const { json: result } = await apiGet(`/api/account/check-username?username=${encodeURIComponent(username)}`);
      if (!result?.success) {
        setUsernameStatus((s) => ({ ...s, isChecking: false, message: "ইউজারনেম যাচাই করা যায়নি।", isAvailable: false }));
        return false;
      }
      const ok = result.data.isAvailable;
      setUsernameStatus({
        isChecking: false,
        isAvailable: ok,
        message: ok ? "ইউজারনেমটি অ্যাভেলেবল!" : "এই ইউজারনেমটি ইতিমধ্যে নেওয়া হয়েছে।",
      });
      return ok;
    } catch {
      setUsernameStatus((s) => ({ ...s, isChecking: false }));
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (Object.prototype.hasOwnProperty.call(formData, name)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setExtraInfo((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "username") setUsernameStatus((s) => ({ ...s, message: "" }));
  };

  const goNextFromStep1 = async () => {
    setSubmitError("");
    if (!formData.displayName.trim() || !formData.username.trim() || !formData.email.trim()) {
      setSubmitError("নাম, ইউজারনেম ও ইমেইল পূরণ করুন।");
      return;
    }
    const nameOk = await checkUsername(formData.username);
    if (!nameOk) {
      setSubmitError("ইউজারনেম যাচাই করুন বা অন্য নাম বেছে নিন।");
      return;
    }
    if (!validatePassword(formData.password)) {
      setPasswordError("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে (বড়+ছোট হাতের অক্ষর ও স্পেশাল ক্যারেক্টারসহ)");
      setSubmitError("পাসওয়ার্ড নিয়ম মেনে চলছে না।");
      return;
    }
    setPasswordError("");
    if (formData.password !== confirmPassword) {
      setSubmitError("পাসওয়ার্ড দুইবার একই হতে হবে।");
      return;
    }
    setStep(2);
  };

  const goNextFromStep2 = () => {
    setSubmitError("");
    if (!extraInfo.mobile?.trim()) {
      setSubmitError("মোবাইল নম্বর দিন।");
      return;
    }
    if (!formData.hostelId) {
      setSubmitError("হোস্টেল নির্বাচন করুন।");
      return;
    }
    if (!extraInfo.institution?.trim() || !extraInfo.bloodGroup || !extraInfo.gender) {
      setSubmitError("প্রতিষ্ঠান, রক্তের গ্রুপ ও লিঙ্গ পূরণ করুন।");
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!termsAccepted) {
      setSubmitError("শর্তাবলীতে সম্মত হন।");
      return;
    }
    if (!usernameStatus.isAvailable || passwordError) {
      setSubmitError("ইউজারনেম ও পাসওয়ার্ড ঠিক করুন।");
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
      profilePictureUrl: "",
      phoneNumber: extraInfo.mobile?.replace(/\D/g, "") || null,
      institution: extraInfo.institution || null,
      bloodGroup: extraInfo.bloodGroup || null,
      gender: extraInfo.gender || null,
      emergencyContact: (extraInfo.emergencyContact || extraInfo.mobile || "").replace(/\D/g, "") || null,
    };

    try {
      const { json: result } = await apiPost("/api/account/register", payload);
      if (result.success) {
        alert(result.message);
        navigate("/signIn");
      } else {
        setSubmitError(result.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
      }
    } catch {
      setSubmitError("সার্ভারে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordField = (pass) => {
    if (pass && !validatePassword(pass)) {
      setPasswordError("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে (বড়+ছোট হাতের অক্ষর ও স্পেশাল ক্যারেক্টারসহ)");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                aria-label="পিছনে"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <BrandLogo to="/" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden items-center gap-1 text-emerald-700 sm:flex">
              <ShieldCheck className="h-4 w-4" />
              SSL সুরক্ষিত
            </span>
            <span className="text-slate-600">
              অ্যাকাউন্ট আছে?{" "}
              <Link to="/signIn" className="font-semibold text-[var(--cb-primary)] hover:underline">
                লগ-ইন
              </Link>
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white px-4 py-6 md:px-6">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
            {steps.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      step > s.n
                        ? "bg-[var(--cb-primary)] text-white"
                        : step === s.n
                          ? "bg-[var(--cb-primary)] text-white ring-4 ring-blue-100"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step > s.n ? <Check className="h-5 w-5" /> : s.n}
                  </div>
                  <span
                    className={`hidden text-center text-[10px] font-medium sm:block md:text-xs ${
                      step >= s.n ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-1 h-0.5 flex-1 rounded ${step > s.n ? "bg-[var(--cb-primary)]" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {submitError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {submitError}
          </div>
        )}

        {step === 1 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
              <User className="h-3.5 w-3.5" />
              বোর্ডার রেজিস্ট্রেশন
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-3xl">অ্যাকাউন্ট তৈরি করুন</h1>
            <p className="mt-2 text-sm text-slate-600">
              ম্যানেজার অনুমোদনের পর লগ-ইন সক্রিয় হবে। নিরাপদ পাসওয়ার্ড ও সঠিক ইমেইল ব্যবহার করুন।
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">পূর্ণ নাম *</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                  placeholder="আপনার নাম"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">ইউজারনেম *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => checkUsername(formData.username)}
                  required
                  className={`mt-1 w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)] ${
                    !usernameStatus.isAvailable ? "border-red-400" : "border-slate-200"
                  }`}
                  placeholder="rahim123"
                />
                {usernameStatus.message && (
                  <p className={`mt-1 text-xs font-semibold ${usernameStatus.isAvailable ? "text-emerald-600" : "text-red-600"}`}>
                    {usernameStatus.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">ইমেইল *</label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">পাসওয়ার্ড *</label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => validatePasswordField(formData.password)}
                    required
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)] ${
                      passwordError ? "border-red-400" : "border-slate-200"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="mt-1 text-xs font-semibold text-red-600">{passwordError}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">পাসওয়ার্ড নিশ্চিত করুন *</label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword2 ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    placeholder="আবার লিখুন"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <Link to="/register-hostel" className="text-sm font-bold text-[var(--cb-secondary)] hover:underline">
                হোস্টেল মালিক? →
              </Link>
              <button
                type="button"
                onClick={goNextFromStep1}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95"
              >
                পরবর্তী
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-xl font-extrabold text-slate-900">ব্যক্তিগত ও হোস্টেল</h2>
            <p className="mt-1 text-sm text-slate-600">যোগাযোগ ও হোস্টেল নির্বাচন করুন।</p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">মোবাইল *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={extraInfo.mobile}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                  placeholder="017XXXXXXXX"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">জরুরি যোগাযোগ</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={extraInfo.emergencyContact}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                  placeholder="খালি রাখলে মোবাইল ব্যবহার হবে"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">হোস্টেল *</label>
                <div className="relative mt-1">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    name="hostelId"
                    value={formData.hostelId}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {hostels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.hostelId ? (
                  (() => {
                    const sel = hostels.find((x) => x.id === formData.hostelId);
                    if (!sel) return null;
                    return (
                      <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
                        <UserAvatar url={sel.managerProfilePictureUrl} className="h-10 w-10 border-slate-200" />
                        <div>
                          <p className="font-semibold text-slate-800">ম্যানেজার: {sel.managerName}</p>
                          {sel.managerPhone ? <p className="text-slate-500">{sel.managerPhone}</p> : null}
                        </div>
                      </div>
                    );
                  })()
                ) : null}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">শিক্ষা প্রতিষ্ঠান *</label>
                <input
                  type="text"
                  name="institution"
                  value={extraInfo.institution}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">রক্তের গ্রুপ *</label>
                <select
                  name="bloodGroup"
                  value={extraInfo.bloodGroup}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                >
                  <option value="">সিলেক্ট করুন</option>
                  <option>A+</option>
                  <option>B+</option>
                  <option>O+</option>
                  <option>AB+</option>
                  <option>A-</option>
                  <option>B-</option>
                  <option>O-</option>
                  <option>AB-</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">লিঙ্গ *</label>
                <select
                  name="gender"
                  value={extraInfo.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                >
                  <option value="">সিলেক্ট করুন</option>
                  <option>পুরুষ</option>
                  <option>মহিলা</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">ধর্ম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  name="religion"
                  value={extraInfo.religion}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">স্থায়ী ঠিকানা (ঐচ্ছিক)</label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={extraInfo.permanentAddress}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={goNextFromStep2}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95"
              >
                পরবর্তী
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-xl font-extrabold text-slate-900">রুম ও চূড়ান্ত</h2>
            <p className="mt-1 text-sm text-slate-600">খালি সিট থাকলে পছন্দের রুম বেছে নিতে পারবেন।</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">উপলব্ধ রুম (ঐচ্ছিক)</label>
                {roomsLoading ? (
                  <p className="mt-2 text-sm text-[var(--cb-primary)]">রুম লোড হচ্ছে...</p>
                ) : availableRooms.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">এই হোস্টেলে এখন খালি রুম লিস্টে নেই — পরে ম্যানেজার বরাদ্দ দেবেন।</p>
                ) : (
                  <select
                    name="preferredRoomId"
                    value={formData.preferredRoomId}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                  >
                    <option value="">রুম নির্বাচন করব না</option>
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} — ৳{Number(r.monthlyRent || 0).toLocaleString("bn-BD")} · খালি {r.seatAvailable}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">নোট (ঐচ্ছিক)</label>
                <textarea
                  name="preferenceNote"
                  value={formData.preferenceNote}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                  placeholder="যেমন: AC রুম প্রয়োজন"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">
                  আমি নিশ্চিত করছি তথ্য সঠিক। ম্যানেজার অনুমোদনের আগে লগ-ইন করা যাবে না — এতে সম্মত।
                </span>
              </label>
            </div>

            <div className="mt-10 flex flex-wrap justify-between gap-3">
              <Link to="/signIn" className="text-sm font-semibold text-slate-600 hover:text-[var(--cb-primary)]">
                ← লগ-ইনে ফিরুন
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[var(--cb-primary)] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "প্রসেসিং..." : "রেজিস্ট্রেশন সম্পন্ন করুন"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
