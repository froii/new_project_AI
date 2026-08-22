export const CONTACT_OPEN = "contact:open";

/* Trigger and form sit in two different server components. */
export function requestContactForm(): void {
  window.dispatchEvent(new Event(CONTACT_OPEN));
}
