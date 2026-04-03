import { Command } from "commander";
import { select, isCancel, cancel, confirm, password } from "@clack/prompts";
import { store, type VaultEntryData } from "../core/store.js";
import { CryptoEngine } from "../core/crypto.js";
import chalk from "chalk";

export const registerDelete = (program: Command) => {
	program
		.command("delete")
		.alias("rm")
		.description("Remove a credential from the vault")
		.action(async () => {
			const entries = store.get("entries") as VaultEntryData[];
			if (!entries || entries.length === 0)
				return console.log(chalk.yellow("Vault is empty."));
			const choice = await select({
				message: "Select credential to delete.",
				options: entries.map((entry) => ({
					value: entry.id,
					label: entry.service,
				})),
			});
			if (isCancel(choice)) return cancel("Cancelled.");
			const sure = await confirm({
				message: "Are you sure you want to delete this credential?",
			});
			if (isCancel(sure) || !sure) return cancel("Cancelled.");
			const master = await password({
				message: "Enter Master Key to confirm deletion.",
			});
			if (isCancel(master)) return cancel("Cancelled.");
			const target = entries.find((entry) => entry.id === choice);
			if (!target) return console.log(chalk.red("Entry not found."));
			try {
				CryptoEngine.decrypt(target.data, master);
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				return cancel(
					chalk.red(`Invalid Master Key or corrupted data.\n${err}`),
				);
			}
			store.set(
				"entries",
				entries.filter((entry) => entry.id !== choice),
			);
			console.log(chalk.green("✓ Credential successfully deleted."));
		});
};
