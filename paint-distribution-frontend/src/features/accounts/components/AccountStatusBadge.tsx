interface AccountStatusBadgeProps {
  isActive: boolean;
  isVerified?: boolean;
}

export default function AccountStatusBadge({
  isActive,
  isVerified,
}: AccountStatusBadgeProps) {
  if (!isActive) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        Inactive
      </span>
    );
  }

  if (isVerified === false) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
        Unverified
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      Active
    </span>
  );
}
