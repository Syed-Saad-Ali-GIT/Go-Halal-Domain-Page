"use client";

import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import ThemeChanger from "./DarkSwitch";
import { site } from "@/lib/site-config";

export const Navbar = () => {
  const navigation = [
    { label: "Why Go Halal", href: "/#why-go-halal" },
    { label: "FAQ", href: "/#faq" },
    { label: "Download", href: "/#download" },
  ];

  return (
    <div className="w-full">
      <nav className="container relative mx-auto flex flex-wrap items-center justify-between px-6 py-5 lg:justify-between xl:px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/img/logo.svg"
            width={40}
            height={40}
            alt=""
            className="h-10 w-10"
          />
          <span className="text-xl font-bold tracking-tight text-gh-text-dark dark:text-white">
            {site.name}
          </span>
        </Link>

        <div className="nav__item mr-2 flex gap-2 lg:order-2 lg:ml-0 lg:gap-3">
          <ThemeChanger />
        </div>

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                aria-label="Toggle menu"
                className="rounded-lg px-2 py-1 text-gh-text-light hover:text-gh-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gh-primary dark:text-neutral-300 lg:hidden"
              >
                <svg
                  className="h-6 w-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  {open ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                    />
                  )}
                </svg>
              </Disclosure.Button>

              <Disclosure.Panel className="my-5 flex w-full flex-wrap lg:hidden">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="w-full rounded-lg px-4 py-2.5 text-gh-text dark:text-neutral-200 hover:bg-gh-card dark:hover:bg-gh-surface-dark"
                  >
                    {item.label}
                  </Link>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="flex flex-1 list-none items-center justify-end gap-1 pt-0">
            {navigation.map((item) => (
              <li key={item.href} className="nav__item">
                <Link
                  href={item.href}
                  className="inline-block rounded-lg px-4 py-2 text-base font-medium text-gh-text no-underline transition hover:text-gh-primary-dark dark:text-neutral-200 dark:hover:text-gh-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};
