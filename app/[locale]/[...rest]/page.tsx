import { notFound } from "next/navigation";

/* Unknown paths under a locale 404 inside `[locale]`. Without this they fall out
   into Next's unstyled 404, in the wrong language and with no way back. */
export default function CatchAll() {
  notFound();
}
