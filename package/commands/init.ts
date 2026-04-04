import { Command } from "commander";
import { intro, password, outro, isCancel, cancel, note } from "@clack/prompts";
import { store } from "../core/store.js";
import { createVerifier } from "../core/validator.js";
import chalk from "chalk";
import os from "node:os";

export const registerInit = (program: Command) => {
	program
		.command("init")
		.alias("i")
		.description("Initialize the local vault")
		.action(async () => {
			intro(chalk.hex("#FD8000")(" VaultGen Setup "));
			if (store.get("initialized")) {
				return outro(
					chalk.yellow("Vault is already initialized at: " + store.path),
				);
			}
			const master = await password({
				message: "Create a Master Key to encrypt your vault.",
			});
			if (isCancel(master)) return cancel("Cancelled.");
			createVerifier(master.toString());
			store.set("initialized", true);
			store.set("entries", []);
			note(
				`Vault file: ${chalk.cyan(store.path)}\n` +
					`Platform: ${chalk.gray(os.platform())} (${chalk.gray(os.arch())})\n\n` +
					`${chalk.yellow("Your Master Key is never stored anywhere.")}\n` +
					`${chalk.yellow("If you lose it, your credentials cannot be recovered.")}`,
				"Vault created",
			);
			outro(
				chalk.green(
					"✓ Ready. Run 'vaultgen new' to add your first credential.",
				),
			);
		});
};
