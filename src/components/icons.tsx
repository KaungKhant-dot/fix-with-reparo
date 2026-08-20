/** Minimal brand vector icons (no external assets). */

export function ReparoToolMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Wrench and screwdriver">
      {/* Wrench */}
      <path
        d="M42.5 8.5a12 12 0 0 0-14.8 15.2L9.6 41.8a5.5 5.5 0 0 0 7.8 7.8l18.1-18.1A12 12 0 0 0 50.6 16l-6.2 6.2-6.6-1.7-1.7-6.6 6.4-5.4Z"
        fill="#4A627A"
      />
      {/* Screwdriver */}
      <path d="M52.9 40.6 41.1 52.4l4.2 4.2a3.6 3.6 0 0 0 5.1 0l6.7-6.7a3.6 3.6 0 0 0 0-5.1l-4.2-4.2Z" fill="#FFB800" />
      <path d="m36.6 47 4.5-4.5 6.1 6.1-4.5 4.5-6.1-6.1Z" fill="#4A627A" />
    </svg>
  );
}

export function PersonalItemIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="Bag, shoe and watch"
    >
      {/* Handbag */}
      <path d="M4 9h9l1 7H3l1-7Z" />
      <path d="M6.5 9V7.5a2.2 2.2 0 0 1 4.4 0V9" />
      {/* Watch */}
      <circle cx="18.5" cy="8" r="3" />
      <path d="M18.5 5.6V3.5M18.5 12.4v2.1" />
      {/* Shoe */}
      <path d="M3 19h13.5a4.5 4.5 0 0 0 4.5-2.2c-2 0-3.4-.6-4.6-1.6" />
    </svg>
  );
}
