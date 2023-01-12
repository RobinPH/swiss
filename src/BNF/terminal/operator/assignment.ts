import BNF from "../../../BNF";
const { ATOM } = BNF;

export const ASSIGNMENT_OPERATOR = ATOM("=")
  .name("ASSIGNMENT_OPERATOR")
  .token();
