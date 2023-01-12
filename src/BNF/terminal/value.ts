import BNF from "..";
import { NUMBER } from "./literal";
import { STRING } from "./literal/string";
import { WHITESPACE } from "./whitespace";

const { CONCAT, OR, ATOM, OPTIONAL, STAR } = BNF;

export let VALUE = OR(NUMBER, STRING).name("VALUE");

export const ARRAY_OPENING_BRACKET = ATOM("[").name("ARRAY_OPENING_BRACKET");
export const ARRAY_CLOSING_BRACKET = ATOM("]").name("ARRAY_CLOSING_BRACKET");
export const ARRAY_ADDITIONAL_VALUE = CONCAT(
  VALUE,
  WHITESPACE,
  ATOM(","),
  WHITESPACE
).name("ARRAY_ADDITIONAL_VALUE");

export const ARRAY_VALUE = CONCAT(WHITESPACE, VALUE).name("ARRAY_VALUE");

export const ARRAY = CONCAT(
  ARRAY_OPENING_BRACKET,
  WHITESPACE,
  STAR(ARRAY_ADDITIONAL_VALUE),
  OPTIONAL(ARRAY_VALUE),
  WHITESPACE,
  ARRAY_CLOSING_BRACKET
).name("ARRAY");

// @ts-ignore
VALUE = VALUE.OR(ARRAY);
