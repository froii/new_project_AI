import type { PresetId } from "./sections";

export const certificateLinks = {
  frontendexpert: "https://certificate.algoexpert.io/FrontendExpert%20Certificate%20FE-c97970c096",
  algoexpert: "https://certificate.algoexpert.io/AlgoExpert%20Certificate%20AE-79e5eb6004",
  english: "https://cert.efset.org/gteMy2",
  aws: "https://www.coursera.org/account/accomplishments/verify/252SOHEUBGKS",
} as const;

/* An empty string is how a link that does not exist yet is written: the field
   that renders it drops out rather than shipping a href to nowhere. */
export const projectLinks = {
  bechacant: "",
  eteam: "https://nedyx.com",
  ugenius: "https://linksquares.com",
  adraba: "https://events.financemagnates.com",
  mackiev: "https://www.mackiev.com/",
  nas: "https://scholar.google.com.ua/citations?user=m5WnOMEAAAAJ&hl=en",
} as const;

export type CvPdf = { href: string; pages: number };

/* The file name is what a recruiter sees after the download, so it carries the
   preset's English label. `pages` is read off the file by hand: re-export, recount. */
const cvPdf = (file: string, pages: number): CvPdf => ({
  href: `/pdf/Oleksa_Tyshchenko_CV-${file}.pdf`,
  pages,
});

export const cvPdfs = {
  full: cvPdf("Full", 5),
  tech: cvPdf("Detailed", 3),
  us: cvPdf("ATS", 3),
  cases: cvPdf("Technical_Interview", 2),
  screening: cvPdf("Overview", 2),
  short: cvPdf("One_Page", 1),
} as const satisfies Record<PresetId, CvPdf>;
