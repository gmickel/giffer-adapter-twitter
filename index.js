'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var twitter = require('twit');

try {
  var twitterConfig = require('./config');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    console.log('you need to create a config.js file');
  }
}

inherits(Adapter, EventEmitter);

function Adapter(args) {
  this.config = args.config || twitterConfig.twitter;
  this.path = args.path || 'statuses/filter';
  this.query = args.query || {follow: [1019188722, 15076743, 19701628, 265902729]};
  this.image_types = args.image_types || '(gif|jpg|jpeg|png)';
  this.re = new RegExp('https?:\/\/.*\\.' + this.image_types + '', 'i');

  this.twit = new twitter({
    consumer_key: this.config.consumer_key,
    consumer_secret: this.config.consumer_secret,
    access_token: this.config.access_token_key,
    access_token_secret: this.config.access_token_secret
  });

  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  var self = this;

  this.stream = this.twit.stream(self.path, self.query);
  this.stream.on('tweet', function(data) {
    if (data.entities.media) {
      // handle images uploaded through twitter's image service
      data.entities.media.forEach(function(tweet) {
        if (tweet.media_url.match(self.re)) {
          self.emit('gif', tweet.media_url);
        }
      });
    }
    if (data.entities.urls) {
      // handle all other images
      data.entities.urls.forEach(function(tweet) {
        // if (tweet.expanded_url.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i)) {
        if (tweet.expanded_url.match(self.re)) {
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
