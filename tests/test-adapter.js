'use strict';
var test = require('tap').test;
var Adapter = require('../index');

test('Test functionality of adapter', function(t) {
  var instance = new Adapter({});
  t.ok(instance);

  // test start and stop functions
  t.end();
});

test('Test start of adapter', function(t) {
  var instance = new Adapter({'track': ['funny', 'hilarious', 'gif', 'cat']});
  instance.start();
  instance.on('gif', function(url) {
    console.log('url', url);
    instance.stop();
    t.ok(url);
    t.end();
  });
  t.end();
});
