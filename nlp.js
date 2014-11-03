var spawn = require('child_process').spawn;
var NewickParser = require('./NewickParser');
var newickParser = new NewickParser();

var sentences = ["The prime number few.\n", "Fat people eat accumulates.\n", "The cotton clothing is usually made of grows in Mississippi.\n", "Until the police arrest the drug dealers control the street.\n", "The man who hunts ducks out on weekends.\n", "When Fred eats food gets thrown.\n", "Mary gave the child the dog bit a bandaid.\n", "The girl told the story cried.\n", "I convinced her children are noisy.\n", "Helen is expecting tomorrow to be a bad day.\n", "The horse raced past the barn fell.\n", "I know the words to that song about the queen don't rhyme.\n", "She told me a little white lie will come back to haunt me.\n", "The dog that I had really loved bones.\n", "That Jill is never here hurts.\n", "The man who whistles tunes pianos.\n", "The old man the boat.\n", "Have the students who failed the exam take the supplementary.\n", "The raft floated down the river sank.\n", "We painted the wall with cracks.\n", "The tycoon sold the offshore oil tracts for a lot of money wanted to kill JR.\n"];
var child = spawn("java", ["-Xmx1048m", "-jar", "parsers/berkeley/BerkeleyParser-1.7.jar", "-gr", "parsers/berkeley/eng_sm6.gr"]);

child.stdout.on('data', function (data) {
  newickParser.parseToJSON(data.toString());
});

for (var i = 0; i < sentences.length; i++) {
  child.stdin.write(sentences[i]);
}

child.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

child.on('close', function (code) {
  console.log('child process exited with code ' + code);
});
