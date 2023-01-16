import { ATOM, OR, CONCAT, STAR, PLUS, OPTIONAL, WORD } from "../../BNF";
import { TestResultStatus } from "../../BNF/BaseBNF";

const IF = WORD("if").name("IF");
const FOR = WORD("for").name("FOR");
const ELSE = WORD("else").name("ELSE");
const SPACE = WORD(" ").name("SPACE");
const SPACE_STAR = STAR(SPACE).name("SPACE_STAR");

const SPACE_PLUS = PLUS(SPACE).name("SPACE_PLUS");

const OR_IF_ELSE = OR(IF, ELSE).name("OR_IF_ELSE");

const CONCAT_ELSE_SPACE_IF = CONCAT(
  CONCAT(ELSE, SPACE).name("ELSE_SPACE"),
  IF
).name("ELSE_IF");

const CONCAT_ELSE_SPACE_STAR_IF = CONCAT(
  CONCAT(ELSE, SPACE_STAR).name("ELSE_SPACE_STAR"),
  IF
).name("ELSE_IF");

const CONCAT_ELSE_SPACE_PLUS_IF = CONCAT(
  CONCAT(ELSE, SPACE_PLUS).name("ELSE_SPACE_PLUS"),
  IF
).name("ELSE_IF");

const CONCAT_FOR_IF = CONCAT(FOR, IF).name("FOR_IF");

const CONCAT_OR_CONCAT = OR(CONCAT_ELSE_SPACE_IF, CONCAT_FOR_IF).name(
  "CONCAT_OR_CONCAT"
);

const OR_OR = OR(OR(FOR, IF).name("FOR_OR_IF"), OR_IF_ELSE).name("OR_OR");

const OR_PLUS = PLUS(OR_IF_ELSE).name("OR_PLUS");

const OR_STAR = STAR(OR_IF_ELSE).name("OR_STAR");

const CONCAT_ELSE_SPACE_STAR_IF_STAR = STAR(CONCAT_ELSE_SPACE_STAR_IF).name(
  "CONCAT_ELSE_SPACE_STAR_IF_STAR"
);

test("Single Word", async () => {
  expect((await IF.test("if"))?.status).toStrictEqual(TestResultStatus.SUCCESS);
  expect((await FOR.test("for"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await ELSE.test("else"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await IF.test("ifx"))?.status).toStrictEqual(TestResultStatus.FAILED);
});

test("Concat", async () => {
  expect((await CONCAT_ELSE_SPACE_IF.test("else if"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
});

test("Or", async () => {
  expect((await OR_IF_ELSE.test("else"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_IF_ELSE.test("if"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_IF_ELSE.test("for"))?.status).toStrictEqual(
    TestResultStatus.FAILED
  );
  expect((await OR_IF_ELSE.test("else ifx"))?.status).toStrictEqual(
    TestResultStatus.FAILED
  );

  expect((await CONCAT_OR_CONCAT.test("else if"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await CONCAT_OR_CONCAT.test("forif"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );

  expect((await OR_OR.test("for"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_OR.test("else"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_OR.test("if"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
});

test("Kleene Star", async () => {
  expect(
    (await CONCAT_ELSE_SPACE_STAR_IF.test("elseif"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
  expect(
    (await CONCAT_ELSE_SPACE_STAR_IF.test("else if"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
  expect(
    (await CONCAT_ELSE_SPACE_STAR_IF.test("else  if"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
  expect(
    (await CONCAT_ELSE_SPACE_STAR_IF.test("else ifx"))?.status
  ).toStrictEqual(TestResultStatus.FAILED);
  expect((await CONCAT_ELSE_SPACE_STAR_IF.test("else"))?.status).toStrictEqual(
    TestResultStatus.FAILED
  );
  expect((await CONCAT_ELSE_SPACE_STAR_IF.test("if"))?.status).toStrictEqual(
    TestResultStatus.FAILED
  );

  expect((await OR_STAR.test("if"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_STAR.test("ifif"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_STAR.test("elseifif"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_STAR.test("ifelseif"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_STAR.test("ifififelseelse"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );

  expect((await OR_STAR.test(""))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );

  expect((await CONCAT_ELSE_SPACE_STAR_IF_STAR.test(""))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect(
    (await CONCAT_ELSE_SPACE_STAR_IF_STAR.test("else if"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
  expect(
    (await CONCAT_ELSE_SPACE_STAR_IF_STAR.test("else  ifelseif"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
  expect(
    (await CONCAT_ELSE_SPACE_STAR_IF_STAR.test("elseifelse      if"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
});

test("Kleene Plus", async () => {
  expect(
    (await CONCAT_ELSE_SPACE_PLUS_IF.test("elseif"))?.status
  ).toStrictEqual(TestResultStatus.FAILED);
  expect(
    (await CONCAT_ELSE_SPACE_PLUS_IF.test("else if"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
  expect(
    (await CONCAT_ELSE_SPACE_PLUS_IF.test("else  if"))?.status
  ).toStrictEqual(TestResultStatus.SUCCESS);
  expect(
    (await CONCAT_ELSE_SPACE_PLUS_IF.test("else ifx"))?.status
  ).toStrictEqual(TestResultStatus.FAILED);
  expect((await CONCAT_ELSE_SPACE_PLUS_IF.test("else"))?.status).toStrictEqual(
    TestResultStatus.FAILED
  );
  expect((await CONCAT_ELSE_SPACE_PLUS_IF.test("if"))?.status).toStrictEqual(
    TestResultStatus.FAILED
  );

  expect((await OR_PLUS.test(""))?.status).toStrictEqual(
    TestResultStatus.FAILED
  );
  expect((await OR_PLUS.test("if"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_PLUS.test("ifif"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_PLUS.test("elseifif"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_PLUS.test("ifelseif"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
  expect((await OR_PLUS.test("ifififelseelse"))?.status).toStrictEqual(
    TestResultStatus.SUCCESS
  );
});
