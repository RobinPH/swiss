import BaseBNF from "./BaseBNF";

export default class ManagerBNF {
  static #processes = new Map<BaseBNF<any>, number>();

  private constructor() {}

  static isProcessing(bnf: BaseBNF<any>) {
    return ManagerBNF.#processes.has(bnf);
  }

  static count(bnf: BaseBNF<any>) {
    return ManagerBNF.#processes.get(bnf) ?? 0;
  }

  static process(bnf: BaseBNF<any>) {
    if (!ManagerBNF.#processes.has(bnf)) {
      ManagerBNF.#processes.set(bnf, 0);
    }

    ManagerBNF.#processes.set(bnf, ManagerBNF.#processes.get(bnf)! + 1);
  }

  static fulfill(bnf: BaseBNF<any>) {
    ManagerBNF.#processes.delete(bnf);
  }

  static clear() {
    ManagerBNF.#processes.clear();
  }
}
