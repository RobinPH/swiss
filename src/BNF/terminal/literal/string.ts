import { ATOM, CONCAT, MINUS, OR, STAR } from "../..";
import { CHARACTER } from "../character";

const STRING_SINGLE_QUOTE = CONCAT(
  ATOM(`'`).name("STRING_OPENING_QUOTE").token(),
  STAR(MINUS(CHARACTER, ATOM("\n"), ATOM(`'`)))
    .name("STRING_CONTENT")
    .token(),
  ATOM(`'`).name("STRING_CLOSING_QUOTE").token()
).name("STRING_SINGLE_QUOTE");

const STRING_DOUBLE_QUOTE = CONCAT(
  ATOM(`"`).name("STRING_OPENING_QUOTE").token(),
  STAR(MINUS(CHARACTER, ATOM("\n"), ATOM(`"`)))
    .name("STRING_CONTENT")
    .token(),
  ATOM(`"`).name("STRING_CLOSING_QUOTE").token()
).name("STRING_DOUBLE_QUOTE");

export const STRING = OR(STRING_SINGLE_QUOTE, STRING_DOUBLE_QUOTE)
  .name("STRING_LITERAL")
  .token();
