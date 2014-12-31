#!/usr/bin/env node

var pciinfo = require('../');
var pkg = require('../package.json');
var program = require('commander');

program
  .version(pkg.version)
  .usage('[options]')
  .option('-p, --pci [value]', 'your pci.id file (from https://pci-ids.ucw.cz/)')
  .option('-i, --info', 'Just get info on hackintosh kexts, don\'t actually download them')
  .option('-o, --out [directory]', 'Download the kexts to this directory (defaults to current)')
  .parse(process.argv);