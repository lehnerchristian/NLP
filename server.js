// http://nodejs.org/api.html#_child_processes
var sys = require('sys')
var exec = require('child_process').exec;
var child;

child = exec("java -jar parsers/berkeley/BerkeleyParser-1.7.jar -gr parsers/berkeley/eng_sm6.gr", function (error, stdout, stderr) {
  sys.print('stdout: ' + stdout);
  sys.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

setTimeout(function () {
  child.stdin.write("Das ist ein Text\n");
  child.stdin.setEncoding = 'utf-8';
  child.stdout.pipe(process.stdout);

  child.stdout.on('data', function (data) {
    console.log(data.toString());
  });
}, 100);