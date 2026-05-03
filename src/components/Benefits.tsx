import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

interface BenefitsProps {
  imgPos?: "left" | "right";
  data: {
    imgPos?: "left" | "right";
    title: string;
    desc: string;
    image: any;
    bullets: {
      title: string;
      desc: string;
      icon: React.ReactNode;
    }[];
  };
}

export const Benefits = (props: Readonly<BenefitsProps>) => {
  const { data } = props;
  return (
    <Container className="mb-24 flex flex-wrap lg:flex-nowrap lg:gap-12">
      <div
        className={`flex w-full items-center justify-center lg:w-1/2 ${
          props.imgPos === "right" ? "lg:order-1" : ""
        }`}
      >
        <div className="overflow-hidden rounded-2xl shadow-gh">
          <Image
            src={data.image}
            width={521}
            height={521}
            alt=""
            className="object-cover"
            placeholder="blur"
            blurDataURL={data.image.src}
          />
        </div>
      </div>

      <div
        className={`flex w-full flex-wrap items-center lg:w-1/2 ${
          data.imgPos === "right" ? "lg:justify-end" : ""
        }`}
      >
        <div>
          <div className="mt-4 flex w-full flex-col">
            <h3 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-gh-text-dark dark:text-white lg:text-4xl">
              {data.title}
            </h3>
            <p className="max-w-2xl py-4 text-lg leading-relaxed text-gh-text-light dark:text-neutral-300 lg:text-xl">
              {data.desc}
            </p>
          </div>

          <div className="mt-6 w-full">
            {data.bullets.map((item, index) => (
              <Benefit key={index} title={item.title} icon={item.icon}>
                {item.desc}
              </Benefit>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

function Benefit(props: {
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly children?: React.ReactNode;
}) {
  return (
    <div className="mt-9 flex gap-4">
      <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gh-primary to-gh-primary-dark text-white shadow-md">
        {React.isValidElement(props.icon)
          ? React.cloneElement(props.icon, {
              className: "h-7 w-7 text-white",
            })
          : props.icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gh-text-dark dark:text-white">
          {props.title}
        </h4>
        <p className="mt-1 leading-relaxed text-gh-text-light dark:text-neutral-400">
          {props.children}
        </p>
      </div>
    </div>
  );
}
