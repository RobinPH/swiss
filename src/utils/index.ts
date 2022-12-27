import { CheckResult, MakeCheckSubResult } from "../FiniteAutomata";

export const pick = <
  T extends CheckResult<string, any>,
  V extends T extends CheckResult<infer Value, any> ? Value : never
>(
  result: T,
  value: V
) => {
  type Children = T extends CheckResult<any, infer Children> ? Children : never;

  return {
    ...result,
    subValues: result.subValues.filter((subValue) => {
      subValue.value === value;
    }) as MakeCheckSubResult<V, Children>,
    value: result.value as V,
  };
};
