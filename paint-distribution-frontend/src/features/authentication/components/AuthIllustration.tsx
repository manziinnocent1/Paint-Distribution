export default function AuthIllustration() {
  return (
    <div className="relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-10 text-white">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />

      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border border-white/10" />

      <div className="relative z-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
          Color Paint Distribution
        </p>

        <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight">
          Manage your paint business with confidence.
        </h2>

        <p className="mt-5 max-w-md text-base leading-7 text-blue-100">
          Manage products, inventory, suppliers, customers, sales, and business
          operations from one platform.
        </p>
      </div>

      <div className="relative z-10 mt-12">
        <div className="flex gap-3">
          <span className="h-2 w-10 rounded-full bg-white" />
          <span className="h-2 w-10 rounded-full bg-white/30" />
          <span className="h-2 w-10 rounded-full bg-white/30" />
        </div>

        <p className="mt-5 text-sm text-blue-200">
          One platform. Better business management.
        </p>
      </div>
    </div>
  );
}
