"use client";

import { type Cat, SpriteCat, sheets } from "@/components/ui/sprite-cat";
import styles from "./status.module.css";

const NOSE_DOWN = 24;
const SNIFF = [36, 50] as const;
const LOOK_UP = 64;
/* 62 matches the start of another take, where she lies down; 65-79 crossfade into it. */
const LIE_CUE = 62;
const LIE_FROM = 65;
const LYING = 101;

async function search(cat: Cat) {
  await cat.wait(800);
  await cat.play(0, NOSE_DOWN);
  await cat.play(NOSE_DOWN, SNIFF[1]);
  await cat.play(SNIFF[1], SNIFF[0], 0.8);
  await cat.play(SNIFF[0], SNIFF[1], 0.8);
  await cat.play(SNIFF[1], LOOK_UP);
  await cat.wait(2000);
  await cat.play(LOOK_UP, LIE_CUE);
  await cat.play(LIE_FROM, LYING, 0.7);
}

const SIT = 0;
const WASH = [20, 48] as const;

async function facepalm(cat: Cat) {
  cat.show(SIT);
  await cat.wait(600);
  await cat.play(SIT, WASH[1], 0.8);
  for (;;) {
    await cat.wait(2500);
    await cat.play(WASH[1], WASH[0], 0.7);
    await cat.play(WASH[0], WASH[1], 0.7);
  }
}

export function StatusCat({ variant }: { variant: "search" | "oops" }) {
  return variant === "search" ? (
    <SpriteCat sheet={sheets.search} script={search} still={LYING} className={styles.cat} />
  ) : (
    <SpriteCat sheet={sheets.oops} script={facepalm} still={WASH[1]} className={styles.cat} />
  );
}
