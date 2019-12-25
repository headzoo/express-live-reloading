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

/**
 * @method static
 * @param {string} virtualDir path in url but not phisycal directory path
 * @param {string} static path phisycal directory
 * @return self
 * @description config method define the relative path of `static` directory
 */
middleware.static = function( virtualDir = null , staticDir ) {

    if( !staticDir ) {
        staticDir = virtualDir;
    } else if( virtualDir && staticDir ) {

        process.liveReload.virtualDir = virtualDir ;

    } else { // !virtualDir [argumentError]

        throw "live realod `static` method argument error arg1 is not optional";
    }

    process.liveReload.staticDir = staticDir ;

    return this;
} ;

/**
 * @method views
 * @param {string} path of views directory
 * @return self
 * @description config method define the path relative/absolute of **views directory**
 */
middleware.views = function( path ) {

    process.liveReload.viewsDir = path ;

    return this;
} ;

/**
 * @exports Function middleware live reloading for express
 */
module.exports = middleware ;
