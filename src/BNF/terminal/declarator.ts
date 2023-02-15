import { CONCAT, OPTIONAL, OR, WORD } from "..";
import { Token } from "./tokenType";

export const CONST_DECLARATOR = CONCAT(
  WORD("const").name(Token.CONST_DECLARATOR),
  OPTIONAL(WORD("ant")).name(Token.CONST_NOISE_WORD)
)
  .name(Token.CONST_DECLARATOR)
  .token();

export const LET_DECLARATOR = WORD("let").name(Token.LET_DECLARATOR).token();

export const DECLARATOR = OR(LET_DECLARATOR, CONST_DECLARATOR).name(
  Token.DECLARATOR
);
