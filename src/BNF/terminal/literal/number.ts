import { ATOM, CONCAT, OPTIONAL, OR, PLUS, STAR } from "../..";
import { DIGIT, DIGIT_NONZERO } from "../digit";
import { Token } from "../tokenType";

export const NO_ZERO_PREFIX_INTEGER = OR(
  ATOM("0"),
  CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))
);

export const EXPONENT_PART = CONCAT(
  OR(ATOM("e"), ATOM("E")).name(Token.SCIENTIFIC_EXPONENT_SYMBOL).token(),
  OPTIONAL(ATOM("-").name(Token.NEGATIVE_SYMBOL).token()),
  NO_ZERO_PREFIX_INTEGER
).name(Token.EXPONENT_PART);

export const FLOAT = CONCAT(
  NO_ZERO_PREFIX_INTEGER,
  ATOM(".").name(Token.DECIMAL_POINT),
  PLUS(DIGIT).name(Token.FLOAT_FRACTIONAL_PART),
  OPTIONAL(EXPONENT_PART)
)
  .name(Token.FLOAT_LITERAL)
  .token();

export const INTEGER = CONCAT(NO_ZERO_PREFIX_INTEGER, OPTIONAL(EXPONENT_PART))
  .name(Token.INTEGER_LITERAL)
  .token();

export const NUMBER = OR(FLOAT, INTEGER).name(Token.NUMBER_LITERAL);
