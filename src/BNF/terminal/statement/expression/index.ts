import { ATOM, CONCAT, OPTIONAL, OR, STAR } from "../../..";
import { IDENTIFIER } from "../../identifier";
import { NEW_OBJECT_KEYWORD } from "../../keyword";
import { ARITHMETIC_OPERATORS } from "../../operator/arithmetic";
import { BITWISE_OPERATORS } from "../../operator/bitwise";
import {
  LOGICAL_BINARY_BOOLEAN_OPERATORS,
  LOGICAL_BOOLEAN_OPERATORS,
} from "../../operator/logical";
import { RELATIONAL_BOOLEAN_OPERATORS } from "../../operator/relational";
import {
  UNARY_PREFIX_OPERATOR,
  UNARY_SUFFIX_OPERATOR,
} from "../../operator/unary";
import { VALUE } from "../../value";
import {
  EMPTY_SPACE,
  NON_EMPTY_WHITESPACE,
  WHITESPACE,
} from "../../whitespace";

export const EXPRESSION3 = OR().name("EXPRESSION");
export let EXPRESSION = OR();
let VALUE3 = OR();

export const OPENING_PARENTHESIS = ATOM("(").name("OPENING_PARENTHESIS");
export const CLOSING_PARENTHESIS = ATOM(")").name("CLOSING_PARENTHESIS");

export const OPENING_CURLY = ATOM("{").name("OPENING_CURLY");
export const CLOSING_CURLY = ATOM("}").name("CLOSING_CURLY");

export const OPENING_SQUARE_BRACKET = ATOM("[").name("OPENING_SQUARE_BRACKET");
export const CLOSING_SQUARE_BRACKET = ATOM("]").name("CLOSING_SQUARE_BRACKET");

export let VALUE2 = OR().name("VALUE");

// export const ARITHMETIC_EXPRESSION = CONCAT(
//   VALUE2,
//   WHITESPACE,
//   ARITHMETIC_OPERATORS,
//   WHITESPACE,
//   EXPRESSION
// ).name("ARITHMETIC_EXPRESSION");

// export const BITWISE_EXPRESSION = CONCAT(
//   VALUE2,
//   WHITESPACE,
//   BITWISE_OPERATORS,
//   WHITESPACE,
//   EXPRESSION
// ).name("BITWISE_EXPRESSION");

// export const LOGICAL_EXPRESSION = CONCAT(
//   VALUE2,
//   WHITESPACE,
//   LOGICAL_BOOLEAN_OPERATORS,
//   WHITESPACE,
//   EXPRESSION
// ).name("LOGICAL_EXPRESSION");

// export const RELATIONAL_EXPRESSION = CONCAT(
//   VALUE2,
//   WHITESPACE,
//   RELATIONAL_BOOLEAN_OPERATORS,
//   WHITESPACE,
//   EXPRESSION
// ).name("RELATIONAL_EXPRESSION");

export const UNARY_EXPRESSION = OR(
  CONCAT(UNARY_PREFIX_OPERATOR, WHITESPACE, VALUE2),
  CONCAT(VALUE2, WHITESPACE, UNARY_SUFFIX_OPERATOR)
).name("UNARY_EXPRESSION");

export const UNARY_PREFIX_EXPRESSION = CONCAT(
  UNARY_PREFIX_OPERATOR,
  WHITESPACE,
  VALUE2
).name("UNARY_PREFIX_EXPRESSION");

export const UNARY_SUFFIX_EXPRESSION = CONCAT(
  VALUE2,
  WHITESPACE,
  UNARY_SUFFIX_OPERATOR
).name("UNARY_SUFFIX_EXPRESSION");

export const FUNCTION_CALL_EXPRESSION = CONCAT(
  VALUE,
  WHITESPACE,
  OPENING_PARENTHESIS,
  STAR(
    CONCAT(
      EXPRESSION,
      WHITESPACE,
      ATOM(",").name("ARGUMENT_SEPARATOR"),
      WHITESPACE
    )
  ).name("REST_ARGUMENT"),
  OPTIONAL(EXPRESSION).name("PARAMETER"),
  CLOSING_PARENTHESIS
);

export const ARRAY_ACCESS_EXPRESSION = CONCAT(
  IDENTIFIER,
  WHITESPACE,
  OPENING_SQUARE_BRACKET,
  EXPRESSION,
  CLOSING_SQUARE_BRACKET
);

export const OBJECT_INSTANTIATION = CONCAT(
  NEW_OBJECT_KEYWORD,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  OPENING_PARENTHESIS,
  STAR(
    CONCAT(
      EXPRESSION,
      WHITESPACE,
      ATOM(",").name("ARGUMENT_SEPARATOR"),
      WHITESPACE
    )
  ).name("REST_ARGUMENT"),
  OPTIONAL(EXPRESSION).name("PARAMETER"),
  CLOSING_PARENTHESIS
);

const OPERATORS = OR(
  RELATIONAL_BOOLEAN_OPERATORS,
  ARITHMETIC_OPERATORS,
  BITWISE_OPERATORS,
  LOGICAL_BINARY_BOOLEAN_OPERATORS
);

VALUE3 = VALUE3.OR(
  FUNCTION_CALL_EXPRESSION,
  ARRAY_ACCESS_EXPRESSION,
  UNARY_SUFFIX_EXPRESSION,
  UNARY_PREFIX_EXPRESSION,
  OBJECT_INSTANTIATION,
  VALUE2
);

VALUE3 = VALUE3.OR(
  CONCAT(
    OPENING_PARENTHESIS,
    WHITESPACE,
    EXPRESSION,
    WHITESPACE,
    CLOSING_PARENTHESIS
  )
);

EXPRESSION = EXPRESSION.OR(
  CONCAT(VALUE3, STAR(CONCAT(WHITESPACE, OPERATORS, WHITESPACE, EXPRESSION))),
  CONCAT(
    OPENING_PARENTHESIS,
    WHITESPACE,
    EXPRESSION,
    WHITESPACE,
    CLOSING_PARENTHESIS
  ),
  EMPTY_SPACE
);

// @ts-ignore
VALUE2 = VALUE2.OR(
  FUNCTION_CALL_EXPRESSION,
  ARRAY_ACCESS_EXPRESSION,
  VALUE,
  CONCAT(OPENING_PARENTHESIS, VALUE2, CLOSING_PARENTHESIS).name(
    "PARENTHESIS_ENCLOSED_VALUE"
  )
);

// @ts-ignore
EXPRESSION3 = EXPRESSION3.OR(
  FUNCTION_CALL_EXPRESSION,
  ARRAY_ACCESS_EXPRESSION,
  // ARITHMETIC_EXPRESSION,
  // BITWISE_EXPRESSION,
  // LOGICAL_EXPRESSION,
  // RELATIONAL_EXPRESSION,
  UNARY_EXPRESSION,
  VALUE2
);

// @ts-ignore
EXPRESSION3 = EXPRESSION3.OR(
  CONCAT(OPENING_PARENTHESIS, EXPRESSION3, CLOSING_PARENTHESIS).name(
    "PARENTHESIS_ENCLOSED_EXPRESSION"
  )
);
