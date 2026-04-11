import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Star, Wallet } from "lucide-react";
import { apiGet, apiPost } from "../../lib/api";
import { formatBdDate } from "../../lib/datetime";
import { publicUrl } from "../../lib/assets";

const monthsBn = ["", "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

function statusBadge(status) {
  if (status === "Paid") return "bg-emerald-100 text-emerald-800";
  if (status === "Partial") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-700";
}

function statusLabel(status) {
  if (status === "Paid") return "পেইড";
  if (status === "Partial") return "আংশিক";
  return "বকেয়া";
}

export default function BoarderOverviewPage() {
  const [dash, setDash] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payBill, setPayBill] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [d, b] = await Promise.all([apiGet("/api/boarder/dashboard"), apiGet("/api/boarder/my-bills")]);
      if (d.ok && d.json?.success) setDash(d.json.data);
      if (b.ok && b.json?.success) setBills(Array.isArray(b.json.data) ? b.json.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalPaid = bills.reduce((s, x) => s + Number(x.paidAmount || 0), 0);
  const totalDueAll = bills.reduce((s, x) => s + Number(x.dueAmount || 0), 0);
  const paidMonths = bills.filter((x) => x.status === "Paid").length;

  const current =
    bills.find((x) => x.status !== "Paid" && Number(x.dueAmount) > 0) || bills[0] || null;
  const dueNow = current ? Number(current.dueAmount) : 0;
  const progress =
    current && Number(current.totalAmount) > 0
      ? Math.round((Number(current.paidAmount) / Number(current.totalAmount)) * 100)
      : 0;

  const submitPay = async (e) => {
    e.preventDefault();
    if (!payBill) return;
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;
    const r = await apiPost("/api/boarder/pay-bill-mock", {
      billId: payBill.id,
      amount: amt,
      paymentMethod: "Cash",
      transactionId: "",
    });
    if (r.ok && r.json?.success) {
      alert(r.json.message);
      setPayOpen(false);
      setPayBill(null);
      load();
    } else {
      alert(r.json?.message || "পেমেন্ট ব্যর্থ");
    }
  };

  if (loading) {
    return <div className="p-10 text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</div>;
  }

  const room = dash?.room;

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={publicUrl(dash?.profile?.profilePictureUrl)}
            alt=""
            className="h-14 w-14 rounded-full border border-slate-200 object-cover"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              স্বাগতম, {dash?.profile?.name || "বোর্ডার"}!
            </h1>
            <p className="text-sm text-slate-500">
              ওভারভিউ — {formatBdDate(new Date())}
            </p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {dash?.billingSummary != null && (
          <p className="mb-4 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
            <span className="font-semibold">বিল সারাংশ:</span> মোট বকেয়া{" "}
            <span className="font-bold text-red-700">৳{Number(dash.billingSummary.totalDue).toLocaleString("bn-BD")}</span>
            {dash.billingSummary.openBillCount > 0 && (
              <> · খোলা বিল {dash.billingSummary.openBillCount} টি (ম্যানেজার যোগ করা অতিরিক্ত চার্জ এখানে যুক্ত হবে)</>
            )}
          </p>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-600" />
            <p className="text-2xl font-bold text-emerald-700">৳{totalPaid.toLocaleString("bn-BD")}</p>
            <p className="text-xs text-slate-500">মোট পরিশোধিত</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <AlertTriangle className="mb-2 h-8 w-8 text-red-500" />
            <p className="text-2xl font-bold text-red-600">৳{totalDueAll.toLocaleString("bn-BD")}</p>
            <p className="text-xs text-slate-500">মোট বকেয়া</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <Star className="mb-2 h-8 w-8 text-[var(--cb-primary)]" />
            <p className="text-2xl font-bold text-[var(--cb-primary)]">
              {paidMonths}/{bills.length || 0}
            </p>
            <p className="text-xs text-slate-500">পেইড মাস</p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">আমার রুমের তথ্য</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                সক্রিয়
              </span>
            </div>
            {!room ? (
              <p className="text-sm text-slate-500">রুম এখনো বরাদ্দ হয়নি। ম্যানেজারের অনুমোদনের অপেক্ষায়।</p>
            ) : (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <dt className="text-slate-500">হোস্টেল</dt>
                  <dd className="font-semibold">{dash?.hostel?.name}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <dt className="text-slate-500">রুম নং</dt>
                  <dd className="font-semibold">{room.roomNo}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 py-2">
                  <dt className="text-slate-500">ফ্লোর</dt>
                  <dd className="font-semibold">{room.floor}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-slate-500">টাইপ</dt>
                  <dd className="font-semibold">
                    {room.acAvailable ? "AC" : "নন-AC"}
                    {room.attachedBath ? ", এটাচ বাথ" : ""}
                  </dd>
                </div>
                {room.roomMates?.length > 0 && (
                  <div className="pt-2">
                    <p className="mb-2 text-xs font-semibold text-slate-500">রুমমেটস</p>
                    <div className="flex flex-wrap gap-2">
                      {room.roomMates.map((n) => (
                        <span key={n} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </dl>
            )}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[var(--cb-primary)] to-[#0b1a4a] p-6 text-white shadow-lg">
            <p className="text-sm text-blue-200">
              বর্তমান বকেয়া — {current ? `${monthsBn[current.month]} ${current.year}` : "—"}
            </p>
            <p className="mt-2 text-4xl font-extrabold">৳{dueNow.toLocaleString("bn-BD")}</p>
            {current && (
              <>
                <p className="mt-4 text-xs text-blue-200">পেমেন্ট অগ্রগতি</p>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full bg-white" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-1 text-xs">
                  মোট বিল ৳{Number(current.totalAmount).toLocaleString("bn-BD")} · পরিশোধিত ৳
                  {Number(current.paidAmount).toLocaleString("bn-BD")}
                </p>
              </>
            )}
            <button
              type="button"
              disabled={!current || dueNow <= 0}
              onClick={() => {
                setPayBill(current);
                setPayAmount(String(dueNow));
                setPayOpen(true);
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-[var(--cb-primary)] disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" />
              পেমেন্ট করুন
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">আমার বিলের হিস্ট্রি</h2>
            <Link to="/home/boarder/bills" className="text-sm font-semibold text-[var(--cb-primary)]">
              সব দেখুন
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                  <th className="pb-2">মাস</th>
                  <th className="pb-2">মোট বিল</th>
                  <th className="pb-2">পরিশোধিত</th>
                  <th className="pb-2">বকেয়া</th>
                  <th className="pb-2">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {bills.slice(0, 6).map((b) => (
                  <tr key={b.id} className="border-b border-slate-50">
                    <td className="py-2">
                      {monthsBn[b.month]} {b.year}
                    </td>
                    <td className="py-2">৳{Number(b.totalAmount).toLocaleString("bn-BD")}</td>
                    <td className="py-2">৳{Number(b.paidAmount).toLocaleString("bn-BD")}</td>
                    <td className="py-2">
                      {Number(b.dueAmount) > 0 ? `৳${Number(b.dueAmount).toLocaleString("bn-BD")}` : "—"}
                    </td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusBadge(b.status)}`}>
                        {statusLabel(b.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {payOpen && payBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">মক পেমেন্ট</h3>
            <p className="mt-1 text-sm text-slate-500">টেস্টিংয়ের জন্য — আসল গেটওয়ে পরে যুক্ত হবে</p>
            <form onSubmit={submitPay} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">পরিমাণ</label>
                <input
                  type="number"
                  step="0.01"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[var(--cb-primary)] py-2 text-sm font-bold text-white"
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
