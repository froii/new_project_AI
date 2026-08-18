import type { Contact } from "@/content/types";

export function contactHref(contact: Contact): string {
  if (contact.kind === "email") return `mailto:${contact.value}`;
  if (contact.kind === "phone") return `tel:${contact.value.replace(/\s/g, "")}`;
  return contact.value;
}

function digits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function messengerLinks(phone: string) {
  return [
    { id: "whatsapp", href: `https://wa.me/${digits(phone)}` },
    { id: "viber", href: `viber://chat?number=%2B${digits(phone)}` },
    { id: "telegram", href: `https://t.me/+${digits(phone)}` },
  ];
}

export function headerLinks(contacts: Contact[]) {
  const find = (id: string) => contacts.find((contact) => contact.id === id)?.value;
  const email = find("email");
  const phone = find("phone");
  const linkedin = find("linkedin");

  return [
    email && { id: "email", href: `mailto:${email}` },
    phone && { id: "whatsapp", href: `https://wa.me/${digits(phone)}` },
    linkedin && { id: "linkedin", href: linkedin },
  ].filter(Boolean) as { id: string; href: string }[];
}
