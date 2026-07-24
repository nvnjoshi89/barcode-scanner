import * as bcrypt from 'bcrypt';

export async function hashPassword({ password }: { password: string }) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword({
  password,
  hashed,
}: {
  password: string;
  hashed: string;
}) {
  return await bcrypt.compare(password, hashed);
}
