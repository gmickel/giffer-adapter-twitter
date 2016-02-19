'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var TwitterStream = require('twitter-stream-api');

try {
  var twitterKeys = require('./config');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    throw new Error('Config file not found, API keys required to access the twitter API');
  }
}

inherits(Adapter, EventEmitter);

function Adapter(args) {
  this.config = args.config || twitterKeys.twitter;
  this.endpoint = args.endpoint || 'statuses/filter';
  this.query = args.query ||
    {
      follow: [1019188722, 15076743, 19701628, 265902729],
      stall_warnings: true
    };
  this.image_types = args.image_types || '(gif|jpg|jpeg|png)';
  this.re = new RegExp('https?:\/\/.*\\.' + this.image_types + '', 'i');

  this.stopped = true;

  this.twit = new TwitterStream(this.config);

  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  this.stopped = false;
  var self = this;

  this.stream = this.twit.stream(self.endpoint, self.query);

  this.twit.on('connection success', function (uri) {
    console.log('connection success', uri);
  });


  this.twit.on('data', function(data) {
    if (!data.entities) {
      return;
    }
    if (data.entities.media && data.entities.media.length !== 0) {
      // handle images uploaded through twitter's image service
      data.entities.media.forEach(function(tweet) {
        if (tweet.media_url.match(self.re)) {
          self.emit('gif', tweet.media_url, { origin: tweet.expanded_url });
        }
      });
    }
    if (data.entities.urls && data.entities.urls.length !== 0) {
      // handle all other images
      data.entities.urls.forEach(function(tweet) {
        if (tweet.expanded_url.match(self.re)) {
          var source_url = `http://www.twitter.com/statuses/${data.id_str}`;
          self.emit('gif', tweet.expanded_url, { origin: source_url });
        }
      });
    }
  });
};

Adapter.prototype.stop = function() {
  this.stopped = true;
  this.emit('stop');
  this.twit.close();
  // stop grabbing gifs
};

module.exports = Adapter;
