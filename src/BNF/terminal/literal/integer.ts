import { ATOM, CONCAT, OPTIONAL, OR, STAR } from "../..";
import { DIGIT, DIGIT_NONZERO } from "../digit";

export const INTEGER = OR(
  ATOM("0"),
  CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))
)
  .name("INTEGER_LITERAL")
  .token();
