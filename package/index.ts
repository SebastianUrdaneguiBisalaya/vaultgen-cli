#!/usr/bin/env node

import { program } from "./cli.js";
import { HEADER } from "./utils/constants.js";

console.log(HEADER);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}