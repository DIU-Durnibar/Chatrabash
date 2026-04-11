import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  User,
  Zap,
  Lock,
} from "lucide-react";
import { apiGet, apiPost } from "../lib/api";
import BrandLogo from "../Components/BrandLogo";

const steps = [
  { n: 1, label: "প্যাকেজ নির্বাচন" },
  { n: 2, label: "হোস্টেলের তথ্য" },
  { n: 3, label: "ম্যানেজার প্রোফাইল" },
];

function isPopularPackage(pkg) {
  const n = (pkg?.name || "").toLowerCase();
  return n.includes("professional") || n.includes("প্রফেশনাল");
}

function packageIcon(pkg) {
  const n = (pkg?.name || "").toLowerCase();
  if (n.includes("enterprise") || n.includes("এন্টারপ্রাইজ")) return Building2;
  if (isPopularPackage(pkg)) return Star;
  return Zap;
}

function validatePassword(pass) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
  return regex.test(pass);
}

function validateBdPhone(p) {
  const digits = p.replace(/\D/g, "");
  return /^01\d{9}$/.test(digits);
}

export default function HostelRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [subscriptionPackageId, setSubscriptionPackageId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");

  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/saas/packages");
      if (r.ok && r.json?.success && Array.isArray(r.json.data)) {
        const list = [...r.json.data].sort((a, b) => (a.monthlyPrice ?? 0) - (b.monthlyPrice ?? 0));
        setPackages(list);
      }
      setPackagesLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/location/divisions");
      if (r.ok && r.json?.success) setDivisions(r.json.data || []);
    })();
  }, []);

  useEffect(() => {
    if (!divisionId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    (async () => {
      const r = await apiGet(`/api/location/districts/${divisionId}`);
      if (r.ok && r.json?.success) setDistricts(r.json.data || []);
    })();
  }, [divisionId]);

  useEffect(() => {
    if (!districtId) {
      setUpazilas([]);
      setUpazilaId("");
      return;
    }
    (async () => {
      const r = await apiGet(`/api/location/upazilas/${districtId}`);
      if (r.ok && r.json?.success) setUpazilas(r.json.data || []);
    })();
  }, [districtId]);

  const locationProgress = useMemo(() => {
    let c = 0;
    if (divisionId) c++;
    if (districtId) c++;
    if (upazilaId) c++;
    if (areaDescription.trim()) c++;
    return c;
  }, [divisionId, districtId, upazilaId, areaDescription]);

  const planSummary = selectedPackage
    ? `${selectedPackage.name} — ৳${Number(selectedPackage.monthlyPrice || 0).toLocaleString("bn-BD")}/মাস`
    : "";

  const selectPackage = (pkg) => {
    setSubscriptionPackageId(pkg.id);
    setSelectedPackage(pkg);
  };

  const goNextFromStep1 = () => {
    if (subscriptionPackageId == null) return;
    setStep(2);
  };

  const goNextFromStep2 = () => {
    if (!hostelName.trim()) {
      alert("হোস্টেলের নাম দিন।");
      return;
    }
    if (!divisionId || !districtId || !upazilaId) {
      alert("বিভাগ, জেলা ও উপজেলা নির্বাচন করুন।");
      return;
    }
    if (!areaDescription.trim()) {
      alert("বিস্তারিত ঠিকানা লিখুন।");
      return;
    }
    setStep(3);
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!managerName.trim()) {
      setSubmitError("ম্যানেজারের নাম দিন।");
      return;
    }
    if (!validateBdPhone(managerPhone)) {
      setSubmitError("সঠিক বাংলাদেশী মোবাইল নম্বর দিন (01XXXXXXXXX)।");
      return;
    }
    if (!managerEmail.trim() || !managerEmail.includes("@")) {
      setSubmitError("সঠিক ইমেইল দিন।");
      return;
    }
    if (!validatePassword(password)) {
      setSubmitError(
        "পাসওয়ার্ড অন্তত ৮ অক্ষর, ছোট ও বড় হাতের অক্ষর ও একটি বিশেষ চিহ্ন (!@#$%^&*) থাকতে হবে।"
      );
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError("পাসওয়ার্ড মিলছে না।");
      return;
    }
    if (!termsAccepted) {
      setSubmitError("শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হন।");
      return;
    }

    let packagePaymentTransactionId = null;
    const price = Number(selectedPackage?.monthlyPrice || 0);
    if (price > 0) {
      const payR = await apiPost("/api/saas/mock-pay-package", { packageId: subscriptionPackageId });
      if (!payR.ok || !payR.json?.success || !payR.json.data?.transactionId) {
        setSubmitError(payR.json?.message || "মক পেমেন্ট ব্যর্থ — আবার চেষ্টা করুন।");
        return;
      }
      packagePaymentTransactionId = payR.json.data.transactionId;
    }

    const payload = {
      hostelName: hostelName.trim(),
      areaDescription: areaDescription.trim(),
      divisionId: Number(divisionId),
      districtId: Number(districtId),
      upazilaId: Number(upazilaId),
      subscriptionPackageId: subscriptionPackageId,
      managerName: managerName.trim(),
      managerEmail: managerEmail.trim(),
      managerPhone: managerPhone.replace(/\D/g, ""),
      password,
      packagePaymentTransactionId,
    };

    setSubmitting(true);
    const r = await apiPost("/api/saas/register-hostel", payload);
    setSubmitting(false);

    if (r.ok && r.json?.success) {
      setStep(4);
    } else {
      setSubmitError(r.json?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                aria-label="পিছনে"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex flex-col items-start gap-1.5">
              <BrandLogo to="/" imgClassName="max-w-[12rem]" />
              <span className="text-[11px] font-medium text-slate-500">বাংলাদেশের হোস্টেল প্ল্যাটফর্ম</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden items-center gap-1 text-emerald-700 sm:flex">
              <ShieldCheck className="h-4 w-4" />
              SSL সুরক্ষিত
            </span>
            <span className="text-slate-600">
              অ্যাকাউন্ট আছে?{" "}
              <Link to="/signIn" className="font-semibold text-[var(--cb-primary)] hover:underline">
                লগ-ইন করুন
              </Link>
            </span>
          </div>
        </div>

        {step < 4 && (
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
                    <div
                      className={`mx-1 h-0.5 flex-1 rounded ${step > s.n ? "bg-[var(--cb-primary)]" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {step === 1 && (
          <div>
            <div className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
              ১৪ দিনের ফ্রি ট্রায়াল — কোনো ক্রেডিট কার্ড দরকার নেই
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 md:text-3xl">
              আপনার হোস্টেলের জন্য সেরা প্ল্যান বেছে নিন
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              সব প্ল্যানে ১৪ দিনের ফ্রি ট্রায়াল; যেকোনো সময় পরিবর্তন করতে পারবেন।
            </p>

            {packagesLoading ? (
              <p className="mt-10 text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
            ) : (
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {packages.map((pkg) => {
                  const Icon = packageIcon(pkg);
                  const popular = isPopularPackage(pkg);
                  const selected = subscriptionPackageId === pkg.id;
                  const isStarter = Number(pkg.monthlyPrice) === 0;
                  return (
                    <div
                      key={pkg.id}
                      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition ${
                        popular ? "border-[var(--cb-primary)] shadow-md ring-1 ring-[var(--cb-primary)]/20" : "border-slate-200"
                      } ${selected ? "ring-2 ring-[var(--cb-primary)]" : ""}`}
                    >
                      {popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--cb-primary)] px-3 py-0.5 text-[10px] font-bold text-white">
                          জনপ্রিয়
                        </span>
                      )}
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--cb-primary)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">সাবস্ক্রিপশন প্যাকেজ</p>
                      <p className="mt-4 text-2xl font-extrabold text-[var(--cb-primary)]">
                        {isStarter
                          ? "৳ ০ / মাস"
                          : pkg.name.toLowerCase().includes("enterprise") || pkg.name.includes("এন্টারপ্রাইজ")
                            ? `৳${Number(pkg.monthlyPrice).toLocaleString("bn-BD")}+ / মাস`
                            : `৳${Number(pkg.monthlyPrice).toLocaleString("bn-BD")} / মাস`}
                      </p>
                      <ul className="mt-4 flex-1 space-y-2 text-xs text-slate-600">
                        <li className="flex gap-2">
                          <User className="h-4 w-4 shrink-0 text-slate-400" />
                          সর্বোচ্চ {pkg.maxBoarders} বোর্ডার
                        </li>
                        {(pkg.features || "")
                          .split(",")
                          .map((f) => f.trim())
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((f) => (
                            <li key={f} className="flex gap-2">
                              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                              {f}
                            </li>
                          ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => selectPackage(pkg)}
                        className={`mt-6 w-full rounded-xl py-3 text-sm font-bold transition ${
                          popular
                            ? "bg-[var(--cb-primary)] text-white hover:opacity-95"
                            : "border-2 border-slate-200 bg-white text-slate-800 hover:border-[var(--cb-primary)]"
                        }`}
                      >
                        {popular
                          ? "প্রো প্ল্যান বেছে নিন"
                          : isStarter
                            ? "ফ্রি শুরু করুন"
                            : "বেছে নিন"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-8 text-center text-xs text-slate-500">
              বাংলা ইন্টারফেস, ডেটা এক্সপোর্ট ও নিরাপদ পেমেন্ট — সব প্ল্যানে
            </p>

            <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[var(--cb-primary)]"
              >
                <ArrowLeft className="h-4 w-4" />
                হোমে ফিরুন
              </Link>
              <button
                type="button"
                disabled={subscriptionPackageId == null}
                onClick={goNextFromStep1}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-8 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                পরবর্তী ধাপ
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {selectedPackage && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm">
                <span>
                  <span className="font-semibold text-slate-700">নির্বাচিত প্ল্যান:</span>{" "}
                  <span className="text-[var(--cb-primary)]">{planSummary}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-semibold text-[var(--cb-primary)] hover:underline"
                >
                  পরিবর্তন করুন
                </button>
              </div>
            )}

            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cb-primary)]/10 text-[var(--cb-primary)]">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">হোস্টেলের তথ্য দিন</h1>
            <p className="mt-1 text-sm text-slate-600">আপনার হোস্টেলের নাম ও অবস্থান নিশ্চিত করুন</p>

            <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--cb-primary)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cb-primary)] text-xs text-white">
                    ১
                  </span>
                  হোস্টেলের নাম
                </div>
                <div className="relative mt-2">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={hostelName}
                    onChange={(e) => setHostelName(e.target.value)}
                    placeholder="যেমন: সুপার স্টুডেন্ট হোস্টেল"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[var(--cb-primary)] focus:ring-1 focus:ring-[var(--cb-primary)]"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">আপনার হোস্টেলের আনুষ্ঠানিক নাম লিখুন</p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--cb-primary)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cb-primary)] text-xs text-white">
                    ২
                  </span>
                  হোস্টেলের অবস্থান
                </div>
                <p className="mb-2 text-xs text-slate-500">
                  অবস্থান পূরণের অগ্রগতি: {locationProgress}/৪ সম্পন্ন
                </p>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-[var(--cb-primary)] transition-all"
                    style={{ width: `${(locationProgress / 4) * 100}%` }}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">বিভাগ নির্বাচন করুন</label>
                    <select
                      value={divisionId}
                      onChange={(e) => setDivisionId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    >
                      <option value="">বিভাগ বেছে নিন...</option>
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.bengaliName || d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">জেলা নির্বাচন করুন</label>
                    <select
                      value={districtId}
                      onChange={(e) => setDistrictId(e.target.value)}
                      disabled={!divisionId}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)] disabled:bg-slate-50"
                    >
                      <option value="">{divisionId ? "জেলা বেছে নিন..." : "আগে বিভাগ নির্বাচন করুন"}</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.bengaliName || d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">উপজেলা বা থানা</label>
                    <select
                      value={upazilaId}
                      onChange={(e) => setUpazilaId(e.target.value)}
                      disabled={!districtId}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)] disabled:bg-slate-50"
                    >
                      <option value="">{districtId ? "উপজেলা বেছে নিন..." : "আগে জেলা নির্বাচন করুন"}</option>
                      {upazilas.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.bengaliName || u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">বিস্তারিত ঠিকানা</label>
                    <textarea
                      value={areaDescription}
                      onChange={(e) => setAreaDescription(e.target.value)}
                      rows={3}
                      placeholder="যেমন: হাউজ নং ২৪/বি, রোড নং ৭, মেইন বাজার সংলগ্ন..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    />
                    <p className="mt-1 text-xs text-slate-500">হাউজ নং, রোড নং, ল্যান্ডমার্ক ইত্যাদি উল্লেখ করুন</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--cb-primary)] bg-white px-6 py-3 text-sm font-bold text-[var(--cb-primary)]"
              >
                <ChevronLeft className="h-4 w-4" />
                আগের ধাপ
              </button>
              <button
                type="button"
                onClick={goNextFromStep2}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-8 py-3 text-sm font-bold text-white"
              >
                পরবর্তী ধাপ
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {selectedPackage && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--cb-primary)]" />
                  <span className="font-semibold text-slate-700">নির্বাচিত প্ল্যান:</span>{" "}
                  <span className="text-[var(--cb-primary)]">{planSummary}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-semibold text-[var(--cb-primary)] hover:underline"
                >
                  পরিবর্তন করুন
                </button>
              </div>
            )}

            <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cb-primary)]/10 text-[var(--cb-primary)]">
                <User className="h-7 w-7" />
              </div>
              <h1 className="text-center text-xl font-extrabold text-slate-900">ম্যানেজারের প্রোফাইল</h1>
              <p className="mt-1 text-center text-sm text-slate-600">অ্যাকাউন্ট অ্যাক্সেসের জন্য আপনার তথ্য দিন</p>

              <form onSubmit={submitRegistration} className="mt-8 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">ম্যানেজারের সম্পূর্ণ নাম</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      placeholder="আপনার পুরো নাম"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">মোবাইল নম্বর</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={managerPhone}
                      onChange={(e) => setManagerPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">বাংলাদেশী নম্বর (01X-XXXXXXXX)</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">ইমেইল এড্রেস</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      placeholder="manager@yourmail.com"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">পাসওয়ার্ড</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="কমপক্ষে ৮ অক্ষর"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300"
                  />
                  <span>
                    আমি{" "}
                    <Link to="/" className="font-semibold text-[var(--cb-primary)] hover:underline">
                      শর্তাবলী
                    </Link>{" "}
                    এবং{" "}
                    <Link to="/" className="font-semibold text-[var(--cb-primary)] hover:underline">
                      প্রাইভেসি পলিসি
                    </Link>
                    র সাথে একমত
                  </span>
                </label>

                {submitError && <p className="text-sm font-medium text-red-600">{submitError}</p>}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--cb-primary)] bg-white px-6 py-3 text-sm font-bold text-[var(--cb-primary)]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    আগের ধাপ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cb-primary)] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {submitting ? "প্রসেসিং..." : "অ্যাকাউন্ট তৈরি করুন"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="relative mb-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--cb-primary)] text-white shadow-lg">
                <ShieldCheck className="h-12 w-12" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                <Check className="h-6 w-6" />
              </span>
            </div>
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-800">
              অ্যাকাউন্ট তৈরি সফল হয়েছে!
            </span>
            <h1 className="mt-6 text-2xl font-extrabold text-slate-900 md:text-3xl">স্বাগতম ছাত্রাবাস.কম-এ!</h1>
            <p className="mt-3 max-w-md text-sm text-slate-600">
              আপনার হোস্টেল রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে। এখন লগ-ইন করে অ্যাডমিন ড্যাশবোর্ড ব্যবহার করুন।
            </p>
            <p className="mt-2 text-sm text-slate-500">আমাদের টিম প্রয়োজনে আপনার সাথে যোগাযোগ করবে।</p>
            <button
              type="button"
              onClick={() => navigate("/signIn")}
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[var(--cb-primary)] px-10 py-4 text-sm font-bold text-white shadow-lg hover:opacity-95"
            >
              অ্যাডমিন ড্যাশবোর্ডে যান
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {step < 4 && (
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-600">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link to="/signIn" className="font-semibold text-[var(--cb-primary)] hover:underline">
            লগ-ইন করুন
          </Link>
        </footer>
      )}
    </div>
  );
}
