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


//Assignment Operators (=, +=, -=, *=, /=, %=, //=, **=)
export const ASSIGNMENT_OPERATOR = ATOM("=")
  .setValue("ASSIGNMENT_OPERATOR")
  .token();

export const ADDITION_ASSIGNMENT_OPERATOR = WORD("+=")
  .setValue("ADDITION_ASSIGNMENT_OPERATOR")
  .token();

export const SUBTRACTION_ASSIGNMENT_OPERATOR = WORD("-=")
  .setValue("SUBTRACTION_ASSIGNMENT_OPERATOR")
  .token();

export const MULTIPLICATION_ASSIGNMENT_OPERATOR = WORD("*=")
  .setValue("MULTIPLICATION_ASSIGNMENT_OPERATOR")
  .token();

export const DIVISION_ASSIGNMENT_OPERATOR = WORD("/=")
  .setValue("DIVISION_ASSIGNMENT_OPERATOR")
  .token();

export const MODULO_ASSIGNMENT_OPERATOR = WORD("%=")
  .setValue("MODULO_ASSIGNMENT_OPERATOR")
  .token();

export const INTEGER_DIVISION_ASSIGNMENT_OPERATOR = WORD("//=")
  .setValue("INTEGER_DIVISION_ASSIGNMENT_OPERATOR")
  .token();

export const EXPONENT_ASSIGNMENT_OPERATOR = WORD("**=")
  .setValue("EXPONENT_ASSIGNMENT_OPERATOR")
  .token();
  
export const ASSIGNMENT_OPERATORS = 
  OR(ASSIGNMENT_OPERATOR, ADDITION_ASSIGNMENT_OPERATOR,
    SUBTRACTION_ASSIGNMENT_OPERATOR, EXPONENT_ASSIGNMENT_OPERATOR,
    MULTIPLICATION_ASSIGNMENT_OPERATOR, INTEGER_DIVISION_ASSIGNMENT_OPERATOR, 
    DIVISION_ASSIGNMENT_OPERATOR, MODULO_ASSIGNMENT_OPERATOR
  ,)
  .setValue("ASSIGNMENT_OPERATORS");

//Arithmetic Operators (+, -, *, /, %, //, **)
export const ADDITION_OPERATOR = ATOM("+")
  .setValue("ADDITION_ASSIGNMENT_OPERATOR")
  .token();

export const SUBTRACTION_OPERATOR = ATOM("-")
  .setValue("SUBTRACTION_OPERATOR")
  .token();

  export const MULTIPLICATION_OPERATOR = ATOM("*")
  .setValue("MULTIPLICATION_OPERATOR")
  .token();

export const DIVISION_OPERATOR = ATOM("/")
  .setValue("DIVISION_OPERATOR")
  .token();

export const MODULO_OPERATOR = ATOM("%")
  .setValue("MODULO_OPERATOR")
  .token();

export const INTEGER_DIVISION_OPERATOR = WORD("//")
  .setValue("INTEGER_DIVISION_OPERATOR")
  .token();

export const EXPONENT_OPERATOR = WORD("**")
  .setValue("EXPONENT_OPERATOR")
  .token();
  
export const ARITHMETIC_OPERATORS = 
  OR(ASSIGNMENT_OPERATOR, ADDITION_OPERATOR ,SUBTRACTION_OPERATOR, 
  MULTIPLICATION_OPERATOR, DIVISION_OPERATOR, MODULO_OPERATOR,
  INTEGER_DIVISION_ASSIGNMENT_OPERATOR,EXPONENT_ASSIGNMENT_OPERATOR)
  .setValue("ARITHEMTIC_OPERATORS");

//Unary Operator (+, -, ++, --)
export const UNARY_PLUS_OPERATOR = ATOM("+")
  .setValue("UNARY_PLUS_OPERATOR")
  .token();

export const UNARY_MINUS_OPERATOR = ATOM("-")
  .setValue("UNARY_MINUS_OPERATOR")
  .token();

//BALIKAN
export const INCREMENT_OPERATOR = WORD("++")
  .setValue("INCREMENT_OPERATOR")
  .token();

//BALIKAN
export const DECREMENT_OPERATOR = WORD("--")
  .setValue("DECREMENT_OPERATOR")
  .token();

export const UNARY_OPERATORS = 
  OR(UNARY_PLUS_OPERATOR, UNARY_MINUS_OPERATOR, 
    INCREMENT_OPERATOR,DECREMENT_OPERATOR)
  .setValue("UNARY_OPERATORS");

//Logical Boolean (NOT, OR, AND)
export const LOGICAL_NOT_OPERATOR = WORD("NOT")
  .setValue("LOGICAL_NOT_OPERATOR")
  .token();

export const LOGICAL_OR_OPERATOR = WORD("OR")
  .setValue("LOGICAL_OR_OPERATOR")
  .token();

export const LOGICAL_AND_OPERATOR = WORD("AND")
  .setValue("LOGICAL_AND_OPERATOR")
  .token();

export const LOGICAL_BOOLEAN_OPERATORS = 
  OR(LOGICAL_NOT_OPERATOR, LOGICAL_OR_OPERATOR, 
    LOGICAL_AND_OPERATOR)
  .setValue("LOGICAL_BOOLEAN_OPERATORS");

//RELATIONAL BOOLEAN (==, !=, >, <, >=, <=)
export const EQUAL_TO_OPERATOR = ATOM("==")
  .setValue("EQUAL_TO_OPERATOR")
  .token();

export const NOT_EQUAL_TO_OPERATOR = WORD("!=")
  .setValue("NOT_EQUAL_TO_OPERATOR")
  .token();

export const GREATER_THAN_OPERATOR = ATOM(">")
  .setValue("GREATER_THAN_OPERATOR")
  .token();

//BALIKAN
export const GREATER_THAN_OR_EQUAL_TO_OPERATOR = WORD(">=")
  .setValue("GREATER_THAN_OR_EQUAL_TO_OPERATOR")
  .token();

export const LESS_THAN_OPERATOR = ATOM("<")
  .setValue("LESS_THAN_OPERATOR")
  .token();

//BALIKAN
export const LESS_THAN_OR_EQUAL_TO_OPERATOR = WORD("<=")
  .setValue("LESS_THAN_OR_EQUAL_TO_OPERATOR")
  .token();

export const RELATIONAL_BOOLEAN_OPERATORS = 
  OR(EQUAL_TO_OPERATOR, NOT_EQUAL_TO_OPERATOR, 
  GREATER_THAN_OPERATOR, GREATER_THAN_OR_EQUAL_TO_OPERATOR,
  LESS_THAN_OPERATOR, LESS_THAN_OR_EQUAL_TO_OPERATOR)
  .setValue("RELATIONAL_BOOLEAN_OPERATORS");

//Bitwise Operators (&, |, ~, ^, <<, >>)
export const AND_BITWISE_OPERATOR = ATOM("&")
  .setValue("AND_BITWISE_OPERATOR")
  .token();

export const OR_BITWISE_OPERATOR = WORD("|")
  .setValue("OR_BITWISE_OPERATOR")
  .token();

export const NOT_BITWISE_OPERATOR = WORD("~")
  .setValue("NOT_BITWISE_OPERATOR")
  .token();

export const XOR_BITWISE_OPERATOR = WORD("^")
  .setValue("XOR_BITWISE_OPERATOR")
  .token();

export const LEFT_SHIFT_BITWISE_OPERATOR = WORD("<<")
  .setValue("LEFT_SHIFT_BITWISE_OPERATOR")
  .token();

export const RIGHT_SHIFT_BITWISE_OPERATOR = WORD(">>")
  .setValue("RIGHT_SHIFT_BITWISE_OPERATOR")
  .token();

export const BITWISE_OPERATORS = 
  OR(AND_BITWISE_OPERATOR, OR_BITWISE_OPERATOR, 
    NOT_BITWISE_OPERATOR, XOR_BITWISE_OPERATOR, 
    LEFT_SHIFT_BITWISE_OPERATOR, RIGHT_SHIFT_BITWISE_OPERATOR)
  .setValue("BITWISE_OPERATORS");


export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  ASSIGNMENT_OPERATOR,
  WHITESPACE,
  VALUE,
  WHITESPACE,
  RELATIONAL_BOOLEAN_OPERATORS,
  WHITESPACE,
  VALUE,
  SEMICOLON
).setValue("DECLARATION_STATEMENT");

// ---- KEYWORDS ---- //

const LOOPING_KEYWORD_FOR = WORD("for").setValue("LOOPING_KEYWORD_FOR").token();
const LOOPING_KEYWORD_WHILE = WORD("while").setValue("LOOPING_KEYWORD_WHILE").token();
const LOOPING_KEYWORD_DO = WORD("do").setValue("LOOPING_KEYWORD_DO").token();

export const LOOPING_KEYWORD = OR(
  LOOPING_KEYWORD_FOR,
  LOOPING_KEYWORD_WHILE,
  LOOPING_KEYWORD_DO,
)
  .setValue("LOOPING_KEYWORD");

/* 
export const FOR_LOOP_STATEMENT = CONCAT(
  LOOPING_KEYWORD_FOR,
  NON_EMPTY_WHITESPACE,
  // initialization
  ATOM("("), 
  LET_DECLARATOR, 
  NON_EMPTY_WHITESPACE, 
  IDENTIFIER, 
  WHITESPACE, 
  ASSIGNMENT_OPERATOR, 
  WHITESPACE, 
  VALUE,
  SEMICOLON,
  // test
  OR(
    // either an explicit condition...
    CONCAT(IDENTIFIER, WHITESPACE, RELATIONAL_BOOLEAN_OPERATORS, WHITESPACE, VALUE),
    // an explicit boolean (which will make this like a while loop)...
    // -- insert BOOLEAN_KEYWORD here --
    // or a boolean identifier
    IDENTIFIER,
  ),
  SEMICOLON,
  // update
  WHITESPACE,
  OR(
    DECLARATION_STATEMENT,
    CONCAT(IDENTIFIER, OR(INCREMENT_OPERATOR, DECREMENT_OPERATOR)),
  ),
  ATOM(")"),
  ATOM(":")
)
  .setValue("FOR_LOOP_STATEMENT"); 
*/

export const LOOPING_CONTROL_KEYWORD = OR(
  WORD("break").setValue("LOOPING_CONTROL_KEYWORD_BREAK").token(),
  WORD("continue").setValue("LOOPING_CONTROL_KEYWORD_CONTINUE").token()
)
  .setValue("LOOPING_CONTROL_KEYWORD");

export const SWITCH_KEYWORD = OR(
  WORD("switch").setValue("SWITCH_KEYWORD_SWITCH").token(),
  WORD("case").setValue("SWITCH_KEYWORD_CASE").token(),
  WORD("default").setValue("SWITCH_KEYWORD_DEFAULT").token(),
)
  .setValue("SWITCH_KEYWORD");

export const IF_STATEMENT_KEYWORD = OR(
  WORD("if").setValue("IF_STATEMENT_KEYWORD_IF").token(),
  WORD("else").setValue("IF_STATEMENT_KEYWORD_ELSE").token(),
)
  .setValue("IF_STATEMENT_KEYWORD");

