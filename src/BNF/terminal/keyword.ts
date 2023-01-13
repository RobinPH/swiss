import { OR, WORD } from "..";

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

const LOOPING_KEYWORD_FOR = WORD("for").name("LOOPING_KEYWORD_FOR").token();
const LOOPING_KEYWORD_WHILE = WORD("while")
  .name("LOOPING_KEYWORD_WHILE")
  .token();
const LOOPING_KEYWORD_DO = WORD("do").name("LOOPING_KEYWORD_DO").token();

export const LOOPING_KEYWORD = OR(
  LOOPING_KEYWORD_FOR,
  LOOPING_KEYWORD_WHILE,
  LOOPING_KEYWORD_DO
).name("LOOPING_KEYWORD");

export const LOOPING_CONTROL_KEYWORD = OR(
  WORD("break").name("LOOPING_CONTROL_KEYWORD_BREAK").token(),
  WORD("continue").name("LOOPING_CONTROL_KEYWORD_CONTINUE").token()
).name("LOOPING_CONTROL_KEYWORD");

export const SWITCH_KEYWORD = OR(
  WORD("switch").name("SWITCH_KEYWORD_SWITCH").token(),
  WORD("case").name("SWITCH_KEYWORD_CASE").token(),
  WORD("default").name("SWITCH_KEYWORD_DEFAULT").token()
).name("SWITCH_KEYWORD");

export const IF_STATEMENT_KEYWORD = OR(
  WORD("if").name("IF_STATEMENT_KEYWORD_IF").token(),
  WORD("else").name("IF_STATEMENT_KEYWORD_ELSE").token()
).name("IF_STATEMENT_KEYWORD");
