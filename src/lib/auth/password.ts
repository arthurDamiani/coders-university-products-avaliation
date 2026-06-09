import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(plainPassword: string) {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(plainPassword, salt);

	return { hashedPassword, salt };
}

export async function comparePassword(
	plainPassword: string,
	hashedPassword: string,
) {
	return bcrypt.compare(plainPassword, hashedPassword);
}
