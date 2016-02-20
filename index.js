'use strict';
const EventEmitter = require('events').EventEmitter;
const inherits = require('inherits');
const TwitterStream = require('twitter-stream-api');
let twitterKeys = {};

try {
  twitterKeys = require('./config');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    throw new Error('Config file not found, API keys required to access the twitter API');
  }
}

function Adapter(args) {
  this.config = args.config || twitterKeys.twitter;
  this.endpoint = args.endpoint || 'statuses/filter';
  this.parameters = args.parameters ||
    {
      follow: [1019188722, 15076743, 19701628, 265902729],
      stall_warnings: true
    };
  this.imageTypes = args.imageTypes || '(gif|jpg|jpeg|png)';
  this.re = new RegExp(`https?:\/\/.*\.${this.imageTypes}`, 'i');
  this.stopped = true;
  this.twitter = new TwitterStream(this.config);
}

inherits(Adapter, EventEmitter);

Adapter.prototype.start = function start() {
  this.emit('start');
  this.stopped = false;
  const self = this;

  this.twitter.stream(self.endpoint, self.parameters);

  this.twitter.on('connection success', (uri) => {
    console.log('connection success', uri);
  });

  this.twitter.on('connection error stall', () => {
    console.log('connection error stall, reconnecting...');
  });

  this.twitter.on('data', (data) => {
    if (!data.entities) {
      return;
    }

    if (data.entities.media && data.entities.media.length !== 0) {
      // handle images uploaded through twitter's image service
      data.entities.media.forEach((tweet) => {
        if (tweet.media_url.match(self.re)) {
          self.emit('gif', tweet.media_url, { origin: tweet.expanded_url });
        }
      });
    }

    if (data.entities.urls && data.entities.urls.length !== 0) {
      // handle all other images
      data.entities.urls.forEach((tweet) => {
        if (tweet.expanded_url.match(self.re)) {
          const sourceUrl = `http://www.twitter.com/statuses/${data.id_str}`;
          self.emit('gif', tweet.expanded_url, { origin: sourceUrl });
        }
      });
    }
  });
};

Adapter.prototype.stop = function stop() {
  // stop grabbing gifs
  this.stopped = true;
  this.emit('stop');
  this.twitter.close();
};

module.exports = Adapter;
