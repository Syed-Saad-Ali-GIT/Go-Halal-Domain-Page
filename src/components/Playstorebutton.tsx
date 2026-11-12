import { ANDROID_APP_URL } from "@/lib/links";

type Props = {
  className?: string;
  size?: "md" | "lg";
};

export function PlayStoreButton({ className = "", size = "md" }: Props) {
  const pad = size === "lg" ? "px-6 py-3.5" : "px-5 py-3";
  return (
    <a
      href={ANDROID_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Go Halal on Google Play"
      className={`btn-store inline-flex items-center gap-3 rounded-2xl ${pad} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={size === "lg" ? "h-8 w-8" : "h-7 w-7"}
      >
        <path
          fill="#00A0FF"
          d="M3.6 2.4 13.2 12l-9.6 9.6a1.5 1.5 0 0 1-.4-1V3.4c0-.4.1-.7.4-1z"
        />
        <path
          fill="#00E676"
          d="M3.6 2.4c.3-.3.8-.4 1.3-.1l11.5 6.5L13.2 12z"
        />
        <path
          fill="#FFD500"
          d="m16.4 8.8 3.6 2c1 .6 1 1.8 0 2.4l-3.6 2-3.2-3.2z"
        />
        <path
          fill="#FF3A44"
          d="m13.2 12 3.2 3.2-11.5 6.5c-.5.3-1 .2-1.3-.1z"
        />
      </svg>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[11px] font-medium opacity-80">Get it on</span>
        <span className="text-lg font-semibold tracking-tight">
          Google Play
        </span>
      </span>
    </a>
  );
}