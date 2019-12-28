/**
 * @exports Function
 * @return {Function} attach TCP to HTTP server initialize memories store
 * @return {Function} final middleware live reload for express {📦}
 */
module.exports = function() {

    // if( typeof reloadEmitter !== "object" ) {
    //     throw new TypeError('arg1 bust be object emitter') ;
    // }
    const env = process.liveReload ;

    return function( server , clientDir = null ) {


        if( !!clientDir ) {
            // active local env , give __dirname for active logs dev
            env.devUse = true;
            env.clientDir = clientDir ;
        } else {

            env.clientDir = require('./client-dir')() ;
        }

        const io = require('socket.io')( server ) ;

        liveReloadIO = io.of( '/live-reload' );

        liveReloadIO.on('connect' , require('./socket-connect')() ) ;

        return require('./middleware') ;
    } ;

} ;
