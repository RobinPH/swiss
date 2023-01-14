import { ATOM, CONCAT, OR, PLUS, STAR } from "..";

const nonEmptyWhiteSpaceCharacter = [" ", "\t", "\n", "\r"] as const;

export const NON_EMPTY_WHITESPACE_CHARACTER = OR(
  ...nonEmptyWhiteSpaceCharacter.map((ch) => ATOM(ch).name(ch).hide())
).name("NON_EMPTY_WHITESPACE_CHARACTER");

export const NON_EMPTY_WHITESPACE = PLUS(NON_EMPTY_WHITESPACE_CHARACTER)
  .name("NON_EMPTY_WHITESPACE")
  .token();

const EMPTY_SPACE = ATOM("").name("EPSILON").hide();

export const WHITESPACE = CONCAT(
  EMPTY_SPACE,
  STAR(NON_EMPTY_WHITESPACE_CHARACTER).name("WHITESPACE")
)
  .name("WHITESPACE")
  .token();

const whitespaceWithoutNewline = [" ", "\r", "\t"] as const;

export const WHITESPACE_WITHOUT_NEWLINE = OR(
  ...whitespaceWithoutNewline.map((ch) => ATOM(ch).name(ch).hide())
)
  .name("WHITESPACE_WITHOUT_NEWLINE")
  .token();
