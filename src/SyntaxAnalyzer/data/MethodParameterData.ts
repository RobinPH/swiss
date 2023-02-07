import { DataType } from "./types";
import { VariableData } from "./VariableData";

type MethodParameter = "METHOD_PARAMETER";

export class MethodParameterData extends VariableData<MethodParameter> {
  constructor(
    metadata: ConstructorParameters<typeof VariableData<DataType.ANY>>[1]
  ) {
    super("METHOD_PARAMETER", metadata);
  }
}
