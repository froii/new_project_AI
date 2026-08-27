export type Contact = {
  id: string;
  kind: "email" | "phone" | "link";
  value: string;
};

export type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
};

export type OwnerProfile = {
  photos: Photo[];
  contacts: Contact[];
};

export type SkillGroup = {
  id: string;
  items: string[];
  more?: string[];
};

export type ExperienceEntry = {
  id: string;
  organisation: string;
  start: string;
  end?: string;
  techStack: string[];
  alsoUsed: string[];
  link?: string;
  nonDev?: boolean;
};

export type EducationEntry = {
  id: string;
  institution: string;
  start: string;
  end?: string;
  skills: string[];
};

export type Certification = {
  id: string;
  issued?: string;
  href?: string;
};

export type Achievement = {
  id: string;
};
