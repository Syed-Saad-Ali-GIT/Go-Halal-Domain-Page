import { Container } from "@/components/Container";
import { AppScreensShowcase } from "@/components/AppScreensShowcase";
import { SectionTitle } from "@/components/SectionTitle";
import { StoreIntro } from "@/components/StoreIntro";
import { WhyGoHalal } from "@/components/WhyGoHalal";
import { Faq } from "@/components/Faq";

export default function Home() {
  return (
    <Container className="!pt-4">
      <StoreIntro />

      <AppScreensShowcase />

      <div id="why-go-halal" className="scroll-mt-24">
        <SectionTitle preTitle="Why Go Halal" title="Made for mindful shopping">
          Regular improvements, an open-minded community, and a straight-forward
          experience—so you can choose with confidence at the shelf.
        </SectionTitle>

        <WhyGoHalal />
      </div>

      <div id="faq" className="scroll-mt-24">
        <SectionTitle preTitle="FAQ" title="Common questions">
          Everything you might want to know before you download—or share the app
          with family and friends.
        </SectionTitle>

        <Faq />
      </div>
    </Container>
  );
}
