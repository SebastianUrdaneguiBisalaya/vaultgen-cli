import { Command } from "commander";
import { intro, password, outro, isCancel, cancel } from "@clack/prompts";
import { store } from "../core/store.js";
import chalk from "chalk";

export const registerInit = (program: Command) => {
    program
        .command("init")
        .alias("i")
        .description("Initialize the local vault")
        .action(async () => {
            intro(chalk.hex("#5D3FD3")(" VaultGen Setup "));
            if (store.get("initialized")) {
                return outro(chalk.yellow("Vault is already initialized at: " + store.path));
            }
            const master = await password({
                message: "Create a Master Key to encrypt your vault."
            });
            if (isCancel(master)) return cancel("Cancelled.");
            store.set("initialized", true);
            store.set("entries", []);
            outro(chalk.green(`✓ Vault successfully created at ${store.path}`));
        })
}