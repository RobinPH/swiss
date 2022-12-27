export type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<
  Pick<T, Extract<keyof T, K>>
> &
  Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

export interface Cloneable {
  clone(): this;
}

type HeadCharacterOf<T extends string> = T extends `${infer FC}${string}`
  ? FC
  : never;
type TailCharactersOf<T extends string> =
  T extends `${HeadCharacterOf<T>}${infer RC}` ? Characters<RC> : never;
export type Characters<T extends string> = T extends ""
  ? []
  : [HeadCharacterOf<T>, ...TailCharactersOf<T>];
