var exec = require('child_process').exec
var fs = require('fs')

// escape arguments for the shell
// discuss at: http://phpjs.org/functions/escapeshellarg/
function escapeshellarg (arg) {
  return "'" + arg.replace(/[^\\]'/g, function (m) {
      return m.slice(0, 1) + "\'"
    }) + "'"
}

function parsepciline (str) {
  var re = /([0-f:\.]+) (.+) \[([0-f]+)\]: (.+) \[([0-f]+)\] (.+)/g
  var m
  var out
  while ((m = re.exec(str)) !== null) {
    out = m.slice(1)
  }
  if (out) {
    out[4] = out[4].split(':')
    return {
      vendor: out[4][0],
      device: out[4][1],
      class: out[2],
      svendor: out[3] + out[5],
      sdevice: out[1]
    }
  }
}

var lspcicmd = 'lspci'

if (process.platform === 'darwin') {
  lspcicmd = fs.realpathSync(__dirname + '/bin/darwin/dspci')
}

if (process.platform === 'win32') {
  lspcicmd = fs.realpathSync(__dirname + '/bin/win32/lspci.exe')
}

function pciinfo (cb, pciid) {
  pciid = pciid || __dirname + '/bin/pci.ids.gz'
  fs.realpath(pciid, function (err, pciid) {
    if (err) return cb(err)
    var cmd = lspcicmd + ' -i ' + escapeshellarg(pciid)
    exec(cmd, function (err, stdout, stderr) {
      if (err) return cb(err)
      if (stderr) return cb(stderr)
      cb(null, stdout.trim().split('\n').map(parsepciline).filter(function (p) { return p }))
    })
  })
}

module.exports = pciinfo
