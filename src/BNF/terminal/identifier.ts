import { CONCAT, EXACT_MINUS, OR, STAR } from "..";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { KEYWORDS, RESERVED_WORDS } from "./keyword";
import { UNDERSCORE } from "./specialCharacter";

export const INVALID_IDENTIFIERS = OR(KEYWORDS, RESERVED_WORDS);

export const IDENTIFIER = EXACT_MINUS(
  CONCAT(
    OR(ALPHABET, UNDERSCORE).name("NO_DIGIT_PREFIX"),
    STAR(OR(ALPHABET, UNDERSCORE, DIGIT).name("NO_PREFIX_RESTRICTION")).name(
      "ANY_COMBINATION"
    )
  ),
  INVALID_IDENTIFIERS
)
  .name("IDENTIFIER")
  .token();
