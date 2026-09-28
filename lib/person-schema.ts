import { owner, skills } from "@/content";

type PersonInput = {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
};

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

/* A `</script>` inside the JSON would end the script element. No visitor input
   here, but escaping `<` removes that class of bug for one call. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
