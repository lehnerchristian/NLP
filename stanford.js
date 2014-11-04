var http = require('http');
var spawn = require('child_process').spawn;
var NewickParser = require('./NewickParser');
var newickParser = new NewickParser();
var parsedData = [];

var result = "";

var parse = function (data) {
  var json = newickParser.parseToJSON(data);
  parsedData.push(json);
}

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

child.stdout.on('data', function (buffer) {
  console.log("ON");
  var data = buffer.toString();

  if (data.indexOf("ROOT") !== -1) {
    data = data.slice(5);
  }

  result += data;
  if ( data.indexOf(".)))") > -1) {
    console.log("RESULT");
    parse(result);
    result = "";
  }
});

child.stderr.on('data', function (data) {
  //console.log('stderr: ' + data);
});

child.on('close', function (code) {
  //console.log('child process exited with code ' + code);
});

http.createServer(function (request, response) {
  response.writeHead(200);
  response.write(JSON.stringify(parsedData));
  response.end();
}).listen(3000);