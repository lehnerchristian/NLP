// =============
// Newick Parser
// =============

var NewickParser = function () {
  this.init();
};

NewickParser.prototype.init = function () {
  this.data = {
    name: "ROOT",
    children: []
  };
}

NewickParser.prototype.parseToJSON = function (newickString) {
  var splitArray = newickString.split(" ").clean();
  this.init();

  // stack of parent nodes
  var parentNodes = [];
  parentNodes.push(this.data);

  for (var i = 0; i < splitArray.length; i++) {
    if (splitArray[i].indexOf("ROOT") !== -1) {
      continue;
    }
    else if(splitArray[i].length <= 1 || splitArray[i].charAt(0) === ")"){
      continue;
    }

    if (splitArray[i].charAt(0) === "(") {
      // Stanford parser prints for names carriage returns
      // or newlines - so we have to remove them
      var name = splitArray[i].slice(1);
      parentNodes.push(this.insertChildNode(name, parentNodes[parentNodes.length - 1]));
    }
    else if (splitArray[i][splitArray[i].length-1] === ")") {
      var word = splitArray[i].replace(/\)/g, "");
      parentNodes[parentNodes.length - 1].name += " " + word;

      // Everything in this tag is with )
      if(splitArray[i].charAt(0) === ")"){
        continue;
      }

      // Removes for every ) one stack of node
      for(var j=1; j<=splitArray[i].length;j++){
        if(splitArray[i][splitArray[i].length-j] === ")"){
          parentNodes.pop();
        }
      }
    }
  }
  return this.data;
};

NewickParser.prototype.print = function () {
  console.log(JSON.stringify(this.data, null, 2));
}

NewickParser.prototype.insertChildNode = function (name, parentNode) {
  if (!parentNode) {
    return;
  }
  if (!parentNode.children) {
    parentNode.children = [];
  }

  var child = {
    name: name,
    parent: parentNode.name
  };

  parentNode.children.push(child);
  return child;
}

module.exports = NewickParser;

// =============
// Array Helper
// =============

Array.prototype.clean = function () {
  for (var i = 0; i < this.length; i++) {
    // Replace carriage return, newlines and points
    this[i] = this[i].replace(/(\r\n|\n|\r)/gm, "");
    this[i] = this[i].replace(".", "");

    // Remove element when empty
    if (this[i] === "" || !this[i] || typeof this[i] === "undefined") {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
