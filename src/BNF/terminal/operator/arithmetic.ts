import { ATOM, OR, WORD } from "../..";
import { Token } from "../tokenType";
import { ASSIGNMENT_OPERATOR } from "./assignment";

//Arithmetic Operators (+, -, *, /, %, //, **)
export const ADDITION_OPERATOR = ATOM("+")
  .name(Token.ADDITION_OPERATOR)
  .token();

export const SUBTRACTION_OPERATOR = ATOM("-")
  .name(Token.SUBTRACTION_OPERATOR)
  .token();

export const MULTIPLICATION_OPERATOR = ATOM("*")
  .name(Token.MULTIPLICATION_OPERATOR)
  .token();

export const DIVISION_OPERATOR = ATOM("/")
  .name(Token.DIVISION_OPERATOR)
  .token();

export const MODULO_OPERATOR = ATOM("%").name(Token.MODULO_OPERATOR).token();

export const INTEGER_DIVISION_OPERATOR = WORD("//")
  .name(Token.INTEGER_DIVISION_OPERATOR)
  .token();

export const EXPONENT_OPERATOR = WORD("**")
  .name(Token.EXPONENT_OPERATOR)
  .token();

export const ARITHMETIC_OPERATORS = OR(
  ASSIGNMENT_OPERATOR,
  ADDITION_OPERATOR,
  SUBTRACTION_OPERATOR,
  EXPONENT_OPERATOR,
  MULTIPLICATION_OPERATOR,
  INTEGER_DIVISION_OPERATOR,
  DIVISION_OPERATOR,
  MODULO_OPERATOR
).name(Token.ARITHEMTIC_OPERATORS);
