import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/accordion";
import { Field, FieldList } from "@/components/ui/field-list";
import { TagList } from "@/components/ui/tag-list";
import { Part } from "@/components/visibility/part";
import { experience } from "@/content";
import { isCurrent, sortExperience } from "@/lib/content";

export function Experience() {
  const t = useTranslations("experience");

  const items = sortExperience(experience).map((entry) => ({
    id: entry.id,
    title: t(`entries.${entry.id}.role`),
    meta: `${entry.organisation} · ${entry.start} — ${isCurrent(entry) ? t("present") : entry.end}`,
    content: (
      <FieldList>
        <Part id="experience.project">
          <Field term={t("fields.project")}>{t(`entries.${entry.id}.project`)}</Field>
        </Part>

        <Part id="experience.responsibilities">
          <Field term={t("fields.responsibilities")}>
            {t(`entries.${entry.id}.responsibilities`)}
          </Field>
        </Part>

        <Part id="experience.techStack">
          <Field term={t("fields.techStack")}>
            <TagList items={entry.techStack} label={t("fields.techStack")} />
          </Field>
        </Part>

        {entry.alsoUsed.length > 0 && (
          <Part id="experience.alsoUsed">
            <Field term={t("fields.alsoUsed")}>
              <TagList items={entry.alsoUsed} label={t("fields.alsoUsed")} variant="quiet" />
            </Field>
          </Part>
        )}

        {entry.link && (
          <Part id="experience.link">
            <Field term={t("fields.link")}>
              <a href={entry.link}>{entry.link}</a>
            </Field>
          </Part>
        )}

        <Part id="experience.interest">
          <Field term={t("fields.interest")}>{t(`entries.${entry.id}.interest`)}</Field>
        </Part>
      </FieldList>
    ),
  }));

  return (
    <section className="section" id="experience">
      <div className="shell stack">
        <h2>{t("heading")}</h2>
        <Accordion items={items} defaultOpen={[items[0]?.id ?? ""]} />
      </div>
    </section>
  );
}
