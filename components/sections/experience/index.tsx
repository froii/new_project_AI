import { useTranslations } from "next-intl";
import { Roles } from "./roles";
import { OpenAll } from "./open-all";
import { Field, FieldList } from "@/components/ui/field-list";
import { TagList } from "@/components/ui/tag-list";
import { Part } from "@/components/visibility/part";
import { PartToggle } from "@/components/visibility/part-toggle";
import { experience } from "@/content";
import {
  dottedDate,
  experienceSpan,
  isCurrent,
  shortlistExperience,
  sortExperience,
} from "@/lib/content";
import styles from "./experience.module.css";

export function Experience() {
  const t = useTranslations("experience");

  const entries = sortExperience(experience);
  const span = experienceSpan(experience);

  /* Teaching is not the pitch: a non-dev role earns its place only once the
     visitor has asked for the whole history. */
  const shortlist = shortlistExperience(experience);
  const rest = entries.filter((entry) => !shortlist.includes(entry));

  const toItem = (entry: (typeof entries)[number]) => ({
    id: entry.id,
    lead: (
      <>
        <span>{dottedDate(entry.start)}</span>
        <span>{isCurrent(entry) ? t("present") : dottedDate(entry.end ?? "")}</span>
      </>
    ),
    title: t(`entries.${entry.id}.role`),
    meta: entry.techStack.slice(0, 4).join(" · "),
    content: (
      <FieldList>
        <Part id="experience.project">
          <Field term={t("fields.project")}>{t(`entries.${entry.id}.project`)}</Field>
        </Part>

        <Part id="experience.result">
          <Field term={t("fields.result")}>
            <strong className={styles.result}>{t(`entries.${entry.id}.result`)}</strong>
          </Field>
        </Part>

        <Part id="experience.responsibilities">
          <Field term={t("fields.responsibilities")}>
            {t(`entries.${entry.id}.responsibilities`)
              .split("\n\n")
              .map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
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
      </FieldList>
    ),
  });

  return (
    <section className="section" id="experience">
      <div className="block-head">
        <h2>{t("heading")}</h2>
        <span className={styles.span}>
          {t("summary", { count: entries.filter((entry) => !entry.nonDev).length })} · {span.from} -{" "}
          {span.to ?? t("present")}
        </span>
        <OpenAll
          ids={shortlist.map((entry) => entry.id)}
          extra={rest.map((entry) => entry.id)}
          expand={t("open.expand")}
          collapse={t("open.collapse")}
        />
        <PartToggle
          id="experience.all"
          label={t("scope.label")}
          off={t("scope.recent")}
          on={t("scope.all")}
        />
      </div>

      <Roles items={shortlist.map(toItem)} />

      <Part id="experience.all">
        <Roles items={rest.map(toItem)} className={styles.rest} />
      </Part>
    </section>
  );
}
