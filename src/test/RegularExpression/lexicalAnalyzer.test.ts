import { RegularExpression as re } from "../../RegularExpression";
import {
  DECLARATION_STATEMENT,
  IDENTIFIER,
} from "../../RegularExpression/terminal";

test("Identifier", () => {
  expect(IDENTIFIER.check("_")?.value).toBe("IDENTIFIER");
  expect(IDENTIFIER.check("_a")?.value).toBe("IDENTIFIER");
  expect(IDENTIFIER.check("0_a")?.value).toBe(undefined);
  expect(IDENTIFIER.check("_0_a")?.value).toBe("IDENTIFIER");
  expect(IDENTIFIER.check("_$")?.value).toBe(undefined);
  expect(IDENTIFIER.check("foo")?.value).toBe("IDENTIFIER");
  expect(IDENTIFIER.check("_$_foo")?.value).toBe(undefined);
  expect(IDENTIFIER.check("b1a2r3")?.value).toBe("IDENTIFIER");
  expect(IDENTIFIER.check("$b1a2r3")?.value).toBe(undefined);
});

test("Declaration Statement", () => {
  expect(DECLARATION_STATEMENT.check("const a = 1")?.value).toBe(
    "DECLARATION_STATEMENT"
  );
  expect(DECLARATION_STATEMENT.check("let a= 1")?.value).toBe(
    "DECLARATION_STATEMENT"
  );
  expect(DECLARATION_STATEMENT.check("constant bas=1")?.value).toBe(
    "DECLARATION_STATEMENT"
  );
  expect(DECLARATION_STATEMENT.check("const _a=1")?.value).toBe(
    "DECLARATION_STATEMENT"
  );
  expect(DECLARATION_STATEMENT.check("const 0aa =1")?.value).toBe(undefined);
  expect(DECLARATION_STATEMENT.check("cons a = 1")?.value).toBe(undefined);
  expect(DECLARATION_STATEMENT.check("conxst a =")?.value).toBe(undefined);
  expect(DECLARATION_STATEMENT.check("let  _ab_   =  1")?.value).toBe(
    "DECLARATION_STATEMENT"
  );
  expect(DECLARATION_STATEMENT.check("let  _a00b_   =  1")?.value).toBe(
    "DECLARATION_STATEMENT"
  );
  expect(DECLARATION_STATEMENT.check("xlet  _a00b_   =  2")?.value).toBe(
    undefined
  );
  expect(DECLARATION_STATEMENT.check("constant  _a00b_    2")?.value).toBe(
    undefined
  );
});
