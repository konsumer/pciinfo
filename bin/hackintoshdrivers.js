#!/usr/bin/env node

'use strict';

var pciinfo = require('../');
var pkg = require('../package.json');
var program = require('commander');
var fs = require('fs');
var exec = require('child_process').exec;

exec('sw_vers -productVersion', function (err, version) {
  if (err) throw err;
  version = version.split('.').slice(0, -1).join('.');
  program
    .usage('[options]')
    .option('-p, --pci [value]', 'your pci.id file')
    .option('-n, --nodownload', 'Don\'t download kexts')
    .option('-o, --out [directory]', 'Download directory [current]')
    .option('-v, --osx [version]', 'OSX version ['+version+']')
    .parse(process.argv);

  program.osx = program.osx || version;

  pciinfo.hackintosh(function(error, info){
    if (error) throw error;
    console.log(JSON.stringify(info, null, 2));
    fs.realpath(program.out || process.cwd(), function(err, outDir){
      if (err) throw err;
      // TODO: download files
      console.log(JSON.stringify(info, null, 2));
    });
  }, program.pci, program.osx);
});

