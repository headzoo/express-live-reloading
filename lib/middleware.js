const middleware = function( req , res , next ) {

    if( req.url === "/live-reload.js" ) {

        res.type('application/javascript') ;
        res.sendFile( __dirname + '\\..\\client\\client.js' ) ;

    } else {

        res.liveReload = function( path ) {

            process.liveReload.path = path ;
            return this;
        } ;

        next() ;
    }

} ;

/**
 * @method static
 * @description affect `public` directory give by client
 */
middleware.static = function( staticDir ) {

    process.liveReload.staticDir = staticDir ;
} ;

/**
 * @exports Function middleware live reloading for express
 */
module.exports = middleware ;
