import { Command } from "commander";
import {
	intro,
	select,
	text,
	password,
	spinner,
	note,
	isCancel,
	cancel,
} from "@clack/prompts";
import { store, type VaultEntryData } from "../core/store.js";
import { CryptoEngine } from "../core/crypto.js";
import { CredentialSchema, verifyMasterKey } from "../core/validator.js";
import chalk from "chalk";

export const registerUpdate = (program: Command) => {
	program
		.command("update")
		.alias("up")
		.description("Update an existing credential.")
		.action(async () => {
			intro(chalk.cyan(" Update Data "));
			const entries = store.get("entries") as VaultEntryData[];
			if (!entries || entries.length === 0)
				return console.log(chalk.yellow("Vault is empty."));
			const choice = await select({
				message: "Select credential you want to update.",
				options: entries.map((entry) => ({
					value: entry.id,
					label: `${entry.service} • updated at ${new Date(entry.updatedAt).toLocaleDateString()}`,
				})),
			});
			if (isCancel(choice)) return cancel("Cancelled.");
			const targetEntry = entries.find((entry) => entry.id === choice);
			if (!targetEntry) return console.log(chalk.red("Entry not found."));
			const master = await password({
				message: "Enter Master Key to decrypt current data.",
			});
			if (isCancel(master)) return cancel("Cancelled.");
			if (!verifyMasterKey(master.toString())) {
				return cancel(chalk.red("✗ Invalid Master Key. Credential not saved."));
			}
			let currentData: { account: string; username: string; password: string };
			try {
				const decryptedStr = CryptoEngine.decrypt(
					targetEntry.data,
					master as string,
				);
				currentData = JSON.parse(decryptedStr);
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				return cancel(
					chalk.red(`Invalid Master Key or corrupted data.\n${err}`),
				);
			}
			note(`Leave fields blank to keep current value.`, "Tip");
			const newAccount = await text({
				message: `Account [${chalk.gray(currentData.account)}] `,
				placeholder: "Press Enter to keep current",
			});
			if (isCancel(newAccount)) return cancel("Cancelled.");
			const newUsername = await text({
				message: `Username [${chalk.gray(currentData.username)}] `,
				placeholder: "Press Enter to keep current",
			});
			if (isCancel(newUsername)) return cancel("Cancelled.");
			const newPassword = await password({
				message: `Password [${chalk.gray("********")}] `,
			});
			if (isCancel(newPassword)) return cancel("Cancelled.");
			const finalAccount = (newAccount as string).trim() || currentData.account;
			const finalUsername =
				(newUsername as string).trim() || currentData.username;
			const finalPassword =
				(newPassword as string).trim() || currentData.password;
			try {
				CredentialSchema.parse({
					account: finalAccount,
					username: finalUsername,
					password: finalPassword,
				});
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				return cancel(chalk.red(err));
			}
			const s = spinner();
			s.start("Re-encrypting and updating vault...");
			try {
				const payload = JSON.stringify({
					account: finalAccount,
					username: finalUsername,
					password: finalPassword,
				});
				const newEncryptedData = CryptoEngine.encrypt(payload, master);
				const updateEntries = entries.map((entry) => {
					if (entry.id === targetEntry.id) {
						return {
							...entry,
							updatedAt: new Date().toISOString(),
							data: newEncryptedData,
						};
					}
					return entry;
				});
				store.set("entries", updateEntries);
				s.stop(
					chalk.green(`✓ Credential '${finalAccount}' updated successfully.`),
				);
				note(
					`Stored at: ${chalk.cyan(store.path)}\n` +
						`Encrypted: ${chalk.gray("AES-256-GCM — only decryptable with your Master Key.")}\n`,
					"Updated",
				);
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				s.stop(chalk.red(err));
			}
		});
};
