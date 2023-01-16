import { ATOM, CONCAT, MINUS, OPTIONAL, OR, PLUS, STAR, WORD } from "./BNF";
import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import {
  ALPHABET,
  LOWERCASE_ALPHABET,
  UPPERCASE_ALPHABET,
} from "./BNF/terminal/alphabet";
import { CHARACTER } from "./BNF/terminal/character";
import { CONST_DECLARATOR, DECLARATOR } from "./BNF/terminal/declarator";
import { DIGIT } from "./BNF/terminal/digit";
import { EXPRESSION } from "./BNF/terminal/expression";
import { IDENTIFIER } from "./BNF/terminal/identifier";
import { NUMBER } from "./BNF/terminal/literal";
import { STRING } from "./BNF/terminal/literal/string";
import { MULTI_LINE_COMMENT } from "./BNF/terminal/multipleLineComment";
import { UNDERSCORE } from "./BNF/terminal/specialCharacter";
import { DECLARATION_STATEMENT } from "./BNF/terminal/statement";
import { VALUE } from "./BNF/terminal/value";
import { WHITESPACE } from "./BNF/terminal/whitespace";
import { vizualize, vizualizeParseTree } from "./BNF/viz";

const main = async () => {
  const A = ATOM("A").name("A");
  const B = ATOM("B").name("B");
  const A_B = OR(A, B).name("A_B");
  const C = ATOM("C").name("C");
  const D = ATOM("D").name("D");
  const C_D = OR(C, D).name("C_D");
  const A_B_C_D = OR(A_B, C_D).name("A_B_C_D");
  const A_STAR = STAR(A).name("A_STAR");
  const A_B_STAR = STAR(A_B).name("A_B_STAR");
  const A_PLUS = PLUS(A).name("A_PLUS");
  const A_B_B = MINUS(A_B, ATOM("B")).name("A_B - B");
  const A_OPTIONAL = OPTIONAL(A).name("A_OPTIONAL");
  const AA = CONCAT(A, A).name("AA");
  const EMPTY = ATOM("").name("EMPTY");
  const FOO = CONCAT(A, OR(AA, EMPTY).name("AA ")).name("AA?");
  const BAR = OR(ALPHABET, UNDERSCORE).name("NO_DIGIT_PREFIX");
  const CAT = WORD("CAT").name("CAT");
  const DOG = STAR(
    OR(ALPHABET, UNDERSCORE, DIGIT).name("NO_PREFIX_RESTRICTION")
  ).name("ANY_COMBINATION");
  const ANT = OPTIONAL(WORD("ant").name("ANT")).name("OPTIONAL_ANT");
  const STRING_SINGLE_QUOTE = CONCAT(
    ATOM(`'`).name("STRING_OPENING_QUOTE").token(),
    STAR(MINUS(CHARACTER, ATOM("\n"), ATOM(`'`)))
      .name("STRING_CONTENT")
      .token(),
    ATOM(`'`).name("STRING_CLOSING_QUOTE").token()
  ).name("STRING_SINGLE_QUOTE");
  const WHITESPACE_STAR = STAR(WHITESPACE).name("WHITESPACE_STAR");

  // let F = OR().name("F");
  // let T = OR().name("T");
  // // @ts-ignore
  // T = T.OR(CONCAT(T, ATOM("*").name("MULTIPLY"), F).name("T MULTIPLY F"));
  // // @ts-ignore
  // T = T.OR(F);

  // // @ts-ignore
  // F = F.OR(ATOM("a").name("a"));

  // let E = OR().name("E");
  // // @ts-ignore
  // E = E.OR(CONCAT(E, ATOM("+").name("PLUS"), T).name("E PLUS T"));
  // // @ts-ignore
  // E = E.OR(T);

  const bnf = STRING_SINGLE_QUOTE;
  const input = `''`;

  console.log("start");

  const res = await bnf.test(input);
  vizualizeParseTree(res.task.children[0]);

  if (res.status === TestResultStatus.SUCCESS) {
    console.log("[?] SUCCESS");
  } else if (res.status === TestResultStatus.FAILED) {
    console.log(`[!] Failed`);
  }
  // console.log(res);

  console.log(res.range);

  toTable("symbol_table.txt", res);

  for (const b of [bnf]) {
    console.log(b.toDeclaration());
  }
  // vizualize("res", bnf);
};

main();
