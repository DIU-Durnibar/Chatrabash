import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../lib/api";

const monthsBn = ["", "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

export default function BoarderBillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payBill, setPayBill] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await apiGet("/api/boarder/my-bills");
    if (r.ok && r.json?.success) setBills(Array.isArray(r.json.data) ? r.json.data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const pay = async (e) => {
    e.preventDefault();
    if (!payBill) return;
    const amt = Number(payAmount);
    const r = await apiPost("/api/boarder/pay-bill-mock", {
      billId: payBill.id,
      amount: amt,
      paymentMethod: "Cash",
      transactionId: "",
    });
    if (r.ok && r.json?.success) {
      alert(r.json.message);
      setPayBill(null);
      load();
    } else {
      alert(r.json?.message || "ব্যর্থ");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">আমার বিল ও পেমেন্ট</h1>
        <p className="text-sm text-slate-500">সব মাসিক বিল ও মক পেমেন্ট</p>
      </header>

      <div className="p-6">
        {loading ? (
          <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
        ) : bills.length === 0 ? (
          <p className="text-slate-500">এখনও কোনো বিল নেই।</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">মাস</th>
                  <th className="px-4 py-3">মোট</th>
                  <th className="px-4 py-3">পরিশোধিত</th>
                  <th className="px-4 py-3">বকেয়া</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      {monthsBn[b.month]} {b.year}
                    </td>
                    <td className="px-4 py-3">৳{Number(b.totalAmount).toLocaleString("bn-BD")}</td>
                    <td className="px-4 py-3">৳{Number(b.paidAmount).toLocaleString("bn-BD")}</td>
                    <td className="px-4 py-3">৳{Number(b.dueAmount).toLocaleString("bn-BD")}</td>
                    <td className="px-4 py-3 text-xs font-bold">{b.status}</td>
                    <td className="px-4 py-3">
                      {Number(b.dueAmount) > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPayBill(b);
                            setPayAmount(String(b.dueAmount));
                          }}
                          className="rounded-lg bg-[var(--cb-primary)] px-3 py-1.5 text-xs font-bold text-white"
                        >
                          পে করুন
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {payBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-bold text-slate-900">মক পেমেন্ট</h3>
            <form onSubmit={pay} className="mt-4 space-y-3">
              <input
                type="number"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayBill(null)}
                  className="flex-1 rounded-lg border py-2 text-sm font-semibold"
                >
                  বাতিল
                </button>
                <button type="submit" className="flex-1 rounded-lg bg-[var(--cb-primary)] py-2 text-sm font-bold text-white">
                  নিশ্চিত
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
