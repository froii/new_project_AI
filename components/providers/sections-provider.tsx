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
import type { ToggleId } from "@/content/sections";
import {
  decodeVisibility,
  encodeVisibility,
  SECTIONS_PARAM,
  type Visibility,
} from "@/lib/section-visibility";

type SectionsValue = {
  visible: Visibility;
  toggle: (id: ToggleId) => void;
};

const SectionsContext = createContext<SectionsValue | null>(null);

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

const readParam = () => new URLSearchParams(window.location.search).get(SECTIONS_PARAM);

export function SectionsProvider({ children }: { children: ReactNode }) {
  const param = useSyncExternalStore(subscribe, readParam, () => null);
  const [chosen, setChosen] = useState<Visibility | null>(null);

  const visible = useMemo(() => chosen ?? decodeVisibility(param), [chosen, param]);

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

    const url = new URL(window.location.href);
    const encoded = encodeVisibility(chosen);

    if (encoded === null) url.searchParams.delete(SECTIONS_PARAM);
    else url.searchParams.set(SECTIONS_PARAM, encoded);

    window.history.replaceState(null, "", url);
  }, [chosen]);

  const value = useMemo(() => ({ visible, toggle }), [visible, toggle]);

  return <SectionsContext.Provider value={value}>{children}</SectionsContext.Provider>;
}

export function useSections(): SectionsValue {
  const value = useContext(SectionsContext);
  if (!value) throw new Error("useSections must be used inside SectionsProvider");
  return value;
}
