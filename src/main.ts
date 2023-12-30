#! /usr/bin/env node

import { spawn } from "child_process";
import { attachLogger } from "./logger";

const { program } = require('commander');

const teste = spawn('node teste.js', { shell: true });
attachLogger(teste);

program.parse();
