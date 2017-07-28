#! /usr/bin/env node

/* eslint no-console: 0 */

const yargs = require("yargs");
const createCLI = require("..").default;

createCLI(yargs, console.log.bind(console));
