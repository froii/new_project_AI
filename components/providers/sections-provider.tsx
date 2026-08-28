"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { experience } from "@/content";
import type { ToggleId } from "@/content/sections";
import { defaultOpenRoles } from "@/lib/content";
import {
  decodeOpen,
  decodeVisibility,
  encodeOpen,
  encodeVisibility,
  OPEN_PARAM,
  SECTIONS_PARAM,
  type Visibility,
} from "@/lib/section-visibility";

type SectionsValue = {
  visible: Visibility;
  toggle: (id: ToggleId) => void;
  apply: (next: Visibility) => void;
  open: string[];
  setOpen: (next: string[]) => void;
};

const SectionsContext = createContext<SectionsValue | null>(null);

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

const readParam = () => new URLSearchParams(window.location.search).get(SECTIONS_PARAM);
const readOpenParam = () => new URLSearchParams(window.location.search).get(OPEN_PARAM);

const writeParam = (name: string, encoded: string | null) => {
  const url = new URL(window.location.href);
  if (encoded === null) url.searchParams.delete(name);
  else url.searchParams.set(name, encoded);
  window.history.replaceState(null, "", url);
};

export function SectionsProvider({ children }: { children: ReactNode }) {
  const param = useSyncExternalStore(subscribe, readParam, () => null);
  const openParam = useSyncExternalStore(subscribe, readOpenParam, () => null);
  const [chosen, setChosen] = useState<Visibility | null>(null);
  const [openChosen, setOpenChosen] = useState<string[] | null>(null);

  const visible = useMemo(() => chosen ?? decodeVisibility(param), [chosen, param]);

  const fallbackOpen = useMemo(() => defaultOpenRoles(experience), []);
  const open = useMemo(
    () => openChosen ?? decodeOpen(openParam) ?? fallbackOpen,
    [openChosen, openParam, fallbackOpen],
  );

  const toggle = useCallback(
    (id: ToggleId) => {
      setChosen((current) => {
        const base = current ?? decodeVisibility(param);
        return { ...base, [id]: !base[id] };
      });
    },
    [param],
  );

  useEffect(() => {
    if (chosen === null) return;
    writeParam(SECTIONS_PARAM, encodeVisibility(chosen));
  }, [chosen]);

  useEffect(() => {
    if (openChosen === null) return;
    writeParam(OPEN_PARAM, encodeOpen(openChosen, fallbackOpen));
  }, [openChosen, fallbackOpen]);

  const apply = useCallback((next: Visibility) => setChosen(next), []);
  const setOpen = useCallback((next: string[]) => setOpenChosen(next), []);

  const value = useMemo(
    () => ({ visible, toggle, apply, open, setOpen }),
    [visible, toggle, apply, open, setOpen],
  );

  return <SectionsContext.Provider value={value}>{children}</SectionsContext.Provider>;
}

export function useSections(): SectionsValue {
  const value = useContext(SectionsContext);
  if (!value) throw new Error("useSections must be used inside SectionsProvider");
  return value;
}
