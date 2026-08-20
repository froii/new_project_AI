"use client";

import { useId, useState } from "react";
import type { Photo } from "@/content/types";
import styles from "./photo-switcher.module.css";

type PhotoSwitcherProps = {
  photos: Photo[];
  alt: string;
  groupLabel: string;
  optionLabels: string[];
};

export function PhotoSwitcher({ photos, alt, groupLabel, optionLabels }: PhotoSwitcherProps) {
  const [activeId, setActiveId] = useState(photos[0]?.id);
  const name = useId();

  const active = photos.find((photo) => photo.id === activeId) ?? photos[0];
  if (!active) return null;

  return (
    <div className={styles.root}>
      <img
        className={styles.photo}
        src={active.src}
        width={active.width}
        height={active.height}
        alt={alt}
      />

      {photos.length > 1 && (
        <fieldset className={`screen-only ${styles.picker}`}>
          <legend className="visually-hidden">{groupLabel}</legend>
          {photos.map((photo, index) => (
            <span key={photo.id} className={styles.option}>
              <input
                type="radio"
                className={styles.input}
                id={`${name}-${photo.id}`}
                name={name}
                value={photo.id}
                checked={photo.id === active.id}
                onChange={() => setActiveId(photo.id)}
              />
              <label className={styles.thumb} htmlFor={`${name}-${photo.id}`}>
                <img src={photo.src} width={photo.width} height={photo.height} alt="" />
                <span className="visually-hidden">{optionLabels[index]}</span>
              </label>
            </span>
          ))}
        </fieldset>
      )}
    </div>
  );
}
