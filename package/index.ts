#!/usr/bin/env node

import { program } from "./cli.js";
import { HEADER } from "./utils/constants.js";
import { registerInit } from "./commands/init.js";
import { registerNew } from "./commands/new.js";
import { registerList } from "./commands/list.js";
import { registerDelete } from "./commands/delete.js";
import { registerUpdate } from "./commands/update.js";
import { registerAudit } from "./commands/audit.js";
import { registerReset } from "./commands/reset.js";

registerInit(program);
registerNew(program);
registerList(program);
registerDelete(program);
registerUpdate(program);
registerAudit(program);
registerReset(program);

if (!process.argv.slice(2).length) {
    console.log(HEADER);
    program.outputHelp();
    process.exit(0);
}

program.parse(process.argv);
