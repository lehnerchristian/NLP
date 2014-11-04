var http = require('http');
var spawn = require('child_process').spawn;
var NewickParser = require('./NewickParser');
var newickParser = new NewickParser();
var parsedData = [];

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
  if(data.toString().indexOf("ROOT") === -1){
    var json = newickParser.parseToJSON(data.toString());
    parsedData.push(json);
  }
});

child.stderr.on('data', function (data) {
  //console.log('stderr: ' + data);
});

child.on('close', function (code) {
  //console.log('child process exited with code ' + code);
});

http.createServer(function(request, response) {
  response.writeHead(200);
  if(parsedData.length <= 21) {
    response.write("Parsing in progress...");
    response.end();
  }
  response.write(JSON.stringify(parsedData));
  response.end();
}).listen(3000);