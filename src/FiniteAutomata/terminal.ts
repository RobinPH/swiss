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
const digit_nonzero = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export const LOWERCASE_ALPHABET = OR(
  ...lowercaseAlphabet.map((ch) => ATOM(ch).setValue(ch).hide())
).setValue("LOWERCASE_ALPHABET");

export const UPPERCASE_ALPHABET = OR(
  ...uppercaseAlphabet.map((ch) => ATOM(ch).setValue(ch).hide())
).setValue("UPPERCASE_ALPHABET");

export const ALPHABET = OR(LOWERCASE_ALPHABET, UPPERCASE_ALPHABET).setValue(
  "ALPHABET"
);

export const UNDERSCORE = ATOM("_").setValue("UNDERSCORE");

export const DIGIT = OR(
  ...digit.map((ch) => ATOM(ch).setValue(ch).hide())
).setValue("DIGIT");

export const DIGIT_NONZERO = OR(
  ...digit_nonzero.map((ch) => ATOM(ch).setValue(ch).hide())
).setValue("DIGIT_NONZERO");

export const IDENTIFIER = CONCAT(
  OR(ALPHABET, UNDERSCORE).setValue("NO_DIGIT_PREFIX"),
  STAR(
    OR(ALPHABET, UNDERSCORE, DIGIT).setValue("NO_PREFIX_RESTRICTION")
  ).setValue("ANY_COMBINATION")
)
  .setValue("IDENTIFIER")
  .token();

const nonEmptyWhiteSpaceCharacter = [" ", "\t", "\n", "\r"] as const;

export const NON_EMPTY_WHITESPACE_CHARACTER = OR(
  ...nonEmptyWhiteSpaceCharacter.map((ch) => ATOM(ch).setValue(ch).hide())
).setValue("NON_EMPTY_WHITESPACE_CHARACTER");

export const NON_EMPTY_WHITESPACE = PLUS(NON_EMPTY_WHITESPACE_CHARACTER)
  .setValue("NON_EMPTY_WHITESPACE")
  .token();

export const WHITESPACE = CONCAT(
  EMPTY_SPACE,
  STAR(NON_EMPTY_WHITESPACE_CHARACTER).setValue("WHITESPACE")
)
  .setValue("WHITESPACE")
  .token();

export const ASSIGNMENT_OPERATOR = ATOM("=")
  .setValue("ASSIGNMENT_OPERATOR")
  .token();

export const CONST_DECLARATOR = CONCAT(
  WORD("const").setValue("CONST_DECLARATOR"),
  OPTIONAL(WORD("ant").setValue("CONST_NOISE_WORD")).setValue(
    "CONST_NOISE_WORD"
  )
)
  .setValue("CONST_DECLARATOR")
  .token();

export const LET_DECLARATOR = WORD("let").setValue("LET_DECLARATOR").token();

export const DECLARATOR = OR(LET_DECLARATOR, CONST_DECLARATOR).setValue(
  "DECLARATOR"
);

export const INTEGER = OR(
  ATOM("0"),
  CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))
)
  .setValue("INTEGER_LITERAL")
  .token();

export const FLOAT = CONCAT(
  OR(ATOM("0"), CONCAT(DIGIT_NONZERO, OPTIONAL(STAR(DIGIT)))).setValue(
    "FLOAT_INTEGER_PART"
  ),
  ATOM(".").setValue("DECIMAL_POINT"),
  PLUS(DIGIT).setValue("FLOAT_FRACTIONAL_PART")
)
  .setValue("FLOAT_LITERAL")
  .token();

export const NUMBER = OR(FLOAT, INTEGER).setValue("NUMBER_LITERAL");

export const SEMICOLON = ATOM(";").setValue("SEMICOLON").token();
export const STRING = CONCAT(
  ATOM("'").setValue("STRING_OPENING_QUOTE").token(),
  STAR(ALPHABET).setValue("STRING_LITERAL").token(),
  ATOM("'").setValue("STRING_CLOSING_QUOTE").token()
).setValue("STRING");


export const VALUE = OR(INTEGER, STRING).setValue("VALUE");

//CHARACTER KEYWORD
export const CHARACTER_KEYWORD = WORD("char").setValue("CHARACTER_KEYWORD").token();
//STRING KEYWORD
export const STRING_KEYWORD = WORD("string").setValue("STRING_KEYWORD").token();
//BOOLEAN KEYWORD
export const BOOLEAN_KEYWORD = CONCAT(
  WORD("bool").setValue("BOOLEAN_KEYWORD"),
  OPTIONAL(WORD("ean")
  .setValue("BOOLEAN_NOISE_WORD"))
  .setValue("BOOLEAN_NOISE_WORD")
)
.setValue("BOOLEAN_KEYWORD")
.token();

//DATATYPE SPECIFIER
export const DATATYPE_SPECIFIER = OR(CHARACTER_KEYWORD, STRING_KEYWORD, BOOLEAN_KEYWORD)
.setValue("DATATYPE_SPECIFIER");

  //FUNCTION_KEYWORD
export const FUNCTION_KEYWORD = WORD("function").setValue("FUNCTION_KEYWORD").token();

export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  DATATYPE_SPECIFIER,
  WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  ASSIGNMENT_OPERATOR,
  WHITESPACE,
  VALUE,
  SEMICOLON
).setValue("DECLARATION_STATEMENT");


