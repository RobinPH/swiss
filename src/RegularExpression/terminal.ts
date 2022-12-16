import { RegularExpression as re } from ".";
const { ATOM, CONCAT, OR, OPTIONAL, PLUS, STAR } = re;

export const LOWERCASE_ALPHABET = re
  .choicesHidden(..."abcdefghijklmnopqrstuvwxyz".split(""))
  .label("LOWERCASE_ALPHABET")
  .hide();

export const UPPERCASE_ALPHABET = re
  .choicesHidden(..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))
  .label("UPPERCASE_ALPHABET")
  .hide();

export const ALPHABET = re
  .OR(LOWERCASE_ALPHABET, UPPERCASE_ALPHABET)
  .label("ALPHABET");

export const DIGIT = re.choicesHidden(..."0123456789".split("")).label("DIGIT");

export const NON_EMPTY_WHITESPACE_CHARACTER = re
  .choicesHidden(" ", "\t", "\n", "\r")
  .label("NON_EMPTY_WHITESPACE_CHARACTER")
  .hide();

export const NON_EMPTY_WHITESPACE = re
  .PLUS(NON_EMPTY_WHITESPACE_CHARACTER)
  .label("NON_EMPTY_WHITESPACE");

export const WHITESPACE = CONCAT(
  re.EMPTY_SPACE,
  STAR(NON_EMPTY_WHITESPACE_CHARACTER).label("WHITESPACE")
).label("WHITESPACE");

export const ASSIGNMENT_OPERATOR = ATOM("=").label("ASSIGNMENT_OPERATOR");

export const UNDERSCORE = ATOM("_").label("UNDERSCORE");

export const IDENTIFIER = CONCAT(
  OR(ALPHABET, UNDERSCORE).label("NO_DIGIT_PREFIX"),
  STAR(OR(ALPHABET, UNDERSCORE, DIGIT).label("NO_PREFIX_RESTRICTION")).label(
    "ANY_COMBINATION"
  )
).label("IDENTIFIER");

export const CONST_DECLARATOR = CONCAT(
  re.fromWord("const").label("CONST_DECLARATOR"),
  OPTIONAL(re.fromWord("ant").label("CONST_NOISE_WORD")).label(
    "CONST_NOISE_WORD"
  )
).label("CONST_DECLARATOR");

export const DECLARATOR = OR(
  re.fromWord("let").label("LET_DECLARATOR"),
  CONST_DECLARATOR
).label("DECLARATOR");

export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  ASSIGNMENT_OPERATOR,
  WHITESPACE,
  DIGIT
).label("DECLARATION_STATEMENT");
