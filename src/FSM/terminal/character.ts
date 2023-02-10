import { ATOM, CONCAT, OPTIONAL, OR } from "..";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { SPECIAL_CHARACTER } from "./specialCharacter";
import { Token } from "./tokenType";
import { WHITESPACE } from "./whitespace";

export const CHARACTER = OR(ALPHABET, DIGIT, SPECIAL_CHARACTER, WHITESPACE)
  .name(Token.CHARACTER)
  .token();

// export const CHARACTER_WITHOUT_NEWLINE = MINUS(
//   CHARACTER,
//   CONCAT(OPTIONAL(ATOM("\r")), ATOM("\n"))
// )
//   .name(Token.CHARACTER_WITHOUT_NEWLINE)
//   .token();

export const CHARACTER_WITHOUT_NEWLINE = CHARACTER;
