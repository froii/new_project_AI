export type ContactDraft = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactField = "name" | "email" | "message";

export const contactLimits = {
  name: 100,
  email: 200,
  phone: 40,
  message: 5000,
} as const;

const MESSAGE_MIN = 10;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function invalidContactFields(draft: ContactDraft): ContactField[] {
  const invalid: ContactField[] = [];

  if (draft.name.length === 0 || draft.name.length > contactLimits.name) invalid.push("name");
  if (!emailPattern.test(draft.email) || draft.email.length > contactLimits.email) {
    invalid.push("email");
  }
  if (draft.message.length < MESSAGE_MIN || draft.message.length > contactLimits.message) {
    invalid.push("message");
  }

  return invalid;
}

/* A newline ends the header; whatever follows it is the sender's own. */
export function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}
