import { useState } from "react";
import { User, ImagePlus } from "lucide-react";
import EditProfilePage from "../EditProfilePage";
import ManagerHostelPhotosPanel from "./ManagerHostelPhotosPanel";

const tabs = [
  { id: "profile", label: "প্রোফাইল", icon: User },
  { id: "photos", label: "হোস্টেল ছবি", icon: ImagePlus },
];

export default function ManagerSettingsPage() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">সেটিংস</h1>
        <p className="text-sm text-slate-500">প্রোফাইল ও হোস্টেল মিডিয়া</p>
      </header>
      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === t.id ? "bg-[var(--cb-primary)] text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
        {tab === "profile" && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <EditProfilePage />
          </div>
        )}
        {tab === "photos" && <ManagerHostelPhotosPanel />}
      </div>
    </div>
  );
}
