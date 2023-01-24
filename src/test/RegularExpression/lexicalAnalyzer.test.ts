import { ATOM, CONCAT, MINUS, OPTIONAL, OR, PLUS, STAR, WORD } from "../../BNF";
import { TestResultStatus } from "../../BNF/BaseBNF";
import { ALPHABET } from "../../BNF/terminal/alphabet";
import { CHARACTER } from "../../BNF/terminal/character";
import { MULTI_LINE_COMMENT } from "../../BNF/terminal/comment";
import { DIGIT } from "../../BNF/terminal/digit";
import { IDENTIFIER } from "../../BNF/terminal/identifier";
import { NUMBER } from "../../BNF/terminal/literal/number";
import { UNDERSCORE } from "../../BNF/terminal/specialCharacter";
import {
  CODE_BLOCK,
  DECLARATION_STATEMENT,
} from "../../BNF/terminal/statement";
import { EXPRESSION } from "../../BNF/terminal/statement/expression";
import { ARRAY } from "../../BNF/terminal/value";
import { WHITESPACE } from "../../BNF/terminal/whitespace";

test("Basic Test", async () => {
  const A = ATOM("A").name("A");
  expect((await A.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A.test("a"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A.test(""))?.status).toBe(TestResultStatus.FAILED);

  const B = ATOM("B").name("B");
  const A_B = OR(A, B).name("A_B");
  expect((await A_B.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B.test("B"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B.test("a"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B.test("b"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B.test(""))?.status).toBe(TestResultStatus.FAILED);

  const C = ATOM("C").name("C");
  const D = ATOM("D").name("D");
  const C_D = CONCAT(C, D).name("C_D");
  expect((await C_D.test("CD"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await C_D.test("C"))?.status).toBe(TestResultStatus.FAILED);
  expect((await C_D.test("D"))?.status).toBe(TestResultStatus.FAILED);
  expect((await C_D.test(""))?.status).toBe(TestResultStatus.FAILED);

  const A_B_C_D = OR(A_B, C_D).name("A_B_C_D");
  expect((await A_B_C_D.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_C_D.test("B"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_C_D.test("a"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_C_D.test("b"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_C_D.test(""))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_C_D.test("CD"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_C_D.test("C"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_C_D.test("D"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_C_D.test(""))?.status).toBe(TestResultStatus.FAILED);

  const A_STAR = STAR(A).name("A_STAR");
  expect((await A_STAR.test(""))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_STAR.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_STAR.test("AA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_STAR.test("AAA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_STAR.test("BAA"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_STAR.test("AAAAB"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_STAR.test("BBAAB"))?.status).toBe(TestResultStatus.FAILED);

  const A_B_STAR = STAR(A_B).name("A_B_STAR");
  expect((await A_B_STAR.test(""))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_STAR.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_STAR.test("AA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_STAR.test("AAA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_STAR.test("BAA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_STAR.test("AAAAB"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_STAR.test("BBAAB"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_STAR.test("BBAABC"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_STAR.test("CBBAAB"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_STAR.test("BBCAAB"))?.status).toBe(TestResultStatus.FAILED);

  const A_PLUS = PLUS(A).name("A_PLUS");
  expect((await A_PLUS.test(""))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_PLUS.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_PLUS.test("AA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_PLUS.test("AAA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_PLUS.test("BAA"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_PLUS.test("AAAAB"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_PLUS.test("BBAAB"))?.status).toBe(TestResultStatus.FAILED);

  const A_B_B = MINUS(A_B, ATOM("B")).name("A_B - B");
  expect((await A_B_B.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_B_B.test("B"))?.status).toBe(TestResultStatus.FAILED);
  expect((await A_B_B.test("C"))?.status).toBe(TestResultStatus.FAILED);

  const A_OPTIONAL = OPTIONAL(A).name("A_OPTIONAL");
  expect((await A_OPTIONAL.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_OPTIONAL.test(""))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await A_OPTIONAL.test("X"))?.status).toBe(TestResultStatus.FAILED);

  const AA = CONCAT(A, A).name("AA");
  expect((await AA.test("AA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await AA.test("A"))?.status).toBe(TestResultStatus.FAILED);
  expect((await AA.test("AC"))?.status).toBe(TestResultStatus.FAILED);
  expect((await AA.test(""))?.status).toBe(TestResultStatus.FAILED);

  const EMPTY = ATOM("").name("EMPTY");
  expect((await EMPTY.test(""))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await EMPTY.test("A"))?.status).toBe(TestResultStatus.FAILED);
  expect((await EMPTY.test(" "))?.status).toBe(TestResultStatus.FAILED);

  const FOO = CONCAT(A, OR(AA, EMPTY).name("AA ")).name("AA?");
  expect((await FOO.test("A"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await FOO.test("AAA"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await FOO.test("A "))?.status).toBe(TestResultStatus.FAILED);
  expect((await FOO.test("AA"))?.status).toBe(TestResultStatus.FAILED);
  expect((await FOO.test(" "))?.status).toBe(TestResultStatus.FAILED);

  const BAR = OR(ALPHABET, UNDERSCORE).name("NO_DIGIT_PREFIX");
  expect((await BAR.test("a"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await BAR.test("b"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await BAR.test("c"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await BAR.test("_"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await BAR.test("C"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await BAR.test("1"))?.status).toBe(TestResultStatus.FAILED);
  expect((await BAR.test("AA"))?.status).toBe(TestResultStatus.FAILED);
  expect((await BAR.test("0"))?.status).toBe(TestResultStatus.FAILED);

  const CAT = WORD("CAT").name("CAT");
  expect((await CAT.test("CAT"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await CAT.test("CA"))?.status).toBe(TestResultStatus.FAILED);
  expect((await CAT.test("CA "))?.status).toBe(TestResultStatus.FAILED);
  expect((await CAT.test("cat"))?.status).toBe(TestResultStatus.FAILED);

  const DOG = STAR(
    OR(ALPHABET, UNDERSCORE, DIGIT).name("NO_PREFIX_RESTRICTION")
  ).name("ANY_COMBINATION");

  expect((await DOG.test(""))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await DOG.test("Aasasd0_"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await DOG.test("_asd120_"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await DOG.test("0123as_"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await DOG.test("as_- "))?.status).toBe(TestResultStatus.FAILED);
  expect((await DOG.test("CA "))?.status).toBe(TestResultStatus.FAILED);
  expect((await DOG.test("!cat"))?.status).toBe(TestResultStatus.FAILED);
  expect((await DOG.test("$cat"))?.status).toBe(TestResultStatus.FAILED);

  const ANT = OPTIONAL(WORD("ant").name("ANT")).name("OPTIONAL_ANT");

  expect((await ANT.test(""))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await ANT.test("ant"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await ANT.test("ant "))?.status).toBe(TestResultStatus.FAILED);
  expect((await ANT.test("cant"))?.status).toBe(TestResultStatus.FAILED);

  const STRING_SINGLE_QUOTE = CONCAT(
    ATOM(`'`).name("STRING_OPENING_QUOTE").token(),
    STAR(MINUS(CHARACTER, ATOM("\n"), ATOM(`'`)))
      .name("STRING_CONTENT")
      .token(),
    ATOM(`'`).name("STRING_CLOSING_QUOTE").token()
  ).name("STRING_SINGLE_QUOTE");
  expect((await STRING_SINGLE_QUOTE.test(`''`))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await STRING_SINGLE_QUOTE.test(`'asdasd'`))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await STRING_SINGLE_QUOTE.test(`'asda$a_!asdsd_'`))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await STRING_SINGLE_QUOTE.test(`"asda$a_!asdsd_"`))?.status).toBe(
    TestResultStatus.FAILED
  );
  expect((await STRING_SINGLE_QUOTE.test(`'asda$a_!asdsd_`))?.status).toBe(
    TestResultStatus.FAILED
  );
  expect((await STRING_SINGLE_QUOTE.test(`asda$a_!asdsd_'`))?.status).toBe(
    TestResultStatus.FAILED
  );
  expect(
    (
      await STRING_SINGLE_QUOTE.test(`'
  asda$a_!asdsd_'`)
    )?.status
  ).toBe(TestResultStatus.FAILED);

  expect((await STRING_SINGLE_QUOTE.test(`"asda$a_!asdsd_'`))?.status).toBe(
    TestResultStatus.FAILED
  );

  const WHITESPACE_STAR = STAR(WHITESPACE).name("WHITESPACE_STAR");

  expect((await WHITESPACE_STAR.test(``))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await WHITESPACE_STAR.test(` `))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await WHITESPACE_STAR.test(`  `))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await WHITESPACE_STAR.test(`  a`))?.status).toBe(
    TestResultStatus.FAILED
  );
  expect((await WHITESPACE_STAR.test(`  a `))?.status).toBe(
    TestResultStatus.FAILED
  );
});

test("Identifier", async () => {
  expect((await IDENTIFIER.test("_"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await IDENTIFIER.test("_a"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await IDENTIFIER.test("0_a"))?.status).toBe(TestResultStatus.FAILED);
  expect((await IDENTIFIER.test("_0_a"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await IDENTIFIER.test("_$"))?.status).toBe(TestResultStatus.FAILED);
  expect((await IDENTIFIER.test("foo"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await IDENTIFIER.test("_$_foo"))?.status).toBe(
    TestResultStatus.FAILED
  );
  expect((await IDENTIFIER.test("b1a2r3"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await IDENTIFIER.test("$b1a2r3"))?.status).toBe(
    TestResultStatus.FAILED
  );
});

test("Declaration Statement", async () => {
  expect((await DECLARATION_STATEMENT.test("const a = 1"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await DECLARATION_STATEMENT.test("let a= 1"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await DECLARATION_STATEMENT.test("constant bas=1"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await DECLARATION_STATEMENT.test("const _a=1"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await DECLARATION_STATEMENT.test("const 0aa =1"))?.status).toBe(
    TestResultStatus.FAILED
  );

  expect((await DECLARATION_STATEMENT.test("conxst a ="))?.status).toBe(
    TestResultStatus.FAILED
  );
  expect((await DECLARATION_STATEMENT.test("let  _ab_   =  1"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await DECLARATION_STATEMENT.test("let  _a00b_   =  1"))?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect(
    (await DECLARATION_STATEMENT.test("let  _a00b_   =  'string'"))?.status
  ).toBe(TestResultStatus.SUCCESS);
  expect(
    (await DECLARATION_STATEMENT.test("xlet  _a00b_   =  2"))?.status
  ).toBe(TestResultStatus.FAILED);
  expect(
    (await DECLARATION_STATEMENT.test("constant  _a00b_    2"))?.status
  ).toBe(TestResultStatus.FAILED);

  expect(
    (await DECLARATION_STATEMENT.test("let intsomething = 1")).status
  ).toBe(TestResultStatus.SUCCESS);

  expect(
    (await DECLARATION_STATEMENT.test("let somethingint = 1")).status
  ).toBe(TestResultStatus.SUCCESS);
});

test("Cyclical Reference ", async () => {
  expect((await ARRAY.test("[]"))?.status).toBe(TestResultStatus.SUCCESS);

  expect((await ARRAY.test("[1]"))?.status).toBe(TestResultStatus.SUCCESS);

  expect((await ARRAY.test("['str', 1.0]"))?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect((await ARRAY.test("[[], [], []]"))?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect((await ARRAY.test("[[1], 'str', [[1.0, 2, []]]]"))?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect((await ARRAY.test("[[1], 'str', [[1.0, 2]]"))?.status).toBe(
    TestResultStatus.FAILED
  );

  expect((await ARRAY.test("[[]], [, []]"))?.status).toBe(
    TestResultStatus.FAILED
  );
});

test("Comment", async () => {
  expect((await MULTI_LINE_COMMENT.test("###d###"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await MULTI_LINE_COMMENT.test("###dd###"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await MULTI_LINE_COMMENT.test("###ddd###"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await MULTI_LINE_COMMENT.test("###d#dd###"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await MULTI_LINE_COMMENT.test("###d#d##d###"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await MULTI_LINE_COMMENT.test("###d#d###d###"))?.status).toBe(
    TestResultStatus.FAILED
  );
  expect((await MULTI_LINE_COMMENT.test("###d#d##"))?.status).toBe(
    TestResultStatus.FAILED
  );
});

test("Code Block", async () => {
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

  expect((await CODE_BLOCK.test(input0)).status).toBe(TestResultStatus.SUCCESS);
  expect((await CODE_BLOCK.test(input1)).status).toBe(TestResultStatus.FAILED);
});

test("Expression", async () => {
  // expect(
  //   (await EXPRESSION.test(`0+1-2*3/4%5**6//7++8--9+++10---11`))?.status
  // ).toBe(TestResultStatus.SUCCESS);

  expect(
    (
      await EXPRESSION.test(
        `a+(a+b)+a+(((asd)))+test(1)+((test()*((a+ b) + 12)))+arr[123*2/2]`
      )
    )?.status
  ).toBe(TestResultStatus.SUCCESS);
});

test("Scientific Notation", async () => {
  expect((await NUMBER.test("2e31"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await NUMBER.test("1.618e-2"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await NUMBER.test("3.1415E10"))?.status).toBe(
    TestResultStatus.SUCCESS
  );
  expect((await NUMBER.test("0E-100"))?.status).toBe(TestResultStatus.SUCCESS);
  expect((await NUMBER.test("3.1415E0"))?.status).toBe(
    TestResultStatus.SUCCESS
  );

  expect((await NUMBER.test("2e+31"))?.status).toBe(TestResultStatus.FAILED);
  expect((await NUMBER.test("1.618e-02"))?.status).toBe(
    TestResultStatus.FAILED
  );
});
