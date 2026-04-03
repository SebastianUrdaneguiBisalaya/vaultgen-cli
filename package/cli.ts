import { Command } from "commander";

export const program = new Command()
	.name("vaultgen")
	.version("1.0.0")
	.showSuggestionAfterError(true)
	.showHelpAfterError("(add --help to show all options)")
	.allowUnknownOption(false);
