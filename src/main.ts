#! /usr/bin/env node

import { spawn } from "child_process";
import Logger from "./models/Logger";

const { program } = require('commander');

const teste = spawn('node teste.js', { shell: true });
const testeLogger = new Logger(teste, { logMetaEvents: true });
testeLogger.enable();

program.parse();
