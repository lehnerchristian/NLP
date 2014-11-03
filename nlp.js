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
  this.init();
};

NewickParser.prototype.init = function(){
  this.data = {
    tag: "ROOT",
    parent: "null",
    children: []
  };
}

NewickParser.prototype.parseToJSON = function(newickString) {
  var splitArray = newickString.split(" ");
  this.init();

  // stack of parent nodes
  var parentNodes = [];
  parentNodes.push(this.data);

  for(var i = 0; i < splitArray.length; i++) {
    if(splitArray[i].charAt(0) === "(") {
      var tag = splitArray[i].slice(1);
      parentNodes.push(this.insertChildNode(tag, parentNodes[parentNodes.length - 1]));
    }
    else {
      if(splitArray[i].charAt(splitArray[i].length - 2) === ")" && splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].slice(0, splitArray[i].length - 2);
        parentNodes[parentNodes.length-1].tag += " " + word;
        parentNodes.pop();
        parentNodes.pop();
      }
      else if(splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].slice(0, splitArray[i].length - 1);
        parentNodes[parentNodes.length-1].tag += " " + word;
        parentNodes.pop();
      }
    }
  }
}

NewickParser.prototype.print = function(){
  console.log(JSON.stringify(this.data, null, 2));
}

NewickParser.prototype.insertChildNode = function(tag, parentNode) {
  if(!parentNode.children){
    parentNode.children = [];
  }

  var child = {
    tag: tag
  };

  parentNode.children.push(child);
  return child;
}


var newickParser = new NewickParser();
newickParser.parseToJSON("(NP (NNP The) (NNPS House))");
//newickParser.parseToJSON("( (S (NP (DT The) (NN horse)) (VP (VBD raced) (PP (IN past) (NP (DT the) (NN barn) (NN fell.))))) )");

