"use client";

import React from "react";
import { Container } from "@/components/Container";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="!pb-16 !pt-2">
      <div className="mx-auto max-w-2xl rounded-2xl p-2">
        {faqdata.map((item) => (
          <div key={item.question} className="mb-4">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full items-center justify-between rounded-xl border border-gh-border bg-gh-card px-5 py-4 text-left text-base font-semibold text-gh-text-dark transition hover:border-gh-primary/40 hover:bg-gh-background-muted dark:border-gh-surface-dark dark:bg-gh-surface-dark dark:text-neutral-100 dark:hover:border-gh-primary/60">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${open ? "rotate-180" : ""} h-5 w-5 shrink-0 text-gh-primary`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-5 pb-3 pt-2 leading-relaxed text-gh-text-light dark:text-neutral-400">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "What does the Go Halal app do?",
    answer:
      "It helps you look up products and understand what you are buying—with a barcode-first flow so you can decide quickly at the shelf. Availability of features varies by platform and region.",
  },
  {
    question: "Where can I download it?",
    answer:
      "Use the Google Play badge on this page (and the App Store badge when it is available for iOS).",
  },
  {
    question: "Is this website the actual app?",
    answer:
      "No—this site introduces the app and policies. The full experience is on iOS and Android; this page matches the app’s look for a consistent brand.",
  },
  {
    question: "Do I need an account?",
    answer:
      "You can get started without signing up for the core scanning and lookup flow. If we ever offer optional accounts for extras, that will stay clearly labeled.",
  },
];
