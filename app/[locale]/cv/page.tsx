import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionMenu } from "@/components/controls/section-menu";
import { About } from "@/components/sections/about";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { MoreInfo } from "@/components/sections/more-info";
import { Skills } from "@/components/sections/skills";
import { SiteHeader } from "@/components/sections/site-header";
import { SectionSlot } from "@/components/visibility/section-slot";
import { toggleSectionIds } from "@/content/sections";
import { defaultLocale, locales } from "@/i18n/config";
import { ogImage } from "@/lib/og-image";

const bySection = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  education: Education,
  certifications: Certifications,
  contact: Contact,
};

/* Contact leaves the paper and becomes the band the page ends on. */
const paperIds = toggleSectionIds;

type CvParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: CvParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const title = t("cvTitle", { name: t("name") });
  const images = ogImage(locale, title);

  return {
    title,
    alternates: {
      canonical: `/${locale}/cv`,
      languages: {
        ...Object.fromEntries(locales.map((value) => [value, `/${value}/cv`])),
        "x-default": `/${defaultLocale}/cv`,
      },
    },
    /* Nested metadata replaces the parent object instead of merging, so description
       and site name are repeated; without them the CV card had no description. */
    openGraph: {
      title,
      description: t("description"),
      siteName: t("name"),
      url: `/${locale}/cv`,
      images,
    },
    twitter: { card: "summary_large_image", title, description: t("description"), images },
  };
}

export default async function CvPage({ params }: CvParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <a href="#main" className="skip-link visually-hidden">
        {t("skipToContent")}
      </a>
      <SiteHeader />
      <div className="progress" aria-hidden="true" />
      <div className="workspace">
        <SectionMenu />
        <main id="main" className="sheet">
          <div className="paper">
            {paperIds.map((id) => {
              const Section = bySection[id];
              return (
                <SectionSlot key={id} id={id}>
                  <Section />
                </SectionSlot>
              );
            })}
            <MoreInfo />
          </div>

          {/* Plain `.section-slot`, not SectionSlot: contact has no toggle, and
              the class is what makes the band span the sheet. */}
          <div className="section-slot">
            <Contact />
          </div>
        </main>
      </div>
    </>
  );
}
