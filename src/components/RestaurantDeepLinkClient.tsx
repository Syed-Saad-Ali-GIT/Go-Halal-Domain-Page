"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import { getRestaurantDeeplink, site } from "@/lib/site-config";

const FALLBACK_MS = 2500;

type Props = { restaurantId: string };

export function RestaurantDeepLinkClient({ restaurantId }: Props) {
  const [phase, setPhase] = useState<"opening" | "fallback">("opening");

  useEffect(() => {
    window.location.href = getRestaurantDeeplink(restaurantId);

    const t = window.setTimeout(() => setPhase("fallback"), FALLBACK_MS);
    return () => window.clearTimeout(t);
  }, [restaurantId]);

  if (phase === "fallback") {
    return (
      <Container className="max-w-lg pb-20 pt-12 text-center">
        <Image
          src="/img/logo.svg"
          alt=""
          width={80}
          height={80}
          className="mx-auto h-20 w-20"
        />
        <h1 className="mt-6 text-2xl font-bold text-gh-text-dark dark:text-white">
          Get {site.name}
        </h1>
        <p className="mt-3 text-gh-text-light dark:text-neutral-400">
          Download the app to view this restaurant and discover halal food near you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {site.appStoreUrl ? (
            <a
              href={site.appStoreUrl}
              className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Download on the App Store
            </a>
          ) : null}
          <a
            href={site.playStoreUrl}
            className="inline-flex items-center justify-center rounded-xl bg-gh-primary-dark px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 dark:bg-gh-primary"
          >
            Get it on Google Play
          </a>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-lg pb-20 pt-16 text-center">
      <Image
        src="/img/logo.svg"
        alt=""
        width={72}
        height={72}
        className="mx-auto h-[72px] w-[72px]"
      />
      <h1 className="mt-6 text-lg font-bold text-gh-text-dark dark:text-white">
        Opening in {site.name}…
      </h1>
      <p className="mt-2 text-sm text-gh-text-light dark:text-neutral-400">
        If the app doesn&apos;t open, you&apos;ll see download options shortly.
      </p>
    </Container>
  );
}
