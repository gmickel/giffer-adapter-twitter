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
  var instance = new Adapter({
    'path': 'statuses/filter',
    //'query': {follow: [1019188722, 15076743, 19701628, 265902729, 1041346340, 759251, 1367531, 14523894, 807095]}
    //'query': {track: ['hilarious', 'nodejs', 'kittens', 'cats', 'funny', 'boobs']}
  });
  instance.start();
  instance.on('gif', function(url) {
    console.log('url', url);
    //instance.stop();
    t.ok(url);
    t.end();
  });
  t.end();
});
