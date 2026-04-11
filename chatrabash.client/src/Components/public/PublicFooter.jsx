import { Link } from "react-router-dom";
import BrandHeroStack from "../BrandHeroStack";

export default function PublicFooter() {
  return (
    <footer id="help" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandHeroStack variant="subtle" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              হোস্টেল মালিক ও বোর্ডারদের জন্য এক প্ল্যাটফর্মে ম্যানেজমেন্ট, বিলিং ও সিট খোঁজা।
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-900">প্ল্যাটফর্ম</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/explore" className="hover:text-[var(--cb-primary)]">
                  হোস্টেল লিস্ট
                </Link>
              </li>
              <li>
                <Link to="/signUp" className="hover:text-[var(--cb-primary)]">
                  বোর্ডার রেজিস্ট্রেশন
                </Link>
              </li>
              <li>
                <Link to="/signIn" className="hover:text-[var(--cb-primary)]">
                  লগ-ইন
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-900">যোগাযোগ</h4>
            <p className="text-sm text-slate-600">support@chatrabash.com</p>
            <p className="text-sm text-slate-600">+৮৮০ ১৭০০-০০০০০০</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row">
          <span>© {new Date().getFullYear()} ছাত্রাবাস.কম · সমস্ত অধিকার সংরক্ষিত</span>
          <span>গোপনীয়তা নীতি · সেবার শর্তাবলী</span>
        </div>
      </div>
    </footer>
  );
}
