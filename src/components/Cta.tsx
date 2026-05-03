import React from "react";
import { Container } from "@/components/Container";
import { StoreLinks } from "@/components/StoreLinks";
import { site } from "@/lib/site-config";

export const Cta = () => {
  return (
    <Container>
      <div className="mx-auto mb-24 flex max-w-4xl flex-col gap-10 overflow-hidden rounded-2xl bg-gradient-to-br from-gh-tertiary-dark via-gh-tertiary to-gh-ink px-8 py-12 text-white shadow-gh-lg ring-1 ring-white/10 md:flex-row md:items-center md:justify-between lg:px-14 lg:py-14">
        <div className="text-center md:max-w-md md:text-left">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-[1.75rem]">
            Take {site.name} with you
          </h2>
          <p className="mt-3 text-lg text-white/85">
            Get the native app for the smoothest barcode experience and offline-friendly
            browsing where supported.
          </p>
        </div>
        <div className="flex w-full flex-col items-center md:w-auto md:items-end">
          <StoreLinks variant="compact" />
        </div>
      </div>
    </Container>
  );
};
