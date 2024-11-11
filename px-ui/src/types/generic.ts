import { BaseEntity } from "@gql/generated";

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type RecursiveRequired<T> = {
  [P in keyof T]: T[P] extends object | undefined
    ? RecursiveRequired<Required<T[P]>>
    : T[P];
};
