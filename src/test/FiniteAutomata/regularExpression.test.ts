import RegularExpression from "../../RegularExpression";

const IF = RegularExpression.fromWord("if", "IF");
const FOR = RegularExpression.fromWord("for", "FOR");
const ELSE = RegularExpression.fromWord("else", "ELSE");
const SPACE = RegularExpression.fromWord(" ", "SPACE");
const SPACE_STAR = RegularExpression.STAR({
  args: [SPACE],
  value: ["SPACE_STAR"],
});

const SPACE_PLUS = RegularExpression.PLUS({
  args: [SPACE],
  value: ["SPACE_PLUS"],
});

const OR_IF_ELSE = RegularExpression.OR({
  args: [IF, ELSE],
});

const CONCAT_ELSE_SPACE_IF = RegularExpression.CONCAT({
  args: [
    RegularExpression.CONCAT({
      args: [ELSE, SPACE],
      value: ["ELSE_SPACE"],
    }),
    IF,
  ],
  value: ["ELSE_IF"],
});

const CONCAT_ELSE_SPACE_STAR_IF = RegularExpression.CONCAT({
  args: [
    RegularExpression.CONCAT({
      args: [ELSE, SPACE_STAR],
      value: ["ELSE_SPACE_STAR"],
    }),
    IF,
  ],
  value: ["ELSE_IF"],
});

const CONCAT_ELSE_SPACE_PLUS_IF = RegularExpression.CONCAT({
  args: [
    RegularExpression.CONCAT({
      args: [ELSE, SPACE_PLUS],
      value: ["ELSE_SPACE_PLUS"],
    }),
    IF,
  ],
  value: ["ELSE_IF"],
});

const CONCAT_FOR_IF = RegularExpression.CONCAT({
  args: [FOR, IF],
  value: ["FOR_IF"],
});

const CONCAT_OR_CONCAT = RegularExpression.OR({
  args: [CONCAT_ELSE_SPACE_IF, CONCAT_FOR_IF],
});

const OR_OR = RegularExpression.OR({
  args: [
    RegularExpression.OR({
      args: [FOR, IF],
    }),
    OR_IF_ELSE,
  ],
});

const OR_PLUS = RegularExpression.PLUS({
  args: [OR_IF_ELSE],
  value: ["OR_PLUS"],
});

const OR_STAR = RegularExpression.STAR({
  args: [OR_IF_ELSE],
  value: ["OR_STAR"],
});

const CONCAT_ELSE_SPACE_STAR_IF_STAR = RegularExpression.STAR({
  args: [CONCAT_ELSE_SPACE_STAR_IF],
  value: ["CONCAT_ELSE_SPACE_STAR_IF_STAR"],
});

test("Single Word", () => {
  expect(IF.test("if")).toStrictEqual(["IF"]);
  expect(FOR.test("for")).toStrictEqual(["FOR"]);
  expect(ELSE.test("else")).toStrictEqual(["ELSE"]);
  expect(IF.test("ifx")).toStrictEqual(null);
});

test("Concat", () => {
  expect(CONCAT_ELSE_SPACE_IF.test("else if")).toStrictEqual(["ELSE_IF"]);
});

test("Or", () => {
  expect(OR_IF_ELSE.test("else")).toStrictEqual(["ELSE"]);
  expect(OR_IF_ELSE.test("if")).toStrictEqual(["IF"]);
  expect(OR_IF_ELSE.test("for")).toStrictEqual(null);
  expect(OR_IF_ELSE.test("else if")).toStrictEqual(null);

  expect(CONCAT_OR_CONCAT.test("else if")).toStrictEqual(["ELSE_IF"]);
  expect(CONCAT_OR_CONCAT.test("forif")).toStrictEqual(["FOR_IF"]);

  expect(OR_OR.test("for")).toStrictEqual(["FOR"]);
  expect(OR_OR.test("else")).toStrictEqual(["ELSE"]);
  expect(OR_OR.test("if")).toStrictEqual(["IF"]);
});

test("Kleene Star", () => {
  expect(CONCAT_ELSE_SPACE_STAR_IF.test("elseif")).toStrictEqual(["ELSE_IF"]);
  expect(CONCAT_ELSE_SPACE_STAR_IF.test("else if")).toStrictEqual(["ELSE_IF"]);
  expect(CONCAT_ELSE_SPACE_STAR_IF.test("else  if")).toStrictEqual(["ELSE_IF"]);
  expect(CONCAT_ELSE_SPACE_STAR_IF.test("else ifx")).toStrictEqual(null);
  expect(CONCAT_ELSE_SPACE_STAR_IF.test("else")).toStrictEqual(null);
  expect(CONCAT_ELSE_SPACE_STAR_IF.test("if")).toStrictEqual(null);

  expect(OR_STAR.test("if")).toStrictEqual(["OR_STAR"]);
  expect(OR_STAR.test("ifif")).toStrictEqual(["OR_STAR"]);
  expect(OR_STAR.test("elseifif")).toStrictEqual(["OR_STAR"]);
  expect(OR_STAR.test("ifelseif")).toStrictEqual(["OR_STAR"]);
  expect(OR_STAR.test("ifififelseelse")).toStrictEqual(["OR_STAR"]);

  expect(OR_STAR.test("")).toStrictEqual(["OR_STAR"]);

  expect(CONCAT_ELSE_SPACE_STAR_IF_STAR.test("")).toStrictEqual([
    "CONCAT_ELSE_SPACE_STAR_IF_STAR",
  ]);
  expect(CONCAT_ELSE_SPACE_STAR_IF_STAR.test("else if")).toStrictEqual([
    "CONCAT_ELSE_SPACE_STAR_IF_STAR",
  ]);
  expect(CONCAT_ELSE_SPACE_STAR_IF_STAR.test("else  ifelseif")).toStrictEqual([
    "CONCAT_ELSE_SPACE_STAR_IF_STAR",
  ]);
  expect(
    CONCAT_ELSE_SPACE_STAR_IF_STAR.test("elseifelse      if")
  ).toStrictEqual(["CONCAT_ELSE_SPACE_STAR_IF_STAR"]);
});

test("Kleene Plus", () => {
  expect(CONCAT_ELSE_SPACE_PLUS_IF.test("elseif")).toStrictEqual(null);
  expect(CONCAT_ELSE_SPACE_PLUS_IF.test("else if")).toStrictEqual(["ELSE_IF"]);
  expect(CONCAT_ELSE_SPACE_PLUS_IF.test("else  if")).toStrictEqual(["ELSE_IF"]);
  expect(CONCAT_ELSE_SPACE_PLUS_IF.test("else ifx")).toStrictEqual(null);
  expect(CONCAT_ELSE_SPACE_PLUS_IF.test("else")).toStrictEqual(null);
  expect(CONCAT_ELSE_SPACE_PLUS_IF.test("if")).toStrictEqual(null);

  expect(OR_PLUS.test("")).toStrictEqual(null);
  expect(OR_PLUS.test("if")).toStrictEqual(["OR_PLUS"]);
  expect(OR_PLUS.test("ifif")).toStrictEqual(["OR_PLUS"]);
  expect(OR_PLUS.test("elseifif")).toStrictEqual(["OR_PLUS"]);
  expect(OR_PLUS.test("ifelseif")).toStrictEqual(["OR_PLUS"]);
  expect(OR_PLUS.test("ifififelseelse")).toStrictEqual(["OR_PLUS"]);
});
