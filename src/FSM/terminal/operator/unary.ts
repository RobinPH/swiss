import { ATOM, OR, WORD } from "../..";
import { Token } from "../tokenType";
import { LOGICAL_UNARY_BOOLEAN_OPERATORS } from "./logical";

//Unary Operator (+, -, ++, --)
export const UNARY_PLUS_OPERATOR = ATOM("+")
  .name(Token.UNARY_PLUS_OPERATOR)
  .token();

export const UNARY_MINUS_OPERATOR = ATOM("-")
  .name(Token.UNARY_MINUS_OPERATOR)
  .token();

export const INCREMENT_OPERATOR = WORD("++")
  .name(Token.INCREMENT_OPERATOR)
  .token();

export const DECREMENT_OPERATOR = WORD("--")
  .name(Token.DECREMENT_OPERATOR)
  .token();

export const UNARY_PREFIX_OPERATOR = OR(
  INCREMENT_OPERATOR,
  DECREMENT_OPERATOR,
  LOGICAL_UNARY_BOOLEAN_OPERATORS,
  INCREMENT_OPERATOR,
  DECREMENT_OPERATOR,
  UNARY_PLUS_OPERATOR,
  UNARY_MINUS_OPERATOR
).name(Token.UNARY_PREFIX_OPERATOR);

export const UNARY_SUFFIX_OPERATOR = OR(
  INCREMENT_OPERATOR,
  DECREMENT_OPERATOR
).name(Token.UNARY_SUFFIX_OPERATOR);
