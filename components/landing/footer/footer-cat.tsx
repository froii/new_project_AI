"use client";

import { SpriteCat, knockCup, sheets } from "@/components/ui/sprite-cat";
import styles from "./footer.module.css";

export function FooterCat() {
  return <SpriteCat sheet={sheets.cup} script={knockCup} still={30} className={styles.cat} />;
}
