'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var bluebird = require('bluebird');
var request = bluebird.promisify(require('request'));

var lspcicmd = 'lspci';

var osMap = {
  1: '10.5', // Leopard
  2: '10.6', // Snow Leopard
  3: '10.7', // Lion
  4: '10.8', // Mountain Lion
  5: '10.9', // Mavericks
  6: '10.10' // Yosemite
};

if (process.platform === 'darwin'){
  lspcicmd = fs.realpathSync(__dirname + '/bin/darwin/lspci');
}

if (process.platform === 'win32'){
  lspcicmd = fs.realpathSync(__dirname + '/bin/win32/lspci.exe');
}

// discuss at: http://phpjs.org/functions/escapeshellarg/
function escapeshellarg(arg) {
  var ret = '';
  ret = arg.replace(/[^\\]'/g, function(m) {
    return m.slice(0, 1) + '\\\'';
  });
  return '\'' + ret + '\'';
}

function pciinfo(cb, pciid){
  pciid = pciid || __dirname + '/bin/pci.ids.gz';
  fs.realpath(pciid, function(err, pciid){
    if (err) return cb(err);
    var cmd = lspcicmd + ' -vv -mm -nn -i ' + escapeshellarg(pciid);
    exec(cmd, function (err, stdout, stderr) {
      if (err) return cb(err);
      if (stderr) return cb(stderr);
      cb(null, stdout.trim().split('\n\n').map(function(pciDevice){
        var out = {};
        pciDevice.split('\n').forEach(function(param){
          var info = param.split(':\t');
          out[ info[0].toLowerCase() ] = info[1];
        });
        ['vendor', 'device', 'class', 'svendor', 'sdevice']
          .forEach(function(key){
            if (out[key]){
              var m = out[key].match(/(.+) \[([0-f]{4})\]/);
              out[key + 'Id'] = m.pop();
              out[key] = m.pop();
            }
          });
        return out;
      }));
    });
  });
}


function info2data(cb, pciid, os){
  pciinfo(function(err, info){
    if (err) return cb(err);
    bluebird.all(info.map(function(pciDevice){
      return request('http://olarila.com/' +
        'kexts/kexts/kextsearch.php?' +
        'cid=2&version=1&srch=' + pciDevice.vendorId);
    }))
    .then(function(res){
      res.forEach(function(r,i){
        info[i].kext = r[1].trim().split('\n')
          .filter(function(l){
            return l !== '';
          })
          .map(function(l){
            var r = l.split('|');
            var out = {
              id: parseInt(r[0]),
              os: osMap[ r[1] % 10 ],
              name: r[2],
              kname: r[3]
            };
            return out;
          })
          .filter(function(out){
            return out.os === os;
          });
      });
      cb(null, info.filter(function(pciDevice){
        return pciDevice.kext.length > 0;
      }));
    }, cb);
  }, pciid);
}

function hackintosh(cb, pciid, os){
  info2data(function(err, info){
    if (err) return cb(err);
    info.forEach(function(pciDevice){
      var promises = [];
      pciDevice.kext.forEach(function(kext){
        promises.push(request('http://olarila.com/kexts/kexts/downloads.php?kname='+kext.kname).then(function(res){
          kext.downloads = res[1].trim().split('\n').map(function(l){
            var lr = l.split('|');
              return {
                url: 'http://olarila.com' + lr[0],
                version: lr[1],
                description: lr[2]
              };
          });
        }));
      });
      bluebird.all(promises).then(function(ok){
        cb(null, ok);
      } , cb);
    });
  }, pciid, os);
}

module.exports = pciinfo;
module.exports.hackintosh = hackintosh;
