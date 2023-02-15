import { ATOM, CONCAT, OR, PLUS, STAR } from "..";
import { Token } from "./tokenType";

const nonEmptyWhiteSpaceCharacter = [" ", "\t", "\n", "\r"] as const;

export const NON_EMPTY_WHITESPACE_CHARACTER = OR(
  ...nonEmptyWhiteSpaceCharacter.map((ch) => ATOM(ch).name(ch).hide())
).name(Token.NON_EMPTY_WHITESPACE_CHARACTER);

export const NON_EMPTY_WHITESPACE = PLUS(NON_EMPTY_WHITESPACE_CHARACTER)
  .name(Token.NON_EMPTY_WHITESPACE)
  .token()
  .hide();

export const EMPTY_SPACE = ATOM("").name(Token.EPSILON).hide();

export const WHITESPACE = CONCAT(
  EMPTY_SPACE,
  STAR(NON_EMPTY_WHITESPACE_CHARACTER)
)
  .name(Token.WHITESPACE)
  .token()
  .hide();

const whitespaceWithoutNewline = [" ", "\r", "\t"] as const;

export const WHITESPACE_WITHOUT_NEWLINE = OR(
  ...whitespaceWithoutNewline.map((ch) => ATOM(ch).name(ch).hide())
)
  .name(Token.WHITESPACE_WITHOUT_NEWLINE)
  .token();
