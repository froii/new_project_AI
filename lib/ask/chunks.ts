import { certifications, education, experience, owner, skills } from "@/content";
import { questionTopics } from "@/content/questions";
import type { QuestionTopic } from "@/content/types";
import type { Locale } from "@/i18n/config";
import en from "@/messages/en";
import enQuestions from "@/messages/en/questions.json";
import uk from "@/messages/uk";
import ukQuestions from "@/messages/uk/questions.json";

export type Chunk = { id: string; title: string; text: string; keywords: string[] };

const catalogs = {
  en: { messages: en, questions: enQuestions },
  uk: { messages: uk, questions: ukQuestions },
};

/* Always in context, so the model knows whose CV it is. */
export function profileChunk(locale: Locale): Chunk {
  const { common, hero } = catalogs[locale].messages;
  const contacts = owner.contacts
    .filter((contact) => contact.kind !== "phone")
    .map((contact) => contact.value);

  return {
    id: "profile",
    title: common.name,
    text: [
      `${common.name}, ${hero.title}.`,
      hero.headline,
      hero.location,
      hero.engagement,
      hero.availability,
      contacts.join(", "),
    ].join("\n"),
    keywords: [],
  };
}

export type FaqTopic = {
  id: string;
  title: string;
  items: { id: string; q: string; a: string; keywords: string[] }[];
};

/* Same records for the page and the index. Drafts (empty `a`) stay out of both. */
function answeredTopics(locale: Locale, source: QuestionTopic[]): FaqTopic[] {
  const { topics, items } = catalogs[locale].questions;

  return source
    .map((topic) => ({
      id: topic.id,
      title: topics[topic.id as keyof typeof topics],
      items: topic.items
        .map((id) => ({ id, ...items[id as keyof typeof items] }))
        .filter((item) => item.a),
    }))
    .filter((topic) => topic.items.length > 0);
}

export function faqTopics(locale: Locale): FaqTopic[] {
  return answeredTopics(
    locale,
    questionTopics.filter((topic) => !topic.hidden),
  );
}

function faqChunks(locale: Locale): Chunk[] {
  return answeredTopics(locale, questionTopics).flatMap((topic) =>
    topic.items.map((item) => ({
      id: `faq.${item.id}`,
      title: item.q,
      text: `${item.q}\n${item.a}`,
      keywords: item.keywords,
    })),
  );
}

function cvChunks(locale: Locale): Chunk[] {
  const m = catalogs[locale].messages;
  const span = (start: string, end?: string) => `${start} - ${end ?? m.experience.present}`;

  const about: Chunk[] = [
    { id: "about", title: m.about.heading, text: m.about.body, keywords: [] },
    ...Object.entries(m.about.achievements).map(([id, { short, detail }]) => ({
      id: `about.${id}`,
      title: m.about.achievementsHeading,
      text: `${short} ${detail}`,
      keywords: [],
    })),
    {
      id: "about.personal",
      title: m.about.personalHeading,
      text: m.about.personal.join("\n"),
      keywords: [],
    },
  ];

  const roles = experience.map((entry) => {
    const text = m.experience.entries[entry.id as keyof typeof m.experience.entries];
    const challenges = m.experience.challenges[entry.id as keyof typeof m.experience.challenges];

    return {
      id: `experience.${entry.id}`,
      title: `${m.experience.heading}: ${entry.organisation}`,
      text: [
        `${text.role} (${span(entry.start, entry.end)})`,
        text.project,
        text.result,
        text.responsibilities,
        ...(challenges ?? []),
        [...entry.techStack, ...entry.alsoUsed].join(", "),
      ].join("\n"),
      keywords: [],
    };
  });

  const stack = skills.map((group) => ({
    id: `skills.${group.id}`,
    title: `${m.skills.heading}: ${m.skills.groups[group.id as keyof typeof m.skills.groups]}`,
    text: [...group.items, ...(group.more ?? [])].join(", "),
    keywords: [],
  }));

  const degrees = education.map((entry) => {
    const text = m.education.entries[entry.id as keyof typeof m.education.entries];

    return {
      id: `education.${entry.id}`,
      title: `${m.education.heading}: ${entry.institution}`,
      text: [
        `${text.degree}, ${entry.institution} (${span(entry.start, entry.end)})`,
        text.note,
        entry.skills.join(", "),
      ].join("\n"),
      keywords: [],
    };
  });

  const certificates: Chunk = {
    id: "certifications",
    title: m.certifications.heading,
    text: certifications
      .map((entry) => {
        const text = m.certifications.entries[entry.id as keyof typeof m.certifications.entries];
        return `${text.name}, ${text.issuer}${entry.issued ? ` (${entry.issued})` : ""}`;
      })
      .join("\n"),
    keywords: [],
  };

  return [...about, ...roles, ...stack, ...degrees, certificates];
}

export function chunks(locale: Locale): Chunk[] {
  return [...faqChunks(locale), ...cvChunks(locale)];
}
