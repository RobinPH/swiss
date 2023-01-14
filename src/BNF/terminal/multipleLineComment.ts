import { ATOM, CONCAT, MINUS, OR, STAR } from "..";
import { CHARACTER } from "./character";

const POUND = ATOM("#").name("POUND");
const THREE_POUND_BURGER = CONCAT(POUND, POUND, POUND);

export const MULTI_LINE_COMMENT = CONCAT(
  THREE_POUND_BURGER,
  STAR(
    MINUS(
      OR(
        CHARACTER,
        CONCAT(CHARACTER, CHARACTER),
        CONCAT(CHARACTER, CHARACTER, CHARACTER)
      ),
      THREE_POUND_BURGER
    )
  )
    .name("comment")
    .token(),
  THREE_POUND_BURGER
)
  .name("MULTI_LINE_COMMENT")
  .token();
