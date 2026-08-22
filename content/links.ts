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
