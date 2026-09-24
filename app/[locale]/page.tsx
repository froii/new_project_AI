import { LandingFooter } from "@/components/landing/footer";
import { Highlights } from "@/components/landing/highlights";
import { Intro } from "@/components/landing/intro";
import { Principles } from "@/components/landing/principles";

export default function HomePage() {
  return (
    <>
      <main>
        <Intro />
        <Principles />
        <Highlights />
      </main>
      <LandingFooter />
    </>
  );
}
