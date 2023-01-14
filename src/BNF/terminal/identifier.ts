import { CONCAT, OR, STAR } from "..";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { UNDERSCORE } from "./specialCharacter";

export const IDENTIFIER = CONCAT(
  OR(ALPHABET, UNDERSCORE).name("NO_DIGIT_PREFIX"),
  STAR(OR(ALPHABET, UNDERSCORE, DIGIT).name("NO_PREFIX_RESTRICTION")).name(
    "ANY_COMBINATION"
  )
)
  .name("IDENTIFIER")
  .token();
