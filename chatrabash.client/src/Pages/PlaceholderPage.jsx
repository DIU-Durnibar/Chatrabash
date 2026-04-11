export default function PlaceholderPage({ title, hint }) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{hint || "এই মডিউলটি শীঘ্রই যুক্ত করা হবে।"}</p>
    </div>
  );
}
