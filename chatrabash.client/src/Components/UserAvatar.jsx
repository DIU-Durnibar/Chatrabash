import { publicUrl } from "../lib/assets";

/** Round profile image; falls back to API default avatar on missing/broken URL. */
export default function UserAvatar({ url, alt = "", className = "h-10 w-10" }) {
  const src = publicUrl(url);
  return (
    <img
      src={src}
      alt={alt}
      className={`shrink-0 rounded-full border border-slate-200/80 object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = publicUrl("");
      }}
    />
  );
}
