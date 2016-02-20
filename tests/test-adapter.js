'use strict';
const test = require('tap').test;
const Adapter = require('../index');
const request = require('request');

function testURL(url, callback) {
  request(url, (error, response) => {
    callback(null, response.statusCode);
  });
}

test('Test starting and stopping of adapter', (t) => {
  const instance = new Adapter({
    endpoint: 'statuses/filter',
    parameters: {
      track: ['javascript', 'gifs', 'funny', 'images', 'pics', 'node'],
      stall_warnings: true
    },
    imageTypes: '(gif|jpg|jpeg|png)'
  });
  t.ok(instance, 'adapter initialized');
  instance.start();
  t.equal(instance.stopped, false, 'adapter should be running');

  instance.on('gif', (url, metadata) => {
    console.log('url', url); // eslint-disable-line no-console
    console.log('origin', metadata.origin); // eslint-disable-line no-console
    t.ok(url, 'url exists');
    t.ok(metadata, 'metadata exists');
    t.ok(metadata.origin, 'origin exists');
    test('Test url', (urlTest) => {
      testURL(url, (err, statusCode) => {
        urlTest.equal(statusCode, 200, 'image url should return a 200 statuscode');
        urlTest.end();
      });
    });
    test('Test origin url', (originTest) => {
      testURL(metadata.origin, (err, statusCode) => {
        originTest.equal(statusCode, 200, 'origin url should return a 200 statuscode');
        originTest.end();
      });
    });
    instance.stop();
    t.equal(instance.stopped, true, 'adapter should be stopped');
    t.end();
  });
});
