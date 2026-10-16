import type { components } from "./schema/types";

type CamelCase<S extends string> = S extends `${infer P}_${infer R}`
  ? `${P}${Capitalize<CamelCase<R>>}`
  : S;

type Camelize<T> = T extends readonly (infer U)[]
  ? Camelize<U>[]
  : T extends object
    ? { [K in keyof T as K extends string ? CamelCase<K> : K]: Camelize<T[K]> }
    : T;

export type Schema<T extends keyof components["schemas"]> = Camelize<components["schemas"][T]>;
