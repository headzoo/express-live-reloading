require('./lib/array.proto');
require('./lib/env-vars');

const
    getAllFiles = require('./lib/get-all-files')

    ,webDir =  require('./lib/webdir')()
    
    ,fileState = require('./lib/file-emitter')

    ,{liveReloadMiddleware,watchAssets} = require('./lib/watcher-file')

    ,liveReloading = function( server , namespace = '/live-reload' ) {

        const { itemsAssets } = process.liveReloading ;

        server._events.request.get( /\/live\-?reload(ing(\.js)?)?(\/live\-?reload(ing(\.js))?)?/i  , (r,res) => {
    
            res.type( 'application/javascript' );
    
            res.sendFile( __dirname + '\\client\\live-reload.js' );
    
        } ) ;
    
        const io = require('socket.io')( server );
    
        ioLiveReload = io.of( namespace ) ;
    
        ioLiveReload
        .on('connection' , socket => {
    
            socket.on('styles' , items => {

                watchAssets( items ) ;
                
                const itemsStyles = itemsAssets.filter( item => item.source.split('.').pop() === 'css' ).map( i => i.source ) ;

                socket.emit('listen styles' , {
                    items: itemsStyles
                } ) ;
                socket.emit('simply' , {
                    onName: 'listen styles'
                    ,done: `console.info( 'styles listen : ${ itemsStyles.map( i => i.split('\\').pop() ).join(' , ') }' )`
                } ) ;
            } ) ;

            socket.on('script' , items => {
                watchAssets( items ) ;

                
                const itemsScript = itemsAssets.filter( item => item.source.split('.').pop() === 'js' ).map( i => i.source ) ;

                socket.emit('listen script' , {
                    items: itemsScript
                } ) ;
                socket.emit('simply' , {
                    onName: 'listen script'
                    ,done: `console.info( 'script listen : ${ itemsScript.map( i => i.split('\\').pop() ).join(' , ') }' )`
                } ) ;
            } ) ;
    
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
    }

    ,keysConfigAccept = [
        'assets'
    ]
;

// config entry method
liveReloadMiddleware.set = function( config ) {

    if( typeof config != 'object' ) return false;

    liveReloadMiddleware.config = {} ;

    const keysAccept = Object.keys( config ).filter( attr => {

        const accept = keysConfigAccept.includes(attr)

        if( accept ) {
            liveReloadMiddleware.config[ attr ] = config[ attr ] ; 
        }

        return accept ;
    } ) , 
    keysReject = Object.keys( config ).filter( attr => (
        !keysConfigAccept.includes(attr)
    ) ) ;

    if( keysReject.length ) {
        console.log( `your are ${keysReject.length} keys unknow give with your set method config : ${keysReject.join(' , ')}`);
    }

    // default value config
    if( !this.config['assets'] ) {

        this.config['assets'] = 'public' ;
    }

    this.init() ;
} ;

// exec after read config
liveReloadMiddleware.init = function() {

    getAllFiles( webDir + this.config[ 'assets' ] ) ;
} ;

module.exports = liveReloading ;
