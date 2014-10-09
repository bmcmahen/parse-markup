var expect = require('learnboost/expect.js');
var parse = require('./index');

describe('parseMarkup', function () {

  beforeEach(function () {
    this.el = document.createElement('div');
    this.el.innerHTML = '<b>bold</b> and <i>italic</i> and <a href="http://someurl">url</a>';
  });

  it('should parse markup inside of an element', function () {
    var markup = parse(this.el);
    expect(markup).to.have.length(3);
    expect(markup[0]).to.eql({ from: 0, to: 4, type: 'B', attr: {}});
    expect(markup[1]).to.eql({ from: 9, to: 15, type: 'I', attr: {}});
    expect(markup[2]).to.have.property('type', 'A');
  });

  it('should ignore non-whitelisted tags if provided', function () {
    var markup = parse(this.el, ['B', 'I']);
    expect(markup).to.have.length(2);
  });

  it('should record specified attributes', function () {
    var markup = parse(this.el, ['A'], ['href']);
    expect(markup[0].attr).to.have.property('href', 'http://someurl');
  });

});
