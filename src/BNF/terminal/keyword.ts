import { CONCAT, OPTIONAL, OR, WORD } from "..";
import { CONST_DECLARATOR, LET_DECLARATOR } from "./declarator";
import { ARRAY } from "./value";
import { NON_EMPTY_WHITESPACE } from "./whitespace";

export const TRUE_VALUE_KEYWORD = WORD("true")
  .name("BOOLEAN_TRUE_KEYWORD")
  .token();

export const FALSE_VALUE_KEYWORD = WORD("false")
  .name("BOOLEAN_FALSE_KEYWORD")
  .token();

export const BOOLEAN_LITERAL = OR(TRUE_VALUE_KEYWORD, FALSE_VALUE_KEYWORD).name(
  "BOOLEAN_LITERAL"
);

// Null Keyword
export const NULL_KEYWORD = WORD("null").name("NULL_KEYWORD").token();

//Exception Keyword
export const TRY_KEYWORD = WORD("try").name("TRY_KEYWORD").token();

export const CATCH_KEYWORD = WORD("catch").name("CATCH_KEYWORD").token();

export const FINALLY_KEYWORD = WORD("finally").name("FINALLY_KEYWORD").token();

export const RAISE_KEYWORD = WORD("raise").name("RAISE_KEYWORD").token();

export const EXCEPTION_KEYWORD = OR(
  TRY_KEYWORD,
  CATCH_KEYWORD,
  FINALLY_KEYWORD,
  RAISE_KEYWORD
).name("EXCEPTION_KEYWORD");

//Return Keyword
export const RETURN_KEYWORD = WORD("return").name("RETURN_KEYWORD").token();

export const LOOPING_KEYWORD_FOR = WORD("for")
  .name("LOOPING_KEYWORD_FOR")
  .token();
export const LOOPING_KEYWORD_WHILE = WORD("while")
  .name("LOOPING_KEYWORD_WHILE")
  .token();
export const LOOPING_KEYWORD_DO = WORD("do").name("LOOPING_KEYWORD_DO").token();

export const LOOPING_KEYWORD = OR(
  LOOPING_KEYWORD_FOR,
  LOOPING_KEYWORD_WHILE,
  LOOPING_KEYWORD_DO
).name("LOOPING_KEYWORD");

export const LOOPING_CONTROL_KEYWORD = OR(
  WORD("break").name("LOOPING_CONTROL_KEYWORD_BREAK").token(),
  WORD("continue").name("LOOPING_CONTROL_KEYWORD_CONTINUE").token()
).name("LOOPING_CONTROL_KEYWORD");

export const SWITCH_KEYWORD_SWITCH = WORD("switch")
  .name("SWITCH_KEYWORD_SWITCH")
  .token();
export const SWITCH_KEYWORD_CASE = WORD("case")
  .name("SWITCH_KEYWORD_CASE")
  .token();
export const SWITCH_KEYWORD_DEFAULT = WORD("default")
  .name("SWITCH_KEYWORD_DEFAULT")
  .token();

export const SWITCH_KEYWORD = OR(
  SWITCH_KEYWORD_SWITCH,
  SWITCH_KEYWORD_CASE,
  SWITCH_KEYWORD_DEFAULT
).name("SWITCH_KEYWORD");

export const IF_STATEMENT_KEYWORD_ELSE = WORD("else")
  .name("IF_STATEMENT_KEYWORD_ELSE")
  .token();
export const IF_STATEMENT_KEYWORD_IF = WORD("if")
  .name("IF_STATEMENT_KEYWORD_IF")
  .token();

export const IF_STATEMENT_KEYWORD_ELSE_IF = CONCAT(
  IF_STATEMENT_KEYWORD_ELSE,
  NON_EMPTY_WHITESPACE,
  IF_STATEMENT_KEYWORD_IF
)
  .name("IF_STATEMENT_KEYWORD_ELSE_IF")
  .token();

export const IF_STATEMENT_KEYWORD = OR(
  IF_STATEMENT_KEYWORD_IF,
  IF_STATEMENT_KEYWORD_ELSE,
  IF_STATEMENT_KEYWORD_ELSE_IF
).name("IF_STATEMENT_KEYWORD");

export const INTEGER_KEYWORD = WORD("int").name("INTEGER_KEYWORD").token();
export const FLOAT_KEYWORD = WORD("float").name("FLOAT_KEYWORD").token();

//CHARACTER KEYWORD
export const CHARACTER_KEYWORD = WORD("char").name("CHARACTER_KEYWORD").token();
//STRING KEYWORD
export const STRING_KEYWORD = WORD("string").name("STRING_KEYWORD").token();
//BOOLEAN KEYWORD
export const BOOLEAN_KEYWORD = CONCAT(
  WORD("bool").name("BOOLEAN_KEYWORD"),
  OPTIONAL(WORD("ean").name("BOOLEAN_NOISE_WORD")).name("BOOLEAN_NOISE_WORD")
)
  .name("BOOLEAN_KEYWORD")
  .token();

//DATATYPE SPECIFIER
export const DATATYPE_SPECIFIER = OR(
  CHARACTER_KEYWORD,
  STRING_KEYWORD,
  BOOLEAN_KEYWORD,
  INTEGER_KEYWORD,
  FLOAT_KEYWORD
).name("DATATYPE_SPECIFIER");

//FUNCTION_KEYWORD
export const FUNCTION_KEYWORD = WORD("function")
  .name("FUNCTION_KEYWORD")
  .token();

//ARRAY_KEYWORD
export const ARRAY_KEYWORD = WORD("array").name("ARRAY_KEYWORD").token();

//OBJECT_KEYWORD
export const OBJECT_KEYWORD = WORD("object").name("OBJECT_KEYWORD").token();

export const CLASS_KEYWORD = WORD("class").name("CLASS_KEYWORD").token();
export const CLASS_EXTENDS_KEYWORD = WORD("extends")
  .name("CLASS_EXTENDS_KEYWORD")
  .token();

export const CLASS_KEYWORDS = OR(CLASS_KEYWORD, CLASS_EXTENDS_KEYWORD).name(
  "CLASS_KEYWORDS"
);

export const NEW_OBJECT_KEYWORD = WORD("new")
  .name("NEW_OBJECT_KEYWORD")
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
