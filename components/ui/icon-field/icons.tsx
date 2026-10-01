import type { ReactNode } from "react";

export const icons: { name: string; body: ReactNode }[] = [
  {
    name: "terminal",
    body: (
      <>
        <rect data-fill="" x="2.5" y="4" width="19" height="16" rx="3" />
        <path d="M7 9.5l3 2.5-3 2.5" />
        <path d="M12.5 15h4.5" />
      </>
    ),
  },
  {
    name: "duck",
    body: (
      <>
        <path
          data-fill=""
          d="M7.2 11.2C5.2 12 4 13.6 4 15.6 4 18.3 6.6 20 10.5 20h4.8c3.6 0 5.7-2.3 5.7-5.6V11l-2.6 1.8c-1.3-.8-3.2-1.2-5.2-1"
        />
        <circle data-fill="" cx="9.5" cy="8" r="3.5" />
        <path d="M6 8.8 3 9.6c.6 1.2 2 1.6 3.6 1" />
        <circle cx="9.2" cy="7.3" r=".9" fill="currentColor" stroke="none" />
        <path d="M10 15.2c1.3 1.4 3.7 1.6 5.6.3" />
      </>
    ),
  },
  {
    name: "gear",
    body: (
      <>
        <circle cx="12" cy="12" r="5.5" />
        <circle data-fill="" cx="12" cy="12" r="2.2" />
        <path
          data-bold=""
          d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6"
        />
      </>
    ),
  },
  {
    name: "browser",
    body: (
      <>
        <rect x="2.5" y="4" width="19" height="16" rx="3" />
        <path data-fill="" d="M2.5 8.5V7a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v1.5z" />
        <circle cx="5.6" cy="6.3" r=".8" fill="currentColor" stroke="none" />
        <circle cx="8.1" cy="6.3" r=".8" fill="currentColor" stroke="none" />
        <path d="M9.5 11.5 7 14l2.5 2.5M14.5 11.5 17 14l-2.5 2.5M13 11l-2 6" />
      </>
    ),
  },
  {
    name: "bug",
    body: (
      <>
        <ellipse data-fill="" cx="12" cy="14.5" rx="4.5" ry="5.5" />
        <path d="M9.6 9.3a2.4 2.4 0 0 1 4.8 0" />
        <path d="M10.6 7.1 9.2 4.6M13.4 7.1l1.4-2.5" />
        <path d="M12 9.5v10" />
        <path d="M7.5 13h-3M16.5 13h3M7.8 16.6 5 18.2M16.2 16.6l2.8 1.6M7.9 10.6 5.6 9M16.1 10.6 18.4 9" />
        <circle cx="10" cy="13" r=".8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="16.2" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: "sparkles",
    body: (
      <>
        <path data-fill="" d="M10 3c.5 4 2 5.5 6 6-4 .5-5.5 2-6 6-.5-4-2-5.5-6-6 4-.5 5.5-2 6-6z" />
        <path d="M18 14c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3z" />
        <path d="M5 17.5v3M3.5 19h3" />
      </>
    ),
  },
  {
    name: "coffee",
    body: (
      <>
        <path data-fill="" d="M4.5 10h11v5.5a4.5 4.5 0 0 1-4.5 4.5H9a4.5 4.5 0 0 1-4.5-4.5z" />
        <path d="M15.5 11.5h1.3a2.3 2.3 0 0 1 0 4.6h-1.5" />
        <path d="M8 3.5c-1 1 1 1.6 0 3M11.8 3.5c-1 1 1 1.6 0 3" />
      </>
    ),
  },
  {
    name: "braces",
    body: (
      <>
        <path d="M9 4C7 4 6.5 5 6.5 6.5v3c0 1.5-.7 2.2-2 2.5 1.3.3 2 1 2 2.5v3C6.5 19 7 20 9 20" />
        <path d="M15 4c2 0 2.5 1 2.5 2.5v3c0 1.5.7 2.2 2 2.5-1.3.3-2 1-2 2.5v3c0 1.5-.5 2.5-2.5 2.5" />
        <circle cx="9.6" cy="12" r=".9" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none" />
        <circle cx="14.4" cy="12" r=".9" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: "rocket",
    body: (
      <>
        <path d="M12 2.5c3 2.2 4.5 5.5 4.5 9.5v4h-9v-4c0-4 1.5-7.3 4.5-9.5z" />
        <circle data-fill="" cx="12" cy="9.5" r="1.8" />
        <path d="M7.5 12.5 5 15v2.5h2.5M16.5 12.5 19 15v2.5h-2.5" />
        <path data-fill="" d="M10.3 18.5c0 1.5.8 2.6 1.7 3.5.9-.9 1.7-2 1.7-3.5" />
      </>
    ),
  },
  {
    name: "404",
    body: (
      <>
        <path d="M6.5 18V6l-4 8h5.2M21 18V6l-4 8h5.2" />
        <ellipse data-fill="" cx="12" cy="12" rx="2" ry="6" />
      </>
    ),
  },
  {
    name: "robot",
    body: (
      <>
        <rect data-fill="" x="4.5" y="8" width="15" height="11" rx="3.5" />
        <path d="M12 8V5.4M4.5 12.5H3v3h1.5M19.5 12.5H21v3h-1.5" />
        <circle cx="12" cy="4.2" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="12.8" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="12.8" r="1.3" fill="currentColor" stroke="none" />
        <path d="M10 16c1.2.8 2.8.8 4 0" />
      </>
    ),
  },
  {
    name: "cloud",
    body: (
      <>
        <path
          data-fill=""
          d="M7 18.5h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 6.6 11 3.75 3.75 0 0 0 7 18.5z"
        />
        <path d="M12 16v-4.5M10 13.5l2-2 2 2" />
      </>
    ),
  },
  {
    name: "chip",
    body: (
      <>
        <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
        <rect data-fill="" x="9.5" y="9.5" width="5" height="5" rx="1" />
        <path d="M10 3.5v3M14 3.5v3M10 17.5v3M14 17.5v3M3.5 10h3M3.5 14h3M17.5 10h3M17.5 14h3" />
      </>
    ),
  },
  {
    name: "lightning",
    body: <path data-fill="" d="M13 2.5 5.5 13.5H12l-1 8 7.5-11H12z" />,
  },
  {
    name: "git",
    body: (
      <>
        <path d="M6 7v10M18 10c0 5-12 3-12 7" />
        <circle data-fill="" cx="6" cy="5" r="2" />
        <circle data-fill="" cx="6" cy="19" r="2" />
        <circle data-fill="" cx="18" cy="8" r="2" />
      </>
    ),
  },
  {
    name: "cursor",
    body: (
      <>
        <path data-fill="" d="M8 6.5v13l3.7-3.3 2.4 5 2.2-1-2.4-5h5z" />
        <path d="M5.5 4 4 2.5M8 3.5v-2M5 6.5H3" />
      </>
    ),
  },
  {
    name: "database",
    body: (
      <>
        <ellipse data-fill="" cx="12" cy="6" rx="7" ry="2.5" />
        <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
        <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
      </>
    ),
  },
  {
    name: "semicolon",
    body: (
      <>
        <circle cx="12" cy="7.5" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="12" cy="15" r="1.8" fill="currentColor" stroke="none" />
        <path d="M13.6 15.4c0 2.2-1 3.8-2.8 4.9" />
      </>
    ),
  },
];
