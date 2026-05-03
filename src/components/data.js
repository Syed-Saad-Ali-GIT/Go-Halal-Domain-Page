import {
  ViewfinderCircleIcon,
  ShieldCheckIcon,
  ChartBarSquareIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "Scan and understand products fast",
  desc: "Look up barcodes like you do inside the Go Halal app—designed around quick answers and less second-guessing in the aisle.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Barcode-powered lookup",
      desc: "Point your camera at a product for an experience consistent with how the mobile app behaves today.",
      icon: <ViewfinderCircleIcon />,
    },
    {
      title: "Clearer ingredient context",
      desc: "See the signals that matter to you—not just a wall of fine print—with the same restrained palette as the app UI.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Confidence at checkout",
      desc: "Make decisions backed by structured product data, tuned for mindful shopping rather than overwhelm.",
      icon: <ShieldCheckIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Designed for everyday use",
  desc: "The warm cream field, soft cards, gold accents, and teal highlights mirror the expo theme—you get a landing page that feels like part of the product.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Looks right on mobile",
      desc: "This page is tuned for thumbs first, so people coming from QR codes or campaigns land somewhere that feels familiar.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Find what matters near you",
      desc: "Point visitors toward discovery features that complement scanning—matching the exploratory side of Go Halal.",
      icon: <GlobeAltIcon />,
    },
    {
      title: "A calm, upbeat tone",
      desc: "Same visual language as the app: approachable gold primary, burnt orange sparkle, grounded teal—not cold startup gray.",
      icon: <SparklesIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
