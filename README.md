# giffer-adapter-reddit

Reddit adapter for giffer.

## authentication

enter your Twitter API creditials in the `config.js` file, see `config.js.example` 

## configuration

The following configuration options are available:

### `path`

Streaming endpoint to hit. One of:

'statuses/filter'
'statuses/sample'
'statuses/firehose'
'user'
'site'

 See [Twitter Dev API](https://dev.twitter.com/docs/api/1.1#334)

### `params`

parameters for the request