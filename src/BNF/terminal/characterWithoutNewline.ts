import BNF from "../../BNF";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { SPECIAL_CHARACTER } from "./specialCharacter";
import { WHITESPACE_WITHOUT_NEWLINE } from "./whitespace";
const { OR } = BNF;

export const CHARACTER_WITHOUT_NEWLINE = OR(
    ALPHABET,
    DIGIT,
    SPECIAL_CHARACTER,
    WHITESPACE_WITHOUT_NEWLINE
)
  .name("CHARACTER_WITHOUT_NEWLINE")
  .token();