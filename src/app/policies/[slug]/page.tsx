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
    <Container className="max-w-3xl pb-24 pt-8">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="pill-link">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              d="M10 3 5 8l5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Home
        </Link>
      </nav>
      <article
        className="policy-html surface mt-8 rounded-3xl px-6 py-10 sm:px-12 sm:py-14"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
}