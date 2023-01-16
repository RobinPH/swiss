import { TestResultStatus } from "../../BNF/BaseBNF";
import { IDENTIFIER } from "../../BNF/terminal/identifier";
import { MULTI_LINE_COMMENT } from "../../BNF/terminal/multipleLineComment";
import {
  CODE_BLOCK,
  DECLARATION_STATEMENT,
} from "../../BNF/terminal/statement";
import { ARRAY } from "../../BNF/terminal/value";

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
  expect(DECLARATION_STATEMENT.test("const a = 1")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("let a= 1")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("constant bas=1")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("const _a=1")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("const 0aa =1")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("cons a = 1")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("conxst a =")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("let  _ab_   =  1")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("let  _a00b_   =  1")?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect(DECLARATION_STATEMENT.test("let  _a00b_   =  'string'")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("const a = 1")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(DECLARATION_STATEMENT.test("xlet  _a00b_   =  2")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(DECLARATION_STATEMENT.test("constant  _a00b_    2")?.status).toBe(
    TestResultStatus.FAILED
  );

  expect(DECLARATION_STATEMENT.test("let int = 1").status).toBe(
    TestResultStatus.FAILED
  );

  expect(DECLARATION_STATEMENT.test("let intsomething = 1").status).toBe(
    TestResultStatus.SUCCESS
  );

  expect(DECLARATION_STATEMENT.test("let somethingint = 1").status).toBe(
    TestResultStatus.SUCCESS
  );
});

test("Cyclical Reference ", () => {
  expect(ARRAY.test("[]")?.status).toBe(TestResultStatus.SUCCESS);

  expect(ARRAY.test("[1]")?.status).toBe(TestResultStatus.SUCCESS);

  expect(ARRAY.test("['str', 1.0]")?.status).toBe(TestResultStatus.SUCCESS);

  expect(ARRAY.test("[[], [], []]")?.status).toBe(TestResultStatus.SUCCESS);

  expect(ARRAY.test("[[1], 'str', [[1.0, 2, []]]]")?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect(ARRAY.test("[[1], 'str', [[1.0, 2]]")?.status).toBe(
    TestResultStatus.FAILED
  );

  expect(ARRAY.test("[[]], [, []]")?.status).toBe(TestResultStatus.FAILED);
});

test("Comment", () => {
  expect(MULTI_LINE_COMMENT.test("###d###")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(MULTI_LINE_COMMENT.test("###dd###")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(MULTI_LINE_COMMENT.test("###ddd###")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(MULTI_LINE_COMMENT.test("###d#dd###")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(MULTI_LINE_COMMENT.test("###d#d##d###")?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect(MULTI_LINE_COMMENT.test("###d#d###d###")?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(MULTI_LINE_COMMENT.test("###d#d##")?.status).toBe(
    TestResultStatus.FAILED
  );
});

test("Code Block", () => {
  const input0 = `{
    const a = 1;
    let b = 3.141519;
    constant cint = "HELLO WORLD!";
    constant intd = "HELLO WORLD!";
  
    ++a;
  
    b += 1;
    const e = 2 * (1 + 2);
    b **= e;
  
    if (a < 1) {
      const d = 1;
    }
  
    for(let i = 0; i < 5; i++) {
      const a = 1;
    }
  }`;

  const input1 = `{
    const a = 1;
    let b = 3.141519;
    constant cint = "HELLO WORLD!";
    constant int = "HELLO WORLD!";
  
    ++a;
  
    b += 1;
    const e = 2 * (1 + 2);
    b **= e;
  
    if (a < 1) {
      const d = 1;
    }
  
    for(let i = 0; i < 5; i++) {
      const a = 1;
    }
  }`;

  expect(CODE_BLOCK.test(input0).status).toBe(TestResultStatus.SUCCESS);
  expect(CODE_BLOCK.test(input1).status).toBe(TestResultStatus.FAILED);
});
