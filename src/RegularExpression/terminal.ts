import { RegularExpression as re } from ".";
const { ATOM } = re;

export const LOWERCASE_ALPHABET = re
  .choicesHidden(..."abcdefghijklmnopqrstuvwxyz".split(""))
  .value("LOWERCASE_ALPHABET")
  .hide();

export const UPPERCASE_ALPHABET = re
  .choicesHidden(..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))
  .value("UPPERCASE_ALPHABET")
  .hide();

export const ALPHABET = re
  .OR(LOWERCASE_ALPHABET, UPPERCASE_ALPHABET)
  .value("ALPHABET");

export const DIGIT = re.choicesHidden(..."0123456789".split("")).value("DIGIT");

export const NON_EMPTY_WHITESPACE_CHARACTER = re
  .choicesHidden(" ", "\t", "\n", "\r")
  .value("NON_EMPTY_WHITESPACE_CHARACTER")
  .hide();

export const NON_EMPTY_WHITESPACE = re
  .PLUS(NON_EMPTY_WHITESPACE_CHARACTER)
  .value("NON_EMPTY_WHITESPACE");

export const WHITESPACE = re
  .CONCAT(
    re.EMPTY_SPACE,
    re.STAR(NON_EMPTY_WHITESPACE_CHARACTER).value("WHITESPACE")
  )
  .value("WHITESPACE");

export const ASSIGNMENT_OPERATOR = ATOM("=").value("ASSIGNMENT_OPERATOR");

export const UNDERSCORE = ATOM("_").value("UNDERSCORE");

export const IDENTIFIER = re
  .CONCAT(
    re.OR(ALPHABET, UNDERSCORE).value("NO_DIGIT_PREFIX"),
    re
      .STAR(re.OR(ALPHABET, UNDERSCORE, DIGIT).value("NO_PREFIX_RESTRICTION"))
      .value("ANY_COMBINATION")
  )
  .value("IDENTIFIER");

export const CONST_DECLARATOR = re
  .CONCAT(
    re.fromWord("const").value("CONST_DECLARATOR"),
    re
      .OPTIONAL(re.fromWord("ant").value("CONST_NOISE_WORD"))
      .value("CONST_NOISE_WORD")
  )
  .value("CONST_DECLARATOR");

export const DECLARATOR = re
  .OR(re.fromWord("let").value("LET_DECLARATOR"), CONST_DECLARATOR)
  .value("DECLARATOR");

export const DECLARATION_STATEMENT = re
  .CONCAT(
    DECLARATOR,
    NON_EMPTY_WHITESPACE,
    IDENTIFIER,
    WHITESPACE,
    ASSIGNMENT_OPERATOR,
    WHITESPACE,
    DIGIT
  )
  .value("DECLARATION_STATEMENT");
