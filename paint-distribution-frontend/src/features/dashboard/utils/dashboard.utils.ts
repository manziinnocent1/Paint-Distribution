
import type {
  DashboardDateFilter,
  DashboardPeriod,
  DashboardTrend,
  DashboardTrendDirection,
} from "../types/dashboard.types";

export function getTrendDirection(
  current: number,
  previous: number,
): DashboardTrendDirection {
  if (current === previous) return "neutral";
  return current > previous ? "up" : "down";
}

export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function createTrend(
  current: number,
  previous: number,
  label = "compared with previous period",
): DashboardTrend {
  const change = calculatePercentageChange(current, previous);

  return {
    value: Math.abs(change),
    direction: getTrendDirection(current, previous),
    label,
    percentage: true,
  };
}

export function getDateRange(
  filter: DashboardDateFilter,
  now = new Date(),
): { startDate: string; endDate: string } {
  const end = new Date(now);
  const start = new Date(now);

  switch (filter.range) {
    case "today":
      break;
    case "yesterday":
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      break;
    case "last_7_days":
      start.setDate(start.getDate() - 6);
      break;
    case "last_30_days":
      start.setDate(start.getDate() - 29);
      break;
    case "this_month":
      start.setDate(1);
      break;
    case "last_month":
      start.setMonth(start.getMonth() - 1, 1);
      end.setDate(0);
      break;
    case "this_year":
      start.setMonth(0, 1);
      break;
    case "custom":
      return {
        startDate: filter.startDate ?? start.toISOString().slice(0, 10),
        endDate: filter.endDate ?? end.toISOString().slice(0, 10),
      };
  }

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export function getPeriodForRange(
  range: DashboardDateFilter["range"],
): DashboardPeriod {
  if (range === "today" || range === "yesterday") return "daily";
  if (range === "last_7_days") return "daily";
  if (range === "last_30_days") return "weekly";
  if (range === "this_year") return "monthly";
  return "monthly";
}

export function getGreeting(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
