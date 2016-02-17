'use strict';
var process = require('process');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
//var twitter = require('twit');
var twitterStream = require('twitter-stream-api');

try {
  var twitterConfig = require('./config');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    throw new Error('Config file not found, API keys required to access the twitter API');
  }
}

inherits(Adapter, EventEmitter);

function Adapter(args) {
  this.config = args.config || twitterConfig.twitter;
  this.path = args.path || 'statuses/filter';
  this.query = args.query || {follow: [1019188722, 15076743, 19701628, 265902729]};
  this.image_types = args.image_types || '(gif|jpg|jpeg|png)';
  this.re = new RegExp('https?:\/\/.*\\.' + this.image_types + '', 'i');

  this.twit = new twitterStream({
    consumer_key: this.config.consumer_key,
    consumer_secret: this.config.consumer_secret,
    token: this.config.access_token_key,
    token_secret: this.config.access_token_secret
  });

  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  var self = this;

  //this.stream = this.twit.stream(self.path, self.query);
  this.stream = this.twit.stream('statuses/sample', {
    //track: 'javascript',
    stall_warnings: true
  });

  this.twit.on('connection success', function (uri) {
    console.log('connection success', uri);
  });


  this.twit.on('data', function(data) {
    console.log('data', data);
    if (data.entities.media) {
      // handle images uploaded through twitter's image service
      data.entities.media.forEach(function(tweet) {
        if (tweet.media_url.match(self.re)) {
          var source_url = 'http://www.twitter.com/' + data.user.screen_name + '/status/' + data.id;
          self.emit('gif', tweet.media_url, { origin: source_url });
        }
      });
    }
    if (data.entities.urls) {
      // handle all other images
      data.entities.urls.forEach(function(tweet) {
        // if (tweet.expanded_url.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i)) {
        if (tweet.expanded_url.match(self.re)) {
          var source_url = 'http://www.twitter.com/' + data.user.screen_name + '/status/' + data.id;
          self.emit('gif', tweet.expanded_url, { origin: source_url });
        }
      });
    }
  });
  /*this.stream.on('disconnect', function(disconnectMessage) {
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
  });*/
};

Adapter.prototype.stop = function() {
  this.emit('stop');
  this.stream.stop();
  // stop grabbing gifs
};

module.exports = Adapter;
