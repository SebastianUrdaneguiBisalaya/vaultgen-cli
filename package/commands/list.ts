import { Command } from "commander";
import { select, password, note, isCancel, cancel } from "@clack/prompts";
import { store, type VaultEntryData } from "../core/store.js";
import { CryptoEngine } from "../core/crypto.js";
import { verifyMasterKey } from "../core/validator.js";
import clipboard from "clipboardy";
import chalk from "chalk";

export const registerList = (program: Command) => {
	program
		.command("list")
		.alias("ls")
		.description("List all credentials in the vault and copy to clipboard.")
		.action(async () => {
			const entries = store.get("entries") as VaultEntryData[];
			if (!entries || entries.length === 0)
				return console.log(chalk.yellow("Vault is empty."));
			const choice = await select({
				message: "Select a service to copy its password to clipboard",
				options: entries.map((entry) => ({
					value: entry,
					label: `${entry.service} • updated at ${new Date(entry.updatedAt).toLocaleDateString()}`,
				})),
			});
			if (isCancel(choice)) return cancel("Cancelled.");
			const master = await password({ message: "Enter Master Key to decrypt" });
			if (isCancel(master)) return cancel("Cancelled.");
			if (!verifyMasterKey(master.toString())) {
				return cancel(chalk.red("✗ Invalid Master Key. Credential not saved."));
			}
			try {
				const entry = choice as VaultEntryData;
				const decryptedData = CryptoEngine.decrypt(entry.data, master);
				const { password: plainPassword } = JSON.parse(decryptedData);
				clipboard.writeSync(plainPassword);
				note("Copied to clipboard - clears in 30s.", "Success");
				setTimeout(() => {
					try {
						const current = clipboard.readSync();
						if (current === plainPassword) {
							clipboard.writeSync("");
						}
					} catch {}
				}, 30000);
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				cancel(chalk.red(`Invalid Master Key or corrupted data.\n${err}`));
			}
		});
};
