import BNF from "../../../BNF";
import { DIGIT, DIGIT_NONZERO } from "../digit";
const { ATOM, CONCAT, STAR, OPTIONAL, OR } = BNF;

export const INTEGER = OR(
  ATOM("0"),
  CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))
)
  .name("INTEGER_LITERAL")
  .token();
