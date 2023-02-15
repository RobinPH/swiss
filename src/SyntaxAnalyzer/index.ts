import { TestResult, TestResultStatus } from "../BNF/BaseBNF";
import { toTable, toText } from "../BNF/formatter";
import { getTextFromInput } from "../BNF/formatter/utility";
import { Token } from "../BNF/terminal/tokenType";
import { ClassData } from "./data/ClassData";
import { FunctionData } from "./data/FunctionData";
import { AnyData } from "./data/AnyData";
import { BooleanData } from "./data/BooleanData";
import { CharacterData } from "./data/CharacterData";
import { FloatData } from "./data/FloatData";
import { IntegerData } from "./data/IntegerData";
import { StringData } from "./data/StringData";
import { Memory, MemoryError } from "./Memory";
import { FunctionParameterData } from "./data/FunctionParameterData";
import { ClassTypeData } from "./data/ClassTypeData";
import { DataType } from "./data/types";
import { LexicalAnalyzer } from "../LexicalAnalyzer";
import { VariableValueData } from "./data/VariableValueData";
import { MethodData } from "./data/MethodData";
import { MethodParameterData } from "./data/MethodParameterData";
import { ArrayData } from "./data/ArrayData";
import { BaseData } from "./data/BaseData";

export class SyntaxAnalyzer {
  readonly filepath: string;
  #rawResult?: TestResult<any, any[]>;
  #result?: TestResult<any, any[]>;
  #input?: string;

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  private async runLexicalAnalyzer() {
    const lexicalAnalyer = new LexicalAnalyzer(this.filepath);
    const rawResult = await lexicalAnalyer.run();

    this.#rawResult = rawResult;

    if (rawResult) {
      this.#input = rawResult.input;
      toText("index.txt", rawResult);
      toTable("symbol table", rawResult);

      // this.#result = SyntaxAnalyzer.cleanResult(rawResult);
      this.#result = rawResult;
    }

    return !!rawResult && rawResult.status === TestResultStatus.SUCCESS;
  }

  async run() {
    const isLexicalSuccess = await this.runLexicalAnalyzer();

    const memory = new Memory();

    if (!isLexicalSuccess) {
      return memory;
    }

    const scopedResult = this.modifyResult(this.#result!, memory);

    const errors = new Array<MemoryError>();

    this.registerGlobalVariable(
      new FunctionData({
        identifier: "print",
        parameters: [],
      })
    );

    this.registerGlobalVariable(
      new FunctionData({
        identifier: "input",
        parameters: [],
      })
    );

    const registerVariables = (result: TestResult<any, any[]>) => {
      try {
        this.handleExpression(result);
        this.handleAssignments(result);
        this.handleDeclarations(result);
      } catch (e: any) {
        if (Array.isArray(e)) {
          errors.push(...e);
        } else {
          errors.push(e);
        }
      }

      for (const child of result.children) {
        registerVariables(child);
      }
    };

    registerVariables(scopedResult);

    if (errors.length > 0) {
      console.log("[!] Syntax Analyzer FAILED");
      console.log(`[!] ${errors.length} Errors Found`);
      console.log();

      for (const error of errors) {
        let { line: lineNumber, column } = this.getLineColumnOfRange(
          error.range
        );
        lineNumber += 1;

        const line = this.getLineOfRange(error.range);

        const prefix = `${lineNumber} | `;
        const length = error.range.to - error.range.from;
        const offset = this.getLeftmostNewLineOffset(error.range);
        const caret = "".padStart(length, "^");
        const space = "".padStart(offset + prefix.length, " ");

        const linePrefix = line.slice(0, offset);
        const lineColored = line.slice(offset, length + offset);
        const lineSuffix = line.slice(length + offset);

        const header = `Error at Line ${lineNumber}, Column ${column.from}:${column.to} \x1b[1m[${error.message}]\x1b[0m`;
        const footer = "".padStart(
          header.length - "\x1b[1m\x1b[0m".length,
          " "
        );

        console.log(header);
        console.log(
          `${prefix}${linePrefix}\x1b[1m\x1b[31m${lineColored}\x1b[0m${lineSuffix}`
        );
        console.log(`${space}\x1b[1m\x1b[33m${caret}\x1b[0m`);
        console.log(`\x1b[4m${footer}\x1b[0m`);
        console.log();
      }
    } else {
      console.log("[✓] Syntax Analyzer SUCCESS");
    }

    // console.log(JSON.stringify(memory.toJSON(), null, 2));

    return memory;
  }

  private registerGlobalVariable(data: BaseData<any>) {
    this.#result?.memory?.registerData(data);
  }

  private handleDeclarations(result: TestResult<any, any[]>) {
    var identifier = this.findToken(result, Token.IDENTIFIER);

    if (
      result.name === Token.LET_DECLARATION_STATEMENT ||
      result.name === Token.CONST_DECLARATION_STATEMENT
    ) {
      const nullable = result.name !== Token.CONST_DECLARATION_STATEMENT;
      const constant = result.name === Token.CONST_DECLARATION_STATEMENT;

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
        throw new MemoryError(
          result.range,
          "Constant Variable declarations must be initialized"
        );
      }

      if (primitiveDataType) {
        if (isExpression || !value) {
          this.catchError(() => {
            result.memory?.registerData(
              new AnyData({
                identifier: identifier?.input ?? "",
                rawValue: expression?.input ?? "",
                nullable,
                constant,
              })
            );
          }, identifier);
          return;
        }

        const PrimitiveDataType =
          this.getPrimitiveDataTypeClass(primitiveDataType);

        if (PrimitiveDataType) {
          this.catchError(() => {
            result.memory?.registerData(
              new PrimitiveDataType({
                identifier: identifier?.input ?? "",
                rawValue: value?.input ?? "",
                nullable,
                constant,
                result,
              })
            );
          }, identifier);
        } else {
          throw new MemoryError(
            primitiveDataType.range,
            `Unknown Primitive Type "${primitiveDataType.input}"`
          );
        }
      } else if (classDataType) {
        const className = classDataType?.input ?? "";

        const clazz = result.memory?.getData(className);

        if (!clazz) {
          throw new MemoryError(
            classDataType.range,
            `Class "${className}" is not defined`
          );
        } else {
          if (clazz.type !== DataType.CLASS) {
            throw new MemoryError(
              classDataType.range,
              `Variable "${className}" is not a class`
            );
          }
        }

        if (isExpression || !value) {
          this.catchError(() => {
            result.memory?.registerData(
              new AnyData({
                identifier: identifier?.input ?? "",
                rawValue: expression?.input ?? "",
                nullable,
                constant,
              })
            );
          }, identifier);
          return;
        }

        this.catchError(() => {
          result.memory?.registerData(
            new ClassTypeData({
              identifier: identifier?.input ?? "",
              rawValue: "",
              nullable,
              constant,
            })
          );
        }, identifier!);
      } else {
        const DataType =
          this.getPossiblePrimitiveType(value?.input ?? "") ?? AnyData;

        this.catchError(() => {
          result.memory?.registerData(
            new DataType({
              identifier: identifier?.input ?? "",
              rawValue: value?.input ?? "",
              nullable,
            })
          );
        }, identifier);
      }
    } else if (result.name === Token.FUNCTION_STATEMENT) {
      const parameter = this.findToken(result, Token.PARAMETER)!;
      const restParameters = this.findToken(result, Token.REST_PARAMETER)!;
      const p1 = this.findTokens(parameter, Token.IDENTIFIER);
      const pRest = this.findTokens(restParameters, Token.IDENTIFIER);
      const params = [...pRest, ...p1].map((param) => {
        const id = this.findToken(param, Token.IDENTIFIER);
        return {
          data: new FunctionParameterData({
            identifier: id?.input ?? "",
          }),
          id,
        };
      });

      this.catchError(() => {
        result.memory?.registerData(
          new FunctionData({
            identifier: identifier?.input ?? "",
            parameters: params.map(({ data }) => data),
          })
        );
      }, identifier!);

      const codeBlock = this.findToken(result, Token.CODE_BLOCK)!;

      for (const { data, id } of params) {
        this.catchError(() => {
          codeBlock.memory!.registerData(data);
        }, id!);
      }
    } else if (result.name === Token.CLASS_DECLARATION) {
      this.handleClassDeclaration(result);
    }
  }

  private handleClassDeclaration(result: TestResult<any, any[]>) {
    var identifier = this.findToken(result, Token.IDENTIFIER);

    this.catchError(() => {
      result.memory?.registerData(
        new ClassData({
          identifier: identifier?.input ?? "",
        })
      );
    }, identifier!);

    const extendStatement = this.findToken(result, Token.CLASS_EXTEND);

    if (extendStatement) {
      const extendClass = this.findToken(extendStatement, Token.IDENTIFIER)!;

      const clazz = result.memory?.getData(extendClass.input);

      if (!clazz) {
        throw new MemoryError(
          extendClass.range,
          `Class "${extendClass.input}" is not defined`
        );
      } else {
        if (clazz.type !== DataType.CLASS) {
          throw new MemoryError(
            extendClass.range,
            `Variable "${extendClass.input}" is not a class`
          );
        }
      }
    }

    const classMethods = this.findTokens(result, Token.CLASS_METHOD);

    const codeBlock = this.findToken(result, Token.CLASS_CODE_BLOCK)!;

    for (const classMethod of classMethods) {
      const methodName = this.findToken(classMethod, Token.IDENTIFIER)!;

      if (codeBlock.memory?.hasData(methodName.input)) {
        throw new MemoryError(
          methodName.range,
          `Class Method "${methodName.input}" is already defined`
        );
      }

      const parameter = this.findToken(classMethod, Token.PARAMETER)!;
      const restParameters = this.findToken(classMethod, Token.REST_PARAMETER)!;
      const p1 = this.findTokens(parameter, Token.IDENTIFIER);
      const pRest = this.findTokens(restParameters, Token.IDENTIFIER);
      const params = [...pRest, ...p1].map((param) => {
        const id = this.findToken(param, Token.IDENTIFIER);
        return {
          data: new MethodParameterData({
            identifier: id?.input ?? "",
          }),
          id,
        };
      });

      for (const { data, id } of params) {
        this.catchError(() => {
          codeBlock.memory!.registerData(data);
        }, id!);
      }

      this.catchError(() => {
        codeBlock.memory?.registerData(
          new MethodData({
            identifier: methodName?.input ?? "",
            parameters: params.map(({ data }) => data),
          })
        );
      }, methodName!);
    }

    const classVariables = this.findTokens(
      result,
      Token.CLASS_INSTANCE_VARIABLE
    );

    for (const classVariable of classVariables) {
      this.handleClassVariableDeclaration(codeBlock, classVariable);
    }
  }

  private handleClassVariableDeclaration(
    codeBlock: TestResult<any, any[]>,
    classVariable: TestResult<any, any[]>
  ) {
    const nullable = true;

    const identifier = this.findToken(classVariable, Token.IDENTIFIER);

    const classDataType = this.findToken(classVariable, Token.DATA_TYPE);
    const primitiveDataType = this.findToken(
      classVariable,
      Token.DATATYPE_SPECIFIER
    );

    const value = this.findToken(classVariable, Token.VALUE);

    const expression = this.findToken(classVariable, Token.EXPRESSION);
    const isExpression =
      expression &&
      this.findTokens(classVariable, Token.EXPRESSION, true).length > 1;

    if (primitiveDataType) {
      if (isExpression || !value) {
        this.catchError(() => {
          codeBlock.memory?.registerData(
            new AnyData({
              identifier: identifier?.input ?? "",
              rawValue: expression?.input ?? "",
              nullable,
            })
          );
        }, identifier);
        return;
      }

      const PrimitiveDataType =
        this.getPrimitiveDataTypeClass(primitiveDataType);

      if (PrimitiveDataType) {
        this.catchError(() => {
          codeBlock.memory?.registerData(
            new PrimitiveDataType({
              identifier: identifier?.input ?? "",
              rawValue: value?.input ?? "",
              nullable,
              result: classVariable,
            })
          );
        }, identifier);
      } else {
        throw new MemoryError(
          primitiveDataType.range,
          `Unknown Primitive Type "${primitiveDataType.input}"`
        );
      }
    } else if (classDataType) {
      const className = classDataType?.input ?? "";

      const clazz = codeBlock.memory?.getData(className);

      if (!clazz) {
        throw new MemoryError(
          classDataType.range,
          `Class "${className}" is not defined`
        );
      } else {
        if (clazz.type !== DataType.CLASS) {
          throw new MemoryError(
            classDataType.range,
            `Variable "${className}" is not a class`
          );
        }
      }

      if (isExpression || !value) {
        this.catchError(() => {
          codeBlock.memory?.registerData(
            new AnyData({
              identifier: identifier?.input ?? "",
              rawValue: expression?.input ?? "",
              nullable,
            })
          );
        }, identifier);
        return;
      }

      this.catchError(() => {
        codeBlock.memory?.registerData(
          new ClassTypeData({
            identifier: identifier?.input ?? "",
            rawValue: "",
            nullable,
          })
        );
      }, identifier!);
    } else {
      const DataType =
        this.getPossiblePrimitiveType(value?.input ?? "") ?? AnyData;

      this.catchError(() => {
        codeBlock.memory?.registerData(
          new DataType({
            identifier: identifier?.input ?? "",
            rawValue: value?.input ?? "",
            nullable,
          })
        );
      }, identifier);
    }
  }

  private handleAssignments(result: TestResult<any, any[]>) {
    switch (result.name) {
      case Token.ASSIGNMENT_STATEMENT:
        const identifier = this.findToken(result, Token.IDENTIFIER)!;

        if (!result.memory!.hasData(identifier.input, true)) {
          throw new MemoryError(
            identifier.range,
            `Identifier "${identifier.input}" is not defined`
          );
        } else {
          const data = result.memory!.getData(identifier.input)!;

          if (data instanceof VariableValueData<any, {}, any>) {
            if (data.metadata.constant) {
              throw new MemoryError(
                identifier.range,
                `Constant variable "${identifier.input}" cannot be reassigned`
              );
            }
          }
        }

        break;
    }
  }

  private handleExpression(result: TestResult<any, any[]>) {
    const errors = new Array<MemoryError>();

    // @ts-ignore
    if (result.name === Token.EXPRESSION && !result.childExpression) {
      const identifiers = this.findTokens(result, Token.IDENTIFIER);
      for (const identifier of identifiers) {
        if (!result.memory?.hasData(identifier.input, true)) {
          errors.push(
            new MemoryError(
              identifier.range,
              `Variable "${identifier.input}" is not defined`
            )
          );
        }
      }
    }

    if (errors.length > 0) {
      throw errors;
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
    } else if (this.findToken(result, Token.ARRAY_DATA_TYPE_KEYWORD)) {
      return ArrayData;
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

      if (
        child.name === Token.CODE_BLOCK ||
        child.name === Token.CLASS_CODE_BLOCK
      ) {
        this.modifyResult(child, memory.newChild());
      } else {
        this.modifyResult(child, memory);
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

  private getLineColumnOfRange(range: { from: number; to: number }) {
    if (!this.#input) {
      return {
        line: -1,
        column: {
          from: -1,
          to: -1,
        },
      };
    }

    let indexOfNewLine = 0;
    let lineNumber = 0;

    for (let i = 0; i < range.from && i < this.#input.length; i++) {
      if (this.#input[i] === "\n") {
        lineNumber++;
        indexOfNewLine = i;
      }
    }

    return {
      line: lineNumber,
      column: {
        from: range.from - indexOfNewLine,
        to: range.to - indexOfNewLine,
      },
    };
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

  private getLeftmostNewLineOffset(range: { from: number; to: number }) {
    if (!this.#input) {
      return 0;
    }

    let lineStart = 0;

    for (let i = 0; i < range.from && i < this.#input.length; i++) {
      if (this.#input[i] === "\n") {
        lineStart = i + 1;
      }
    }

    return range.from - lineStart;
  }

  private catchError(func: () => void, result?: TestResult<any, any[]>) {
    try {
      func();
    } catch (e: any) {
      if (result) {
        throw new MemoryError(result.range, e.message);
      }
    }
  }
}
