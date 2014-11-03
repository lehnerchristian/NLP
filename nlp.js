var spawn = require('child_process').spawn;
var NewickParser = require('./NewickParser');
var newickParser = new NewickParser();

var sentences = [
  "The horse raced past the barn fell.\n",
  "The cotton clothing is usually made of grows in Mississippi.\n"
];

var child = spawn("java", ["-Xmx1048m", "-jar", "parsers/berkeley/BerkeleyParser-1.7.jar", "-gr", "parsers/berkeley/eng_sm6.gr"]);

child.stdout.on('data', function (data) {
  console.log(data.toString());
  newickParser.parseToJSON(data.toString());

});

for(var i = 0; i < sentences.length; i++) {
  child.stdin.write(sentences[i]);
}


child.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

child.on('close', function (code) {
  console.log('child process exited with code ' + code);
});
