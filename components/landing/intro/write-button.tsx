"use client";

import type { ReactNode } from "react";
import { requestContactForm } from "@/lib/contact-open";

export function WriteButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={requestContactForm}>
      {children}
    </button>
  );
}
