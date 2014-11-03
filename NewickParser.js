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
    if(splitArray[i].length > 1 && splitArray[i].charAt(0) === "(") {
      var tag = splitArray[i].slice(1);
      parentNodes.push(this.insertChildNode(tag, parentNodes[parentNodes.length - 1]));
    }
    else {
      if(splitArray[i].charAt(splitArray[i].length - 2) === ")" && splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].replace(/\)/g, "");
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
  //this.print();
  return this.data;
}

NewickParser.prototype.print = function(){
  console.log(JSON.stringify(this.data, null, 2));
}

NewickParser.prototype.insertChildNode = function(tag, parentNode) {
  if(!parentNode.children){
    parentNode.children = [];
  }

  var child = {
    tag: tag,
    parent: parentNode.tag
  };

  parentNode.children.push(child);
  return child;
}

module.exports = NewickParser;


