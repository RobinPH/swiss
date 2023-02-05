import { DataType } from "./types";
import { VariableData } from "./VariableData";

type FunctionParameter = "FUNCTION_PARAMETER";

export class FunctionParameterData extends VariableData<FunctionParameter> {
  constructor(
    metadata: ConstructorParameters<typeof VariableData<DataType.ANY>>[1]
  ) {
    super("FUNCTION_PARAMETER", metadata);
  }
}
