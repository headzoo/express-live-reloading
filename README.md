# express-live-reloading `version 0.7.18`

live reloading middleware express for **fast dev** .

## Installation

```npm install express-live-reloading --save-dev```

```yarn add express-live-realoading --dev```

### server.js

```javascript
const
    exp = require('express')
    ,app = exp()
    ,server = require('http').Server( app )
    ,liveReload = require('express-live-reloading')( server )
;

liveReload.static( 'public' )

app
    .use( exp.static( 'public' ) )
    .use( liveReload )
;

app.get('/' , (req,res) => {

    const render = __dirname + '\\index.html' ;

    res
        .liveReload( render ) // give absolute path of render live reload
        .sendFile( render )
    ;

} ) ;


server.listen( 80 , () => console.log("server run ...") ) ;

```

### index.html

```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link rel="stylesheet" href="/index.css">
    </head>

    <body>

        <main>

            <h1>Ullamco Lorem eiusmod deserunt elit aliquip ut reprehenderit.</h1>

        </main>

        <!-- socket.io TCP/IP client script  -->
        <script src="/socket.io/socket.io.js" ></script>

        <!-- live reloading app client script -->
        <script src="/live-reload.js"></script>

    </body>
</html>
```

## output -> index.html
```
"[live reload] on"
"index.html --watched with success"
"index.css --watched with success"
```

## express live reloading watch only files call with your view file for best performence
## re start server is listen with `live-reload.js` for auto reload your view

### [npm package](https://www.npmjs.com/package/express-live-reloading)

### develop by [Samuel Gaborieau](https://orivoir.github.io/profil-reactjs/) with **<3** and **Nodejs** for **open source** and **enjoy**
