import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

import userOneImg from "../../public/img/user1.jpg";
import userTwoImg from "../../public/img/user2.jpg";
import userThreeImg from "../../public/img/user3.jpg";

export const Testimonials = () => {
  return (
    <Container className="!pb-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <figure className="flex h-full flex-col justify-between rounded-2xl border border-gh-border bg-gh-card px-10 py-12 shadow-sm dark:border-gh-surface-dark dark:bg-gh-surface-dark md:col-span-2 lg:col-span-1">
            <blockquote className="text-xl leading-snug text-gh-text-dark dark:text-neutral-100">
              I finally stopped Googling every other ingredient—having a barcode-first flow
              on my phone saves time with three kids in tow.
            </blockquote>
            <Avatar
              image={userOneImg}
              name="Amina K."
              title="Busy parent · Melbourne"
            />
          </figure>
        <figure className="flex h-full flex-col justify-between rounded-2xl border border-gh-border bg-gh-card px-10 py-12 shadow-sm dark:border-gh-surface-dark dark:bg-gh-surface-dark">
            <blockquote className="text-xl leading-snug text-gh-text-dark dark:text-neutral-100">
              The <Mark>cream and gold</Mark> vibe feels approachable—not clinical like
              finance apps pretending to care about wellness.
            </blockquote>
            <Avatar
              image={userTwoImg}
              name="Rahul V."
              title="Retail worker · Perth"
            />
          </figure>
        <figure className="flex h-full flex-col justify-between rounded-2xl border border-gh-border bg-gh-card px-10 py-12 shadow-sm dark:border-gh-surface-dark dark:bg-gh-surface-dark md:col-span-2 lg:col-span-1">
            <blockquote className="text-xl leading-snug text-gh-text-dark dark:text-neutral-100">
              I share the listing with mates who eat halal casually—having a landing page that
              points straight to stores helps.
            </blockquote>
            <Avatar
              image={userThreeImg}
              name="Sofia N."
              title="Student · Sydney"
            />
          </figure>
      </div>
    </Container>
  );
};

interface AvatarProps {
  image: any;
  name: string;
  title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
  return (
    <figcaption className="mt-10 flex items-center gap-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-gh-primary/30">
        <Image
          src={props.image}
          width={56}
          height={56}
          alt=""
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-semibold text-gh-text-dark dark:text-white">
          {props.name}
        </div>
        <div className="text-gh-text-light dark:text-neutral-400">
          {props.title}
        </div>
      </div>
    </figcaption>
  );
}

function Mark(props: { readonly children: React.ReactNode }) {
  return (
    <>
      {" "}
      <mark className="rounded px-1.5 py-0.5 text-gh-primary-dark ring-2 ring-gh-primary/25 dark:bg-gh-primary/25 dark:text-gh-primary-light">
        {props.children}
      </mark>{" "}
    </>
  );
}
