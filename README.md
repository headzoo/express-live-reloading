# [express-live-reload](https://www.npmjs.com/package/express-live-reloading)

> live reloading middleware express for **fast dev**

## version `0.4.0`

### re build watcher files system with *[chokidar](https://github.com/paulmillr/chokidar)* 

- fix `reload recursive infinite`
- listen **add, unlink** file
- add dependency **[chokidar](https://github.com/paulmillr/chokidar)** 

### `npm i express-live-reload --save-dev`

### usage:

#### `server.js`
```javascript

const
    exp = require('express')
    ,app = exp()
    ,server = require('http').Server( app )
    ,liveReload = require('express-live-reload')( server )
;

liveReload.set( {
    "assets": "./public" // path public directory default is "./public"
    ,"strict": true, // use strict mode block code with bad config default false 
} ) ;

// your express config
app
    .use( exp.static( 'public' ) )
    // ...
;

app.get( '/' , ( request, response, next ) => {

    const viewPath = __dirname + '\\src\\index.html';

    // use response.done for define your render
    response.done = {
        method: 'sendFile',
        args: [ viewPath ]
    } ;

    next() ; // call the liveReload middleware

} , liveReload /* this route use the liveReload with middleware */ ) ;
```

### `index.html`
```html
    <!-- ... , -->

    <!-- call TCP client script -->
    <script src="/socket.io/socket.io.js" ></script>

    <!-- hot reload default action script ( is recommended ) -->
    <script src="/live-reload/live-reload.js"></script>

    <!-- you'r other script app -->
    <script
        src="https://code.jquery.com/jquery-3.4.1.min.js"
        integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
        crossorigin="anonymous"
    >
    </script>

    <script src="/js/index.js"></script>
```