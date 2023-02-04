import { OR, WORD } from "../..";
import { Token } from "../tokenType";

//Logical Boolean (NOT, OR, AND)
export const LOGICAL_NOT_OPERATOR = WORD("NOT")
  .name(Token.LOGICAL_NOT_OPERATOR)
  .token();

export const LOGICAL_OR_OPERATOR = WORD("OR")
  .name(Token.LOGICAL_OR_OPERATOR)
  .token();

export const LOGICAL_AND_OPERATOR = WORD("AND")
  .name(Token.LOGICAL_AND_OPERATOR)
  .token();

export const LOGICAL_UNARY_BOOLEAN_OPERATORS = OR(LOGICAL_NOT_OPERATOR).name(
  "LOGICAL_BOOLEAN_OPERATORS"
);

export const LOGICAL_BINARY_BOOLEAN_OPERATORS = OR(
  LOGICAL_OR_OPERATOR,
  LOGICAL_AND_OPERATOR
).name(Token.LOGICAL_BINARY_BOOLEAN_OPERATORS);

export const LOGICAL_BOOLEAN_OPERATORS = OR(
  LOGICAL_UNARY_BOOLEAN_OPERATORS,
  LOGICAL_BINARY_BOOLEAN_OPERATORS
).name(Token.LOGICAL_BOOLEAN_OPERATORS);
