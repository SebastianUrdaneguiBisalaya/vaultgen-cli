#!/usr/bin/env node

import { program } from "./cli.js";
import { HEADER } from "./utils/constants.js";
import { registerInit } from "./commands/init.js";
import { registerNew } from "./commands/new.js";
import { registerList } from "./commands/list.js";
import { registerDelete } from "./commands/delete.js";

console.log(HEADER);

registerInit(program);
registerNew(program);
registerList(program);
registerDelete(program);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}