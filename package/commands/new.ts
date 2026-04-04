import { Command } from "commander";
import {
	intro,
	password,
	text,
	note,
	spinner,
	isCancel,
	cancel,
} from "@clack/prompts";
import { store, type VaultEntryData } from "../core/store.js";
import { CryptoEngine } from "../core/crypto.js";
import { CredentialSchema, analyzePassword, verifyMasterKey } from "../core/validator.js";
import chalk from "chalk";

export const registerNew = (program: Command) => {
	program
		.command("new")
		.alias("n")
		.description("Add a new credential to the vault")
		.action(async () => {
			intro(chalk.cyan(" Add Credential "));
			const service = await text({ message: "Service name (e.g. Netflix)" });
			const account = await text({ message: "Account name (e.g. MyAccount)" });
			const username = await text({ message: "Username (e.g. John Doe)" });
			const pwd = await password({ message: "Password (e.g. 123456)" });
			if (
				isCancel(service) ||
				isCancel(account) ||
				isCancel(username) ||
				isCancel(pwd)
			)
				return cancel("Cancelled.");
			try {
				CredentialSchema.parse({
					service,
					account,
					username,
					password: pwd,
				});
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				return cancel(chalk.red(err));
			}
			const analysis = analyzePassword(pwd.toString());
			if (analysis.isWeak) {
				note(
					`Weak password detected.\n${analysis.suggestion}`,
					"Security Warning",
				);
			}
			const master = await password({ message: "Enter Master Key to encrypt" });
			if (isCancel(master)) return cancel("Cancelled.");
			if (!verifyMasterKey(master.toString())) {
				return cancel(chalk.red("✗ Invalid Master Key. Credential not saved."));
			}
			const s = spinner();
			s.start("Encrypting and saving...");
			try {
				const payload = JSON.stringify({
					account,
					username,
					password: pwd,
				});
				const encryptedData = CryptoEngine.encrypt(payload, master);
				const entries = store.get("entries") as VaultEntryData[] ?? [];
				entries.push({
					id: crypto.randomUUID(),
					service,
					updatedAt: new Date().toISOString(),
					data: encryptedData,
				});
				store.set("entries", entries);
				s.stop(chalk.green("✓ Password successfully encrypted."));
				note(
					`Stored at: ${chalk.cyan(store.path)}\n` +
						`Encrypted: ${chalk.gray("AES-256-GCM — only decryptable with your Master Key.")}\n`,
					"Saved",
				);
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				s.stop(chalk.red(err));
			}
		});
};
