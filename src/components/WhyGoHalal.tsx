import { Container } from "@/components/Container";
import {
  ArrowPathIcon,
  EyeIcon,
  GiftIcon,
  LockOpenIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const pillars = [
  {
    title: "Regular updates",
    description:
      "Our product data and app improve over time so you are not stuck with stale shelf decisions.",
    Icon: ArrowPathIcon,
  },
  {
    title: "Community driven",
    description:
      "Built with feedback from shoppers who care about clarity—your voice helps shape what we prioritize.",
    Icon: UserGroupIcon,
  },
  {
    title: "Transparent",
    description:
      "We focus on showing what we know about a product—sources and limits included—so you can judge for yourself.",
    Icon: EyeIcon,
  },
  {
    title: "Free to use",
    description:
      "Core lookups stay accessible without paywalls—halal-conscious shopping should not cost extra.",
    Icon: GiftIcon,
  },
  {
    title: "No sign-up needed",
    description:
      "Jump in and scan—no account required to get started with the essentials.",
    Icon: LockOpenIcon,
  },
  {
    title: "Easy for everyone",
    description:
      "A calm, simple flow whether it is your first scan or your hundredth trip down the aisle.",
    Icon: SparklesIcon,
  },
];

export function WhyGoHalal() {
  return (
    <Container className="!pt-2 pb-4">
      <ul className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map(({ title, description, Icon }) => (
          <li
            key={title}
            className="rounded-2xl border border-gh-border bg-gh-card/90 p-6 shadow-gh backdrop-blur-sm transition hover:border-gh-primary/35 dark:border-gh-surface-dark dark:bg-gh-surface-dark/80 dark:hover:border-gh-primary/50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gh-primary/15 text-gh-tertiary-dark dark:bg-gh-primary/20 dark:text-gh-primary-light">
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gh-text-dark dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gh-text-light dark:text-neutral-400">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
