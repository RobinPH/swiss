import { RegularExpression as re } from "../../RegularExpression";
const { OR, CONCAT, STAR, PLUS, OPTIONAL } = re;

const IF = re.fromWord("if").value("IF");
const FOR = re.fromWord("for").value("FOR");
const ELSE = re.fromWord("else").value("ELSE");
const SPACE = re.fromWord(" ").value("SPACE");
const SPACE_STAR = STAR(SPACE).value("SPACE_STAR");

const SPACE_PLUS = PLUS(SPACE).value("SPACE_PLUS");

const OR_IF_ELSE = OR(IF, ELSE).value("OR_IF_ELSE");

const CONCAT_ELSE_SPACE_IF = CONCAT(
  CONCAT(ELSE, SPACE).value("ELSE_SPACE"),
  IF
).value("ELSE_IF");

const CONCAT_ELSE_SPACE_STAR_IF = CONCAT(
  re.CONCAT(ELSE, SPACE_STAR).value("ELSE_SPACE_STAR"),
  IF
).value("ELSE_IF");

const CONCAT_ELSE_SPACE_PLUS_IF = CONCAT(
  re.CONCAT(ELSE, SPACE_PLUS).value("ELSE_SPACE_PLUS"),
  IF
).value("ELSE_IF");

const CONCAT_FOR_IF = CONCAT(FOR, IF).value("FOR_IF");

const CONCAT_OR_CONCAT = OR(CONCAT_ELSE_SPACE_IF, CONCAT_FOR_IF).value(
  "CONCAT_OR_CONCAT"
);

const OR_OR = OR(OR(FOR, IF).value("FOR_OR_IF"), OR_IF_ELSE).value("OR_OR");

const OR_PLUS = PLUS(OR_IF_ELSE).value("OR_PLUS");

const OR_STAR = re.STAR(OR_IF_ELSE).value("OR_STAR");

const CONCAT_ELSE_SPACE_STAR_IF_STAR = STAR(CONCAT_ELSE_SPACE_STAR_IF).value(
  "CONCAT_ELSE_SPACE_STAR_IF_STAR"
);

test("Single Word", () => {
  expect(IF.check("if")?.value).toStrictEqual("IF");
  expect(FOR.check("for")?.value).toStrictEqual("FOR");
  expect(ELSE.check("else")?.value).toStrictEqual("ELSE");
  expect(IF.check("ifx")?.value).toStrictEqual(undefined);
});

test("Concat", () => {
  expect(CONCAT_ELSE_SPACE_IF.check("else if")?.value).toStrictEqual("ELSE_IF");
});

test("Or", () => {
  expect(OR_IF_ELSE.check("else")?.value).toStrictEqual("OR_IF_ELSE");
  expect(OR_IF_ELSE.check("if")?.value).toStrictEqual("OR_IF_ELSE");
  expect(OR_IF_ELSE.check("for")?.value).toStrictEqual(undefined);
  expect(OR_IF_ELSE.check("else ifx")?.value).toStrictEqual(undefined);

  expect(CONCAT_OR_CONCAT.check("else if")?.value).toStrictEqual(
    "CONCAT_OR_CONCAT"
  );
  expect(CONCAT_OR_CONCAT.check("forif")?.value).toStrictEqual(
    "CONCAT_OR_CONCAT"
  );

  expect(OR_OR.check("for")?.value).toStrictEqual("OR_OR");
  expect(OR_OR.check("else")?.value).toStrictEqual("OR_OR");
  expect(OR_OR.check("if")?.value).toStrictEqual("OR_OR");
});

test("Kleene Star", () => {
  expect(CONCAT_ELSE_SPACE_STAR_IF.check("elseif")?.value).toStrictEqual(
    "ELSE_IF"
  );
  expect(CONCAT_ELSE_SPACE_STAR_IF.check("else if")?.value).toStrictEqual(
    "ELSE_IF"
  );
  expect(CONCAT_ELSE_SPACE_STAR_IF.check("else  if")?.value).toStrictEqual(
    "ELSE_IF"
  );
  expect(CONCAT_ELSE_SPACE_STAR_IF.check("else ifx")?.value).toStrictEqual(
    undefined
  );
  expect(CONCAT_ELSE_SPACE_STAR_IF.check("else")?.value).toStrictEqual(
    undefined
  );
  expect(CONCAT_ELSE_SPACE_STAR_IF.check("if")?.value).toStrictEqual(undefined);

  expect(OR_STAR.check("if")?.value).toStrictEqual("OR_STAR");
  expect(OR_STAR.check("ifif")?.value).toStrictEqual("OR_STAR");
  expect(OR_STAR.check("elseifif")?.value).toStrictEqual("OR_STAR");
  expect(OR_STAR.check("ifelseif")?.value).toStrictEqual("OR_STAR");
  expect(OR_STAR.check("ifififelseelse")?.value).toStrictEqual("OR_STAR");

  expect(OR_STAR.check("")?.value).toStrictEqual("OR_STAR");

  expect(CONCAT_ELSE_SPACE_STAR_IF_STAR.check("")?.value).toStrictEqual(
    "CONCAT_ELSE_SPACE_STAR_IF_STAR"
  );
  expect(CONCAT_ELSE_SPACE_STAR_IF_STAR.check("else if")?.value).toStrictEqual(
    "CONCAT_ELSE_SPACE_STAR_IF_STAR"
  );
  expect(
    CONCAT_ELSE_SPACE_STAR_IF_STAR.check("else  ifelseif")?.value
  ).toStrictEqual("CONCAT_ELSE_SPACE_STAR_IF_STAR");
  expect(
    CONCAT_ELSE_SPACE_STAR_IF_STAR.check("elseifelse      if")?.value
  ).toStrictEqual("CONCAT_ELSE_SPACE_STAR_IF_STAR");
});

test("Kleene Plus", () => {
  expect(CONCAT_ELSE_SPACE_PLUS_IF.check("elseif")?.value).toStrictEqual(
    undefined
  );
  expect(CONCAT_ELSE_SPACE_PLUS_IF.check("else if")?.value).toStrictEqual(
    "ELSE_IF"
  );
  expect(CONCAT_ELSE_SPACE_PLUS_IF.check("else  if")?.value).toStrictEqual(
    "ELSE_IF"
  );
  expect(CONCAT_ELSE_SPACE_PLUS_IF.check("else ifx")?.value).toStrictEqual(
    undefined
  );
  expect(CONCAT_ELSE_SPACE_PLUS_IF.check("else")?.value).toStrictEqual(
    undefined
  );
  expect(CONCAT_ELSE_SPACE_PLUS_IF.check("if")?.value).toStrictEqual(undefined);

  expect(OR_PLUS.check("")?.value).toStrictEqual(undefined);
  expect(OR_PLUS.check("if")?.value).toStrictEqual("OR_PLUS");
  expect(OR_PLUS.check("ifif")?.value).toStrictEqual("OR_PLUS");
  expect(OR_PLUS.check("elseifif")?.value).toStrictEqual("OR_PLUS");
  expect(OR_PLUS.check("ifelseif")?.value).toStrictEqual("OR_PLUS");
  expect(OR_PLUS.check("ifififelseelse")?.value).toStrictEqual("OR_PLUS");
});
