export const truncate = (input: string, size = 5) =>
  input.length > size ? `${input.substring(0, size)}...` : input;
