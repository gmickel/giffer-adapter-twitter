'use strict';
var test = require('tap').test;
var Adapter = require('../index');

test('Test functionality of adapter', function(t) {
  var instance = new Adapter({});
  t.ok(instance);

  // test start and stop functions
  t.end();
});

test('Test starting and stopping of adapter', function(t) {
  var instance = new Adapter({
    //'path': 'statuses/filter',
    'path': 'statuses/sample',
    //'query': {follow: [1019188722, 15076743, 19701628, 265902729]},
    'query': {},
    'image_types': 'gif'
  });
  instance.start();
  instance.on('gif', function(url, metadata) {
    console.log('url', url);
    console.log('origin', metadata.origin);
    t.ok(url);
    t.ok(metadata);
    t.ok(metadata.origin);
    instance.stop();
    t.end();
  });
  t.end();
});
