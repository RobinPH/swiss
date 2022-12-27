import FiniteAutomata from ".";
const { ATOM, OR, CONCAT, PLUS, STAR, OPTIONAL, EMPTY_SPACE, WORD } =
  FiniteAutomata;

const lowercaseAlphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;
const uppercaseAlphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;
const digit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export const LOWERCASE_ALPHABET = OR(
  ...lowercaseAlphabet.map((ch) => ATOM(ch).setValue(ch))
).setValue("LOWERCASE_ALPHABET");

export const UPPERCASE_ALPHABET = OR(
  ...uppercaseAlphabet.map((ch) => ATOM(ch).setValue(ch))
).setValue("UPPERCASE_ALPHABET");

export const ALPHABET = OR(LOWERCASE_ALPHABET, UPPERCASE_ALPHABET).setValue(
  "ALPHABET"
);

export const UNDERSCORE = ATOM("_").setValue("UNDERSCORE");

export const DIGIT = OR(...digit.map((ch) => ATOM(ch).setValue(ch))).setValue(
  "DIGIT"
);

export const IDENTIFIER = CONCAT(
  OR(ALPHABET, UNDERSCORE).setValue("NO_DIGIT_PREFIX"),
  STAR(
    OR(ALPHABET, UNDERSCORE, DIGIT).setValue("NO_PREFIX_RESTRICTION")
  ).setValue("ANY_COMBINATION")
).setValue("IDENTIFIER");

const nonEmptyWhiteSpaceCharacter = [" ", "\t", "\n", "\r"] as const;

export const NON_EMPTY_WHITESPACE_CHARACTER = OR(
  ...nonEmptyWhiteSpaceCharacter.map((ch) => ATOM(ch).setValue(ch))
).setValue("NON_EMPTY_WHITESPACE_CHARACTER");

export const NON_EMPTY_WHITESPACE = PLUS(
  NON_EMPTY_WHITESPACE_CHARACTER
).setValue("NON_EMPTY_WHITESPACE");

export const WHITESPACE = CONCAT(
  EMPTY_SPACE,
  STAR(NON_EMPTY_WHITESPACE_CHARACTER).setValue("WHITESPACE")
).setValue("WHITESPACE");

export const ASSIGNMENT_OPERATOR = ATOM("=").setValue("ASSIGNMENT_OPERATOR");

export const CONST_DECLARATOR = CONCAT(
  WORD("const").setValue("CONST_DECLARATOR"),
  OPTIONAL(WORD("ant").setValue("CONST_NOISE_WORD")).setValue(
    "CONST_NOISE_WORD"
  )
).setValue("CONST_DECLARATOR");

export const DECLARATOR = OR(
  WORD("let").setValue("LET_DECLARATOR"),
  WORD("const").setValue("CONST_DECLARATOR")
  // CONST_DECLARATOR
).setValue("DECLARATOR");

export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  ASSIGNMENT_OPERATOR,
  WHITESPACE,
  DIGIT
).setValue("DECLARATION_STATEMENT");
