import { ATOM, OR, WORD } from "../..";

//Bitwise Operators (&, |, ~, ^, <<, >>)
export const AND_BITWISE_OPERATOR = ATOM("&")
  .name("AND_BITWISE_OPERATOR")
  .token();

export const OR_BITWISE_OPERATOR = WORD("|")
  .name("OR_BITWISE_OPERATOR")
  .token();

export const NOT_BITWISE_OPERATOR = WORD("~")
  .name("NOT_BITWISE_OPERATOR")
  .token();

export const XOR_BITWISE_OPERATOR = WORD("^")
  .name("XOR_BITWISE_OPERATOR")
  .token();

export const LEFT_SHIFT_BITWISE_OPERATOR = WORD("<<")
  .name("LEFT_SHIFT_BITWISE_OPERATOR")
  .token();

export const RIGHT_SHIFT_BITWISE_OPERATOR = WORD(">>")
  .name("RIGHT_SHIFT_BITWISE_OPERATOR")
  .token();

export const BITWISE_OPERATORS = OR(
  AND_BITWISE_OPERATOR,
  OR_BITWISE_OPERATOR,
  NOT_BITWISE_OPERATOR,
  XOR_BITWISE_OPERATOR,
  LEFT_SHIFT_BITWISE_OPERATOR,
  RIGHT_SHIFT_BITWISE_OPERATOR
).name("BITWISE_OPERATORS");
