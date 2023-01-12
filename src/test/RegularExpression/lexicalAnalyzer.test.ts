import { TestResultStatus } from "../../BNF/BaseBNF";
import { DECLARATION_STATEMENT, IDENTIFIER } from "../../BNF/terminal";

test("Identifier", () => {
  expect(IDENTIFIER.test("_")?.status).toBe(TestResultStatus.SUCCESS);
  expect(IDENTIFIER.test("_a")?.status).toBe(TestResultStatus.SUCCESS);
  expect(IDENTIFIER.test("0_a")?.status).toBe(TestResultStatus.FAILED);
  expect(IDENTIFIER.test("_0_a")?.status).toBe(TestResultStatus.SUCCESS);
  expect(IDENTIFIER.test("_$")?.status).toBe(TestResultStatus.FAILED);
  expect(IDENTIFIER.test("foo")?.status).toBe(TestResultStatus.SUCCESS);
  expect(IDENTIFIER.test("_$_foo")?.status).toBe(TestResultStatus.FAILED);
  expect(IDENTIFIER.test("b1a2r3")?.status).toBe(TestResultStatus.SUCCESS);
  expect(IDENTIFIER.test("$b1a2r3")?.status).toBe(TestResultStatus.FAILED);
});

test("Declaration Statement", () => {
  expect(DECLARATION_STATEMENT.test("const a = 1;")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("let a= 1;")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("constant bas=1;")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("const _a=1;")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("const 0aa =1;")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("cons a = 1;")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("conxst a =")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("let  _ab_   =  1;")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("let  _a00b_   =  1;")?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect(DECLARATION_STATEMENT.test("let  _a00b_   =  'string';")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("const a = 1")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("xlet  _a00b_   =  2;")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("constant  _a00b_    2;")?.status).toBe(
    TestResultStatus.FAILED
  );
});
