import { Command } from "commander";

export const program = new Command()
  .name("vaultgen")
  .description("A minimalist, terminal-based password manager.")
  .version("1.0.0")
  .showSuggestionAfterError(true)
  .showHelpAfterError("(add --help to show all options)")
  .allowUnknownOption(false);
