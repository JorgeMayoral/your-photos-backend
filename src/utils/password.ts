import bcrypt from "bcryptjs";

export const hashPassword = (plainTextPassword: string): string => {
  const hashedPassword = bcrypt.hashSync(plainTextPassword, 10);

  return hashedPassword;
};

export const checkPassword = (
  plainTextPassword: string,
  hashedPassword: string
): boolean => {
  const result = bcrypt.compareSync(plainTextPassword, hashedPassword);

  return result;
};
