import * as React from "react";

export interface FooterProps {
  companyName?: string;
  version?: string;
}

export function Footer({
  companyName = "Color Distribution",
  version = "1.0.0",
}: FooterProps) {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-gray-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>

        <p>Version {version}</p>
      </div>
    </footer>
  );
}
