'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var twitterConfig = require('./config');
var twitter = require('twit');
var twit = new twitter({
  consumer_key: twitterConfig.twitter.consumer_key,
  consumer_secret: twitterConfig.twitter.consumer_secret,
  access_token: twitterConfig.twitter.access_token_key,
  access_token_secret: twitterConfig.twitter.access_token_secret
});


inherits(Adapter, EventEmitter);

function Adapter(config) {
  this.path = config.path || 'statuses/filter';
  this.query = config.query || {follow: [1019188722, 15076743, 19701628, 265902729]};
  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  var self = this;

  this.stream = twit.stream(self.path, self.query);
  this.stream.on('tweet', function(data) {
    if (data.entities.media) {
      // handle images uploaded through twitter's image service
      data.entities.media.forEach(function(tweet) {
        if (tweet.media_url.match(/(https?:\/\/.*\.gif)/i)) {
          self.emit('gif', tweet.media_url);
        }
      });
    }
    if (data.entities.urls) {
      // handle all other images
      data.entities.urls.forEach(function(tweet) {
        // if (tweet.expanded_url.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i)) {
        if (tweet.expanded_url.match(/(https?:\/\/.*\.gif)/i)) {
          self.emit('gif', tweet.expanded_url);
        }
      });
    }
  });
  this.stream.on('disconnect', function(disconnectMessage) {
    // Handle a disconnection
  });
  this.stream.on('limit', function(limitMessage) {
    //...
  });

  this.stream.on('warning', function(warning) {
    console.log(warning);
  });
  this.stream.on('error', function(error) {
    console.log(error);
  });
};

Adapter.prototype.stop = function() {
  this.emit('stop');
  this.stream.stop();
  // stop grabbing gifs
};

module.exports = Adapter;
