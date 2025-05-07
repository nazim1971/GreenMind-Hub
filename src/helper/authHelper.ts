import bcrypt from 'bcrypt';

export const isPasswordMatched = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const isTIssuedBeforePassC = async (
  passwordChangedAt: Date,
  jwtIssuedAt: number
): Promise<boolean> => {
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;
  return passwordChangedTime > jwtIssuedAt;
};