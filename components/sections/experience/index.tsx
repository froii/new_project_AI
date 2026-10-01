import { useId } from "react";
import { useTranslations } from "next-intl";
import { Roles } from "./roles";
import { OpenAll } from "./open-all";
import { Field, FieldList } from "@/components/ui/field-list";
import { TagList } from "@/components/ui/tag-list";
import { Part } from "@/components/visibility/part";
import { PartToggle } from "@/components/visibility/part-toggle";
import { experience, owner } from "@/content";
import { contactHref, contactText } from "@/lib/contacts";
import {
  experienceSpan,
  isCurrent,
  monthYear,
  shortlistExperience,
  sortExperience,
} from "@/lib/content";
import styles from "./experience.module.css";

export function Experience() {
  const headingId = useId();
  const t = useTranslations("experience");

  const entries = sortExperience(experience);
  const challenges: Partial<Record<string, string[]>> = t.raw("challenges");
  const span = experienceSpan(experience);

  /* Non-dev roles show only in the full history. */
  const shortlist = shortlistExperience(experience);
  const rest = entries.filter((entry) => !shortlist.includes(entry));
  const earlier = rest.filter((entry) => !entry.nonDev);
  const linkedin = owner.contacts.find((contact) => contact.id === "linkedin");

  const toItem = (entry: (typeof entries)[number]) => {
    const hardParts = challenges[entry.id];

    return {
      id: entry.id,
      lead: (
        <>
          <span>{monthYear(entry.start)}</span>
          <span>{isCurrent(entry) ? t("present") : monthYear(entry.end ?? "")}</span>
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

          {hardParts && (
            <Part id="experience.challenges">
              <Field term={t("fields.challenges")}>
                <ul className={styles.bullets} role="list">
                  {hardParts.map((item) => (
                    <li key={item.slice(0, 24)}>{item}</li>
                  ))}
                </ul>
              </Field>
            </Part>
          )}

          <Part id="experience.responsibilities">
            <Field term={t("fields.responsibilities")}>
              <ul className={styles.bullets} role="list">
                {t(`entries.${entry.id}.responsibilities`)
                  .split("\n\n")
                  .map((item) => (
                    <li key={item.slice(0, 24)}>{item}</li>
                  ))}
              </ul>
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
    };
  };

  return (
    <section className="section" id="experience" aria-labelledby={headingId}>
      <div className="block-head">
        <div className={styles.title}>
          <h2 id={headingId}>{t("heading")}</h2>
          <OpenAll
            ids={shortlist.map((entry) => entry.id)}
            extra={rest.map((entry) => entry.id)}
            expand={t("open.expand")}
            collapse={t("open.collapse")}
          />
        </div>

        <span className={styles.span}>
          {span.from} - {span.to ?? t("present")}
        </span>
        <PartToggle
          id="experience.all"
          label={t("scope.label")}
          off={t("scope.recent")}
          on={t("scope.all")}
        />
      </div>

      <Roles items={shortlist.map(toItem)} />

      <Part id="experience.all">
        <p className={styles.restHeading}>{t("restHeading")}</p>
        <Roles items={rest.map(toItem)} className={styles.rest} />
      </Part>

      {/* Earlier roles as one-liners while the full list is off. */}
      <Part id="experience.all" whenOff>
        <p className={styles.restHeading}>{t("earlierHeading")}</p>
        <ul className={styles.earlier} role="list">
          {earlier.map((entry) => (
            <li key={entry.id}>
              {t(`entries.${entry.id}.role`)}
              {" · "}
              <span className={styles.earlierDates}>
                {monthYear(entry.start)} - {entry.end ? monthYear(entry.end) : t("present")}
              </span>
            </li>
          ))}
        </ul>
        {linkedin && (
          <p className={styles.history}>
            {t("history")} <a href={contactHref(linkedin)}>{contactText(linkedin)}</a>
          </p>
        )}
      </Part>
    </section>
  );
}
