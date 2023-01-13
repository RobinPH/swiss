import BNF from "../..";
import { DIGIT, DIGIT_NONZERO } from "../digit";
const { ATOM, CONCAT, STAR, OPTIONAL, OR, PLUS } = BNF;

export const FLOAT = CONCAT(
  OR(ATOM("0"), CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))).name(
    "FLOAT_INTEGER_PART"
  ),
  ATOM(".").name("DECIMAL_POINT"),
  PLUS(DIGIT).name("FLOAT_FRACTIONAL_PART")
)
  .name("FLOAT_LITERAL")
  .token();
