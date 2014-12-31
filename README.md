# IN PROGRESS: NOT COMPLETE

Cross-platform PCI info in nodejs.

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

You will need to install the kext in `bin/darwin/directhw.tgz` for this to work.

Extract the kext, then install with `sudo kextutil DirectHW.kext`. Alternately, you can install the kext using [this method](http://www.macbreaker.com/2012/01/how-to-manually-install-kexts.html). I only have a Hackintosh to test on, so I haven't tested if these work on a actual-Mac.

Eventually, I will [put this in a pkg](https://developer.apple.com/library/mac/documentation/Darwin/Conceptual/KEXTConcept/KEXTConceptPackaging/packaging_tutorial.html) or write code around installing it, so it's automated & get some actual-Mac testing in to see if it works.


### Windows

You should be good-to-go.


### Other Operating systems

`lspci` (from pciutils) needs to be in your path.