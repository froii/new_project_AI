import type {
  Achievement,
  Certification,
  EducationEntry,
  ExperienceEntry,
  OwnerProfile,
  SkillGroup,
} from "./types";

export const owner: OwnerProfile = {
  name: "Oleksa Tyshchenko",
  photos: [
    { id: "one", src: "/photos/portrait-1.svg", width: 400, height: 400 },
    { id: "two", src: "/photos/portrait-2.svg", width: 400, height: 400 },
    { id: "three", src: "/photos/portrait-3.svg", width: 400, height: 400 },
  ],
  contacts: [
    { id: "email", kind: "email", value: process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "" },
    { id: "phone", kind: "phone", value: process.env.NEXT_PUBLIC_OWNER_PHONE ?? "" },
    { id: "linkedin", kind: "link", value: process.env.NEXT_PUBLIC_OWNER_LINKEDIN ?? "" },
    { id: "github", kind: "link", value: process.env.NEXT_PUBLIC_OWNER_GITHUB ?? "" },
  ].filter((contact) => contact.value.length > 0) as OwnerProfile["contacts"],
};

export const achievements: Achievement[] = [
  { id: "scale", metric: "1000+" },
  { id: "performance", metric: "60%" },
  { id: "bundle", metric: "45%" },
  { id: "functions", metric: "100+" },
  { id: "queries", metric: "40%" },
  { id: "mentoring", metric: "10+" },
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
      "Cross-browser compatibility",
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
    ],
  },
  {
    id: "ui",
    items: ["Ant Design", "Material UI", "React Table", "React DnD", "React Charts", "D3.js"],
  },
  {
    id: "cs",
    items: [
      "Algorithms",
      "Data structures",
      "Algorithm analysis",
      "Recursion",
      "Graphs",
      "Binary trees",
    ],
  },
  {
    id: "forms",
    items: ["React Hook Form", "Final Form", "Formik", "Redux Form"],
  },
  {
    id: "styling",
    items: ["CSS3", "SCSS / LESS", "styled-components", "PostCSS", "SVG"],
  },
  {
    id: "testing",
    items: ["Jest", "React Testing Library", "Enzyme", "Storybook"],
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
      "Figma",
      "Low-code platforms",
    ],
  },
  {
    id: "legacy",
    items: [
      "Vue.js",
      "Vuex",
      "Nuxt",
      "Vuetify",
      "jQuery",
      "Handlebars",
      "GreenSock",
      "Gulp",
      "PHP",
      "SVN",
      "MODX",
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "bechacant",
    organisation: "BechaCant",
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
    link: "https://nedyx.com",
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
    link: "https://linksquares.com",
  },
  {
    id: "adraba",
    organisation: "Adraba",
    start: "2018-01",
    end: "2018-07",
    techStack: ["Vue.js", "Nuxt", "Vuex", "Vuetify", "Axios", "REST"],
    alsoUsed: ["Ramda", "SCSS", "Jira"],
    link: "https://events.financemagnates.com/londonsummit2019",
  },
  {
    id: "mackiev",
    organisation: "Software MacKiev",
    start: "2016-09",
    end: "2018-01",
    techStack: ["HTML", "CSS", "JavaScript", "jQuery", "PHP"],
    alsoUsed: ["Handlebars", "GreenSock"],
    link: "https://www.mackiev.com/",
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
    organisation: "National Academy of Sciences of Ukraine",
    start: "2012-01",
    end: "2017-06",
    techStack: ["ArcMap", "Data analysis"],
    alsoUsed: [],
    link: "https://scholar.google.com.ua/citations?user=m5WnOMEAAAAJ&hl=en",
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
  {
    id: "nas",
    institution: "National Academy of Sciences of Ukraine",
    start: "2012",
    end: "2016",
    skills: ["Research design", "Data quality & validation", "Technical writing", "ArcMap / GIS"],
  },
];

export const certifications: Certification[] = [
  {
    id: "aws",
    issued: "2025-08",
    href: "https://www.coursera.org/account/accomplishments/verify/252SOHEUBGKS",
  },
  {
    id: "d3",
    issued: "2025-07",
    href: "https://www.coursera.org/account/accomplishments/verify/E7HVJLUGYMK6",
  },
  {
    id: "algoexpert",
    href: "https://certificate.algoexpert.io/AlgoExpert%20Certificate%20AE-79e5eb6004",
  },
  {
    id: "frontendexpert",
    href: "https://certificate.algoexpert.io/FrontendExpert%20Certificate%20FE-c97970c096",
  },
  { id: "english", href: "https://cert.efset.org/gteMy2" },
];
