import { ATOM, CONCAT, OR, STAR } from "../..";
import { CHARACTER } from "../character";
import { Token } from "../tokenType";

const STRING_SINGLE_QUOTE = CONCAT(
  ATOM(`'`).name(Token.STRING_OPENING_QUOTE).token(),
  // STAR(MINUS(CHARACTER, ATOM("\n"), ATOM(`'`)))
  //   .name(Token.STRING_CONTENT)
  //   .token(),
  STAR(CHARACTER).name(Token.STRING_CONTENT).token(),
  ATOM(`'`).name(Token.STRING_CLOSING_QUOTE).token()
).name(Token.STRING_SINGLE_QUOTE);

const STRING_DOUBLE_QUOTE = CONCAT(
  ATOM(`"`).name(Token.STRING_OPENING_QUOTE).token(),
  // STAR(MINUS(CHARACTER, ATOM("\n"), ATOM(`"`)))
  //   .name(Token.STRING_CONTENT)
  //   .token(),
  STAR(CHARACTER).name(Token.STRING_CONTENT).token(),
  ATOM(`"`).name(Token.STRING_CLOSING_QUOTE).token()
).name(Token.STRING_DOUBLE_QUOTE);

export const STRING = OR(STRING_SINGLE_QUOTE, STRING_DOUBLE_QUOTE)
  .name(Token.STRING_LITERAL)
  .token();
