import BNF from "../../BNF";
import { ALPHABET } from "./alphabet";
import { DIGIT, DIGIT_NONZERO } from "./digit";
const { ATOM, OR, CONCAT, STAR, PLUS, OPTIONAL, WORD } = BNF;

export const UNDERSCORE = ATOM("_").name("UNDERSCORE");

export const IDENTIFIER = CONCAT(
  OR(ALPHABET, UNDERSCORE).name("NO_DIGIT_PREFIX"),
  STAR(OR(ALPHABET, UNDERSCORE, DIGIT).name("NO_PREFIX_RESTRICTION")).name(
    "ANY_COMBINATION"
  )
)
  .name("IDENTIFIER")
  .token();

const nonEmptyWhiteSpaceCharacter = [" ", "\t", "\n", "\r"] as const;

export const NON_EMPTY_WHITESPACE_CHARACTER = OR(
  ...nonEmptyWhiteSpaceCharacter.map((ch) => ATOM(ch).name(ch).hide())
).name("NON_EMPTY_WHITESPACE_CHARACTER");

export const NON_EMPTY_WHITESPACE = PLUS(NON_EMPTY_WHITESPACE_CHARACTER)
  .name("NON_EMPTY_WHITESPACE")
  .token();

const EMPTY_SPACE = ATOM("").name("EPSILON").hide();

export const WHITESPACE = CONCAT(
  EMPTY_SPACE,
  STAR(NON_EMPTY_WHITESPACE_CHARACTER).name("WHITESPACE")
)
  .name("WHITESPACE")
  .token();

export const ASSIGNMENT_OPERATOR = ATOM("=")
  .name("ASSIGNMENT_OPERATOR")
  .token();

export const CONST_DECLARATOR = CONCAT(
  WORD("const").name("CONST_DECLARATOR"),
  OPTIONAL(WORD("ant").name("CONST_NOISE_WORD")).name("CONST_NOISE_WORD")
)
  .name("CONST_DECLARATOR")
  .token();

export const LET_DECLARATOR = WORD("let").name("LET_DECLARATOR").token();

export const DECLARATOR = OR(LET_DECLARATOR, CONST_DECLARATOR).name(
  "DECLARATOR"
);

export const INTEGER = OR(
  ATOM("0"),
  CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))
)
  .name("INTEGER_LITERAL")
  .token();

export const FLOAT = CONCAT(
  OR(ATOM("0"), CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))).name(
    "FLOAT_INTEGER_PART"
  ),
  ATOM(".").name("DECIMAL_POINT"),
  PLUS(DIGIT).name("FLOAT_FRACTIONAL_PART")
)
  .name("FLOAT_LITERAL")
  .token();

export const NUMBER = OR(FLOAT, INTEGER).name("NUMBER_LITERAL");

export const SEMICOLON = ATOM(";").name("SEMICOLON").token();
export const STRING = CONCAT(
  ATOM("'").name("STRING_OPENING_QUOTE").token(),
  STAR(ALPHABET).name("STRING_LITERAL").token(),
  ATOM("'").name("STRING_CLOSING_QUOTE").token()
).name("STRING");

export const VALUE = OR(NUMBER, STRING).name("VALUE");

export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  ASSIGNMENT_OPERATOR,
  WHITESPACE,
  VALUE,
  SEMICOLON
).name("DECLARATION_STATEMENT");
