import { ATOM, OR } from "..";

const specialCharacter = [
  "`",
  "~",
  "@",
  "!",
  "$",
  "#",
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
  '"',
  ",",
  ".",
  "?",
] as const;

export const UNDERSCORE = ATOM("_").name("UNDERSCORE");

export const SEMICOLON = ATOM(";").name("SEMICOLON");

export const SPECIAL_CHARACTER = OR(
  ...specialCharacter.map((ch) => ATOM(ch).name(ch).hide())
)
  .name("SPECIAL_CHARACTER")
  .token();
