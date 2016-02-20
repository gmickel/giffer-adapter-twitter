# giffer-adapter-twitter

Twitter adapter for giffer.

## authentication

enter your Twitter API credentials in the `config.js` file, see `config.js.example` 

## API

The Giffer Twitter Adapter has the following API:

### new Adapter(endpoint, parameters, imageTypes)

Creates a new Adapter object

#### endpoint (required)

The following values can be provided:

 * `statuses/filter` [API Doc](https://dev.twitter.com/streaming/reference/post/statuses/filter)
 * `statuses/sample` [API Doc](https://dev.twitter.com/streaming/reference/get/statuses/sample)
 * `statuses/firehose` [API Doc](https://dev.twitter.com/streaming/reference/get/statuses/firehose)
 * `user` [API Doc](https://dev.twitter.com/streaming/reference/get/user)
 * `site` [API Doc](https://dev.twitter.com/streaming/reference/get/site)

 See [Twitter Dev API](https://dev.twitter.com/streaming/public)

#### parameters (required)

Object holding optional Twitter Stream API endpoint parameters. The Twitter 
Stream API endpoints can take a set of given parameters which can be found in
the API documentation for each endpoint.

#### imageTypes

Regexp String containing the images we want the Adapter to emit

Example:

```js
'(gif|jpg|jpeg|png)'
```

### Adapter.start()

Starts the Giffer Adapter

### Adapter.stop()

Stops the Giffer Adapter


## Example

```js
  const instance = new Adapter({
    endpoint: 'statuses/filter',
    parameters: {
      track: ['javascript', 'gifs', 'funny', 'images', 'pics'],
      stall_warnings: true
      },
    image_types: '(gif|jpg|jpeg|png)'
  });
  instance.start();
```