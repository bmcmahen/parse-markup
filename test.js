var expect = require('learnboost/expect.js');
var parse = require('./index');
var setmarkup = require('bmcmahen/markup');

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

  it('should handle embedded markup', function () {
    var el = document.createElement('div');
    el.innerHTML = 'this<i> is <b>italic and bold</b></i><b>. this is bold</b>';
    var markup = parse(el);
    expect(markup).to.have.length(3);
    expect(markup[0]).to.eql({ from: 4, to : 23, type: 'I', attr: {}});
    expect(markup[1]).to.eql({ from: 8, to: 23, type: 'B', attr: {}});

    var div = document.createElement('div');
    div.innerText = 'this is italic and bold. this is bold';
    setmarkup(markup[1].from, markup[1].to, div, markup[1].type);
    expect(div.querySelector('b').innerText).to.be('italic and bold');
  });

  it('should handle multiple embedded', function () {
    var el = document.createElement('div');
    el.innerHTML = '<b>h<i>ell</i>o <i>wor</i>ld</b>';
    var markup = parse(el);
    expect(markup).to.have.length(3);
    expect(markup[1]).to.eql({ from : 1, to : 4, type: 'I', attr: {}});
    expect(markup[2]).to.eql({ from: 6, to: 9, type: 'I', attr: {}});
    var div = document.createElement('div');
    div.innerText = 'hello world';
    setmarkup(markup[1].from, markup[1].to, div, markup[1].type);
    expect(div.querySelector('i').innerText).to.be('ell');

    var div = document.createElement('div');
    div.innerText = 'hello world';
    setmarkup(markup[2].from, markup[2].to, div, markup[2].type);
    expect(div.querySelector('i').innerText).to.be('wor');
  });

});
