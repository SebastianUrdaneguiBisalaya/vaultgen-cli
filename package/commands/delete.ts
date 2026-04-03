import { Command } from "commander";
import { select, isCancel, cancel, confirm } from "@clack/prompts";
import { store, type VaultEntryData } from "../core/store.js";
import chalk from "chalk";

export const registerDelete = (program: Command) => {
    program
        .command("delete")
        .alias("rm")
        .description("Remove a credential from the vault")
        .action(async () => {
            const entries = store.get("entries") as VaultEntryData[];
            if (!entries || entries.length === 0) return console.log(chalk.yellow("Vault is empty."));
            const choice = await select({
                message: "Select credential to delete.",
                options: entries.map((entry) => ({
                    value: entry.id,
                    label: entry.service,
                }))
            });
            if (isCancel(choice)) return cancel("Cancelled.");
            const sure = await confirm({ message: "Are you sure you want to delete this credential?" });
            if (sure) {
                store.set("entries", entries.filter((entry) => entry.id !== choice));
                console.log(chalk.green("✓ Credential successfully deleted."));
            }
        })
}