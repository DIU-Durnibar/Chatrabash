import { Link } from "react-router-dom";

/** Wordmark from `public/brand-logo.png` — fixed-height frame + object-cover trims extra padding inside the PNG */
export default function BrandLogo({ to = "/", className = "", imgClassName = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex max-w-full items-center leading-none ${className}`}
      aria-label="ছাত্রাবাস.কম — হোম"
    >
      <span className="inline-flex h-7 max-h-7 min-w-0 overflow-hidden sm:h-8 sm:max-h-8">
        <img
          src={`${import.meta.env.BASE_URL}brand-logo.png`}
          alt="ছাত্রাবাস.কম"
          className={`block h-full w-auto min-w-0 max-w-[10.5rem] object-cover object-left sm:max-w-[12rem] ${imgClassName}`}
        />
      </span>
    </Link>
  );
}
