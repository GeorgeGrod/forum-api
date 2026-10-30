import argon2 from 'argon2';

export async function hashPassword(password: string){
    const pepper = process.env.PEPPER
    if (!pepper) throw new Error("pepper not found")
    const pepperBuffer = Buffer.from(pepper)
    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
        secret: pepperBuffer
    });
    return hash
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const pepper = process.env.PEPPER;
  if (!pepper) throw new Error("pepper not found");
  return argon2.verify(hash, password, {
    secret: Buffer.from(pepper),
  });
}