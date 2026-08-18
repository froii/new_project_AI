import { getTranslations, setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/about";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { SectionSlot } from "@/components/visibility/section-slot";
import { sectionIds } from "@/content/sections";

const bySection = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  education: Education,
  certifications: Certifications,
  contact: Contact,
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <a href="#main" className="skip-link visually-hidden">
        {t("skipToContent")}
      </a>
      <SiteHeader />
      <main id="main">
        {sectionIds.map((id) => {
          const Section = bySection[id];
          return (
            <SectionSlot key={id} id={id}>
              <Section />
            </SectionSlot>
          );
        })}
      </main>
      <SiteFooter />
    </>
  );
}
