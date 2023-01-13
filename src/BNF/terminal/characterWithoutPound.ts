import BNF from "../../BNF";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { SPECIAL_CHARACTER } from "./specialCharacter";
import { WHITESPACE } from "./whitespace";
const { OR, ATOM } = BNF;

const specialCharacterWithoutPound = [
    "`",
    "~",
    "@",
    "!",
    "$",
    "^",
    "*",
    "%",
    "&",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "<",
    ">",
    "+",
    "=",
    "_",
    "-",
    "|",
    "/",
    "\\",
    ";",
    ":",
    "'",
    "\"",
    ",",
    ".",
    "?",
  ] as const;

export const SPECIAL_CHARACTER_WITHOUT_POUND = OR(
    ...specialCharacterWithoutPound.map((ch) => ATOM(ch).name(ch).hide())
).name("SPECIAL_CHARACTER_WITHOUT_POUND").token();

export const CHARACTER_WITHOUT_POUND = OR(
    ALPHABET, DIGIT, SPECIAL_CHARACTER_WITHOUT_POUND, WHITESPACE
).name("CHARACTER").token();