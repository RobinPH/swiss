import { TestResult } from "../BNF/BaseBNF";
import { toText } from "../BNF/formatter";
import { getTextFromInput } from "../BNF/formatter/utility";
import { FUNCTION_STATEMENT, SWISS } from "../BNF/terminal/statement";
import { Token } from "../BNF/terminal/tokenType";
import { testInput } from "../cli/utility";
import { BaseData } from "./data/BaseData";
import { ClassData } from "./data/ClassData";
import { FunctionData } from "./data/FunctionData";
import { AnyData } from "./data/AnyData";
import { BooleanData } from "./data/BooleanData";
import { CharacterData } from "./data/CharacterData";
import { FloatData } from "./data/FloatData";
import { IntegerData } from "./data/IntegerData";
import { PrimitiveData } from "./data/PrimitiveData";
import { StringData } from "./data/StringData";
import { Memory } from "./Memory";
import { VariableData } from "./data/VariableData";
import { FunctionParameterData } from "./data/FunctionParameterData";
import { ClassTypeData } from "./data/ClassTypeData";
import { DataType } from "./data/types";

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

    const scopedResult = this.modifyResult(this.#result!, memory);

    const errors = new Array<{
      range: {
        from: number;
        to: number;
      };
      message: string;
    }>();

    const registerVariables = (result: TestResult<any, any[]>) => {
      this.handleExpression(result);
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
    var identifier = this.findToken(result, Token.IDENTIFIER);

    if (
      result.name === Token.LET_DECLARATION_STATEMENT ||
      result.name === Token.CONST_DECLARATION_STATEMENT
    ) {
      const nullable = result.name !== Token.CONST_DECLARATION_STATEMENT;

      if (result.name === Token.CONST_DECLARATION_STATEMENT) {
        var identifier = this.findToken(result, Token.CONST_IDENTIFIER);
      }

      const classDataType = this.findToken(result, Token.DATA_TYPE);
      const primitiveDataType = this.findToken(
        result,
        Token.DATATYPE_SPECIFIER
      );

      const value = this.findToken(result, Token.VALUE);

      const expression = this.findToken(result, Token.EXPRESSION);
      const isExpression =
        expression &&
        this.findTokens(result, Token.EXPRESSION, true).length > 1;

      if (
        !value &&
        !expression &&
        result.name === Token.CONST_DECLARATION_STATEMENT
      ) {
        throw new Error("Constant Variable declarations must be initialized");
      }

      if (isExpression || !value) {
        result.memory?.registerData(
          new AnyData({
            identifier: identifier!.input,
            rawValue: expression?.input,
            nullable,
          })
        );
      } else {
        if (primitiveDataType) {
          // if (
          //   this.findToken(primitiveDataType, Token.STRING_DATA_TYPE_KEYWORD) ||
          //   this.findToken(primitiveDataType, Token.CHARACTER_DATA_TYPE_KEYWORD)
          // ) {
          //   if (value) {
          //     const stringContent = this.findToken(value, Token.STRING_CONTENT);

          //     if (stringContent) {
          //       value = stringContent;
          //     }
          //   }
          // }

          const PrimitiveDataType =
            this.getPrimitiveDataTypeClass(primitiveDataType);

          if (PrimitiveDataType) {
            result.memory?.registerData(
              new PrimitiveDataType({
                identifier: identifier!.input,
                rawValue: value?.input,
                nullable,
              })
            );
          } else {
            throw new Error(
              `Unknown Primitive Type "${primitiveDataType.input}"`
            );
          }
        } else if (classDataType) {
          const className = classDataType!.input;

          const clazz = result.memory?.getData(className);

          if (!clazz) {
            throw new Error(`Class "${className}" is not defined`);
          } else {
            if (clazz.type !== DataType.CLASS) {
              throw new Error(`Variable "${className}" is not a class`);
            }
          }

          result.memory?.registerData(
            new ClassTypeData({
              identifier: identifier!.input,
              rawValue: "",
              nullable,
            })
          );
        } else {
          const DataType =
            this.getPossiblePrimitiveType(value!.input) ?? AnyData;

          result.memory?.registerData(
            new DataType({
              identifier: identifier!.input,
              rawValue: value?.input ?? "",
              nullable,
            })
          );
        }
      }
    } else if (result.name === Token.FUNCTION_STATEMENT) {
      const parameter = this.findToken(result, Token.PARAMETER)!;
      const restParameters = this.findToken(result, Token.REST_PARAMETER)!;
      const p1 = this.findTokens(parameter, Token.IDENTIFIER);
      const pRest = this.findTokens(restParameters, Token.IDENTIFIER);
      const params = [...pRest, ...p1].map((param) => {
        const id = this.findToken(param, Token.IDENTIFIER);
        return new FunctionParameterData({
          identifier: id!.input,
        });
      });

      result.memory?.registerData(
        new FunctionData({
          identifier: identifier!.input,
          parameters: params,
        })
      );

      const codeBlock = this.findToken(result, Token.CODE_BLOCK)!;

      for (const param of params) {
        codeBlock.memory!.registerData(param);
      }
    } else if (result.name === Token.CLASS_DECLARATION) {
      result.memory?.registerData(
        new ClassData({
          identifier: identifier!.input,
        })
      );
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

  private handleExpression(result: TestResult<any, any[]>) {
    // @ts-ignore
    if (result.name === Token.EXPRESSION && !result.childExpression) {
      const identifiers = this.findTokens(result, Token.IDENTIFIER);
      for (const identifier of identifiers) {
        if (!result.memory?.hasData(identifier.input)) {
          throw new Error(`Variable "${identifier.input}" is not defined`);
        }
      }
    }
  }

  private getPrimitiveDataTypeClass(result: TestResult<any, any[]>) {
    if (this.findToken(result, Token.INTEGER_DATA_TYPE_KEYWORD)) {
      return IntegerData;
    } else if (this.findToken(result, Token.FLOAT_DATA_TYPE_KEYWORD)) {
      return FloatData;
    } else if (this.findToken(result, Token.STRING_DATA_TYPE_KEYWORD)) {
      return StringData;
    } else if (this.findToken(result, Token.CHARACTER_DATA_TYPE_KEYWORD)) {
      return CharacterData;
    } else if (this.findToken(result, Token.BOOLEAN_DATA_TYPE_KEYWORD)) {
      return BooleanData;
    }
  }

  private getPossiblePrimitiveType(rawValue: string) {
    const primitiveDataTypes = [
      IntegerData,
      FloatData,
      StringData,
      CharacterData,
      BooleanData,
    ];

    for (const primitiveDataType of primitiveDataTypes) {
      if (primitiveDataType.isValidValue(rawValue)) {
        return primitiveDataType;
      }
    }
  }

  private modifyResult(result: TestResult<any, any[]>, memory: Memory) {
    result.memory = memory;
    // @ts-ignore
    result.childExpression ??= false;

    // if (result.name === Token.EXPRESSION) {
    //   console.log(this.findToken(result, Token.IDENTIFIER));
    // }

    for (const child of result.children) {
      if (result.name === Token.EXPRESSION) {
        // @ts-ignore
        child.childExpression = true;
      } else {
        // @ts-ignore
        child.childExpression = result.childExpression;
      }

      if (child.name === Token.CODE_BLOCK) {
        this.modifyResult(child, memory.newChild());
      }
      this.modifyResult(child, memory);
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
    token: Token,
    deep = false
  ): Array<T> {
    const results = new Array<T>();

    if (result.name === token) {
      if (deep) {
        // @ts-ignore
        results.push([
          {
            ...result,
            input: getTextFromInput(this.#input!, result.range),
          } as T,
        ]);
      } else {
        return [
          {
            ...result,
            input: getTextFromInput(this.#input!, result.range),
          } as T,
        ];
      }
    }

    for (const child of result.children) {
      // @ts-ignore
      results.push(...this.findTokens(child, token, deep));
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

    for (let i = 0; i < range.from && i < this.#input.length; i++) {
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

    for (let i = 0; i < range.from && i < this.#input.length; i++) {
      if (this.#input[i] === "\n") {
        lineStart = i + 1;
      }
    }

    for (let i = lineStart; i < this.#input.length; i++) {
      lineEnd = i;

      if (this.#input[i] === "\n") {
        break;
      }
    }

    return this.#input.slice(lineStart, lineEnd);
  }
}
