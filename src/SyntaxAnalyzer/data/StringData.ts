import { PrimitiveData } from "./PrimitiveData";
import { PrimitiveDataType } from "./types";

export class StringData extends PrimitiveData<
  PrimitiveDataType.STRING,
  string
> {
  constructor(
    metadata: ConstructorParameters<
      typeof PrimitiveData<PrimitiveDataType.STRING, string>
    >[1]
  ) {
    super(PrimitiveDataType.STRING, metadata);
  }

  isValidValue(rawValue: string): boolean {
    return StringData.isValidValue(rawValue);
  }

  static isValidValue(rawValue: string) {
    return (
      /".*"/.test(rawValue) || /'.*'/.test(rawValue) || /`.*`/.test(rawValue)
    );
  }

  _parseValue(rawValue: string): string {
    return rawValue.slice(1, rawValue.length);
  }
}
