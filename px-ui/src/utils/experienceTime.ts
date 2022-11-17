import { Experience } from "@gql/generated";
import { differenceInDays } from "date-fns";

export const getTimeBetweenInExperience = (
  startDate: Date,
  endDate: Date
): string => {
  const days = endDate
    ? differenceInDays(endDate, startDate)
    : differenceInDays(startDate, new Date());
  return daysFmt(days);
};

export const getTotalTimeInOrganizationByExperiences = (
  experiences: Experience[]
) => {
  const days = experiences.reduce(
    (prev, e) =>
      prev +
      differenceInDays(
        e.endDate ? new Date(e.endDate) : new Date(),
        new Date(e.startDate)
      ),
    0
  );
  return daysFmt(days);
};

const daysFmt = (days: number) => {
  const years = Math.floor(days / 365);
  const months = Math.floor((days - years * 365) / 30);
  const d = Math.round(days - years * 365 - months * 30);

  let res = [];
  if (years > 0) {
    res.push(years + " years");
  }
  if (months > 0) {
    res.push(months + " months");
  }
  if (d > 0 && months <= 0) {
    res.push("1 month");
  }

  return res.join(" ");
};
