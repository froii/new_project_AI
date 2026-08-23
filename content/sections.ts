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
  experience: ["all", "project", "responsibilities", "techStack", "alsoUsed", "link", "interest"],
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

export const presetIds = ["eu", "us", "short", "full"] as const;

export type PresetId = (typeof presetIds)[number];

export const presets = {
  eu: { "experience.interest": true },
  us: {
    "hero.photo": false,
    "experience.alsoUsed": false,
    "experience.interest": false,
  },
  short: {
    "hero.photo": false,
    "about.achievementsFull": false,
    "about.personal": false,
    "skills.full": false,
    "experience.all": false,
    "experience.responsibilities": false,
    "experience.interest": false,
    "education.all": false,
    "education.skills": false,
    certifications: false,
  },
  full: {
    "about.achievementsFull": true,
    "skills.full": true,
    "experience.all": true,
    "education.all": true,
    "experience.alsoUsed": true,
    "experience.interest": true,
  },
} as const satisfies Record<PresetId, Partial<Record<ToggleId, boolean>>>;
