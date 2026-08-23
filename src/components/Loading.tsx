import Image from "next/image";

export const LoadingDog = () => (
  <div role="status" className="flex items-center justify-center">
    <Image src="/480.gif" alt="" width={64} height={32} loading="eager" unoptimized />
    <span className="sr-only">Loading...</span>
  </div>
);

export const LoadingSpinner = ({ size = 16 }: { size?: number }) => (
  <div role="status">
    <svg aria-hidden="true" className="animate-spin" viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

export const LoadingPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <LoadingDog />
  </div>
);
