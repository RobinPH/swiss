import { PrimitiveData } from "./PrimitiveData";
import { PrimitiveDataType } from "./types";

export class FloatData extends PrimitiveData<PrimitiveDataType.FLOAT, number> {
  constructor(
    metadata: ConstructorParameters<
      typeof PrimitiveData<PrimitiveDataType.FLOAT, number>
    >[1]
  ) {
    super(PrimitiveDataType.FLOAT, metadata);
  }

  isValidValue(rawValue: string): boolean {
    return FloatData.isValidValue(rawValue);
  }

  static isValidValue(rawValue: string) {
    return parseFloat(rawValue) % 1 !== 0;
  }

  _parseValue(rawValue: string): number {
    return parseFloat(rawValue);
  }
}
