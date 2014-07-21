'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var twitterConfig = require('./config');
var util = require('util');
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: twitterConfig.twitter.consumer_key,
  consumer_secret: twitterConfig.twitter.consumer_secret,
  access_token_key: twitterConfig.twitter.access_token_key,
  access_token_secret: twitterConfig.twitter.access_token_secret
});


inherits(Adapter, EventEmitter);

function Adapter(config) {
  this.track = config.track || ['funny', 'hilarious', 'gif', 'cat'];
  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  var self = this;

  twit.stream('statuses/filter', { track: this.track }, function(stream) {
    stream.on('data', function(data) {
      if (data.entities.media) {
        // handle images uploaded through twitter's image service
        data.entities.media.forEach(function(tweet) {
          self.emit('gif', tweet.media_url);
        });
      }
      if (data.entities.urls) {
        data.entities.urls.forEach(function(tweet) {
          if (tweet.expanded_url.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i)) {
            self.emit('gif', tweet.expanded_url);
          }
        });
      }
    });
    stream.on('end', function(response) {
      // Handle a disconnection
    });
    stream.on('destroy', function(response) {
      // Handle a 'silent' disconnection from Twitter, no end/error event fired
    });
    // Disconnect stream after ten seconds
    //setTimeout(stream.destroy, 100000);
  });
};


Adapter.prototype.stop = function() {
  this.emit('stop');
  // stop grabbing gifs
};

module.exports = Adapter;
