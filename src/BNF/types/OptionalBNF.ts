import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import AtomBNF from "./AtomBNF";
import OrBNF from "./OrBNF";
import { v4 as uuidv4 } from "uuid";

export default class OptionalBNF<
  Name extends string,
  BNF extends BaseBNF<any, any[], any>
> extends OrBNF<Name, [BNF, AtomBNF<string>]> {
  type = BNFType.STAR;

  #bnf;

  constructor(name: Name, bnf: BNF) {
    super(name, bnf, new AtomBNF(uuidv4(), ""));

    this.#bnf = bnf;
  }

  toDefinition(): string {
    return this.toVariable();
  }

  toVariable(): string {
    return `${this.#bnf.toVariable()}?`;
  }

  bnf() {
    return this.#bnf;
  }
}
