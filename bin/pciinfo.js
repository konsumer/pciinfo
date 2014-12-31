#!/usr/bin/env node

var pciinfo = require('../');
var pkg = require('../package.json');
var program = require('commander');
var fs = require('fs');

program
  .version(pkg.version)
  .usage('[options]')
  .option('-p, --pci [value]', 'your pci.ids.gz file (from https://pci-ids.ucw.cz/)')
  .parse(process.argv);

if (!program.pci){
	try{
		program.pci = fs.realpathSync(__dirname + '/pci.ids.gz');
	}catch(e){
		console.log('You need to download pci.ids.gz from https://pci-ids.ucw.cz/ and put it in ' + __dirname);
		process.exit(1);
	}
}

pciinfo(function(error, info){
    if (error) throw error;
    console.log(JSON.stringify(info, null, 2));
}, program.pci);
