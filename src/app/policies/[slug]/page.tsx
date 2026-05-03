import Link from "next/link";
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { site } from "@/lib/site-config";
import { POLICY_SLUGS, getPolicyBySlug } from "@/lib/policies";

const policiesDir = path.join(process.cwd(), "src/content/policies");

export function generateStaticParams() {
  return POLICY_SLUGS.map(({ slug }) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const policy = getPolicyBySlug(params.slug);
  if (!policy) return { title: "Not found" };
  return {
    title: `${policy.navLabel} — ${site.name}`,
    description: `${policy.navLabel} for the ${site.name} app.`,
  };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = getPolicyBySlug(params.slug);
  if (!policy) notFound();

  const filepath = path.join(policiesDir, policy.filename);
  if (!fs.existsSync(filepath)) notFound();

  const html = fs.readFileSync(filepath, "utf8");

  return (
    <Container className="max-w-3xl pb-20 pt-8">
      <nav aria-label="Breadcrumb">
        <Link
          href="/"
          className="text-sm font-medium text-gh-tertiary-dark transition hover:text-gh-tertiary dark:text-gh-tertiary-light dark:hover:text-gh-secondary-light"
        >
          ← Back to home
        </Link>
      </nav>
      <article
        className="policy-html mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
}
