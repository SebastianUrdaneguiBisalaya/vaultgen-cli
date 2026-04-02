#!/usr/bin/env node

import { program } from "./cli.js";
import { HEADER } from "./utils/constants.js";

console.log(HEADER);

program.parse();