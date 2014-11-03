var spawn = require('child_process').spawn;
var NewickParser = require('./NewickParser');
var newickParser = new NewickParser();

var child = spawn("java", [
  "-mx1024m",
  "-cp",
  "./parsers/stanford/*",
  "edu.stanford.nlp.parser.lexparser.LexicalizedParser",
  "-outputFormat",
  "penn",
  "edu/stanford/nlp/models/lexparser/englishFactored.ser.gz",
  "./parsers/stanford/input.txt"
]);

child.stdout.on('data', function (data) {
  console.log(data.toString());
  newickParser.parseToJSON(data.toString());
});

child.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

child.on('close', function (code) {
  console.log('child process exited with code ' + code);
});
