var isBrowser = exports.isBrowser = require("sjs:apollo-sys").hostenv == 'xbrowser';
var _ = require("../lib/underscore.js");

var _currentRunner = null;
function currentRunner() {
  if(!_currentRunner) {
    throw("no suite defined yet!");
  };
  return _currentRunner;
};

var setRunner = exports.setRunner = function(runner) {
  _currentRunner = runner;
}

exports.test = function test(name, expected, f) {
  return currentRunner().addCase(name, function() {
    var actual = f();
    if (_.isEqual(actual, expected))
      this.addSuccess(name, actual);
    else
      this.addFailure(name, expected, actual);
  });
}

exports.testParity = function testParity(expr, f) {
  return currentRunner().addCase(expr, function() {
    var expected;
    try {
      expected = eval(expr);
    }
    catch (e) {
      expected = e;
    }
    var actual;
    try {
      actual = f();
    }
    catch (e) {
      actual = e;
    }
    if (_.isEqual(actual, expected))
      this.addSuccess(expr, actual);
    else
      this.addFailure(expr, expected, actual);
  });
}

exports.time = function time(name, f) {
  return currentRunner().addCase(name, function() {
    try {
      var start = new Date();
      f();
      var duration = (new Date()) - start;
    }
    catch (e) {
      this.addFailure(name, "success", e);
      return;
    }
    this.addSuccess(name, duration + "ms");
    hold(0);
  });
}

