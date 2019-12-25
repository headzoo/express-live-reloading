/**
 * @exports Function
 * @return {Function}
 * @return {Function} middleware live relaod for express
 */
module.exports = function( reloadEmitter ) {

    return function( server ) {

        const io = require('socket.io')( server ) ;

        liveReloadIO = io.of( '/live-reload' );

        liveReloadIO.on('connect' , require('./lib/socket-connect')( reloadEmitter ) ) ;

        return require('./middleware') ;
    } ;

} ;
