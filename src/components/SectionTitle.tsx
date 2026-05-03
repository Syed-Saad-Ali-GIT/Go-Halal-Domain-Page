import React from "react";
import { Container } from "@/components/Container";

interface SectionTitleProps {
  preTitle?: string;
  title?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

export const SectionTitle = (props: Readonly<SectionTitleProps>) => {
  return (
    <Container
      className={`mb-2 mt-16 flex w-full flex-col scroll-mt-24 ${
        props.align === "left" ? "" : "items-center justify-center text-center"
      }`}
    >
      {props.preTitle ? (
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gh-tertiary dark:text-gh-tertiary-light">
          {props.preTitle}
        </div>
      ) : null}

      {props.title ? (
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gh-text-dark dark:text-white lg:text-4xl">
          {props.title}
        </h2>
      ) : null}

      {props.children ? (
        <p className="max-w-2xl py-4 text-lg leading-relaxed text-gh-text-light dark:text-neutral-300 lg:text-xl xl:text-xl">
          {props.children}
        </p>
      ) : null}
    </Container>
  );
};
