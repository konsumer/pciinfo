# pciinfo

Cross-platform PCI info in nodejs.

[![npm](https://nodei.co/npm/pciinfo.png)](https://www.npmjs.com/package/pciinfo)
[![Build Status](https://travis-ci.org/konsumer/pciinfo.svg?branch=master)](https://travis-ci.org/konsumer/pciinfo)
[![Code Climate](https://codeclimate.com/github/konsumer/pciinfo/badges/gpa.svg)](https://codeclimate.com/github/konsumer/pciinfo)

## usage

```javascript
var pciinfo = require('pciinfo');

pciinfo(function(error, info){
	if (error) throw error;
	console.log(info);
});
```

I also included a CLI util. `pciinfo` will give you a nice JSON list of your PCI devices.


## installation

`npm install --save pciinfo`

If you want `pciinfo` in your path, do `npm install -g pciinfo`. Both utils have a `--help` flag, so you can learn more about how they work.


### OSX

You will need to install `bin/DirectHW.pkg` for this to work. It will install DirectHW.kext in your system directory.


### Windows

You should be good-to-go.


### Other Operating Systems

`lspci` (from pciutils) needs to be in your path.
