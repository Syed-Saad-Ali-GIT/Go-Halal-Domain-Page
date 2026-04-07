import React from "react";
import { Routes, Route, Link } from "react-router-dom";

function Shell({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FFF8E7", color: "#383838" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#383838", textDecoration: "none", fontWeight: 700 }}>
            <img src="/logo192.png" alt="Go Halal" style={{ width: 28, height: 28, borderRadius: 6 }} />
            <span>Go Halal</span>
          </Link>
          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/privacy-policy" className="gh-link">Privacy</Link>
            <Link to="/terms-of-service" className="gh-link">Terms</Link>
            <Link to="/cookie-policy" className="gh-link">Cookies</Link>
          </nav>
        </header>
        {children}
        <footer style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #EFE7D6", color: "#6B6A6A", fontSize: 14 }}>
          <span>© {new Date().getFullYear()} Go Halal — Built by Diginix Pty Ltd</span>
        </footer>
      </div>
    </div>
  );
}

function Home() {
  return (
    <Shell>
      <div className="gh-hero" style={{ fontFamily: "'Poppins-Regular', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <img src="/logo512.png" alt="Go Halal" style={{ width: 56, height: 56, borderRadius: 12 }} />
          <div>
            <h1 className="gh-hero-title">Find Halal with Confidence</h1>
            <p className="gh-hero-subtitle">Curated products and restaurants. Built with the same identity as our mobile app.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", fontFamily: "'Poppins-Regular', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <Link to="/privacy-policy" className="gh-link">Privacy Policy</Link>
        <Link to="/terms-of-service" className="gh-link">Terms of Service</Link>
        <Link to="/cookie-policy" className="gh-link">Cookie Policy</Link>
        <Link to="/data-retention-policy" className="gh-link">Data Retention Policy</Link>
        <Link to="/content-submission-guidelines" className="gh-link">Content Submission Guidelines</Link>
        <Link to="/childrens-privacy-policy" className="gh-link">Children's Privacy Policy</Link>
      </div>
    </Shell>
  );
}

function PrivacyPolicy() {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Privacy Policy</h1>
      <PolicyContent src="/policies/go-halal-privacy-policy.html" />
    </Shell>
  );
}

function TermsOfService() {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Terms of Service</h1>
      <PolicyContent src="/policies/go-halal-terms-of-service.html" />
    </Shell>
  );
}

function CookiePolicy() {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Cookie Policy</h1>
      <PolicyContent src="/policies/go-halal-cookie-tracking-policy.html" />
    </Shell>
  );
}

function DataRetentionPolicy() {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Data Retention Policy</h1>
      <PolicyContent src="/policies/go-halal-data-retention-policy.html" />
    </Shell>
  );
}

function ContentSubmissionGuidelines() {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Content Submission Guidelines</h1>
      <PolicyContent src="/policies/go-halal-content-submission-guidelines.html" />
    </Shell>
  );
}

function ChildrensPrivacyPolicy() {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Children's Privacy Policy</h1>
      <PolicyContent src="/policies/go-halal-childrens-privacy-policy.html" />
    </Shell>
  );
}

function PolicyContent({ src }) {
  const [html, setHtml] = React.useState("");
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((t) => { if (!cancelled) setHtml(t); })
      .catch((e) => { if (!cancelled) setError("Failed to load policy."); });
    return () => { cancelled = true; };
  }, [src]);
  if (error) return <p style={{ color: "#B00020" }}>{error}</p>;
  if (!html) return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B6A6A" }}>
      <div className="loader-spinner" />
      <span>Loading…</span>
    </div>
  );
  return (
    <div className="policy-container">
      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
           className="policy-content"
           dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/data-retention-policy" element={<DataRetentionPolicy />} />
      <Route path="/content-submission-guidelines" element={<ContentSubmissionGuidelines />} />
      <Route path="/childrens-privacy-policy" element={<ChildrensPrivacyPolicy />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
