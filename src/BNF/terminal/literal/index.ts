import { FLOAT } from "./float";
import { INTEGER } from "./integer";
import BNF from "../../../BNF";
const { OR } = BNF;

export const NUMBER = OR(FLOAT, INTEGER).name("NUMBER_LITERAL");
