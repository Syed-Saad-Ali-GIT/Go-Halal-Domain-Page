import type { Metadata } from "next";

import { RestaurantDeepLinkClient } from "@/components/RestaurantDeepLinkClient";
import { site } from "@/lib/site-config";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  return {
    title: `Restaurant link — ${site.name}`,
    description: `Open this restaurant in the ${site.name} app.`,
    robots: { index: false, follow: true },
  };
}

export default function RestaurantDeepLinkPage({
  params,
}: {
  params: { id: string };
}) {
  return <RestaurantDeepLinkClient restaurantId={params.id} />;
}
