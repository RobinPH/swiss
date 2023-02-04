import { ATOM, OR } from "..";
import { Token } from "./tokenType";

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

export const UNDERSCORE = ATOM("_").name(Token.UNDERSCORE);

export const SEMICOLON = ATOM(";").name(Token.SEMICOLON);

export const COLON = ATOM(":").name(Token.COLON);

export const COMMA = ATOM(",").name(Token.COMMA);

export const SPECIAL_CHARACTER = OR(
  ...specialCharacter.map((ch) => ATOM(ch).name(ch).hide())
)
  .name(Token.SPECIAL_CHARACTER)
  .token();
