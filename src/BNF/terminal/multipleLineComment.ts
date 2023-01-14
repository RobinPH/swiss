import { ATOM, CONCAT, MINUS, OR, STAR } from "..";
import { CHARACTER } from "./character";

const POUND = ATOM("#").name("POUND");
const THREE_POUND = CONCAT(POUND, POUND, POUND);

export const MULTI_LINE_COMMENT = CONCAT(
  THREE_POUND,
  STAR(MINUS(CHARACTER, THREE_POUND)).name("COMMENT").token(),
  THREE_POUND
)
  .name("MULTI_LINE_COMMENT")
  .token();
