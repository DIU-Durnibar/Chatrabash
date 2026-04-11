import BrandLogo from "./BrandLogo";

/**
 * Logo wordmark + platform tagline stacked vertically (hero / auth panels).
 * `variant="light"` — on dark gradient; `variant="subtle"` — on light backgrounds.
 */
export default function BrandHeroStack({ variant = "light", className = "" }) {
  const pillClass =
    variant === "light"
      ? "inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"
      : "inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700";

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <div className="rounded-xl bg-white px-3 py-2 shadow-lg">
        <BrandLogo to="/" imgClassName="max-w-[14rem] md:max-w-[16rem]" />
      </div>
      <div className={pillClass}>
        <span>বাংলাদেশের হোস্টেল প্ল্যাটফর্ম</span>
      </div>
    </div>
  );
}
