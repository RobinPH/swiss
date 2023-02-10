import { ATOM, OR, WORD } from "../..";
import { Token } from "../tokenType";

//RELATIONAL BOOLEAN (==, !=, >, <, >=, <=)
export const EQUAL_TO_OPERATOR = WORD("==")
  .name(Token.EQUAL_TO_OPERATOR)
  .token();

export const NOT_EQUAL_TO_OPERATOR = WORD("!=")
  .name(Token.NOT_EQUAL_TO_OPERATOR)
  .token();

export const GREATER_THAN_OPERATOR = ATOM(">")
  .name(Token.GREATER_THAN_OPERATOR)
  .token();

export const GREATER_THAN_OR_EQUAL_TO_OPERATOR = WORD(">=")
  .name(Token.GREATER_THAN_OR_EQUAL_TO_OPERATOR)
  .token();

export const LESS_THAN_OPERATOR = ATOM("<")
  .name(Token.LESS_THAN_OPERATOR)
  .token();

export const LESS_THAN_OR_EQUAL_TO_OPERATOR = WORD("<=")
  .name(Token.LESS_THAN_OR_EQUAL_TO_OPERATOR)
  .token();

export const RELATIONAL_BOOLEAN_OPERATORS = OR(
  NOT_EQUAL_TO_OPERATOR,
  EQUAL_TO_OPERATOR,
  GREATER_THAN_OR_EQUAL_TO_OPERATOR,
  GREATER_THAN_OPERATOR,
  LESS_THAN_OR_EQUAL_TO_OPERATOR,
  LESS_THAN_OPERATOR
).name(Token.RELATIONAL_BOOLEAN_OPERATORS);
