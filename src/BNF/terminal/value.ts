import { ATOM, CONCAT, OPTIONAL, OR, STAR } from "..";
import { IDENTIFIER } from "./identifier";
import { BOOLEAN_LITERAL, NULL_KEYWORD } from "./keyword";
import { NUMBER } from "./literal/number";
import { STRING } from "./literal/string";
import { Token } from "./tokenType";
import { WHITESPACE } from "./whitespace";

export let VALUE = OR(
  NUMBER,
  STRING,
  CONCAT(
    IDENTIFIER,
    STAR(CONCAT(ATOM(".").name(Token.DOT_OPERATOR).token(), IDENTIFIER))
  ),
  IDENTIFIER,
  BOOLEAN_LITERAL,
  NULL_KEYWORD
).name(Token.VALUE);

export const ARRAY_OPENING_BRACKET = ATOM("[").name(
  Token.ARRAY_OPENING_BRACKET
);
export const ARRAY_CLOSING_BRACKET = ATOM("]").name(
  Token.ARRAY_CLOSING_BRACKET
);
export const ARRAY_ADDITIONAL_VALUE = CONCAT(
  VALUE,
  WHITESPACE,
  ATOM(",").name(Token.ARRAY_VALUE_SEPARATOR),
  WHITESPACE
).name(Token.ARRAY_ADDITIONAL_VALUE);

export const ARRAY = CONCAT(
  ARRAY_OPENING_BRACKET,
  WHITESPACE,
  STAR(ARRAY_ADDITIONAL_VALUE),
  OPTIONAL(VALUE),
  WHITESPACE,
  ARRAY_CLOSING_BRACKET
).name(Token.ARRAY);

// @ts-ignore
VALUE = VALUE.OR(ARRAY);
