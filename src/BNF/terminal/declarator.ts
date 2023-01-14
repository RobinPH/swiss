import { CONCAT, OPTIONAL, OR, WORD } from "..";

export const CONST_DECLARATOR = CONCAT(
  WORD("const").name("CONST_DECLARATOR"),
  OPTIONAL(WORD("ant").name("CONST_NOISE_WORD")).name("CONST_NOISE_WORD")
)
  .name("CONST_DECLARATOR")
  .token();

export const LET_DECLARATOR = WORD("let").name("LET_DECLARATOR").token();

export const DECLARATOR = OR(LET_DECLARATOR, CONST_DECLARATOR).name(
  "DECLARATOR"
);
