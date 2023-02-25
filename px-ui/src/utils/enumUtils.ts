import { capitalizeFirstLetter } from "./capitalizeString";

export const prettyEnumValue = <T extends string>(
  value: T,
  delimiter = "_",
  join = " "
) => capitalizeFirstLetter(value.toLowerCase().split(delimiter).join(join));

export const prettyEnumValueCompanySize = <T extends string>(
  value: T,
  delimiter = "_",
  join = " "
) =>
  capitalizeFirstLetter(
    value
      .toLowerCase()
      .split(delimiter)
      .map((v, idx) => {
        if (idx === 1 && idx !== value.split(delimiter).length - 1)
          return v + " to";
        return v;
      })
      .join(join)
  );
