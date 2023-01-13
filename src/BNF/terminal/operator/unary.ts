import { ATOM, OR, WORD } from "../..";

//Unary Operator (+, -, ++, --)
export const UNARY_PLUS_OPERATOR = ATOM("+")
  .name("UNARY_PLUS_OPERATOR")
  .token();

export const UNARY_MINUS_OPERATOR = ATOM("-")
  .name("UNARY_MINUS_OPERATOR")
  .token();

export const INCREMENT_OPERATOR = WORD("++").name("INCREMENT_OPERATOR").token();

export const DECREMENT_OPERATOR = WORD("--").name("DECREMENT_OPERATOR").token();

export const UNARY_OPERATORS = OR(
  UNARY_PLUS_OPERATOR,
  UNARY_MINUS_OPERATOR,
  INCREMENT_OPERATOR,
  DECREMENT_OPERATOR
).name("UNARY_OPERATORS");
