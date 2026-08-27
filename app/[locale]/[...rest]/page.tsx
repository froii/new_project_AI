import { notFound } from "next/navigation";

/* Two real pages, so anything else under a locale is a typo or a dead link.
   Without this the URL matches no segment at all and falls out of `[locale]`
   into Next's own unstyled 404, in the wrong language and with no way back. */
export default function CatchAll() {
  notFound();
}
