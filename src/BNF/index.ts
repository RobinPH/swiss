import BaseBNF from "./BaseBNF";
import AtomBNF from "./types/AtomBNF";
import ConcatBNF from "./types/ConcatBNF";
import OrBNF from "./types/OrBNF";
import StarBNF from "./types/StarBNF";
import PlusBNF from "./types/PlusBNF";
import OptionalBNF from "./types/OptionalBNF";
import { v4 as uuidv4 } from "uuid";
import { Characters } from "../types";
import MinusBNF from "./types/MinusBNF";
import ExactMinusBNF from "./types/ExactMinusBNF";

export default class BNF {
  static ATOM<Character extends string>(character: Character) {
    return new AtomBNF(BNF.randomToken(), character);
  }

  static OR<Children extends BaseBNF<any, any[], any>[]>(...bnfs: Children) {
    return new OrBNF(BNF.randomToken(), ...bnfs);
  }

  static CONCAT<Children extends BaseBNF<any, any[], any>[]>(
    ...bnfs: Children
  ) {
    return new ConcatBNF(BNF.randomToken(), ...bnfs);
  }

  static STAR<BNF extends BaseBNF<any, any[], any>>(bnf: BNF) {
    return new StarBNF(BNF.randomToken(), bnf);
  }

  static PLUS<BNF extends BaseBNF<any, any[], any>>(bnf: BNF) {
    return new PlusBNF(BNF.randomToken(), bnf);
  }

  static OPTIONAL<BNF extends BaseBNF<any, any[], any>>(bnf: BNF) {
    return new OptionalBNF(BNF.randomToken(), bnf);
  }

  static MINUS<
    BNF extends BaseBNF<any, any[], any>,
    Excluding extends BaseBNF<any, any[], any>[]
  >(bnf: BNF, ...excluding: Excluding) {
    return new MinusBNF(BNF.randomToken(), bnf, ...excluding);
  }

  static EXACT_MINUS<
    BNF extends BaseBNF<any, any[], any>,
    Excluding extends BaseBNF<any, any[], any>[]
  >(bnf: BNF, ...excluding: Excluding) {
    return new ExactMinusBNF(BNF.randomToken(), bnf, ...excluding);
  }

  static WORD<U extends string>(word: U) {
    const characters = word.split("") as Characters<U>;

    return BNF.CONCAT(
      ...characters.map((character) => {
        const machine = BNF.ATOM(character).name(character);
        // machine.#hide = true;
        return machine;
      })
    ).name(word);
  }

  private static randomToken() {
    return uuidv4();
  }
}

export const ATOM = BNF.ATOM;
export const OR = BNF.OR;
export const CONCAT = BNF.CONCAT;
export const STAR = BNF.STAR;
export const PLUS = BNF.PLUS;
export const OPTIONAL = BNF.OPTIONAL;
export const WORD = BNF.WORD;
export const MINUS = BNF.MINUS;
export const EXACT_MINUS = BNF.EXACT_MINUS;
