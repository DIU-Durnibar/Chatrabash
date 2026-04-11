const BD_TZ = "Asia/Dhaka";

/** Format an API date (ISO / UTC) for display in Bangladesh time. */
export function formatBdDateTime(value, options = {}) {
  if (value == null || value === "") return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("bn-BD", {
    timeZone: BD_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...options,
  });
}

/** Calendar date only (Bangladesh calendar day). */
export function formatBdDate(value, options = {}) {
  if (value == null || value === "") return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("bn-BD", {
    timeZone: BD_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}
