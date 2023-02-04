import { TestResult } from "../BNF/BaseBNF";
import { toText } from "../BNF/formatter";
import { getTextFromInput } from "../BNF/formatter/utility";
import { FUNCTION_STATEMENT, SWISS } from "../BNF/terminal/statement";
import { Token } from "../BNF/terminal/tokenType";
import { testInput } from "../cli/utility";
import { ClassData } from "./data/ClassData";
import { FunctionData } from "./data/FunctionData";
import { StringData } from "./data/StringData";
import { Memory } from "./Memory";

export class SyntaxAnalyzer {
  readonly filepath: string;
  #rawResult?: TestResult<any, any[]>;
  #result?: TestResult<any, any[]>;
  #input?: string;

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  private async runLexicalAnalyzer() {
    const rawResult = await testInput(SWISS, this.filepath);

    this.#rawResult = rawResult;

    if (rawResult) {
      this.#input = rawResult.input;
      toText("index.txt", rawResult);

      // this.#result = SyntaxAnalyzer.cleanResult(rawResult);
      this.#result = rawResult;
    }
  }

  async run() {
    await this.runLexicalAnalyzer();

    const memory = new Memory();

    const scopedResult = this.scopify(this.#result!, memory);

    const errors = new Array<{
      range: {
        from: number;
        to: number;
      };
      message: string;
    }>();

    const registerVariables = (result: TestResult<any, any[]>) => {
      this.handleDeclarations(result);
      this.handleAssignments(result);

      for (const child of result.children) {
        try {
          registerVariables(child);
        } catch (e: any) {
          errors.push({
            range: result.range,
            message: e.message,
          });
        }
      }
    };

    registerVariables(scopedResult);

    if (errors.length > 0) {
      for (const error of errors) {
        const lineNumber = this.getLineNumberOfRange(error.range) + 1;
        const line = this.getLineOfRange(error.range);

        console.log(`Error at Line ${lineNumber}: ${error.message}`);
        console.log(`${lineNumber} |     ${line}`);
      }

      console.log("[!] Syntax Analyzer FAILED");
      console.log(`[!] ${errors.length} Errors Found`);
    } else {
      console.log("[✓] Syntax Analyzer SUCCESS");
    }

    // console.log(JSON.stringify(memory.toJSON(), null, 2));
  }

  private handleDeclarations(result: TestResult<any, any[]>) {
    switch (result.name) {
      case Token.LET_DECLARATION_STATEMENT:
        result.memory?.registerData(
          new StringData(
            this.findToken(result, Token.IDENTIFIER)!.input,
            this.findToken(result, Token.VALUE)?.input ?? ""
          )
        );
        break;
      case Token.CONST_DECLARATION_STATEMENT:
        result.memory?.registerData(
          new StringData(
            this.findToken(result, Token.CONST_IDENTIFIER)!.input,
            this.findToken(result, Token.VALUE)!.input
          )
        );
        break;
      case Token.FUNCTION_STATEMENT:
        const parameter = this.findToken(result, Token.PARAMETER)!;
        const restParameters = this.findToken(result, Token.REST_PARAMETER)!;
        const p1 = this.findTokens(parameter, Token.IDENTIFIER);
        const pRest = this.findTokens(restParameters, Token.IDENTIFIER);
        const params = [...pRest, ...p1];

        result.memory?.registerData(
          new FunctionData(this.findToken(result, Token.IDENTIFIER)!.input, "")
        );

        const codeBlock = this.findToken(result, Token.CODE_BLOCK)!;

        for (const param of params) {
          codeBlock.memory!.registerData(new StringData(param.input, ""));
        }
        break;
      case Token.CLASS_DECLARATION:
        result.memory?.registerData(
          new ClassData(this.findToken(result, Token.IDENTIFIER)!.input, "")
        );
        break;
    }
  }

  private handleAssignments(result: TestResult<any, any[]>) {
    switch (result.name) {
      case Token.ASSIGNMENT_STATEMENT:
        const identifier = this.findToken(result, Token.IDENTIFIER)!.input;

        if (!result.memory!.hasData(identifier, true)) {
          throw new Error(`Identifier "${identifier}" is not defined`);
        }

        break;
    }
  }

  private scopify(result: TestResult<any, any[]>, memory: Memory) {
    result.memory = memory;

    for (const child of result.children) {
      if (child.name === Token.CODE_BLOCK) {
        this.scopify(child, memory.newChild());
      } else {
        this.scopify(child, memory);
      }
    }

    return result;
  }

  private findToken(
    result: TestResult<any, any[]>,
    token: Token
  ): (TestResult<any, any[]> & { input: string }) | undefined {
    if (result.name === token) {
      return {
        ...result,
        input: getTextFromInput(this.#input!, result.range),
      };
    }

    for (const child of result.children) {
      const res = this.findToken(child, token);

      if (res) {
        return res;
      }
    }

    return;
  }

  private findTokens<T extends TestResult<any, any[]> & { input: string }>(
    result: TestResult<any, any[]>,
    token: Token
  ): Array<T> {
    const results = new Array<T>();

    if (result.name === token) {
      return [
        {
          ...result,
          input: getTextFromInput(this.#input!, result.range),
        } as T,
      ];
    }

    for (const child of result.children) {
      // @ts-ignore
      results.push(...this.findTokens(child, token));
    }

    return results;
  }

  private static cleanResult(
    result: TestResult<any, any[]>
  ): TestResult<any, any[]> | undefined {
    if (result.children.length === 0 || result.isToken) {
      if (result.isHidden || result.range.from === result.range.to) {
        return;
      }
    }

    const children = result.children
      .map((child) => {
        return this.cleanResult(child);
      })
      .filter((child) => !!child) as TestResult<any, any[]>[];

    return {
      range: result.range,
      children,
      isHidden: result.isHidden,
      isToken: result.isToken,
      name: result.name,
      status: result.status,
    };
  }

  private getLineNumberOfRange(range: { from: number; to: number }) {
    if (!this.#input) {
      return -1;
    }

    let lineNumber = 0;

    for (let i = 0; i < range.to && i < this.#input.length; i++) {
      if (this.#input[i] === "\n") {
        lineNumber++;
      }
    }

    return lineNumber;
  }

  private getLineOfRange(range: { from: number; to: number }) {
    if (!this.#input) {
      return "";
    }

    let lineStart = 0;
    let lineEnd = 0;

    for (let i = 0; i < range.to && i < this.#input.length; i++) {
      if (this.#input[i] === "\n") {
        lineStart = i + 1;
      }
    }

    for (let i = range.to; i < this.#input.length; i++) {
      lineEnd = i;

      if (this.#input[i] === "\n") {
        break;
      }
    }

    return this.#input.slice(lineStart, lineEnd);
  }
}
