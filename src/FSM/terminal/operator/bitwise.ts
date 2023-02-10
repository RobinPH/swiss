import { ATOM, OR, WORD } from "../..";
import { Token } from "../tokenType";

//Bitwise Operators (&, |, ~, ^, <<, >>)
export const AND_BITWISE_OPERATOR = ATOM("&")
  .name(Token.AND_BITWISE_OPERATOR)
  .token();

export const OR_BITWISE_OPERATOR = ATOM("|")
  .name(Token.OR_BITWISE_OPERATOR)
  .token();

export const NOT_BITWISE_OPERATOR = ATOM("~")
  .name(Token.NOT_BITWISE_OPERATOR)
  .token();

export const XOR_BITWISE_OPERATOR = ATOM("^")
  .name(Token.XOR_BITWISE_OPERATOR)
  .token();

export const LEFT_SHIFT_BITWISE_OPERATOR = WORD("<<")
  .name(Token.LEFT_SHIFT_BITWISE_OPERATOR)
  .token();

export const RIGHT_SHIFT_BITWISE_OPERATOR = WORD(">>")
  .name(Token.RIGHT_SHIFT_BITWISE_OPERATOR)
  .token();

export const BITWISE_OPERATORS = OR(
  AND_BITWISE_OPERATOR,
  OR_BITWISE_OPERATOR,
  NOT_BITWISE_OPERATOR,
  XOR_BITWISE_OPERATOR,
  LEFT_SHIFT_BITWISE_OPERATOR,
  RIGHT_SHIFT_BITWISE_OPERATOR
).name(Token.BITWISE_OPERATORS);
