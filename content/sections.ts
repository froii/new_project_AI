export const sectionIds = [
  "hero",
  "about",
  "skills",
  "experience",
  "education",
  "certifications",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const sectionParts = {
  hero: ["photo", "contacts"],
  about: ["achievementsFull", "personal"],
  skills: ["full"],
  experience: [
    "all",
    "project",
    "result",
    "responsibilities",
    "techStack",
    "alsoUsed",
    "link",
    "interest",
  ],
  education: ["all", "skills"],
  certifications: [],
  contact: [],
} as const satisfies Record<SectionId, readonly string[]>;

export type PartId = {
  [S in SectionId]: `${S}.${(typeof sectionParts)[S][number]}`;
}[SectionId];

/* Contact is screen-only: it never reaches the PDF and it is the band the page
   ends on, so there is nothing for a visitor to switch off. It renders always. */
export type ToggleSectionId = Exclude<SectionId, "contact">;

export const toggleSectionIds = sectionIds.filter(
  (id): id is ToggleSectionId => id !== "contact",
);

export type ToggleId = ToggleSectionId | PartId;

export const toggleCodes = {
  hero: "h",
  "hero.photo": "hp",
  "hero.contacts": "hc",
  about: "a",
  "about.achievementsFull": "af",
  "about.personal": "ap",
  skills: "k",
  "skills.full": "kf",
  experience: "e",
  "experience.all": "ea",
  "experience.project": "ep",
  "experience.result": "eo",
  "experience.responsibilities": "er",
  "experience.techStack": "et",
  "experience.alsoUsed": "eu",
  "experience.link": "el",
  "experience.interest": "ei",
  education: "d",
  "education.all": "da",
  "education.skills": "ds",
  certifications: "r",
} as const satisfies Record<ToggleId, string>;

export const toggleDefaults = {
  hero: true,
  "hero.photo": true,
  "hero.contacts": true,
  about: true,
  "about.achievementsFull": true,
  "about.personal": true,
  skills: true,
  "skills.full": true,
  experience: true,
  "experience.all": true,
  "experience.project": true,
  "experience.result": true,
  "experience.responsibilities": true,
  "experience.techStack": true,
  "experience.alsoUsed": false,
  "experience.link": true,
  "experience.interest": false,
  education: true,
  "education.all": true,
  "education.skills": true,
  certifications: true,
} as const satisfies Record<ToggleId, boolean>;

export const toggleIds = Object.keys(toggleCodes) as ToggleId[];

export function isToggleSection(id: SectionId): id is ToggleSectionId {
  return id !== "contact";
}

export function partsOf(section: ToggleSectionId): PartId[] {
  return sectionParts[section].map((part) => `${section}.${part}` as PartId);
}

/* Ordered by how much detail survives, widest first (15, 14, 11, 11, 6, 2), so
   the list reads as one scale. Not by section count: `screening` keeps fewer
   sections than `short` but more inside them, and the two orderings disagree. */
export const presetIds = ["full", "eu", "us", "tech", "screening", "short"] as const;

export type PresetId = (typeof presetIds)[number];

export const presets = {
  full: {
    "about.achievementsFull": true,
    "skills.full": true,
    "experience.all": true,
    "education.all": true,
    "experience.alsoUsed": true,
    "experience.interest": true,
  },
  eu: { "experience.interest": true },
  us: {
    "hero.photo": false,
    "about.personal": false,
    "experience.alsoUsed": false,
    "experience.interest": false,
  },
  tech: {
    "hero.photo": false,
    "about.achievementsFull": true,
    "about.personal": false,
    "skills.full": true,
    "experience.all": true,
    "experience.alsoUsed": true,
    "experience.interest": false,
    "education.all": false,
  },
  screening: {
    "about.achievementsFull": false,
    "about.personal": false,
    "skills.full": false,
    "experience.all": false,
    "experience.responsibilities": false,
    "experience.alsoUsed": false,
    "experience.interest": false,
    education: false,
    certifications: false,
  },
  /* Named for a page count, so it has to hold one: measured at 0.89 of an A4
     text block against 1.62 before. Everything but the result comes off each
     role - the accordion header still carries the dates and the top of the
     stack, so what is dropped is the prose, not the facts. Dropping only the
     stack lands on 1.00 exactly, which the next line of translated copy breaks. */
  short: {
    "hero.photo": false,
    about: false,
    "skills.full": false,
    "experience.all": false,
    "experience.project": false,
    "experience.responsibilities": false,
    "experience.techStack": false,
    "experience.alsoUsed": false,
    "experience.link": false,
    "experience.interest": false,
    education: false,
    certifications: false,
  },
} as const satisfies Record<PresetId, Partial<Record<ToggleId, boolean>>>;
