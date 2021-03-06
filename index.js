/**
 * Module dependencies
 */

var iterator = require('dom-iterator');

/**
 * Parse the markup of an element
 *
 * @param  {Element} el
 * @param  {Array} whitelist
 * @return {Array}
 */

module.exports = function (el, whitelist, attr) {
  var next, prev;
  var length = 0;
  var it = iterator(el.firstChild, el).revisit(false);

  var markup = [];

  function parse(node) {
    if (node.tagName == 'BR') return;

    var children = node.children;
    var len = node.textContent.length;

    // if our node is a text node, or it doesn't pass our whitelist
    // then record length and break.
    if (!node.tagName || (whitelist && !~whitelist.indexOf(node.tagName))) {
      if (!children) length += len;
      return;
    }

    var instance = {
      type: node.tagName,
      from: length,
      to: length + len,
      attr: {}
    };

    if (attr) {
      for (var i = 0; i < attr.length; i++) {
        var a = attr[i];
        var property = node.getAttribute(a);
        if (property) {
          instance.attr[a] = property;
        }
      }
    }

    if (!children) length += len;
    markup.push(instance);
  }

  prev = el.firstChild;
  parse(el.firstChild);

  while(next = it.next()) {
    parse(next);
    prev = next;
  }

  return markup;
};
