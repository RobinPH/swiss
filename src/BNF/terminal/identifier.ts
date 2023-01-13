import BNF from "../../BNF";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { UNDERSCORE } from "./specialCharacter";
const { CONCAT, STAR, OR } = BNF;

export const IDENTIFIER = CONCAT(
  OR(ALPHABET, UNDERSCORE).name("NO_DIGIT_PREFIX"),
  STAR(OR(ALPHABET, UNDERSCORE, DIGIT).name("NO_PREFIX_RESTRICTION")).name(
    "ANY_COMBINATION"
  )
)
  .name("IDENTIFIER")
  .token();
