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

}

NewickParser.prototype.parseToJSON = function(newickString) {

  var splitArray = newickString.split(" ");


  // stack of parent nodes
  var parentNodes = [];
  parentNodes.push(this.data);

  for(var i = 0; i < splitArray.length; i++) {
    if(splitArray[i].charAt(0) === "(") {
      var tag = splitArray[i].slice(1);

      parentNodes.push(this.insertChildNode(tag, parentNodes[parentNodes.length - 1], parentNodes[parentNodes.length - 1].children));

    }
    else {
      if(splitArray[i].charAt(splitArray[i].length - 2) === ")" && splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].slice(0, splitArray[i].length - 2);
        parentNodes[parentNodes.length-1].word = word;
        parentNodes.pop();
        parentNodes.pop();
        console.log(word);
      }
      else if(splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].slice(0, splitArray[i].length - 1);
        parentNodes[parentNodes.length-1].word = word;
        console.log(word);
        parentNodes.pop();
      }
    }
  }

  console.log(JSON.stringify(this.data.children));


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

NewickParser.prototype.insertChildNode = function(tag, parentNode, children) {


  //if(parentNode !== )


  var child = {
    tag: tag,
    word: null,
    children: []
  };

  children.push(child);

  console.log("Tag: " + tag);

  return child;

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

