import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { apiGet, apiPost } from "../../lib/api";

export default function BoarderReviewPanel() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/boarder/my-review");
      if (r.ok && r.json?.success && r.json.data) {
        setExisting(r.json.data);
        setRating(r.json.data.rating || 5);
        setComment(r.json.data.comment || "");
      }
      setLoading(false);
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const r = await apiPost("/api/boarder/review", { rating, comment });
    if (r.ok && r.json?.success) {
      alert(r.json.message);
      setExisting({ rating, comment, createdAt: new Date().toISOString() });
    } else {
      alert(r.json?.message || "ব্যর্থ");
    }
  };

  if (loading) {
    return <p className="text-[var(--cb-primary)]">লোড হচ্ছে...</p>;
  }

  return (
    <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">আপনার হোস্টেল রিভিউ</h2>
      <p className="mt-1 text-sm text-slate-500">শুধুমাত্র আপনার বর্তমান হোস্টেলের জন্য। আপডেট করতে পারবেন।</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500">রেটিং</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="rounded-lg p-1 text-amber-400 hover:bg-amber-50"
              >
                <Star className={`h-8 w-8 ${n <= rating ? "fill-current" : ""}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">মন্তব্য</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
          />
        </div>
        <button type="submit" className="w-full rounded-xl bg-[var(--cb-primary)] py-3 text-sm font-bold text-white">
          {existing ? "রিভিউ আপডেট করুন" : "রিভিউ জমা দিন"}
        </button>
      </form>
    </div>
  );
}
