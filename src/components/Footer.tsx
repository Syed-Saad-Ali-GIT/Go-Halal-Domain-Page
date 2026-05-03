import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { POLICY_SLUGS } from "@/lib/policies";
import { site } from "@/lib/site-config";

export function Footer() {
  const navigation = [
    { label: "Why Go Halal", href: "/#why-go-halal" },
    { label: "FAQ", href: "/#faq" },
    { label: "Download", href: "/#download" },
  ];

  return (
    <div className="relative mt-12 border-t border-gh-border bg-gh-background-muted/50 dark:border-gh-surface-dark dark:bg-gh-ink/30">
      <Container>
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-10 py-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold text-gh-text-dark dark:text-white"
            >
              <Image
                src="/img/logo.svg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <span>{site.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-gh-text-light dark:text-neutral-400">
              {site.shortDescription}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gh-text-dark dark:text-white">
              Page
            </h3>
            <div className="mt-4 flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gh-text-light transition hover:text-gh-primary-dark dark:text-neutral-400 dark:hover:text-gh-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gh-text-dark dark:text-white">
              Policies
            </h3>
            <div className="mt-4 flex flex-col gap-2">
              {POLICY_SLUGS.map(({ slug, navLabel }) => (
                <Link
                  key={slug}
                  href={`/policies/${slug}`}
                  className="text-gh-text-light transition hover:text-gh-primary-dark dark:text-neutral-400 dark:hover:text-gh-primary"
                >
                  {navLabel}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gh-text-dark dark:text-white">
              Connect
            </h3>
            <div className="mt-4 flex gap-4 text-gh-text-light dark:text-neutral-500">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-gh-secondary-dark dark:hover:text-gh-secondary-light"
              >
                <Instagram />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gh-border py-8 text-center text-sm text-gh-text-light dark:border-gh-surface-dark dark:text-neutral-500">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </Container>
    </div>
  );
}

const Instagram = ({ size = 22 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
  </svg>
);
