/**
 * Shared chrome for manager pages (aligned with app shell / dashboard cards).
 */
export default function ManagerPageFrame({ title, subtitle, badge, children, actions }) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-5 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {badge}
            {actions}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">{children}</div>
    </div>
  );
}
