import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { apiGet, apiPost } from "../../lib/api";
import UserAvatar from "../../Components/UserAvatar";
import ManagerPageFrame from "../../layouts/ManagerPageFrame";

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, r] = await Promise.all([apiGet("/api/manager/pending-users"), apiGet("/api/manager/rooms")]);
        if (p.ok && p.json?.success) setPendingUsers(p.json.data || []);
        if (r.ok && r.json?.success) setRooms(r.json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const approve = async (userId, userName, roomId) => {
    if (!roomId) {
      alert("রুম নির্বাচন করুন।");
      return;
    }
    const { ok, json } = await apiPost(`/api/manager/approve-user/${userId}`, { allocatedRoomId: roomId });
    if (ok && json?.success) {
      alert(json.message);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      alert(json?.message || "অনুমোদন ব্যর্থ।");
    }
  };

  const decline = (userId) => {
    if (!window.confirm("এই আবেদন সরিয়ে ফেলবেন? (ডেমো — এপিআই সংযোগ পরে যুক্ত করুন)")) return;
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  if (loading) {
    return (
      <ManagerPageFrame title="আবেদনকারী" subtitle="নতুন বোর্ডার রেজিস্ট্রেশন">
        <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
      </ManagerPageFrame>
    );
  }

  const withSeats = (rid) => {
    const list = rooms.filter((x) => x.seatAvailable > 0);
    return list.length ? list : rooms;
  };

  return (
    <ManagerPageFrame
      title="আবেদনকারী রিকোয়েস্ট"
      subtitle="অনুমোদনের আগে রুম ও ভাড়ার তথ্য যাচাই করুন"
      badge={
        <span className="rounded-full bg-[var(--cb-secondary)]/15 px-3 py-1 text-xs font-bold text-[var(--cb-secondary)]">
          মোট {pendingUsers.length}
        </span>
      }
    >
      {pendingUsers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          কোনো পেন্ডিং আবেদন নেই।
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pendingUsers.map((user) => (
            <PendingCard
              key={user.id}
              user={user}
              roomChoices={withSeats()}
              onApprove={approve}
              onDecline={decline}
            />
          ))}
        </div>
      )}
    </ManagerPageFrame>
  );
}

function PendingCard({ user, roomChoices, onApprove, onDecline }) {
  const [roomId, setRoomId] = useState(roomChoices[0]?.id || "");

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <UserAvatar url={user.profilePictureUrl} className="h-12 w-12 border-slate-200" />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">{user.displayName}</h3>
          <p className="text-xs text-slate-500">@{user.userName}</p>
          <p className="mt-2 break-all text-xs text-slate-600">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        <span className="font-semibold text-slate-500">নোট: </span>
        {user.preferenceNote || "কোনো বিশেষ নোট নেই"}
      </div>

      <div className="mt-4">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">রুম বরাদ্দ</label>
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--cb-primary)]"
        >
          {roomChoices.length === 0 ? (
            <option value="">কোনো রুম নেই</option>
          ) : (
            roomChoices.map((r) => (
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
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onApprove(user.id, user.userName, roomId)}
          disabled={!roomId}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          অনুমোদন
        </button>
        <button
          type="button"
          onClick={() => onDecline(user.id)}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
