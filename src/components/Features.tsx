const steps = [
  {
    n: "1",
    title: "Scan",
    body: "Point your camera at a barcode. No typing, no searching the aisle.",
  },
  {
    n: "2",
    title: "Verify",
    body: "See the product’s halal status in seconds, right where you’re standing.",
  },
  {
    n: "3",
    title: "Choose",
    body: "Put it in the basket or leave it on the shelf, with the answer in hand.",
  },
];

const extras = [
  {
    title: "Built with the community",
    body: "An open-minded community helps keep the information useful for everyone who shops by it.",
  },
  {
    title: "Better every release",
    body: "Regular improvements, delivered in a straightforward app that stays out of your way.",
  },
];

export function Features() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((s) => (
        <article
          key={s.title}
          className="surface group rounded-3xl p-8 transition-colors hover:border-gh-primary/60"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gh-tertiary text-sm font-semibold text-white">
            {s.n}
          </span>
          <h3 className="mt-10 text-2xl font-semibold tracking-tight text-gh-text-dark dark:text-white">
            {s.title}
          </h3>
          <p className="mt-2 leading-relaxed text-gh-text-light dark:text-neutral-300">
            {s.body}
          </p>
        </article>
      ))}

      {extras.map((e) => (
        <article
          key={e.title}
          className="surface rounded-3xl p-8 md:col-span-3 lg:col-span-1 md:[&:nth-child(4)]:col-span-2 md:[&:nth-child(5)]:col-span-1"
        >
          <h3 className="text-xl font-semibold tracking-tight text-gh-text-dark dark:text-white">
            {e.title}
          </h3>
          <p className="mt-2 max-w-md leading-relaxed text-gh-text-light dark:text-neutral-300">
            {e.body}
          </p>
        </article>
      ))}
    </div>
  );
}