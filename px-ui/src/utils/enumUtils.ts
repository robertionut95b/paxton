import { capitalizeFirstLetter } from "./capitalizeString";

export const prettyEnumValue = <T extends string>(value: T, delimiter = "_") =>
  capitalizeFirstLetter(value.toLowerCase().split(delimiter).join(" "));
