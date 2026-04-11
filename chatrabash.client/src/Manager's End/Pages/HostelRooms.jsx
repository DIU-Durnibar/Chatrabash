import { useEffect, useState } from "react";
import { Building2, CheckCircle2, ClipboardCopy, Eye, EyeOff, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";
import { apiGet } from "../../lib/api";
import ManagerPageFrame from "../../layouts/ManagerPageFrame";

export default function HostelRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    (async () => {
      const { ok, json } = await apiGet("/api/manager/rooms");
      if (ok && json?.success) setRooms(json.data || []);
      setLoading(false);
    })();
  }, []);

  const toggleId = (id) => setVisible((p) => ({ ...p, [id]: !p[id] }));

  const copy = (id) => {
    navigator.clipboard.writeText(id);
    alert("রুম আইডি কপি হয়েছে");
  };

  if (loading) {
    return (
      <ManagerPageFrame title="রুম ম্যানেজমেন্ট" subtitle="সব রুম, ভাড়া ও আনুমানিক ব্যয়">
        <p className="text-center font-medium text-[var(--cb-primary)]">লোড হচ্ছে...</p>
      </ManagerPageFrame>
    );
  }

  return (
    <ManagerPageFrame
      title="হোস্টেল রুম ইনভেন্টরি"
      subtitle="প্রতিটি রুমের মাসিক রুম ভাড়া (সিট প্রতি) ও আনুমানিক মোট মাসিক ব্যয়"
      actions={
        <NavLink
          to="/home/create-room"
          className="rounded-xl bg-[var(--cb-primary)] px-4 py-2 text-sm font-bold text-white shadow-sm hover:opacity-95"
        >
          + নতুন রুম
        </NavLink>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="bg-[var(--cb-sidebar)] text-xs font-bold uppercase tracking-wide text-white">
              <tr>
                <th className="px-4 py-3">ফ্লোর</th>
                <th className="px-4 py-3">রুম</th>
                <th className="px-4 py-3 text-right">রুম ভাড়া / সিট</th>
                <th className="px-4 py-3 text-right">আনুমানিক মাসিক</th>
                <th className="px-4 py-3 text-center">সিট</th>
                <th className="px-4 py-3 text-center">এসি</th>
                <th className="px-4 py-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-600">{room.floorNo} তলা</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[var(--cb-primary)]">রুম {room.roomNumber}</p>
                    {visible[room.id] && (
                      <code className="mt-1 inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                        {room.id}
                      </code>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    ৳{Number(room.monthlyRent || 0).toLocaleString("bn-BD")}
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--cb-secondary)]">
                    ৳
                    {Number(room.estimatedMonthlyCost ?? room.monthlyRent ?? 0).toLocaleString("bn-BD")}
                    {!room.estimatedMonthlyCost && (
                      <span className="ml-1 text-[10px] font-normal text-slate-400">(ভাড়া=আনুমানিক)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        room.seatAvailable > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      খালি {room.seatAvailable}/{room.seatCapacity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {room.isAcAvailable ? (
                      <span className="inline-flex items-center justify-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" /> আছে
                      </span>
                    ) : (
                      <span className="text-slate-400">নেই</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                      <button
                        type="button"
                        onClick={() => toggleId(room.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--cb-primary)] hover:underline"
                      >
                        {visible[room.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {visible[room.id] ? "আইডি লুকান" : "আইডি"}
                      </button>
                      <button type="button" onClick={() => copy(room.id)} className="text-slate-500 hover:text-[var(--cb-primary)]">
                        <ClipboardCopy className="h-4 w-4" />
                      </button>
                      <NavLink
                        to={`/home/update-rooms/${room.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--cb-sidebar)] px-3 py-1.5 text-xs font-bold text-white hover:opacity-95"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        এডিট
                      </NavLink>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {rooms.length === 0 && (
        <p className="mt-6 text-center text-slate-500">
          <Building2 className="mx-auto mb-2 h-10 w-10 text-slate-300" />
          কোনো রুম যোগ করা হয়নি।
        </p>
      )}
    </ManagerPageFrame>
  );
}
