import { getGreeting } from "../../utils/dashboard.utils";

interface DashboardWelcomeProps {
  userName?: string;
}

export function DashboardWelcome({
  userName = "there",
}: DashboardWelcomeProps) {
  return (
    <div>
      <p className="text-sm font-medium text-blue-600">{getGreeting()}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Welcome back, {userName}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Here is what's happening with your paint distribution business.
      </p>
    </div>
  );
}
