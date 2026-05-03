import { ScreenshotGrid, type ScreenshotItem } from "@/components/ScreenshotGrid";
import { SectionTitle } from "@/components/SectionTitle";

const PRODUCT_ITEMS: ScreenshotItem[] = [
  {
    src: "/img/screenshot-products-list.svg",
    alt: "Screenshot of the Go Halal product search and list screen",
    label: "Search & browse",
  },
  {
    src: "/img/screenshot-product-scan.svg",
    alt: "Screenshot of scanning a barcode in Go Halal",
    label: "Scan a barcode",
  },
  {
    src: "/img/screenshot-product-single.svg",
    alt: "Screenshot of a product result card in Go Halal",
    label: "Quick result",
  },
  {
    src: "/img/screenshot-product-page.svg",
    alt: "Screenshot of the Go Halal product detail screen",
    label: "Full product page",
  },
];

const RESTAURANT_ITEMS: ScreenshotItem[] = [
  {
    src: "/img/screenshot-restaurant-list.svg",
    alt: "Screenshot of the Go Halal restaurant list",
    label: "Nearby restaurants",
  },
  {
    src: "/img/screenshot-restaurant-single.svg",
    alt: "Screenshot of a restaurant detail in Go Halal",
    label: "Venue details",
  },
];

export function AppScreensShowcase() {
  return (
    <>
      <section id="download" className="scroll-mt-24">
        <SectionTitle preTitle="Products" title="Browse, scan, and read labels with ease">
          Search the database, scan a barcode, and open a full product page—halal
          callouts, ingredients, and sources in one place.
        </SectionTitle>

        <ScreenshotGrid items={PRODUCT_ITEMS} stagger />
      </section>

      <section id="restaurants" className="scroll-mt-24">
        <SectionTitle preTitle="Restaurants" title="Find places that fit how you eat">
          Explore nearby options and open a restaurant profile to see what matters
          before you go.
        </SectionTitle>

        <ScreenshotGrid items={RESTAURANT_ITEMS} stagger={false} />
      </section>
    </>
  );
}
