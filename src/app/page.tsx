import { Container } from "@/components/Container";
import { AppScreensShowcase } from "@/components/AppScreensShowcase";
import { SectionTitle } from "@/components/SectionTitle";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Faq } from "@/components/Faq";
import { DownloadCta } from "@/components/DownloadCta";

export default function Home() {
  return (
    <Container className="!pt-4 pb-24">
      <Hero />

      <section
        aria-label="App screens"
        className="surface overflow-hidden rounded-[2rem] px-4 py-10 sm:px-10 sm:py-16"
      >
        <AppScreensShowcase />
      </section>

      <div id="why-go-halal" className="scroll-mt-28 pt-24 sm:pt-32">
        <SectionTitle preTitle="Why Go Halal" title="Made for mindful shopping">
          Regular improvements, an open-minded community, and a straight-forward
          experience—so you can choose with confidence at the shelf.
        </SectionTitle>
        <Features />
      </div>

      <div id="faq" className="scroll-mt-28 pt-24 sm:pt-32">
        <SectionTitle preTitle="FAQ" title="Common questions">
          Everything you might want to know before you download—or share the app
          with family and friends.
        </SectionTitle>
        <Faq />
      </div>

      <DownloadCta />
    </Container>
  );
}