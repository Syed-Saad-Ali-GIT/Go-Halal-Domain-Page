export const POLICY_SLUGS = [
  {
    slug: "go-halal-privacy-policy",
    filename: "go-halal-privacy-policy.html",
    navLabel: "Privacy Policy",
  },
  {
    slug: "go-halal-terms-of-service",
    filename: "go-halal-terms-of-service.html",
    navLabel: "Terms of Service",
  },
  {
    slug: "go-halal-childrens-privacy-policy",
    filename: "go-halal-childrens-privacy-policy.html",
    navLabel: "Children's Privacy",
  },
  {
    slug: "go-halal-content-submission-guidelines",
    filename: "go-halal-content-submission-guidelines.html",
    navLabel: "Content Submission Guidelines",
  },
  {
    slug: "go-halal-cookie-tracking-policy",
    filename: "go-halal-cookie-tracking-policy.html",
    navLabel: "Cookie & Tracking",
  },
  {
    slug: "go-halal-data-retention-policy",
    filename: "go-halal-data-retention-policy.html",
    navLabel: "Data Retention",
  },
] as const;

export type PolicySlug = (typeof POLICY_SLUGS)[number]["slug"];

export function getPolicyBySlug(slug: string) {
  return POLICY_SLUGS.find((p) => p.slug === slug);
}
