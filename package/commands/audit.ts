import { Command } from "commander";
import { password, isCancel, cancel, spinner } from "@clack/prompts";
import { store, type VaultEntryData } from "../core/store.js";
import { CryptoEngine } from "../core/crypto.js";
import chalk from "chalk";
import { analyzePassword, verifyMasterKey } from "../core/validator.js";

export const registerAudit = (program: Command) => {
	program
		.command("audit")
		.alias("a")
		.description("Analyze all credentials for security vulnerabilities.")
		.action(async () => {
			const entries = store.get("entries") as VaultEntryData[];
			if (!entries || entries.length === 0)
				return console.log(chalk.yellow("Vault is empty."));
			const master = await password({
				message: "Enter Master Key to begin audit",
			});
			if (isCancel(master)) return cancel("Cancelled.");
			if (!verifyMasterKey(master.toString())) {
				return cancel(chalk.red("✗ Invalid Master Key. Credential not saved."));
			}
			const s = spinner();
			s.start("Auditing vault...");
			let weakCount = 0;
			const report: string[] = [];
			try {
				for (const entry of entries) {
					const decryptedStr = CryptoEngine.decrypt(entry.data, master);
					const { password: plainPassword } = JSON.parse(decryptedStr);
					const analysis = analyzePassword(plainPassword);
					if (analysis.isWeak) {
						weakCount++;
						report.push(
							`${chalk.red("✗")} ${entry.service}: Weak (Score: ${analysis.score}/5`,
						);
					} else {
						report.push(
							`${chalk.green("✓")} ${entry.service}: Strong (Score: ${analysis.score}/5`,
						);
					}
				}
				s.stop(chalk.cyan("Audit complete."));
				console.log("\n" + chalk.bold("Security Report"));
				report.forEach((line) => console.log(line));
				if (weakCount > 0) {
					console.log(
						`\n${chalk.yellow(`Warning: You have ${weakCount} weak password.`)}`,
					);
					console.log(chalk.red("Universal pattern: 12+ chars, mix of A-Z, a-z, 0-9, and symbols (!@#$%^&*)"))
				}
			} catch (error: unknown) {
				const err =
					error instanceof Error ? error.message : "Something went wrong.";
				s.stop(chalk.red(`Decryption failed. Invalid Master Key.\n${err}`));
			}
		});
};
