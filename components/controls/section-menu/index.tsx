"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSections } from "@/components/providers/sections-provider";
import { Switch } from "@/components/ui/switch";
import { partsOf, sectionIds, sectionParts } from "@/content/sections";
import { useActiveSection } from "./use-active-section";
import styles from "./section-menu.module.css";

export function SectionMenu() {
  const t = useTranslations("sections");
  const { visible, toggle } = useSections();
  const active = useActiveSection(visible);

  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const shownCount = sectionIds.filter((id) => visible[id]).length;

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{active ? t(`labels.${active}`) : t("menu")}</span>
        <span className={styles.count}>
          {shownCount}/{sectionIds.length}
        </span>
        <span className={styles.caret} aria-hidden="true" />
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <p className={styles.hint}>{t("hint")}</p>
        <ul className={styles.list} role="list">
          {sectionIds.map((id) => (
            <li key={id}>
              <div className={styles.row}>
                <a
                  href={`#${id}`}
                  className={styles.link}
                  aria-current={active === id ? "location" : undefined}
                  aria-disabled={!visible[id] || undefined}
                  onClick={(event) => {
                    if (!visible[id]) {
                      event.preventDefault();
                      return;
                    }
                    setOpen(false);
                  }}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.label}>{t(`labels.${id}`)}</span>
                </a>
                <Switch
                  id={`toggle-${id}`}
                  label={t("toggle", { section: t(`labels.${id}`) })}
                  checked={visible[id]}
                  onChange={() => toggle(id)}
                />
              </div>

              {visible[id] && sectionParts[id].length > 0 && (
                <ul className={styles.parts} role="list">
                  {partsOf(id).map((partId) => {
                    const part = partId.slice(id.length + 1);
                    const partLabel = t(`parts.${id}.${part}`);
                    return (
                      <li key={partId} className={styles.partRow}>
                        <label className={styles.partLabel} htmlFor={`toggle-${partId}`}>
                          {partLabel}
                        </label>
                        <Switch
                          id={`toggle-${partId}`}
                          className={styles.smallSwitch}
                          label={t("toggle", { section: partLabel })}
                          checked={visible[partId]}
                          onChange={() => toggle(partId)}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
