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
    'path': 'statuses/filter',
    'query': {follow: [256099675, 1019188722]},
    'image_types': 'gif'
    //'query': {track: ['#funny', '#hilarious', '#cats', '#cat']}
  });
  instance.start();
  instance.on('gif', function(url) {
    console.log('url', url);
    t.ok(url);
    instance.stop();
    t.end();
  });
  t.end();
});
