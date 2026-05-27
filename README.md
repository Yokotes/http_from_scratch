# Overview

Simple http server for serving routes and public files.
Written using http built-in lib of Node.js.

There are no typescript, eslint, prettier, many fields in package.json, dependencies.

It's a pet-project written just for fun. So have fun too :)

## What is `serverConf.json`

`serverConf.json` - config where you can define server things. Just like nginx but smaller.

Here are fields:

- `port` - as it says, defines server port. _Default: 3000_
- `route` - field for adding routes to the server, it's a single object field, not an array! **Required**
  - `path` - defines route path. _Example: /, /about, /page_. **Required**
  - `filePath` - where server will be looking for a html file in public folder. **Required**
  - `children` - array of child routes

Consider already existing `serverConf.json` as example.
