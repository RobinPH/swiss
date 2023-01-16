import { ATOM, CONCAT, OR } from "../..";
import { ARITHMETIC_OPERATORS } from "../operator/arithmetic";
// import { VALUE } from "../value";

const VALUE = ATOM("A").name("A");
export const EXPRESSION = OR().name("EXPRESSION");

// export const ARITHMETIC_EXPRESSION = CONCAT(
//   VALUE,
//   // ARITHMETIC_OPERATORS,
//   ATOM("+").name("OPERATOR"),
//   EXPRESSION
// ).name("ARITHMETIC_EXPRESSION");

const WITH_OPERATOR = CONCAT(VALUE, ARITHMETIC_OPERATORS, EXPRESSION).name(
  "EQUATION"
);

//@ts-ignore
EXPRESSION = EXPRESSION.OR(WITH_OPERATOR);
//@ts-ignore
EXPRESSION = EXPRESSION.OR(VALUE);
