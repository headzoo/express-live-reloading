require('./lib/array.proto');
require('./lib/env-vars');

const
    fileState = require('./lib/file-emitter')
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
    
            fileState.on('change' , () => {
    
                socket.emit( 'change' ) ;
    
                socket.emit('simply' , {
                    done: 'document.location.reload()'
                    ,onName: 'tracked'
                } ) ;
    
            } ) ;
    
            fileState.on('unlink' , () => {
    
                socket.emit( 'unlink' ) ;
    
                socket.emit('simply' , {
                    done: 'document.location.reload()'
                    ,onName: 'unlink'
                } ) ;
    
            } ) ;
    
            fileState.on('add' , () => {
    
                socket.emit( 'add' ) ;
    
                socket.emit('simply' , {
                    done: 'document.location.reload()'
                    ,onName: 'add'
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
;

module.exports = liveReloading ;
