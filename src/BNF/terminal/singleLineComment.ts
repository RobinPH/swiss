import BNF from "../../BNF";
import { CHARACTER_WITHOUT_NEWLINE } from "./character";
const { CONCAT, ATOM, STAR } = BNF;

export const SINGLE_LINE_COMMENT = CONCAT(
  ATOM("#"),
  STAR(CHARACTER_WITHOUT_NEWLINE)
)
  .name("SINGLE_LINE_COMMENT")
  .token();
