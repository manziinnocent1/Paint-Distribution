import type { AnalyticsPeriod } from "../types/analytics.types";

export const formatCurrency = (
  value: number,
  currency = "RWF",
): string => {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatPercentage = (
  value?: number,
): string => {
  if (value === undefined || value === null) {
    return "0.0%";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
};

export const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

export const formatShortDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(parsedDate);
};

export const getPeriodLabel = (
  period: AnalyticsPeriod,
): string => {
  const labels: Record<AnalyticsPeriod, string> = {
    today: "Today",
    this_week: "This week",
    this_month: "This month",
    this_year: "This year",
    last_7_days: "Last 7 days",
    last_30_days: "Last 30 days",
    last_90_days: "Last 90 days",
    custom: "Custom range",
  };

  return labels[period];
};

export const getChangeColor = (
  value?: number,
): string => {
  if (value === undefined || value === 0) {
    return "text-gray-500";
  }

  return value > 0 ? "text-green-600" : "text-red-600";
};

export const getChangeBackground = (
  value?: number,
): string => {
  if (value === undefined || value === 0) {
    return "bg-gray-100 text-gray-600";
  }

  return value > 0
    ? "bg-green-50 text-green-700"
    : "bg-red-50 text-red-700";
};