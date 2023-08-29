export const displayInitials = (
  fallback: string,
  firstName?: string,
  lastName?: string
) =>
  firstName && lastName
    ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
    : fallback?.[0].toUpperCase();
