export type Credential = {
  host: string;
  id: string;
};

export function readCredential(href: string): Credential | null {
  try {
    const url = new URL(href);
    const segment = url.pathname.split("/").filter(Boolean).pop() ?? "";
    const decoded = decodeURIComponent(segment);
    const id = decoded.split(/\s+/).filter(Boolean).pop() ?? decoded;

    return { host: url.hostname.replace(/^www\./, ""), id };
  } catch {
    return null;
  }
}
