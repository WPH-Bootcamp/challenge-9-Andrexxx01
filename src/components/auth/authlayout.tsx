import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      <div className="hidden md:block relative">
        <img
          src="/Frame 76.svg"
          alt="Restaurant"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right content */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
