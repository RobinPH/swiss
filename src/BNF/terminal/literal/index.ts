import { OR } from "../..";
import { FLOAT } from "./float";
import { INTEGER } from "./integer";

export const NUMBER = OR(FLOAT, INTEGER).name("NUMBER_LITERAL");
