import { BaseData, DataMetadata } from "./BaseData";
import { DataType } from "./types";

export class ClassData extends BaseData {
  constructor(metadata: Omit<DataMetadata, "type">) {
    super({
      ...metadata,
      type: DataType.CLASS,
    });
  }
}
