import { ATOM, CONCAT, MINUS, OPTIONAL, OR } from "..";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { SPECIAL_CHARACTER } from "./specialCharacter";
import { WHITESPACE } from "./whitespace";

export const CHARACTER = OR(ALPHABET, DIGIT, SPECIAL_CHARACTER, WHITESPACE)
  .name("CHARACTER")
  .token();

export const CHARACTER_WITHOUT_NEWLINE = MINUS(
  CHARACTER,
  CONCAT(OPTIONAL(ATOM("\r")), ATOM("\n"))
)
  .name("CHARACTER_WITHOUT_NEWLINE")
  .token();
