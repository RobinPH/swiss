import { CONCAT } from "../..";
import { DECLARATOR } from "../declarator";
import { IDENTIFIER } from "../identifier";
import { ASSIGNMENT_OPERATOR } from "../operator/assignment";
import { SEMICOLON } from "../specialCharacter";
import { Token } from "../tokenType";
import { VALUE } from "../value";
import { NON_EMPTY_WHITESPACE, WHITESPACE } from "../whitespace";

export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  ASSIGNMENT_OPERATOR,
  WHITESPACE,
  VALUE
).name(Token.DECLARATION_STATEMENT);
