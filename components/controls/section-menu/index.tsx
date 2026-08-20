"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSections } from "@/components/providers/sections-provider";
import { Switch } from "@/components/ui/switch";
import { partsOf, presetIds, sectionIds, sectionParts, type SectionId } from "@/content/sections";
import { defaultVisibility, matchPreset, presetVisibility } from "@/lib/section-visibility";
import { useActiveSection } from "./use-active-section";
import styles from "./section-menu.module.css";

export function SectionMenu() {
  const t = useTranslations("sections");
  const { visible, toggle, apply } = useSections();
  const active = useActiveSection(visible);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<SectionId | null>(null);
  const [drag, setDrag] = useState(0);
  const [pages, setPages] = useState(false);
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
    const root = document.documentElement;
    if (pages) root.dataset.pages = "";
    else delete root.dataset.pages;
  }, [pages]);

  const shown = sectionIds.filter((id) => visible[id]).length;
  const preset = matchPreset(visible);

  return (
    <aside className={`screen-only ${styles.root}`} ref={rootRef} aria-label={t("menu")}>
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
          {shown}/{sectionIds.length}
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

        <ul className={styles.list} role="list">
          {sectionIds.map((id, index) => {
            const label = t(`labels.${id}`);
            const hasParts = sectionParts[id].length > 0;
            const isExpanded = expanded === id && visible[id];

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
                    aria-disabled={!visible[id] || undefined}
                    onClick={(event) => {
                      if (!visible[id]) {
                        event.preventDefault();
                        return;
                      }
                      setOpen(false);
                    }}
                  >
                    {label}
                  </a>

                  {hasParts && visible[id] && (
                    <button
                      type="button"
                      className={styles.chevron}
                      aria-expanded={isExpanded}
                      aria-label={label}
                      onClick={() => setExpanded((value) => (value === id ? null : id))}
                    >
                      <span aria-hidden="true" />
                    </button>
                  )}

                  <Switch
                    id={`toggle-${id}`}
                    className={styles.switch}
                    label={t("toggle", { section: label })}
                    checked={visible[id]}
                    onChange={() => toggle(id)}
                  />
                </div>

                {isExpanded && (
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
            );
          })}
        </ul>

        <div className={styles.tools}>
          <div className={styles.presetRow}>
            {presetIds.map((id) => (
              <button
                key={id}
                type="button"
                className={styles.preset}
                aria-pressed={preset === id}
                title={t(`presets.${id}.note`)}
                onClick={() => apply(presetVisibility(id))}
              >
                {t(`presets.${id}.label`)}
              </button>
            ))}
          </div>

          <div className={styles.exportRow}>
            <button
              type="button"
              className={styles.preset}
              aria-pressed={pages}
              onClick={() => setPages((value) => !value)}
            >
              {t("pages")}
            </button>
            <button type="button" className={styles.print} onClick={() => window.print()}>
              {t("print")}
            </button>
          </div>

          <p className={styles.footer}>
            <span>{t("count", { shown, total: sectionIds.length })}</span>
            <button
              type="button"
              className={styles.reset}
              onClick={() => apply({ ...defaultVisibility })}
            >
              {t("reset")}
            </button>
          </p>
        </div>
      </div>
    </aside>
  );
}
