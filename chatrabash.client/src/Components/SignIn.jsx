import React, { useContext, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";

const SignIn = () => {
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");

  const { handleLogin } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const hostels = [
    "A.H. Hostel",
    "Younic Home",
    "Afroza Girls Hostel",
    "Rahat Villa",
  ];

  // 🔥 Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    handleLogin(email, password)
      .then(() => {
        location.state === null ? navigate("/home") : navigate(location.state);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="py-4 bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center px-4">
      
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 w-full max-w-md border border-blue-100">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          সাইন ইন করুন
        </h2>

        {/* Role Selector */}
        <div className="mb-6">
          <p className="mb-2 font-medium text-gray-700">
            অ্যাকাউন্টের ধরন নির্বাচন করুন
          </p>

          <div className="flex bg-blue-50 rounded-xl p-1">
            {["Admin", "Student", "Staff"].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setRole(item)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200
                  ${
                    role === item
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-700 hover:bg-blue-100"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              ইমেইল
            </label>
            <input
              name="email"
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              name="password"
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
            />
          </div>

          {/* Hostel Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              হোস্টেলের নাম নির্বাচন করুন
            </label>

            <select className="w-full border text-gray-600 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm">
              <option value="">হোস্টেল নির্বাচন করুন</option>
              {hostels.map((hostel, index) => (
                <option key={index}>{hostel}</option>
              ))}
            </select>
          </div>

          {/* Provided Code (Hidden for Admin) */}
          {role !== "Admin" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                প্রদত্ত কোড
              </label>
              <input
                type="text"
                placeholder="হোস্টেল থেকে পাওয়া কোড লিখুন"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl font-semibold
            shadow-md hover:shadow-lg hover:opacity-95
            active:scale-95 transition-all duration-150"
          >
            সাইন ইন করুন
          </button>
        </form>

        
        {/* Bottom Link */}
        <p className="text-sm text-center mt-5 text-gray-600">
          নতুন ব্যবহারকারী?{" "}
          <Link
            to="/signUp"
            className="text-blue-600 hover:underline font-medium"
          >
            অ্যাকাউন্ট তৈরি করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
