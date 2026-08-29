import type { ReactNode } from "react";
import styles from "./social-links.module.css";

export type SocialLink = {
  id: string;
  href: string;
  label: string;
};

const icons: Record<string, ReactNode> = {
  email: (
    <path
      d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm1.5.7 7.5 5 7.5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.7c0-1.36-.03-3.1-1.9-3.1-1.9 0-2.2 1.47-2.2 3v5.8h-4V9Z" />
  ),
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3 0-1.5.7-2.2 1-2.5.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2c.1.2.1.4 0 .6l-.4.5-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3.1.1.1.6-.1 1.3Z" />
  ),
  viber: (
    <path d="M12 1.5c-4 0-7 .6-8.6 2.2C1.9 5.3 1.3 7.7 1.3 11c0 3.2.6 5.6 2.1 7.2.5.5 1.1.9 1.9 1.2v3.1c0 .5.6.8 1 .5l2.7-2.4c.9.1 1.9.2 3 .2 4 0 7-.6 8.6-2.2 1.5-1.6 2.1-4 2.1-7.3 0-3.2-.6-5.6-2.1-7.2C19 2.1 16 1.5 12 1.5Zm4.5 13.7c-.2.6-1 1.2-1.7 1.3-.4.1-.9.1-1.5-.1-1.6-.5-3.6-1.8-5.1-3.6-1.3-1.5-2-3-2.2-4.1-.1-.6 0-1.1.2-1.5.3-.5.9-1 1.4-1 .3 0 .5.1.7.4l.9 1.7c.1.3.1.5-.1.7l-.5.6c-.2.2-.2.4-.1.6.4.9 1.6 2.4 3.2 3.1.2.1.4.1.6-.1l.6-.6c.2-.2.4-.2.7-.1l1.7 1c.3.2.4.4.4.7 0 .2 0 .5-.2.9Z" />
  ),
  telegram: (
    <path d="M21.7 3.3 2.4 10.8c-.9.4-.9 1 0 1.3l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.4-1.7-1.2-1.4ZM9 14.3l-.3 3.4 1.3-3.6 7.9-6.5-8.9 6.7Z" />
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
};

export function SocialLinks({
  links,
  label,
  size = "regular",
}: {
  links: SocialLink[];
  label: string;
  size?: "regular" | "compact";
}) {
  if (links.length === 0) return null;

  return (
    <ul className={[styles.list, styles[size]].join(" ")} role="list" aria-label={label}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            className={[styles.link, styles[link.id]].filter(Boolean).join(" ")}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {icons[link.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
