import { PrimitiveData } from "./PrimitiveData";
import { PrimitiveDataType } from "./types";

export class ArrayData extends PrimitiveData<
  PrimitiveDataType.ARRAY,
  Array<any>
> {
  constructor(
    metadata: ConstructorParameters<
      typeof PrimitiveData<PrimitiveDataType.ARRAY, Array<any>>
    >[1]
  ) {
    super(PrimitiveDataType.ARRAY, metadata);
  }

  isValidValue(rawValue: string): boolean {
    return ArrayData.isValidValue(rawValue);
  }

  static isValidValue(rawValue: string) {
    return rawValue.startsWith("[") && rawValue[rawValue.length - 1] === "]";
  }

  _parseValue(rawValue: string): Array<any> {
    const elements = rawValue.slice(1, rawValue.length - 1);

    return elements.split(",");
  }
}
