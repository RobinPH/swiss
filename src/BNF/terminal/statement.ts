import BNF from "../../BNF";
import { DECLARATOR } from "./declarator";
import { IDENTIFIER } from "./identifier";
import { NUMBER } from "./literal";
import { STRING } from "./literal/string";
import { ASSIGNMENT_OPERATOR } from "./operator/assignment";
import { SEMICOLON } from "./specialCharacter";
import { NON_EMPTY_WHITESPACE, WHITESPACE } from "./whitespace";
const { CONCAT, OR } = BNF;

export const VALUE = OR(NUMBER, STRING).name("VALUE");

export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  ASSIGNMENT_OPERATOR,
  WHITESPACE,
  VALUE,
  SEMICOLON
).name("DECLARATION_STATEMENT");
