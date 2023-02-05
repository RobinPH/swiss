import { PrimitiveData } from "./PrimitiveData";
import { DataType } from "./types";
import { VariableValueData } from "./VariableValueData";

export class AnyData extends VariableValueData<DataType.ANY, {}, any> {
  constructor(
    metadata: ConstructorParameters<
      typeof VariableValueData<DataType.ANY, {}, any>
    >[1]
  ) {
    super(DataType.ANY, metadata);
  }

  isValidValue(rawValue: string): boolean {
    return true;
  }

  _parseValue(rawValue: string): any {
    return rawValue;
  }
}
