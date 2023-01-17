import { ATOM, OR, WORD } from "../..";
import { ASSIGNMENT_OPERATOR } from "./assignment";

//Arithmetic Operators (+, -, *, /, %, //, **)
export const ADDITION_OPERATOR = ATOM("+")
  .name("ADDITION_OPERATOR")
  .token();

export const SUBTRACTION_OPERATOR = ATOM("-")
  .name("SUBTRACTION_OPERATOR")
  .token();

export const MULTIPLICATION_OPERATOR = ATOM("*")
  .name("MULTIPLICATION_OPERATOR")
  .token();

export const DIVISION_OPERATOR = ATOM("/").name("DIVISION_OPERATOR").token();

export const MODULO_OPERATOR = ATOM("%").name("MODULO_OPERATOR").token();

export const INTEGER_DIVISION_OPERATOR = WORD("//")
  .name("INTEGER_DIVISION_OPERATOR")
  .token();

export const EXPONENT_OPERATOR = WORD("**").name("EXPONENT_OPERATOR").token();

export const ARITHMETIC_OPERATORS = OR(
  ADDITION_OPERATOR,
  SUBTRACTION_OPERATOR,
  MULTIPLICATION_OPERATOR,
  DIVISION_OPERATOR,
  MODULO_OPERATOR,
  INTEGER_DIVISION_OPERATOR,
  EXPONENT_OPERATOR
).name("ARITHEMTIC_OPERATORS");
