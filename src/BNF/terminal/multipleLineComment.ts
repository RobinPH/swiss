import BNF from "../../BNF";
import { CHARACTER } from "./character";
const { CONCAT, ATOM, STAR, } = BNF;

export const MULTI_LINE_COMMENT = CONCAT(
    ATOM("#"),
    ATOM("#"),
    ATOM("#"),
    STAR(CHARACTER),
    ATOM("#"),
    ATOM("#"),
    ATOM("#"),
)
    .name("MULTI_LINE_COMMENT")
    .token();
    