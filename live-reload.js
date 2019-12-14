const fs = require('fs') ;

Array.prototype.equal2 = function(ref) {

    if( !(ref instanceof Array) ) return false;

    let eq = true;

    this.forEach( (el,key) => {

        if( el != ref[key] )
            eq = false;
    } );

    return eq;
} ;

let fileWatched = null; // path of current file watch
let assetsWatcheds = [] ; // path of currents assets file watch

let webDir =  (() => {

    const sep = __dirname.indexOf('/') != -1 ? '/' : '\\' ;

    let foundLast = false; 

    return __dirname
        .split( sep )
        .filter( ressource => {
            
            if( 
                foundLast ||
                /express-live-reload|nodes?_modules?/.test( ressource )
            ) {
                foundLast = true;
                return false;
            }

            return ressource;
        } )
        .join( sep ) + '\\'
    ;

} )();

let itemsStyles = [];

function getAllFiles( path ) {
 
    fs.exists( path , exists => {
        
        if( exists ) {
         
            fs.readdir( path , (err , items ) => {

                if( err )
                    throw 'public dir not readable';

                items.forEach( item => {

                    if( fs.statSync( path + '\\' + item ).isDirectory() ) {

                        if( item.split('.').includes('css') ){
                            getAllFiles( path + '\\' + item ) ;
                        }
                    } else {
                        itemsStyles.push( {
                            path: path+ '\\' + item
                            ,source: path.split('public')[1] + '\\' + item
                        } ) ;
                    }

                } ) ;

            } ) ;

        } else {
            console.log('public dir not found asset not watched');
        }

    } ) ;

}

getAllFiles( webDir + 'public' ) ;

const
    fileState = new ( require('events') )
    ,onWatchFile = () => {

        fileState.emit('tracked') ;
    },
    liveReloadMiddleware = (rq,res,next) => {

        const {method,args} = res.done;
    
        let path = res.done.path ;

        if( !path ) {
            path = args[0] ;
        }

        fs.exists( path , exists => {

            if( exists ) {

                fs.watchFile( path , {
                    persistent: true,
                    interval: 1e3 // ms interval ask change
                } , onWatchFile ) ;

                fileWatched = __dirname + '\\src\\index.html' ;

            } else {
                fileState.emit('not watchable' , path ) ;
            }
        } ) ;

        if( fileWatched ) {
            fs.unwatchFile( fileWatched , onWatchFile ) ;
        }
        if( assetsWatcheds.length ) {
            
            assetsWatcheds.forEach( assetWatch => (
                fs.unwatchFile( assetWatch , onWatchFile )
            ) ) ;
        }


        res[ method ]( ...args );
    },
    watchAssets = items2watch => {

        const ressources = items2watch.map( item => (
            item.split( /(localhost|127\.0\.0\.1):?(\d{1,4})?/i ).filter( l => l.length ).pop()
        ) ) ;

        ressources.forEach(  ressource => {

            ressource = ressource.split('/').filter( l => l.length ) ;

            itemsStyles.forEach( itemStyle => {

                src = itemStyle.source.split('\\').filter( l => l.length ) ;

                if( ressource.equal2(src) ) {

                    fs.watchFile( itemStyle.path , {
                        persistent: true
                        ,interval:1e3
                    } , onWatchFile ) ;

                    assetsWatcheds.push( itemStyle.path ) ;
                }

            } ) ;
        } ) ;
    }
;

module.exports = function( server , namespace = '/live-reload' ) {

    server._events.request.get( /\/live\-?reload(ing(\.js)?)?(\/live\-?reload(ing(\.js))?)?/i  , (r,res) => {

        res.type( 'application/javascript' );

        res.sendFile( __dirname + '\\client\\live-reload.js' );

    } ) ;

    const io = require('socket.io')( server );

    ioLiveReload = io.of( namespace ) ;

    ioLiveReload
    .on('connection' , socket => {

        socket.on('styles' , items => (
            watchAssets( items )
        ) ) ;

        socket.emit('listen') ;
        socket.emit('simply' , {
            done: 'console.info("[watch] ok")'
            ,onName: 'listen'
        } )

        fileState.on('tracked' , () => {

            socket.emit( 'change' ) ;

            socket.emit('simply' , {
                done: 'document.location.reload()'
                ,onName: 'tracked'
            } ) ;

        } ) ;

        fileState.on('not watchable' , path => {

            socket.emit('error' , {
                type: "not found"
                ,path: path
            } ) ;

            socket.emit( 'simply' , {
                done: `console.error('hot reload module error file not found for : ${path}')`
                ,onName: 'error'
            } ) ;

        } ) ;

    } ) ;

    return liveReloadMiddleware ;
} ;