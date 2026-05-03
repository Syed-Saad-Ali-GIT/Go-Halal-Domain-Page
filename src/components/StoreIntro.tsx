import Image from "next/image";
import { Container } from "@/components/Container";
import { site } from "@/lib/site-config";

export function StoreIntro() {
  return (
    <section
      id="download"
      className="scroll-mt-24"
      aria-labelledby="home-intro-heading"
    >
      <Container className="flex flex-col items-center pb-10 pt-2 text-center md:pb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gh-tertiary dark:text-gh-tertiary-light">
          {site.tagline}
        </p>
        <h1
          id="home-intro-heading"
          className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gh-text-dark dark:text-white lg:text-4xl"
        >
          Your companion for mindful halal choices
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-gh-text-light dark:text-neutral-300">
          {site.shortDescription}
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <a
            href={site.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            className="inline-flex justify-center rounded-md transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gh-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gh-background-dark"
          >
            <Image
              src="/img/googleplay.svg"
              alt=""
              width={204}
              height={59}
              className="h-11 w-auto sm:h-12"
              priority
            />
          </a>
          {site.appStoreUrl ? (
            <a
              href={site.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="inline-flex justify-center rounded-md transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gh-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gh-background-dark"
            >
              <Image
                src="/img/appstore.svg"
                alt=""
                width={205}
                height={59}
                className="h-11 w-auto sm:h-12"
                priority
              />
            </a>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
