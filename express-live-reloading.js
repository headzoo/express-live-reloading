const
    fs = require('fs')
    ,chokidar = require('chokidar')
    ,reloadEmitter = new ( require('events') )()
    ,clientDir = () => {

        let found = false ;
        const sep = __dirname.indexOf('/') !== -1 ? "/": "\\";

        return __dirname.split( sep ).filter( ressource => {

            if( found ) return false;

            if( /express-live-reloading|node_modules/.test( ressource ) ) {

                found = true;
                return false;
            }

            return true;

        } ).join( sep ) ;
    }
;

process.liveReload = {

    staticDir: ""
    ,assets: {
        scripts: []
        ,styles: []
    }
    ,watchers: []
    ,lastReq: null
    ,done() {

        Promise
        .all( this.watchers.map( watcher => watcher.close() ) )
        .then( () => { // all watchers close with success

            if( fs.existsSync( this.path ) ) {

                const watcher = chokidar.watch( this.path ) ;

                watcher
                    // event add emit immediately invoke bug infinity reload
                    // .on('add' , () => reloadEmitter.emit('reload') )
                    .on('change' , () => reloadEmitter.emit('reload') )
                    .on('unlink' , () => reloadEmitter.emit('reload') )
                ;

                this.watchers.push( watcher ) ;

                reloadEmitter.emit('success watch' , this.path ) ;

                Object.keys( this.assets ).forEach( assetType => {

                    this.assets[ assetType ].forEach( relativeSource => {

                        const absolutePath = clientDir() + '/' + this.staticDir + relativeSource ;

                        if( fs.existsSync( absolutePath ) ) {

                            const watcherAsset = chokidar.watch( absolutePath ) ;

                            watcherAsset
                                .on('change' , () => reloadEmitter.emit('reload') )
                                .on('unlink' , () => reloadEmitter.emit('reload') )
                            ;

                            this.watchers.push( watcherAsset ) ;

                            reloadEmitter.emit('success watch' , absolutePath ) ;
                        } else {

                            reloadEmitter.emit('fail watch' , absolutePath ) ;
                        }

                    } ) ;

                } ) ;

            } else {
                // socket immediately re emit after re start server but not HTTP request listen
                reloadEmitter.emit('reload') ; // :-)

                // console.log('render :' , this.path , ' not found' );
                // throw 'render not found';
            }

        } ).catch( () => {

            throw "one or many watcher fail close" ;

        } ) ;

    }
} ;

const middleware = function( req , res , next ) {

    if( req.url === "/live-reload.js" ) {
        res.type('application/javascript') ;
        res.sendFile( __dirname + '\\client\\client.js' ) ;
    } else {

        res.liveReload = function( path ) {

            process.liveReload.path = path ;
            return this;
        } ;

        next() ;
    }
} ;

const entryPoint = function( server ) {

    const io = require('socket.io')( server ) ;

    liveReloadIO = io.of( '/live-reload' );

    liveReloadIO.on('connect' , socket => {

        reloadEmitter.on('reload' , () => socket.emit('reload') ) ;

        reloadEmitter.on('success watch' , path => socket.emit('success watch' , path ) ) ;
        reloadEmitter.on('fail watch' , path => socket.emit('fail watch' , path ) ) ;

        socket.emit('skip' , {
            scripts: ['/socket.io/socket.io.js' , '/live-reload.js']
            ,styles: []
        } ) ;

        socket.on('assets' , assets => {

            process.liveReload.assets = assets ;
            process.liveReload.done() ;

        } ) ;

    } ) ;

    return middleware ;
} ;

middleware.static = function( staticDir ) {

    process.liveReload.staticDir = staticDir ;
} ;

module.exports = entryPoint;
