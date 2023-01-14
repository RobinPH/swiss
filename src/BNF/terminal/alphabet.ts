import { ATOM, OR } from "..";

const lowercaseAlphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;
const uppercaseAlphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

export const LOWERCASE_ALPHABET = OR(
  ...lowercaseAlphabet.map((ch) => ATOM(ch).name(ch).hide())
).name("LOWERCASE_ALPHABET");

export const UPPERCASE_ALPHABET = OR(
  ...uppercaseAlphabet.map((ch) => ATOM(ch).name(ch).hide())
).name("UPPERCASE_ALPHABET");

export const ALPHABET = OR(LOWERCASE_ALPHABET, UPPERCASE_ALPHABET).name(
  "ALPHABET"
);
