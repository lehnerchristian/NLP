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
    if (splitArray[i].length > 1 && splitArray[i].charAt(0) === "(") {
      // Stanford parser prints for tags carriage returns
      // or newlines - so we have to remove them
      var tag = splitArray[i].slice(1);
      parentNodes.push(this.insertChildNode(tag, parentNodes[parentNodes.length - 1]));
    }
    else if (splitArray[i].length > 1 && splitArray[i].charAt(0) !== ")") {
      if (splitArray[i].charAt(splitArray[i].length - 2) === ")" && splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].replace(/\)/g, "");

        if (parentNodes[parentNodes.length - 1]) {
          parentNodes[parentNodes.length - 1].tag += " " + word;
          console.log(parentNodes);
          parentNodes.pop();
          parentNodes.pop();
        }
      }
      else if (splitArray[i].charAt(splitArray[i].length - 1) === ")") {
        var word = splitArray[i].replace(/\)/g, "");

        if (parentNodes[parentNodes.length - 1]) {
          parentNodes[parentNodes.length - 1].tag += " " + word;
          console.log(parentNodes);
          parentNodes.pop();
        }
      }
    }
  }
  return this.data;
}

NewickParser.prototype.print = function () {
  console.log(JSON.stringify(this.data, null, 2));
}

NewickParser.prototype.insertChildNode = function (tag, parentNode) {
  if (!parentNode) {
    return;
  }
  if (!parentNode.children) {
    parentNode.children = [];
  }

  var child = {
    name: tag,
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
