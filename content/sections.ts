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
  about: ["achievements", "personal"],
  skills: ["full"],
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
  "about.achievements": "aa",
  "about.personal": "ap",
  skills: "k",
  "skills.full": "kf",
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
  "about.achievements": true,
  "about.personal": true,
  skills: true,
  "skills.full": true,
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

export const presetIds = ["eu", "us", "short", "full"] as const;

export type PresetId = (typeof presetIds)[number];

export const presets = {
  eu: { "experience.interest": true },
  us: {
    "hero.photo": false,
    "about.personal": false,
    "experience.alsoUsed": false,
    "experience.interest": false,
  },
  short: {
    "hero.photo": false,
    "about.personal": false,
    "skills.full": false,
    "experience.responsibilities": false,
    "experience.interest": false,
    "education.skills": false,
    certifications: false,
  },
  full: {
    "skills.full": true,
    "experience.alsoUsed": true,
    "experience.interest": true,
  },
} as const satisfies Record<PresetId, Partial<Record<ToggleId, boolean>>>;
