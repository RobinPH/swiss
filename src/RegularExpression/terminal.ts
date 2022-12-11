import { RegularExpression as re } from ".";

export const LOWERCASE_ALPHABET = re.choices(
  "abcdefghijklmnopqrstuvwxyz".split("").map((alphabet) => {
    return {
      value: alphabet,
      word: alphabet,
    };
  }),
  "LOWERCASE_ALPHABET"
);

export const UPPERCASE_ALPHABET = re.choices(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((alphabet) => {
    return {
      value: alphabet,
      word: alphabet,
    };
  }),
  "UPPERCASE_ALPHABET"
);

export const ALPHABET = re.or({
  value: "ALPHABET",
  args: [LOWERCASE_ALPHABET, UPPERCASE_ALPHABET],
});

export const DIGIT = re.choices(
  "0123456789".split("").map((digit) => {
    return {
      value: digit,
      word: digit,
    };
  }),
  "DIGIT"
);

export const NON_EMPTY_WHITESPACE_CHARACTER = re.choices(
  [
    {
      value: "SPACE",
      word: " ",
    },
    {
      value: "HORIZONTAL_TAB",
      word: "\t",
    },
    {
      value: "NEW_LINE",
      word: "\n",
    },
  ],
  "NON_EMPTY_WHITESPACE_CHARACTER"
);

export const NON_EMPTY_WHITESPACE = re.plus({
  value: "NON_EMPTY_WHITESPACE",
  args: NON_EMPTY_WHITESPACE_CHARACTER,
});

export const WHITESPACE = re.concat({
  value: "WHITESPACE",
  args: [
    re.EMPTY_SPACE,
    re.star({
      value: "WHITESPACE",
      args: NON_EMPTY_WHITESPACE_CHARACTER,
    }),
  ],
});

export const ASSIGNMENT_OPERATOR = re.atom("=", "ASSIGNMENT_OPERATOR");

export const UNDERSCORE = re.atom("_", "underscore");

export const IDENTIFIER = re.concat({
  value: "IDENTIFIER",
  args: [
    re.or({
      value: "NO_DIGIT_PREFIX",
      args: [ALPHABET, UNDERSCORE],
    }),
    re.star({
      value: "ANY_COMBINATION",
      args: re.or({
        value: "NO_PREFIX_RESTRICTION",
        args: [ALPHABET, UNDERSCORE, DIGIT],
      }),
    }),
  ],
});

export const DECLARATOR = re.or({
  value: "DECLARATOR",
  args: [
    re.fromWord("let", "LET_DECLARATOR"),
    re.or({
      value: "CONST_DECLRATOR",
      args: [
        re.fromWord("const", "CONST_DECLARATOR"),
        re.fromWord("constant", "CONSTANT_DECLARATOR"),
      ],
    }),
  ],
});

export const DECLARATION_STATEMENT = re.concat({
  value: "DECLARATION_STATEMENT",
  args: [
    DECLARATOR,
    NON_EMPTY_WHITESPACE,
    IDENTIFIER,
    WHITESPACE,
    ASSIGNMENT_OPERATOR,
    WHITESPACE,
    DIGIT,
  ],
});
