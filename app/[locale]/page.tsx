import { LandingFooter } from "@/components/landing/footer";
import { Highlights } from "@/components/landing/highlights";
import { Intro } from "@/components/landing/intro";

export default function HomePage() {
  return (
    <>
      <main>
        <Intro />
        <Highlights />
      </main>
      <LandingFooter />
    </>
  );
}
