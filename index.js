var fs = require('fs');
var exec = require('child_process').exec;

var lspcicmd = 'lspci';

if (process.platform == 'darwin'){
	lspcicmd = fs.realpathSync(__dirname + '/bin/darwin/lspci');
}

if (process.platform == 'win32'){
	lspcicmd = fs.realpathSync(__dirname + '/bin/win32/lspci.exe');
}

// discuss at: http://phpjs.org/functions/escapeshellarg/
function escapeshellarg(arg) {
  var ret = '';
  ret = arg.replace(/[^\\]'/g, function(m, i, s) {
    return m.slice(0, 1) + '\\\'';
  });
  return "'" + ret + "'";
}

function pciinfo(cb, pciid){
	pciid = pciid || __dirname + '/bin/pci.ids.gz';
	pciid = fs.realpathSync(pciid);
	var cmd = lspcicmd + ' -vv -mm -nn -i ' + escapeshellarg(pciid);
	exec(cmd, function (error, stdout, stderr) {
		if (error) return cb(error);
		if (stderr) return cb(stderr);
		cb(null, stdout.trim().split('\n\n').map(function(pci_device){
			var out = {};
			pci_device.split('\n').forEach(function(param){
				var info = param.split(':\t');
				out[ info[0].toLowerCase() ] = info[1];
			});

			['vendor', 'device', 'class', 'svendor', 'sdevice'].forEach(function(key){
				if (out[key]){
					var m = out[key].match(/(.+) \[([0-f]{4})\]/);
					out[key + '_id'] = m.pop();
					out[key] = m.pop();
				}
			});

			return out;
		}));
	});
}

function hackintosh(cb, pciid){
	pciinfo(function(err, info){
		if (err) return cb(err);

	}, pciid);
}


module.exports = pciinfo;
module.exports.hackintosh = hackintosh;
