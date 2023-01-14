import { ATOM, CONCAT, STAR } from "..";
import { CHARACTER_WITHOUT_NEWLINE } from "./character";

export const SINGLE_LINE_COMMENT = CONCAT(
  ATOM("#"),
  STAR(CHARACTER_WITHOUT_NEWLINE)
)
  .name("SINGLE_LINE_COMMENT")
  .token();
