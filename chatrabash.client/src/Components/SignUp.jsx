import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";

const SignUp = () => {
  const navigate = useNavigate();
  const { handleRegister, handleUpdateProfile } = useContext(AuthContext);
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");

  const hostels = [
    "A.H. Hostel",
    "Younic Home",
    "Afroza Girls Hostel",
    "Rahat Villa",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      username: e.target.username.value,
      password: e.target.password.value,
      mobile: e.target.mobile.value,
      hostel: e.target.hostel.value,
      code: e.target.code?.value || "",
      role,
      address: e.target.address?.value || "",
      currentAddress: e.target.currentAddress?.value || "",
      university: e.target.university?.value || "",
      workplace: e.target.workplace?.value || "",
    };

    // Password validation
    if (formData.password.length < 6) {
      setError("Password length should be at least 6 characters.");
      return;
    }

    // Firebase registration
    handleRegister(formData.email, formData.password)
      .then((res) => {
        // Update profile with full name and username as photoURL (optional)
        handleUpdateProfile(formData.fullName, formData.username)
          .then(() => navigate("/signIn"))
          .catch((err) => setError(err.message));
      })
      .catch((err) => setError(err.message));
  };


  return (
    <div className="py-4 bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center px-4 min-h-screen">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 w-full max-w-lg border border-blue-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          রেজিস্ট্রেশন করুন
        </h2>

        {/* Role Selector */}
        <div className="mb-6">
          <p className="mb-2 font-medium text-gray-700">অ্যাকাউন্টের ধরন নির্বাচন করুন</p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
          >
            <option value="Admin">Admin</option>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">পূর্ণ নাম</label>
            <input
              name="fullName"
              type="text"
              placeholder="আপনার নাম লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ইমেইল</label>
            <input
              name="email"
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ব্যবহারকারীর ইউজারনেম</label>
            <input
              name="username"
              type="text"
              placeholder="একটি ইউনিক ইউজারনেম লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">পাসওয়ার্ড</label>
            <input
              name="password"
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">মোবাইল নম্বর</label>
            <input
              name="mobile"
              type="text"
              placeholder="মোবাইল নম্বর লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          {/* Hostel Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">হোস্টেল নির্বাচন করুন</label>
            <select
              name="hostel"
              required
              className="w-full border text-gray-600 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            >
              <option value="">হোস্টেল নির্বাচন করুন</option>
              {hostels.map((hostel, index) => (
                <option key={index}>{hostel}</option>
              ))}
            </select>
          </div>

          {/* Optional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">প্রদত্ত কোড</label>
            <input
              name="code"
              type="text"
              placeholder="হোস্টেল থেকে পাওয়া কোড লিখুন"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ঠিকানা</label>
            <input
              name="address"
              type="text"
              placeholder="স্থায়ী ঠিকানা"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">বর্তমান ঠিকানা</label>
            <input
              name="currentAddress"
              type="text"
              placeholder="বর্তমান ঠিকানা"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">শিক্ষাপ্রতিষ্ঠান</label>
            <input
              name="university"
              type="text"
              placeholder="আপনার বিশ্ববিদ্যালয় বা কলেজ"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">কর্মস্থল (ঐচ্ছিক)</label>
            <input
              name="workplace"
              type="text"
              placeholder="আপনার কর্মস্থল"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>


          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:opacity-95 active:scale-95 transition-all duration-150 mt-2"
          >
            রেজিস্ট্রেশন করুন
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
