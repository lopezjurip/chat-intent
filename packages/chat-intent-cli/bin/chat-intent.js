#! /usr/bin/env node

/* eslint no-console: 0 */

const yargs = require("yargs");
const createCLI = require("..").default;

const print = console.log.bind(console);

createCLI(yargs, print).demandCommand().help().wrap(72).argv;
