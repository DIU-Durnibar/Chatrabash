import { useEffect, useState } from "react";
import { apiFetch, apiGet, apiPut } from "../lib/api";
import { publicUrl } from "../lib/assets";

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    phoneNumber: "",
    bio: "",
    institution: "",
    bloodGroup: "",
    emergencyContact: "",
    gender: "",
  });
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/account/profile");
      if (r.ok && r.json?.success && r.json.data) {
        const d = r.json.data;
        setForm({
          displayName: d.displayName || "",
          phoneNumber: d.phoneNumber || "",
          bio: d.bio || "",
          institution: d.institution || "",
          bloodGroup: d.bloodGroup || "",
          emergencyContact: d.emergencyContact || "",
          gender: d.gender || "",
        });
        setPhoto(d.profilePictureUrl || "");
      }
      setLoading(false);
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const r = await apiPut("/api/account/profile", {
      displayName: form.displayName,
      phoneNumber: form.phoneNumber,
      bio: form.bio,
      institution: form.institution,
      bloodGroup: form.bloodGroup,
      emergencyContact: form.emergencyContact,
      gender: form.gender,
    });
    setSaving(false);
    if (r.ok && r.json?.success) alert(r.json.message || "সংরক্ষিত");
    else alert(r.json?.message || "ব্যর্থ");
  };

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const r = await apiFetch("/api/account/upload-photo", { method: "POST", body: fd });
    if (r.ok && r.json?.success && r.json.data?.photoUrl) {
      setPhoto(r.json.data.photoUrl);
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      u.profilePictureUrl = r.json.data.photoUrl;
      localStorage.setItem("user", JSON.stringify(u));
      alert(r.json.message || "আপলোড সফল");
    } else {
      alert(r.json?.message || "আপলোড ব্যর্থ");
    }
    e.target.value = "";
  };

  if (loading) {
    return <div className="p-10 text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</div>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={publicUrl(photo)}
          alt=""
          className="h-20 w-20 rounded-full border-2 border-slate-200 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = publicUrl("");
          }}
        />
        <div>
          <label className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[var(--cb-primary)] hover:bg-slate-50">
            ছবি পরিবর্তন
            <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </label>
          <p className="mt-1 text-xs text-slate-500">JPG, PNG — সর্বোচ্চ যুক্তিসঙ্গত সাইজ</p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">প্রোফাইল সম্পাদনা</h2>
        {[
          ["displayName", "পূর্ণ নাম"],
          ["phoneNumber", "মোবাইল"],
          ["bio", "সংক্ষিপ্ত পরিচিতি"],
          ["institution", "শিক্ষা প্রতিষ্ঠান"],
          ["bloodGroup", "রক্তের গ্রুপ"],
          ["emergencyContact", "জরুরি যোগাযোগ"],
          ["gender", "লিঙ্গ"],
        ].map(([k, label]) => (
          <div key={k}>
            <label className="text-xs font-semibold text-slate-500">{label}</label>
            <input
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--cb-primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "সংরক্ষণ..." : "সংরক্ষণ করুন"}
        </button>
      </form>
    </div>
  );
}
