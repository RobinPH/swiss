import BNF from "../../BNF";
const { CONCAT, ATOM, PLUS, STAR, OR } = BNF;

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