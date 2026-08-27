"use client";

import { useId, useState } from "react";
import Image from "next/image";
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
      <Image
        className={styles.photo}
        src={active.src}
        width={active.width}
        height={active.height}
        sizes="(max-width: 47.99rem) 100vw, 18rem"
        priority
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
                {/* 3rem in the CSS: the row was five full portraits before the
                    size hint told the optimiser what it actually renders at. */}
                <Image
                  src={photo.src}
                  width={photo.width}
                  height={photo.height}
                  sizes="48px"
                  alt=""
                />
                <span className="visually-hidden">{optionLabels[index]}</span>
              </label>
            </span>
          ))}
        </fieldset>
      )}
    </div>
  );
}
