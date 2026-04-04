import { Command } from "commander";
import {
	intro,
	password,
	outro,
	isCancel,
	cancel,
	note,
	confirm,
} from "@clack/prompts";
import { store } from "../core/store.js";
import chalk from "chalk";
import fs from "node:fs";
import { verifyMasterKey } from "../core/validator.js";

export const registerReset = (program: Command) => {
	program
		.command("reset")
		.alias("r")
		.description(
			"Completely wipe the vault — all credentials, metadata and config.",
		)
		.action(async () => {
			intro(chalk.red(" Reset Vault "));
			if (!store.get("initialized")) {
				return outro(chalk.yellow("Vault is not initialized yet."));
			}
			note(
				`This will permanently delete:\n` +
					` • All saved credentials\n` +
					` • All saved metadata\n` +
					` • The vault file at ${chalk.gray(store.path)}\n` +
					`This action cannot be undone.`,
				"⚠ Warning",
			);
			const sure = await confirm({
				message: "Are you absolutely sure you want to wipe the vault?",
			});
			if (isCancel(sure) || !sure) return cancel("Cancelled.");
			const master = await password({
				message: "Enter Master Key to confirm deletion.",
			});
			if (isCancel(master)) return cancel("Cancelled.");
			if (!verifyMasterKey(master.toString())) {
				return cancel(chalk.red("✗ Invalid Master Key. Credential not saved."));
			}
			try {
				fs.unlinkSync(store.path);
				outro(
					chalk.green(
						"✓ Vault completely wiped. Run 'vaultgen init' to start fresh.",
					),
				);
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				cancel(chalk.red(`Failed to delete vault file.\n${err}`));
			}
		});
};
