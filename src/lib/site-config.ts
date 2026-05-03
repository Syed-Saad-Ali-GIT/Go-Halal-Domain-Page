/** Custom URL scheme for opening the native app (`gohalal` → gohalal://product/...) */
const appDeeplinkScheme = "gohalal";

export function getProductDeeplink(id: string) {
  const safe = encodeURIComponent(id);
  return `${appDeeplinkScheme}://product/${safe}`;
}

export const site = {
  name: "Go Halal",
  shortDescription:
    "Scan barcodes, check ingredients, and find halal-friendly options—all in one place.",
  tagline: "Confidence at the shelf",

  /** App Store (iOS) — set when the listing is ready */
  appStoreUrl: "",

  /** Google Play listing */
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.gohalalaus.mobile&hl=en_AU",

  /**
   * Custom-scheme deep link when a user opens `/product/[id]` on the web.
   * Same behavior as the previous `.old` app (`gohalal://product/:id`).
   */
  appDeeplinkScheme,

  /** YouTube video id — leave empty to hide the embed section */
  youtubeVideoId: "",

  social: {
    instagram: "https://www.instagram.com/go.halal.aus/",
  },
};
