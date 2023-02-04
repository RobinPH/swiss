import { CONCAT, EXACT_MINUS, OR, STAR } from "..";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { KEYWORDS, RESERVED_WORDS } from "./keyword";
import { UNDERSCORE } from "./specialCharacter";
import { Token } from "./tokenType";

export const INVALID_IDENTIFIERS = OR(KEYWORDS, RESERVED_WORDS);

export const IDENTIFIER = EXACT_MINUS(
  CONCAT(
    OR(ALPHABET, UNDERSCORE).name(Token.NO_DIGIT_PREFIX),
    STAR(
      OR(ALPHABET, UNDERSCORE, DIGIT).name(Token.NO_PREFIX_RESTRICTION)
    ).name("ANY_COMBINATION")
  ),
  INVALID_IDENTIFIERS
)
  .name(Token.IDENTIFIER)
  .token();

export const CONST_IDENTIFIER = EXACT_MINUS(
  CONCAT(
    OR(ALPHABET, UNDERSCORE).name(Token.NO_DIGIT_PREFIX),
    STAR(
      OR(ALPHABET, UNDERSCORE, DIGIT).name(Token.NO_PREFIX_RESTRICTION)
    ).name("ANY_COMBINATION")
  ),
  INVALID_IDENTIFIERS
)
  .name(Token.CONST_IDENTIFIER)
  .token();
