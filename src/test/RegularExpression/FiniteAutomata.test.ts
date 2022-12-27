import FiniteAutomata from "../../FiniteAutomata";
const { ATOM, OR, CONCAT, PLUS, STAR, OPTIONAL, CHOICES, EMPTY_SPACE, WORD } =
  FiniteAutomata;

const IF = WORD("if").setValue("IF");
const FOR = WORD("for").setValue("FOR");
const ELSE = WORD("else").setValue("ELSE");
const SPACE = WORD(" ").setValue("SPACE");
const SPACE_STAR = STAR(SPACE).setValue("SPACE_STAR");

const SPACE_PLUS = PLUS(SPACE).setValue("SPACE_PLUS");

const OR_IF_ELSE = OR(IF, ELSE).setValue("OR_IF_ELSE");

const CONCAT_ELSE_SPACE_IF = CONCAT(
  CONCAT(ELSE, SPACE).setValue("ELSE_SPACE"),
  IF
).setValue("ELSE_IF");

const CONCAT_ELSE_SPACE_STAR_IF = CONCAT(
  CONCAT(ELSE, SPACE_STAR).setValue("ELSE_SPACE_STAR"),
  IF
).setValue("ELSE_IF");

const CONCAT_ELSE_SPACE_PLUS_IF = CONCAT(
  CONCAT(ELSE, SPACE_PLUS).setValue("ELSE_SPACE_PLUS"),
  IF
).setValue("ELSE_IF");

const CONCAT_FOR_IF = CONCAT(FOR, IF).setValue("FOR_IF");

const CONCAT_OR_CONCAT = OR(CONCAT_ELSE_SPACE_IF, CONCAT_FOR_IF).setValue(
  "CONCAT_OR_CONCAT"
);

const OR_OR = OR(OR(FOR, IF).setValue("FOR_OR_IF"), OR_IF_ELSE).setValue(
  "OR_OR"
);

const OR_PLUS = PLUS(OR_IF_ELSE).setValue("OR_PLUS");

const OR_STAR = STAR(OR_IF_ELSE).setValue("OR_STAR");

const CONCAT_ELSE_SPACE_STAR_IF_STAR = STAR(CONCAT_ELSE_SPACE_STAR_IF).setValue(
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
