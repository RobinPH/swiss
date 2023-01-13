import { OR, WORD } from "../..";

//Logical Boolean (NOT, OR, AND)
export const LOGICAL_NOT_OPERATOR = WORD("NOT")
  .name("LOGICAL_NOT_OPERATOR")
  .token();

export const LOGICAL_OR_OPERATOR = WORD("OR")
  .name("LOGICAL_OR_OPERATOR")
  .token();

export const LOGICAL_AND_OPERATOR = WORD("AND")
  .name("LOGICAL_AND_OPERATOR")
  .token();

export const LOGICAL_BOOLEAN_OPERATORS = OR(
  LOGICAL_NOT_OPERATOR,
  LOGICAL_OR_OPERATOR,
  LOGICAL_AND_OPERATOR
).name("LOGICAL_BOOLEAN_OPERATORS");
