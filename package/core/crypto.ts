import {
	randomBytes,
	createCipheriv,
	createDecipheriv,
	scryptSync,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LEN = 32;

export interface EncryptedData {
	content: string;
	iv: string;
	salt: string;
	tag: string;
}

export const CryptoEngine = {
	deriveKey(masterKey: string, salt: Buffer): Buffer {
		return scryptSync(masterKey, salt, KEY_LEN, { N: 16384, r: 8, p: 1 });
	},
	encrypt(text: string, masterKey: string): EncryptedData {
		const salt = randomBytes(32);
		const iv = randomBytes(12);
		const key = this.deriveKey(masterKey, salt);
		const cipher = createCipheriv(ALGORITHM, key, iv);
		const encrypted = Buffer.concat([
			cipher.update(text, "utf8"),
			cipher.final(),
		]);
		return {
			content: encrypted.toString("hex"),
			iv: iv.toString("hex"),
			salt: salt.toString("hex"),
			tag: cipher.getAuthTag().toString("hex"),
		};
	},
	decrypt(data: EncryptedData, masterKey: string): string {
		const key = this.deriveKey(masterKey, Buffer.from(data.salt, "hex"));
		const decipher = createDecipheriv(
			ALGORITHM,
			key,
			Buffer.from(data.iv, "hex"),
		);
		decipher.setAuthTag(Buffer.from(data.tag, "hex"));
		const decrypted = Buffer.concat([
			decipher.update(Buffer.from(data.content, "hex")),
			decipher.final(),
		]);
		return decrypted.toString("utf8");
	},
};
