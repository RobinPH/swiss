import { CONCAT, OPTIONAL, OR, WORD } from "..";
import { CONST_DECLARATOR, LET_DECLARATOR } from "./declarator";
import { Token } from "./tokenType";
import { ARRAY } from "./value";
import { NON_EMPTY_WHITESPACE } from "./whitespace";

export const TRUE_VALUE_KEYWORD = WORD("true")
  .name(Token.BOOLEAN_TRUE_KEYWORD)
  .token();

export const FALSE_VALUE_KEYWORD = WORD("false")
  .name(Token.BOOLEAN_FALSE_KEYWORD)
  .token();

export const BOOLEAN_LITERAL = OR(TRUE_VALUE_KEYWORD, FALSE_VALUE_KEYWORD)
  .name("BOOLEAN_LITERAL")
  .token();

// Null Keyword
export const NULL_KEYWORD = WORD("null").name(Token.NULL_KEYWORD).token();

//Exception Keyword
export const TRY_KEYWORD = WORD("try").name(Token.TRY_KEYWORD).token();

export const CATCH_KEYWORD = WORD("catch").name(Token.CATCH_KEYWORD).token();

export const FINALLY_KEYWORD = WORD("finally")
  .name(Token.FINALLY_KEYWORD)
  .token();

export const RAISE_KEYWORD = WORD("raise").name(Token.RAISE_KEYWORD).token();

export const EXCEPTION_KEYWORD = OR(
  TRY_KEYWORD,
  CATCH_KEYWORD,
  FINALLY_KEYWORD,
  RAISE_KEYWORD
).name(Token.EXCEPTION_KEYWORD);

//Return Keyword
export const RETURN_KEYWORD = WORD("return").name(Token.RETURN_KEYWORD).token();

export const LOOPING_KEYWORD_FOR = WORD("for")
  .name(Token.LOOPING_KEYWORD_FOR)
  .token();
export const LOOPING_KEYWORD_WHILE = WORD("while")
  .name(Token.LOOPING_KEYWORD_WHILE)
  .token();
export const LOOPING_KEYWORD_DO = WORD("do")
  .name(Token.LOOPING_KEYWORD_DO)
  .token();

export const LOOPING_KEYWORD = OR(
  LOOPING_KEYWORD_FOR,
  LOOPING_KEYWORD_WHILE,
  LOOPING_KEYWORD_DO
).name(Token.LOOPING_KEYWORD);

export const LOOPING_CONTROL_KEYWORD = OR(
  WORD("break").name(Token.LOOPING_CONTROL_KEYWORD_BREAK).token(),
  WORD("continue").name(Token.LOOPING_CONTROL_KEYWORD_CONTINUE).token()
).name(Token.LOOPING_CONTROL_KEYWORD);

export const SWITCH_KEYWORD_SWITCH = WORD("switch")
  .name(Token.SWITCH_KEYWORD_SWITCH)
  .token();
export const SWITCH_KEYWORD_CASE = WORD("case")
  .name(Token.SWITCH_KEYWORD_CASE)
  .token();
export const SWITCH_KEYWORD_DEFAULT = WORD("default")
  .name(Token.SWITCH_KEYWORD_DEFAULT)
  .token();

export const SWITCH_KEYWORD = OR(
  SWITCH_KEYWORD_SWITCH,
  SWITCH_KEYWORD_CASE,
  SWITCH_KEYWORD_DEFAULT
).name(Token.SWITCH_KEYWORD);

export const IF_STATEMENT_KEYWORD_ELSE = WORD("else")
  .name(Token.IF_STATEMENT_KEYWORD_ELSE)
  .token();
export const IF_STATEMENT_KEYWORD_IF = WORD("if")
  .name(Token.IF_STATEMENT_KEYWORD_IF)
  .token();

export const IF_STATEMENT_KEYWORD_ELSE_IF = CONCAT(
  IF_STATEMENT_KEYWORD_ELSE,
  NON_EMPTY_WHITESPACE,
  IF_STATEMENT_KEYWORD_IF
)
  .name(Token.IF_STATEMENT_KEYWORD_ELSE_IF)
  .token();

export const IF_STATEMENT_KEYWORD = OR(
  IF_STATEMENT_KEYWORD_IF,
  IF_STATEMENT_KEYWORD_ELSE,
  IF_STATEMENT_KEYWORD_ELSE_IF
).name(Token.IF_STATEMENT_KEYWORD);

export const INTEGER_DATA_TYPE_KEYWORD = WORD("int")
  .name(Token.INTEGER_DATA_TYPE_KEYWORD)
  .token();
export const FLOAT_DATA_TYPE_KEYWORD = WORD("float")
  .name(Token.FLOAT_DATA_TYPE_KEYWORD)
  .token();

//CHARACTER KEYWORD
export const CHARACTER_DATA_TYPE_KEYWORD = WORD("char")
  .name(Token.CHARACTER_DATA_TYPE_KEYWORD)
  .token();
//STRING KEYWORD
export const STRING_DATA_TYPE_KEYWORD = WORD("string")
  .name(Token.STRING_DATA_TYPE_KEYWORD)
  .token();
//BOOLEAN KEYWORD
export const BOOLEAN_DATA_TYPE_KEYWORD = CONCAT(
  WORD("bool").name(Token.BOOLEAN_KEYWORD),
  OPTIONAL(WORD("ean").name(Token.BOOLEAN_NOISE_WORD)).name(
    Token.BOOLEAN_NOISE_WORD
  )
)
  .name(Token.BOOLEAN_DATA_TYPE_KEYWORD)
  .token();

//DATATYPE SPECIFIER
export const DATATYPE_SPECIFIER = OR(
  CHARACTER_DATA_TYPE_KEYWORD,
  STRING_DATA_TYPE_KEYWORD,
  BOOLEAN_DATA_TYPE_KEYWORD,
  INTEGER_DATA_TYPE_KEYWORD,
  FLOAT_DATA_TYPE_KEYWORD
).name(Token.DATATYPE_SPECIFIER);

//FUNCTION_KEYWORD
export const FUNCTION_KEYWORD = WORD("function")
  .name(Token.FUNCTION_KEYWORD)
  .token();

//ARRAY_KEYWORD
export const ARRAY_KEYWORD = WORD("array").name(Token.ARRAY_KEYWORD).token();

//OBJECT_KEYWORD
export const OBJECT_KEYWORD = WORD("object").name(Token.OBJECT_KEYWORD).token();

export const CLASS_KEYWORD = WORD("class").name(Token.CLASS_KEYWORD).token();
export const CLASS_EXTENDS_KEYWORD = WORD("extends")
  .name(Token.CLASS_EXTENDS_KEYWORD)
  .token();

export const CLASS_KEYWORDS = OR(CLASS_KEYWORD, CLASS_EXTENDS_KEYWORD).name(
  "CLASS_KEYWORDS"
);

export const NEW_OBJECT_KEYWORD = WORD("new")
  .name(Token.NEW_OBJECT_KEYWORD)
  .token();

export const KEYWORDS = OR(
  BOOLEAN_LITERAL,
  DATATYPE_SPECIFIER,
  LOOPING_CONTROL_KEYWORD,
  RETURN_KEYWORD,
  NULL_KEYWORD,
  LET_DECLARATOR,
  CONST_DECLARATOR,
  ARRAY_KEYWORD,
  OBJECT_KEYWORD,
  CLASS_KEYWORDS,
  NEW_OBJECT_KEYWORD
);

export const RESERVED_WORDS = OR(
  FUNCTION_KEYWORD,
  IF_STATEMENT_KEYWORD,
  SWITCH_KEYWORD,
  LOOPING_KEYWORD,
  EXCEPTION_KEYWORD
);
