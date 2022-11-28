export const extractJwtFromHeader = (header: string) => {
  const token = header.split("Bearer ")[1];
  return token;
};
