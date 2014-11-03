var spawn = require('child_process').spawn;

var sentences = ["Das ist ein Test\n", "Das hier auch.\n"];

var child = spawn("java", ["-Xmx1048m", "-jar", "parsers/berkeley/BerkeleyParser-1.7.jar", "-gr", "parsers/berkeley/eng_sm6.gr"]);

child.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
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


// =============
// Newick Parser
// =============

var NewickParser = function() {
  this.data = {
    tag: "ROOT",
    parent: "null",
    children: []
  };

  this.characters = [];
  this.nodes = [];


  // ( (S (NP (DT The) (NN horse)) (VP (VBD raced) (PP (IN past) (NP (DT the) (NN barn) (NN fell.))))) )
  this.newickTags = [
    "S",
    "NP",
    "DT",
    "NN",
    "VP",
    "VBD",
    "PP",
    "IN",
    "NP",
    "DT"
  ];
}

NewickParser.prototype.parseToJSON = function(newickString) {

  var splitArray = newickString.split(" ");
  var openParentheses = 0;

  var children = this.data.children;

  var parentNode = this.data.tag;

  for(var i = 0; i < splitArray.length; i++) {
    if(splitArray[i].charAt(0) === "(") {
      var tag = splitArray[i].slice(1);
      
      this.insertChildNode(tag, children);
    }
    else {

    }
  }

  console.log(this.data.children);


  /*
  for(var i = 0; i < splitArray.length; i++) {
    if(splitArray[i].length > 1 && splitArray[i].charAt(0) == "(") {
      ++openParentheses;

      splitArray[i] = splitArray[i].slice(1);
      this.insertChildNode(splitArray[i], parentNode, children);



    }
    else if(splitArray[i].charAt(splitArray[i].length) == ")") {
      parentNode = splitArray[i];
    }

  }
  */

}

NewickParser.prototype.insertChildNode = function(tag, children) {

  children.push(tag);
  console.log("Tag: " + tag);

  /*
  console.log("Parent: " + parentNode);
  console.log("Children: " + JSON.stringify(children));

  var child = {
    tag: tag,
    parent: parentNode,
    children: []
  };

  children.push(child);
  */
  /*
  if(node && node.length !== 0) {
    node.push(child);
  }
  else if(node) {
    // node immer das gleiche???
    this.insertChildNode(tag, parentNode, node);
  }
  */
}


var newickParser = new NewickParser();
newickParser.parseToJSON("(NP (NNP The) (NNPS House))");
//newickParser.parseToJSON("( (S (NP (DT The) (NN horse)) (VP (VBD raced) (PP (IN past) (NP (DT the) (NN barn) (NN fell.))))) )");

