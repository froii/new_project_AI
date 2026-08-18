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
  about: ["full", "achievements", "personal"],
  skills: [],
  experience: ["project", "responsibilities", "techStack", "alsoUsed", "link", "interest"],
  education: ["skills"],
  certifications: [],
  contact: ["form"],
} as const satisfies Record<SectionId, readonly string[]>;

export type PartId = {
  [S in SectionId]: `${S}.${(typeof sectionParts)[S][number]}`;
}[SectionId];

export type ToggleId = SectionId | PartId;

export const toggleCodes = {
  hero: "h",
  "hero.photo": "hp",
  "hero.contacts": "hc",
  about: "a",
  "about.full": "af",
  "about.achievements": "aa",
  "about.personal": "ap",
  skills: "k",
  experience: "e",
  "experience.project": "ep",
  "experience.responsibilities": "er",
  "experience.techStack": "et",
  "experience.alsoUsed": "eu",
  "experience.link": "el",
  "experience.interest": "ei",
  education: "d",
  "education.skills": "ds",
  certifications: "r",
  contact: "c",
  "contact.form": "cf",
} as const satisfies Record<ToggleId, string>;

export const toggleDefaults = {
  hero: true,
  "hero.photo": true,
  "hero.contacts": true,
  about: true,
  "about.full": false,
  "about.achievements": true,
  "about.personal": true,
  skills: true,
  experience: true,
  "experience.project": true,
  "experience.responsibilities": true,
  "experience.techStack": true,
  "experience.alsoUsed": false,
  "experience.link": true,
  "experience.interest": false,
  education: true,
  "education.skills": true,
  certifications: true,
  contact: true,
  "contact.form": true,
} as const satisfies Record<ToggleId, boolean>;

export const toggleIds = Object.keys(toggleCodes) as ToggleId[];

export function partsOf(section: SectionId): PartId[] {
  return sectionParts[section].map((part) => `${section}.${part}` as PartId);
}
