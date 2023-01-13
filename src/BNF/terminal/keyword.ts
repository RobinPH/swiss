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
