import { useEffect, useState } from "react";
import { Home, RefreshCw, UserMinus, Wallet } from "lucide-react";
import { apiGet, apiPost } from "../../lib/api";
import UserAvatar from "../../Components/UserAvatar";
import ManagerPageFrame from "../../layouts/ManagerPageFrame";

const now = new Date();

export default function ManagerBoardersPage() {
  const [boarders, setBoarders] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const load = async () => {
    setLoading(true);
    try {
      const [b, r] = await Promise.all([apiGet("/api/manager/boarders"), apiGet("/api/manager/rooms")]);
      if (b.ok && b.json?.success) setBoarders(b.json.data || []);
      if (r.ok && r.json?.success) setRooms(r.json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const roomChoicesFor = (u) => {
    const hasSeat = rooms.filter((r) => r.seatAvailable > 0);
    const base = hasSeat.length ? hasSeat : rooms;
    const curId = u.allocatedRoomId;
    if (!curId) return base;
    if (base.some((r) => r.id === curId)) return base;
    const cur = rooms.find((r) => r.id === curId);
    return cur ? [cur, ...base] : base;
  };

  const reallocate = async (userId, roomId) => {
    if (!roomId) return;
    const res = await apiPost(`/api/manager/boarders/${userId}/reallocate`, { newRoomId: roomId });
    if (res.ok && res.json?.success) {
      alert(res.json.message);
      load();
    } else {
      alert(res.json?.message || "ব্যর্থ");
    }
  };

  const remove = async (userId, name) => {
    if (!window.confirm(`${name || "এই বোর্ডার"} কে হোস্টেল থেকে সরাবেন? রুমের খালি সিট আপডেট হবে।`)) return;
    const res = await apiPost(`/api/manager/boarders/${userId}/remove-from-hostel`, {});
    if (res.ok && res.json?.success) {
      alert(res.json.message);
      load();
    } else {
      alert(res.json?.message || "ব্যর্থ");
    }
  };

  const extraCharge = async (userId) => {
    const raw = window.prompt("অতিরিক্ত চার্জের পরিমাণ (৳) — চলতি বিলে যুক্ত হবে:");
    if (raw == null) return;
    const amount = Number(String(raw).replace(/,/g, ""));
    if (!amount || amount <= 0) {
      alert("সঠিক পরিমাণ দিন।");
      return;
    }
    const res = await apiPost(`/api/manager/boarders/${userId}/extra-charge`, { month, year, amount });
    if (res.ok && res.json?.success) {
      alert(res.json.message);
    } else {
      alert(res.json?.message || "ব্যর্থ");
    }
  };

  const generateBill = async (userId) => {
    const u = Number(window.prompt("ইউটিলিটি চার্জ (৳) — ০ হলে শুধু ভাড়া+অতিরিক্ত:", "0"));
    if (Number.isNaN(u)) return;
    const a = Number(window.prompt("অতিরিক্ত চার্জ (৳):", "0"));
    if (Number.isNaN(a)) return;
    const res = await apiPost(`/api/manager/boarders/${userId}/generate-bill`, {
      month,
      year,
      utilityCharge: u,
      additionalCharge: a,
    });
    if (res.ok && res.json?.success) {
      alert(res.json.message || "বিল তৈরি হয়েছে।");
    } else {
      alert(res.json?.message || "ব্যর্থ");
    }
  };

  if (loading) {
    return (
      <ManagerPageFrame title="বোর্ডার তালিকা" subtitle="আপনার হোস্টেলের অনুমোদিত বোর্ডার">
        <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
      </ManagerPageFrame>
    );
  }

  return (
    <ManagerPageFrame
      title="বোর্ডার ব্যবস্থাপনা"
      subtitle="রুম বদল, অতিরিক্ত চার্জ, ব্যক্তিগত বিল — বোর্ডার ড্যাশবোর্ডে বকেয়া দেখা যাবে"
      badge={
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          রিফ্রেশ
        </button>
      }
    >
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <label className="text-xs font-bold text-slate-500">বিল / অতিরিক্ত চার্জের মাস</label>
          <div className="mt-1 flex gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          “অতিরিক্ত চার্জ” ওই মাসের বিলে যোগ হয়। বিল না থাকলে নতুন সারি তৈরি হয়।
        </p>
      </div>

      {boarders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          কোনো অনুমোদিত বোর্ডার নেই।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3 pl-4">বোর্ডার</th>
                <th className="px-3 py-3">যোগাযোগ</th>
                <th className="px-3 py-3">বর্তমান রুম</th>
                <th className="px-3 py-3">নতুন রুম</th>
                <th className="px-3 py-3">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {boarders.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-3 py-3 pl-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar url={u.profilePictureUrl} className="h-11 w-11 border-slate-200" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">{u.displayName}</p>
                        <p className="text-xs text-slate-500">@{u.userName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs">{u.phoneNumber || "—"}</td>
                  <td className="px-3 py-3 font-medium text-[var(--cb-primary)]">{u.roomNumber || "—"}</td>
                  <td className="px-3 py-3">
                    <RoomReassign
                      key={`${u.id}-${u.allocatedRoomId || ""}`}
                      userId={u.id}
                      currentRoomId={u.allocatedRoomId}
                      rooms={roomChoicesFor(u)}
                      onAssign={reallocate}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => extraCharge(u.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
                      >
                        <Wallet className="h-3 w-3" />
                        অতিরিক্ত চার্জ
                      </button>
                      <button
                        type="button"
                        disabled={!u.allocatedRoomId}
                        title={!u.allocatedRoomId ? "রুম বরাদ্দ ছাড়া বিল জেনারেট করা যায় না" : ""}
                        onClick={() => generateBill(u.id)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-40"
                      >
                        বিল জেনারেট
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(u.id, u.displayName)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                      >
                        <UserMinus className="h-3 w-3" />
                        সরান
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-slate-500">
        <Home className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />
        বোর্ডার ড্যাশবোর্ডের “আমার বিল” ও ওভারভিউতে মোট বকেয়া আপডেট হবে।
      </p>
    </ManagerPageFrame>
  );
}

function RoomReassign({ userId, currentRoomId, rooms, onAssign }) {
  const [roomId, setRoomId] = useState(() => currentRoomId || rooms[0]?.id || "");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="max-w-[200px] rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
      >
        {rooms.length === 0 ? (
          <option value="">কোনো রুম নেই</option>
        ) : (
          rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.roomNumber} · খালি {r.seatAvailable}
            </option>
          ))
        )}
      </select>
      <button
        type="button"
        disabled={!roomId || roomId === currentRoomId}
        onClick={() => onAssign(userId, roomId)}
        className="rounded-lg bg-[var(--cb-primary)] px-2 py-1.5 text-xs font-bold text-white disabled:opacity-40"
      >
        বরাদ্দ
      </button>
    </div>
  );
}
