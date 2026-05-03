import type { Metadata } from "next";

import { ProductDeepLinkClient } from "@/components/ProductDeepLinkClient";
import { site } from "@/lib/site-config";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  return {
    title: `Product link — ${site.name}`,
    description: `Open this product in the ${site.name} app.`,
    robots: { index: false, follow: true },
  };
}

export default function ProductDeepLinkPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductDeepLinkClient productId={params.id} />;
}
