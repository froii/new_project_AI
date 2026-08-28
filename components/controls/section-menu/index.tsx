"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSections } from "@/components/providers/sections-provider";
import { Switch } from "@/components/ui/switch";
import {
  isToggleSection,
  partsOf,
  presetIds,
  sectionIds,
  sectionParts,
  toggleSectionIds,
  type ToggleId,
  type ToggleSectionId,
} from "@/content/sections";
import {
  defaultVisibility,
  matchPreset,
  partsCount,
  presetVisibility,
  visibilityCount,
} from "@/lib/section-visibility";
import { PartChips } from "./part-chips";
import { useActiveSection } from "./use-active-section";
import { useScrollAway } from "./use-scroll-away";
import styles from "./section-menu.module.css";

export function SectionMenu() {
  const t = useTranslations("sections");
  const { visible, toggle, apply } = useSections();
  const active = useActiveSection(visible);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<ToggleSectionId | null>(null);
  const [drag, setDrag] = useState(0);
  const dragFrom = useRef(0);
  const panelId = useId();
  const rootRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    if (active && isToggleSection(active)) setExpanded(active);
  }, [active]);

  const away = useScrollAway(open);
  const count = visibilityCount(visible);
  const preset = matchPreset(visible);

  return (
    <aside className={`screen-only ${styles.root}`} ref={rootRef} aria-label={t("menu")}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        data-away={away || undefined}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{active ? t(`labels.${active}`) : t("menu")}</span>
        <span className={styles.count}>
          {count.sections}/{toggleSectionIds.length}
        </span>
        <span className={styles.caret} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.backdrop} aria-hidden="true" onClick={() => setOpen(false)} />
      )}

      <div
        id={panelId}
        className={styles.panel}
        data-open={open}
        style={{
          translate: drag ? `0 ${drag}px` : undefined,
          transition: drag ? "none" : undefined,
        }}
      >
        <div
          className={styles.grip}
          aria-hidden="true"
          onPointerDown={(event) => {
            dragFrom.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            setDrag(Math.max(0, event.clientY - dragFrom.current));
          }}
          onPointerUp={() => {
            if (drag > 80) setOpen(false);
            setDrag(0);
          }}
          onPointerCancel={() => setDrag(0)}
        >
          <span />
        </div>

        <p className={styles.intro}>{t("intro")}</p>

        <div className={styles.scroll}>
          <ul className={styles.list} role="list">
            {sectionIds.map((id, index) => {
              const label = t(`labels.${id}`);
              /* Contact is listed so a visitor can jump to it, but it carries no
                 switch: it is screen-only and never reaches the PDF. */
              const toggleId = isToggleSection(id) ? id : null;
              const on = toggleId ? visible[toggleId] : true;
              const hasParts = sectionParts[id].length > 0;
              const isExpanded = expanded === id && hasParts;
              const parts = toggleId && hasParts ? partsCount(visible, toggleId) : null;

              return (
                <li key={id}>
                  <div className={styles.row}>
                    <span className={styles.num} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <a
                      href={`#${id}`}
                      className={styles.link}
                      aria-current={active === id ? "location" : undefined}
                      aria-disabled={!on || undefined}
                      onClick={(event) => {
                        if (!on) {
                          event.preventDefault();
                          return;
                        }
                        setOpen(false);
                      }}
                    >
                      <span>{label}</span>
                    </a>

                    {toggleId && parts && (
                      <button
                        type="button"
                        className={styles.partsToggle}
                        aria-expanded={isExpanded}
                        aria-label={t("partsLabel", { section: label })}
                        onClick={() => setExpanded((value) => (value === toggleId ? null : toggleId))}
                      >
                        <span className={styles.partsCount} aria-live="polite">
                          {parts.on}/{parts.total}
                        </span>
                        <svg viewBox="0 0 20 20" aria-hidden="true" fill="none">
                          <path
                            d="M3 6.5h14M3 13.5h14"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                          <circle cx="7.5" cy="6.5" r="2.2" fill="var(--color-panel)" stroke="currentColor" strokeWidth="1.4" />
                          <circle cx="13" cy="13.5" r="2.2" fill="var(--color-panel)" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </button>
                    )}

                    {toggleId && (
                      <Switch
                        id={`toggle-${toggleId}`}
                        className={styles.switch}
                        label={t("toggle", { section: label })}
                        checked={visible[toggleId]}
                        onChange={() => toggle(toggleId)}
                      />
                    )}
                  </div>

                  {toggleId && isExpanded && (
                    <div className={styles.parts}>
                      <PartChips
                        label={t("partsLabel", { section: label })}
                        disabled={!on}
                        items={partsOf(toggleId).map((partId) => ({
                          id: partId,
                          label: t(`parts.${id}.${partId.slice(id.length + 1)}`),
                          on: visible[partId],
                        }))}
                        onToggle={(partId) => toggle(partId as ToggleId)}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.tools}>
          <p className={styles.groupLabel}>{t("versionsHeading")}</p>

          <div className={styles.versionRow}>
            {presetIds.map((id) => (
              <button
                key={id}
                type="button"
                className={styles.version}
                aria-pressed={preset === id}
                onClick={() => apply(presetVisibility(id))}
              >
                {t(`presets.${id}.label`)}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.reset}
              onClick={() => apply({ ...defaultVisibility })}
            >
              {t("reset")}
            </button>
            <button type="button" className={styles.print} onClick={() => window.print()}>
              {t("print")}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
