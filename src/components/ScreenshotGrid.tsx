import Image from "next/image";
import { Container } from "@/components/Container";

export type ScreenshotItem = {
  src: string;
  alt: string;
  /** Short label shown under the mockup */
  label: string;
};

type ScreenshotGridProps = {
  items: ScreenshotItem[];
  /** When true, every other tile is dropped slightly on larger screens for a staggered layout */
  stagger?: boolean;
};

export function ScreenshotGrid({
  items,
  stagger = true,
}: Readonly<ScreenshotGridProps>) {
  const useStagger = stagger && items.length > 2;

  return (
    <Container className="!pt-2 pb-6">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 lg:gap-x-14 lg:gap-y-12">
        {items.map((item, i) => (
          <figure
            key={item.src}
            className={`flex flex-col items-center ${
              useStagger && i % 2 === 1 ? "sm:mt-12 lg:mt-14" : ""
            }`}
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[min(100%,280px)]">
              <div
                className="absolute -inset-5 rounded-[2.25rem] bg-gradient-to-br from-gh-primary/18 via-gh-secondary/10 to-gh-tertiary/14 blur-2xl dark:from-gh-primary/10 dark:via-gh-secondary/8 dark:to-gh-tertiary/10"
                aria-hidden
              />
              <Image
                src={item.src}
                alt={item.alt}
                width={577}
                height={1176}
                className="relative mx-auto h-auto w-full rounded-2xl object-contain shadow-gh-lg ring-1 ring-black/5 dark:ring-white/10"
                sizes="(max-width: 640px) 90vw, 280px"
                unoptimized
                priority={i === 0}
              />
            </div>
            <figcaption className="mt-4 max-w-[260px] text-center text-sm font-medium text-gh-text-light dark:text-neutral-400">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}
