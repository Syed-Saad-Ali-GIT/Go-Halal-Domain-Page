import { StoreButtons } from "@/components/StoreButtons";
import { site } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="rise relative mx-auto max-w-4xl pb-16 pt-14 text-center sm:pb-24 sm:pt-24">
      <p className="surface mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-gh-text-light dark:text-neutral-300">
        <span className="h-2 w-2 rounded-full bg-gh-primary" aria-hidden="true" />
        Free on iPhone and Android
      </p>

      <h1 className="text-balance text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-gh-text-dark dark:text-white">
        Scan it. Verify it. Choose with confidence.
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-gh-text-light dark:text-neutral-300">
        {site.shortDescription}
      </p>

      <StoreButtons className="mt-10 justify-center" size="lg" />
    </section>
  );
}