import { owner, skills } from "@/content";

type PersonInput = {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
};

/* Every value comes from `content/`, so the machine-readable copy of the CV
   cannot drift from the rendered one. */
export function personSchema(input: PersonInput) {
  const email = owner.contacts.find((contact) => contact.kind === "email")?.value;
  const phone = owner.contacts.find((contact) => contact.kind === "phone")?.value;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    jobTitle: input.jobTitle,
    description: input.description,
    url: input.url,
    image: input.image,
    ...(email && { email: `mailto:${email}` }),
    ...(phone && { telephone: phone }),
    sameAs: owner.contacts.filter((contact) => contact.kind === "link").map((c) => c.value),
    knowsAbout: skills.flatMap((group) => [...group.items, ...(group.more ?? [])]),
  };
}

/* A closing tag inside a JSON string ends the script element. Nothing here is
   visitor input, but the escape costs one call and removes the class of bug. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
