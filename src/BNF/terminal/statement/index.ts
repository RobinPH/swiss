import { ATOM, CONCAT, OPTIONAL, OR, STAR, WORD } from "../..";
import { DECLARATOR } from "../declarator";
import {
  ARRAY_ACCESS_EXPRESSION,
  CLOSING_CURLY,
  CLOSING_PARENTHESIS,
  EXPRESSION,
  OPENING_CURLY,
  OPENING_PARENTHESIS,
} from "./expression";
import { IDENTIFIER } from "../identifier";
import {
  ASSIGNMENT_OPERATOR,
  ASSIGNMENT_OPERATORS,
} from "../operator/assignment";
import { SEMICOLON } from "../specialCharacter";
import { VALUE } from "../value";
import { NON_EMPTY_WHITESPACE, WHITESPACE } from "../whitespace";
import {
  CATCH_KEYWORD,
  DATATYPE_SPECIFIER,
  FINALLY_KEYWORD,
  FUNCTION_KEYWORD,
  IF_STATEMENT_KEYWORD_ELSE,
  IF_STATEMENT_KEYWORD_ELSE_IF,
  IF_STATEMENT_KEYWORD_IF,
  LOOPING_CONTROL_KEYWORD,
  LOOPING_KEYWORD_DO,
  LOOPING_KEYWORD_FOR,
  LOOPING_KEYWORD_WHILE,
  RAISE_KEYWORD,
  RETURN_KEYWORD,
  SWITCH_KEYWORD_CASE,
  SWITCH_KEYWORD_DEFAULT,
  SWITCH_KEYWORD_SWITCH,
  TRY_KEYWORD,
} from "../keyword";
import { COMMENT } from "../comment";

let _STATEMENTS = OR().name("STATEMENTS");

const LIST_OF_STATEMENTS = STAR(CONCAT(WHITESPACE, _STATEMENTS, WHITESPACE));

export const CODE_BLOCK = CONCAT(
  OPENING_CURLY,
  LIST_OF_STATEMENTS,
  CLOSING_CURLY
).name("CODE_BLOCK");

export const DECLARATION_STATEMENT = CONCAT(
  DECLARATOR,
  NON_EMPTY_WHITESPACE,
  OPTIONAL(CONCAT(DATATYPE_SPECIFIER, NON_EMPTY_WHITESPACE)),
  IDENTIFIER,
  WHITESPACE,
  OPTIONAL(CONCAT(ASSIGNMENT_OPERATOR, WHITESPACE, EXPRESSION))
).name("DECLARATION_STATEMENT");

export const ASSIGNMENT_STATEMENT = CONCAT(
  OR(IDENTIFIER, ARRAY_ACCESS_EXPRESSION),
  WHITESPACE,
  ASSIGNMENT_OPERATORS,
  WHITESPACE,
  EXPRESSION
).name("ASSIGNMENT_STATEMENT");

export const ELSE_IF_STATEMENT = CONCAT(
  IF_STATEMENT_KEYWORD_ELSE_IF,
  WHITESPACE,
  OPENING_PARENTHESIS,
  WHITESPACE,
  EXPRESSION,
  WHITESPACE,
  CLOSING_PARENTHESIS,
  WHITESPACE,
  CODE_BLOCK
);

export const ELSE_STATEMENT = CONCAT(
  IF_STATEMENT_KEYWORD_ELSE,
  WHITESPACE,
  CODE_BLOCK
);

export const WHILE_STATEMENT = CONCAT(
  LOOPING_KEYWORD_WHILE,
  WHITESPACE,
  OPENING_PARENTHESIS,
  WHITESPACE,
  EXPRESSION,
  WHITESPACE,
  CLOSING_PARENTHESIS,
  WHITESPACE,
  CODE_BLOCK
);

export const IF_STATEMENT = CONCAT(
  IF_STATEMENT_KEYWORD_IF,
  WHITESPACE,
  OPENING_PARENTHESIS,
  WHITESPACE,
  EXPRESSION,
  WHITESPACE,
  CLOSING_PARENTHESIS,
  WHITESPACE,
  CODE_BLOCK,
  OPTIONAL(STAR(CONCAT(WHITESPACE, ELSE_IF_STATEMENT, WHITESPACE))),
  OPTIONAL(CONCAT(WHITESPACE, ELSE_STATEMENT, WHITESPACE))
);

export const DO_WHILE_STATEMENT = CONCAT(
  LOOPING_KEYWORD_DO,
  WHITESPACE,
  CODE_BLOCK,
  WHITESPACE,
  LOOPING_KEYWORD_WHILE,
  WHITESPACE,
  OPENING_PARENTHESIS,
  WHITESPACE,
  EXPRESSION,
  WHITESPACE,
  CLOSING_PARENTHESIS,
  WHITESPACE,
  SEMICOLON
);

const TRUE_STATEMENTS = OR(
  DECLARATION_STATEMENT,
  ASSIGNMENT_STATEMENT,
  EXPRESSION
).name("STATEMENTS");

export const FOR_STATEMENT = CONCAT(
  LOOPING_KEYWORD_FOR,
  WHITESPACE,
  OPENING_PARENTHESIS,
  WHITESPACE,
  TRUE_STATEMENTS,
  WHITESPACE,
  SEMICOLON,
  WHITESPACE,
  TRUE_STATEMENTS,
  WHITESPACE,
  SEMICOLON,
  WHITESPACE,
  TRUE_STATEMENTS,
  WHITESPACE,
  CLOSING_PARENTHESIS,
  WHITESPACE,
  CODE_BLOCK
);

export const FUNCTION_STATEMENT = CONCAT(
  FUNCTION_KEYWORD,
  NON_EMPTY_WHITESPACE,
  IDENTIFIER,
  WHITESPACE,
  OPENING_PARENTHESIS,
  WHITESPACE,
  STAR(
    CONCAT(
      IDENTIFIER,
      WHITESPACE,
      ATOM(",").name("PARAMETER_SEPARATOR"),
      WHITESPACE
    )
  ).name("REST_PARAMETER"),
  OPTIONAL(IDENTIFIER).name("PARAMETER").token(),
  WHITESPACE,
  CLOSING_PARENTHESIS,
  WHITESPACE,
  CODE_BLOCK
);

export const FINALLY_STATEMENT = CONCAT(
  FINALLY_KEYWORD,
  WHITESPACE,
  CODE_BLOCK
).name("FINALLY_STATEMENT");

export const CATCH_STATEMENT = CONCAT(
  CATCH_KEYWORD,
  WHITESPACE,
  OPTIONAL(
    CONCAT(
      OPENING_PARENTHESIS,
      WHITESPACE,
      OPTIONAL(IDENTIFIER),
      WHITESPACE,
      CLOSING_PARENTHESIS
    )
  ),
  WHITESPACE,
  CODE_BLOCK
);

export const TRY_STATEMENT = CONCAT(
  TRY_KEYWORD,
  WHITESPACE,
  CODE_BLOCK,
  OPTIONAL(CONCAT(WHITESPACE, CATCH_STATEMENT, WHITESPACE)),
  OPTIONAL(CONCAT(WHITESPACE, FINALLY_KEYWORD, WHITESPACE))
);

export const RAISE_STATEMENT = CONCAT(
  RAISE_KEYWORD,
  NON_EMPTY_WHITESPACE,
  EXPRESSION,
  SEMICOLON
);

export const CASE_STATEMENT = CONCAT(
  SWITCH_KEYWORD_CASE,
  WHITESPACE,
  EXPRESSION,
  WHITESPACE,
  CODE_BLOCK
);

export const DEFAULT_CASE_STATEMENT = CONCAT(
  SWITCH_KEYWORD_DEFAULT,
  WHITESPACE,
  CODE_BLOCK
);

export const SWITCH_STATEMENT = CONCAT(
  SWITCH_KEYWORD_SWITCH,
  WHITESPACE,
  CONCAT(
    OPENING_PARENTHESIS,
    WHITESPACE,
    EXPRESSION,
    WHITESPACE,
    CLOSING_PARENTHESIS
  ),
  WHITESPACE,
  CONCAT(
    OPENING_CURLY,
    WHITESPACE,
    STAR(CONCAT(CASE_STATEMENT, WHITESPACE)),
    OPTIONAL(DEFAULT_CASE_STATEMENT),
    WHITESPACE,
    CLOSING_CURLY
  )
);

export const RETURN_STATEMENT = CONCAT(
  RETURN_KEYWORD,
  WHITESPACE,
  OPTIONAL(EXPRESSION),
  SEMICOLON
).name("RETURN_STATEMENT");

export const ITERATIVE_CONTROL_STATEMENT = CONCAT(
  LOOPING_CONTROL_KEYWORD,
  WHITESPACE,
  SEMICOLON
).name("ITERATIVE_CONTROL_STATEMENT");

// @ts-ignore
_STATEMENTS = _STATEMENTS.OR(
  CONCAT(
    OPTIONAL(
      OR(
        CONCAT(TRUE_STATEMENTS, SEMICOLON).name("STATEMENTS"),
        IF_STATEMENT,
        FOR_STATEMENT,
        WHILE_STATEMENT,
        DO_WHILE_STATEMENT,
        TRY_STATEMENT,
        FUNCTION_STATEMENT,
        RETURN_STATEMENT,
        ITERATIVE_CONTROL_STATEMENT,
        SWITCH_STATEMENT,
        RAISE_STATEMENT,
        CODE_BLOCK
      )
    ),
    OPTIONAL(CONCAT(WHITESPACE, COMMENT))
  )
);

export const SWISS = LIST_OF_STATEMENTS;