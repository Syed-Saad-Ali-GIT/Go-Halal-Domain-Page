import Image from "next/image";
import { site } from "@/lib/site-config";

/** Official App Store + Google Play badges (hosted under `/public/img`). */
export function StoreLinks({
  variant = "default",
  className = "",
}: Readonly<{ variant?: "default" | "compact"; className?: string }>) {
  /** Same box for both badges so asset padding and aspect ratios don’t read as different sizes. */
  const badgeBox =
    variant === "compact"
      ? "h-9 w-[min(100%,8.5rem)] sm:h-10 sm:w-36"
      : "h-11 w-[min(100%,10rem)] sm:h-12 sm:w-40";

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center ${className}`}
    >
      {site.appStoreUrl ? (
        <a
          href={site.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative inline-block rounded-lg leading-none outline-none ring-offset-2 ring-offset-gh-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gh-primary dark:ring-offset-gh-background-dark ${badgeBox}`}
        >
          <Image
            src="/img/appstore.svg"
            alt="Download on the App Store"
            fill
            sizes="(max-width: 640px) 85vw, 160px"
            className="object-contain object-left"
          />
        </a>
      ) : null}
      <a
        href={site.playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative inline-block rounded-lg leading-none outline-none ring-offset-2 ring-offset-gh-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gh-secondary dark:ring-offset-gh-background-dark ${badgeBox}`}
      >
        <Image
          src="/img/googleplay.svg"
          alt="Get it on Google Play"
          fill
          sizes="(max-width: 640px) 85vw, 160px"
          className="object-contain object-left"
        />
      </a>
    </div>
  );
}
