# IN PROGRESS: NOT COMPLETE

Cross-platform PCI info in nodejs.

[![Code Climate](https://codeclimate.com/github/konsumer/pciinfo/badges/gpa.svg)](https://codeclimate.com/github/konsumer/pciinfo)

## usage

```javascript
var pciinfo = require('pciinfo');

pciinfo(function(error, info){
	if (error) throw error;
	console.log(info);
});
```

If you want a list of hackintosh driver suggestions, you can do this:

```javascript
pciinfo.hackintosh(function(error, info){
	if (error) throw error;
	console.log(info);
});
```

I also included 2 CLI utils. `pciinfo` will give you a nice JSON list of your PCI devices, and `hackintoshdrivers` will find hackintosh kexts to support your hardware & download them.


## installation

`npm install --save pciinfo`

If you want `pciinfo` & `hackintoshdrivers` in your path, do `npm install -g pciinfo`. Both utils have a `--help` flag, so you can learn more about how they work.


### OSX

You will need to install `bin/DirectHW.pkg` for this to work. It will install DirectHW.kext in your system directory.


### Windows

You should be good-to-go.


### Other Operating Systems

`lspci` (from pciutils) needs to be in your path.
