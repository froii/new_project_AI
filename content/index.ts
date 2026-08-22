import type {
  Achievement,
  Certification,
  EducationEntry,
  ExperienceEntry,
  OwnerProfile,
  SkillGroup,
} from "./types";
import { certificateLinks, projectLinks } from "./links";

export const owner: OwnerProfile = {
  photos: [
    { id: "one", src: "/photos/portrait-1.svg", width: 400, height: 400 },
    { id: "two", src: "/photos/portrait-2.svg", width: 400, height: 400 },
    { id: "three", src: "/photos/portrait-3.svg", width: 400, height: 400 },
  ],
  contacts: [
    { id: "email", kind: "email", value: "lestyshchenko@gmail.com" },
    { id: "phone", kind: "phone", value: "+380734074118" },
    { id: "linkedin", kind: "link", value: "https://www.linkedin.com/in/oleksa-t-90a050a8" },
    { id: "github", kind: "link", value: "https://github.com/froii" },
  ],
};

export const achievements: Achievement[] = [
  { id: "language" },
  { id: "clients" },
  { id: "platform" },
  { id: "payments" },
  { id: "ai" },
  { id: "performance" },
  { id: "review" },
];

export const skills: SkillGroup[] = [
  {
    id: "frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "GraphQL",
      "Apollo Client",
      "PWA",
      "Accessibility (WCAG)",
      "i18n",
    ],
  },
  {
    id: "state",
    items: ["React Context", "Redux", "Redux-Saga", "Zustand", "SWR", "React Query"],
  },
  {
    id: "backend",
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "TypeORM",
      "type-graphql",
      "class-validator",
      "REST",
      "API design",
      "WebSockets",
      "PostgreSQL",
    ],
  },
  {
    id: "ai",
    items: [
      "LLM APIs",
      "RAG",
      "Prompt design",
      "Streaming responses",
      "Tool calling",
      "Agent flows",
      "OpenRouter",
    ],
  },
  {
    id: "ui",
    items: ["Ant Design", "Material UI", "React Table", "React DnD", "React Charts", "D3.js"],
  },
  {
    id: "forms",
    items: ["React Hook Form", "Formik"],
  },
  {
    id: "styling",
    items: ["CSS3", "SCSS / LESS", "styled-components", "PostCSS", "SVG"],
  },
  {
    id: "testing",
    items: ["Vitest", "Jest", "React Testing Library", "Storybook"],
  },
  {
    id: "tools",
    items: ["Docker", "AWS (Lambda, S3, EC2)", "Git", "Webpack", "ESLint", "Prettier"],
  },
  {
    id: "practice",
    items: [
      "Agile / Scrum",
      "Code review",
      "Architecture design",
      "Mentoring",
      "Technical writing",
      "Direct client work",
      "Requirements & scoping",
      "Figma",
      "Low-code platforms",
    ],
  },
  {
    id: "legacy",
    items: ["Vue.js", "Vuex", "Nuxt", "jQuery", "PHP"],
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "bechacant",
    organisation: "BechaCant",
    link: projectLinks.bechacant,
    start: "2024-05",
    end: "2026-07",
    techStack: [
      "TypeScript",
      "React",
      "Next.js",
      "PWA",
      "Node.js",
      "NestJS",
      "GraphQL",
      "REST",
      "PostgreSQL",
    ],
    alsoUsed: ["LLM APIs", "RAG", "Push notifications", "In-app purchases", "Git"],
  },
  {
    id: "eteam",
    organisation: "eTeam",
    start: "2021-01",
    end: "2024-11",
    techStack: [
      "React",
      "TypeScript",
      "GraphQL",
      "Apollo Client",
      "Node.js",
      "TypeORM",
      "type-graphql",
      "PostgreSQL",
      "styled-components",
    ],
    alsoUsed: ["CodeMirror 6", "Lezer", "Chevrotain.js", "AWS"],
    link: projectLinks.eteam,
  },
  {
    id: "danit",
    organisation: "dan.it",
    start: "2020-09",
    end: "2020-11",
    techStack: ["HTML5", "CSS3", "Git"],
    alsoUsed: [],
  },
  {
    id: "ugenius",
    organisation: "U-Genius Software Development",
    start: "2018-09",
    end: "2021-01",
    techStack: [
      "React",
      "TypeScript",
      "GraphQL",
      "Apollo Server",
      "Redux",
      "Redux-Saga",
      "Ant Design",
      "Ramda",
    ],
    alsoUsed: ["React Router", "useQueryParams", "Storybook", "Jest", "Enzyme", "Docker"],
    link: projectLinks.ugenius,
  },
  {
    id: "adraba",
    organisation: "Adraba",
    start: "2018-01",
    end: "2018-07",
    techStack: ["Vue.js", "Nuxt", "Vuex", "Vuetify", "Axios", "REST"],
    alsoUsed: ["Ramda", "SCSS", "Jira"],
    link: projectLinks.adraba,
  },
  {
    id: "mackiev",
    organisation: "Software MacKiev",
    start: "2016-09",
    end: "2018-01",
    techStack: ["HTML", "CSS", "JavaScript", "jQuery", "PHP"],
    alsoUsed: ["Handlebars", "GreenSock"],
    link: projectLinks.mackiev,
  },
  {
    id: "freelance",
    organisation: "FL.ru / Upwork",
    start: "2015-04",
    end: "2016-10",
    techStack: ["HTML", "CSS", "JavaScript", "jQuery"],
    alsoUsed: ["MODX"],
  },
  {
    id: "nas",
    nonDev: true,
    organisation: "National Academy of Sciences of Ukraine",
    start: "2012-01",
    end: "2017-06",
    techStack: ["ArcMap", "Data analysis"],
    alsoUsed: [],
    link: projectLinks.nas,
  },
];

export const education: EducationEntry[] = [
  {
    id: "neoversity",
    institution: "Neoversity IT University",
    start: "2025-09",
    skills: [
      "Machine learning",
      "Neural networks",
      "Algorithms & data structures",
      "Python for data",
      "Statistics",
      "Research methods",
    ],
  },
  {
    id: "nas",
    institution: "National Academy of Sciences of Ukraine",
    start: "2012",
    end: "2016",
    skills: ["Research design", "Data quality & validation", "Technical writing", "ArcMap / GIS"],
  },
  {
    id: "kai",
    institution: "National University «Kyiv Aviation Institute»",
    start: "2011",
    end: "2012",
    skills: [
      "Project management",
      "Planning & estimation",
      "Risk management",
      "Global sourcing",
      "Stakeholder communication",
    ],
  },
  {
    id: "shevchenko",
    institution: "Taras Shevchenko National University of Kyiv",
    start: "2007",
    end: "2011",
    skills: [
      "Data analysis",
      "Statistical modelling",
      "Scientific method",
      "GIS",
      "Large datasets",
      "Self-directed learning",
    ],
  },
];

export const certifications: Certification[] = [
  {
    id: "frontendexpert",
    href: certificateLinks.frontendexpert,
  },
  {
    id: "algoexpert",
    href: certificateLinks.algoexpert,
  },
  { id: "english", issued: "2024-02", href: certificateLinks.english },
  {
    id: "aws",
    issued: "2025-08",
    href: certificateLinks.aws,
  },
];
