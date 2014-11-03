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
  console.log(newickString);

  var splitArray = newickString.split(" ");


  // stack of parent nodes
  var parentNodes = [];
  parentNodes.push(this.data);

  for(var i = 0; i < splitArray.length; i++) {
    if(splitArray[i].length > 1 && splitArray[i].charAt(0) === "(") {
      var tag = splitArray[i].slice(1);

      parentNodes.push(this.insertChildNode(tag, parentNodes[parentNodes.length - 1], parentNodes[parentNodes.length - 1].children));

    }
    else {
      if(splitArray[i].charAt(splitArray[i].length - 2) === ")" && splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].slice(0, splitArray[i].length - 2);
        parentNodes[parentNodes.length-1].tag  += ", " + word;
        parentNodes.pop();
        parentNodes.pop();
        console.log(word);
      }
      else if(splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].slice(0, splitArray[i].length - 1);
        parentNodes[parentNodes.length-1].tag += ", " + word;
        console.log(word);
        parentNodes.pop();
      }
    }
  }

  console.log(JSON.stringify(this.data, null, 2));


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

  var child = {
    tag: tag,
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


module.exports = NewickParser;