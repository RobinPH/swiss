import { ATOM, CONCAT, MINUS, OR, STAR } from "..";
import { CHARACTER, CHARACTER_WITHOUT_NEWLINE } from "./character";
import { Token } from "./tokenType";

export const SINGLE_LINE_COMMENT = CONCAT(
  ATOM("#"),
  STAR(CHARACTER_WITHOUT_NEWLINE)
)
  .name(Token.SINGLE_LINE_COMMENT)
  .token();

const POUND = ATOM("#").name(Token.POUND);
const THREE_POUND = CONCAT(POUND, POUND, POUND);

export const MULTI_LINE_COMMENT = CONCAT(
  THREE_POUND,
  STAR(MINUS(CHARACTER, THREE_POUND)).name(Token.COMMENT).token(),
  THREE_POUND
)
  .name(Token.MULTI_LINE_COMMENT)
  .token();

export const COMMENT = OR(MULTI_LINE_COMMENT, SINGLE_LINE_COMMENT).name(
  "COMMENT"
);
