import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import UserAvatar from "../../Components/UserAvatar";
import { apiGet, apiPost } from "../../lib/api";
import { formatBdDate } from "../../lib/datetime";

function fmtMoney(n) {
  return `৳ ${Number(n || 0).toLocaleString("bn-BD")}`;
}

export default function ManagerDashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [analytics, setAnalytics] = useState(null);
  const [pending, setPending] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [a, p, r] = await Promise.all([
        apiGet(`/api/billing/analytics?month=${month}&year=${year}`),
        apiGet("/api/manager/pending-users"),
        apiGet("/api/manager/rooms"),
      ]);
      if (a.ok && a.json?.success) setAnalytics(a.json.data);
      if (p.ok && p.json?.success) setPending(p.json.data || []);
      if (r.ok && r.json?.success) setRooms(r.json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const totalSeats = rooms.reduce((s, x) => s + (x.seatCapacity || 0), 0);
  const availSeats = rooms.reduce((s, x) => s + (x.seatAvailable || 0), 0);
  const booked = totalSeats - availSeats;

  const approve = async (userId, roomId) => {
    if (!roomId) return;
    const res = await apiPost(`/api/manager/approve-user/${userId}`, { allocatedRoomId: roomId });
    if (res.ok && res.json?.success) {
      setPending((prev) => prev.filter((u) => u.id !== userId));
      load();
      alert(res.json.message);
    } else {
      alert(res.json?.message || "ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">ড্যাশবোর্ড ওভারভিউ</h1>
        <p className="text-sm text-slate-500">
          {formatBdDate(new Date())}
        </p>
      </header>

      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">মাস</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">বছর</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-sm"
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">এই মাসের মোট বিল</p>
                <p className="mt-1 text-2xl font-bold text-[var(--cb-primary)]">
                  {fmtMoney(analytics?.totalBilled)}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">মোট আদায়কৃত</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {fmtMoney(analytics?.totalCollected)}
                </p>
              </div>
              <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">মোট বকেয়া</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{fmtMoney(analytics?.totalDue)}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">অপেক্ষমান বিল</p>
                <p className="mt-1 text-2xl font-bold text-amber-700">{analytics?.pendingCount ?? 0}</p>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">নতুন মেম্বার রিকোয়েস্ট</h2>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                  {pending.length}
                </span>
              </div>
              {pending.length === 0 ? (
                <p className="text-sm text-slate-500">কোনো পেন্ডিং রিকোয়েস্ট নেই।</p>
              ) : rooms.length === 0 ? (
                <p className="text-sm text-amber-700">প্রথমে রুম যোগ করুন, তারপর অনুমোদন দিন।</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                        <th className="pb-2">মেম্বার</th>
                        <th className="pb-2">রুম বরাদ্দ</th>
                        <th className="pb-2">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((u) => (
                        <PendingRow key={u.id} user={u} rooms={rooms} onApprove={approve} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">রুম স্ট্যাটাস</h2>
                <p className="text-3xl font-extrabold text-[var(--cb-primary)]">{totalSeats}</p>
                <p className="text-xs text-slate-500">মোট সিট</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>বুকড</span>
                      <span>
                        {booked}/{totalSeats}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-[var(--cb-primary)]"
                        style={{ width: totalSeats ? `${(booked / totalSeats) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>খালি আছে</span>
                      <span>
                        {availSeats}/{totalSeats}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: totalSeats ? `${(availSeats / totalSeats) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
                <Link
                  to="/home/rooms"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--cb-primary)]"
                >
                  রুম ম্যানেজমেন্ট →
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">দ্রুত লিংক</h2>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/home/billing" className="font-medium text-[var(--cb-primary)] hover:underline">
                      বিল জেনারেট ও পেমেন্ট গ্রহণ
                    </Link>
                  </li>
                  <li>
                    <Link to="/home/create-room" className="font-medium text-[var(--cb-primary)] hover:underline">
                      নতুন রুম যোগ করুন
                    </Link>
                  </li>
                  <li>
                    <Link to="/home/boarders" className="font-medium text-[var(--cb-primary)] hover:underline">
                      বোর্ডার তালিকা ও রুম বদল
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PendingRow({ user, rooms, onApprove }) {
  const withSeats = rooms.filter((r) => r.seatAvailable > 0);
  const choices = withSeats.length ? withSeats : rooms;
  const [roomId, setRoomId] = useState(choices[0]?.id || "");

  return (
    <tr className="border-b border-slate-50">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <UserAvatar url={user.profilePictureUrl} className="h-10 w-10 border-slate-200" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{user.displayName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3">
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="max-w-[220px] rounded-lg border border-slate-200 px-2 py-1 text-xs"
        >
          {choices.length === 0 ? (
            <option value="">কোনো রুম নেই</option>
          ) : (
            choices.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} — ভাড়া ৳{Number(r.monthlyRent || 0).toLocaleString("bn-BD")}
                {r.estimatedMonthlyCost != null
                  ? ` · আনুমানিক ৳${Number(r.estimatedMonthlyCost).toLocaleString("bn-BD")}`
                  : ""}{" "}
                · খালি {r.seatAvailable}
              </option>
            ))
          )}
        </select>
      </td>
      <td className="py-3">
        <button
          type="button"
          onClick={() => onApprove(user.id, roomId)}
          disabled={!roomId}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
        >
          <Check className="h-3 w-3" /> অনুমোদন
        </button>
      </td>
    </tr>
  );
}
