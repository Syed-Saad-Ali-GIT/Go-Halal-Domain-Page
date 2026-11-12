import { StoreButtons } from "@/components/StoreButtons";

export function DownloadCta() {
  return (
    <section
      aria-labelledby="download-heading"
      className="cta-panel relative mt-24 overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20"
    >
      <h2
        id="download-heading"
        className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl"
      >
        Scan the shelf. Know what you&apos;re buying.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-white/75 sm:text-lg">
        Free on iPhone and Android. Point your camera at a barcode and check a
        product before it reaches your basket.
      </p>
      <StoreButtons
        size="lg"
        className="mt-8 justify-center"
        buttonClassName="btn-store-light"
      />
    </section>
  );
}
