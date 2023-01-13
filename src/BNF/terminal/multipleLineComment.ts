import BNF from "../../BNF";
import { CHARACTER_WITHOUT_POUND } from "./characterWithoutPound";
const { CONCAT, ATOM, STAR, } = BNF;

export const MULTI_LINE_COMMENT = CONCAT(
    ATOM("#"),
    ATOM("#"),
    ATOM("#"),
    STAR(CHARACTER_WITHOUT_POUND),
    ATOM("#"),
    ATOM("#"),
    ATOM("#"),
)
    .name("MULTI_LINE_COMMENT")
    .token();
