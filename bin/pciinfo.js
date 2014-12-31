#!/usr/bin/env node

var pciinfo = require('../');
var pkg = require('../package.json');
var program = require('commander');

program
  .version(pkg.version)
  .usage('[options]')
  .option('-p, --pci [value]', 'your pci.id file (from https://pci-ids.ucw.cz/)')
  .parse(process.argv);
