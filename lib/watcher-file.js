const 
    fs = require('fs')
    ,fileState = require('./file-emitter')
    ,getAllFiles = require('./get-all-files')
    ,onWatchFile = () => {
        fileState.emit('tracked') ;
    } ,
    liveReloadMiddleware = (rq,res,next) => {

        let { fileWatched,assetsWatcheds } = process.liveReloading ;

        const {method,args} = res.done;
    
        let path = res.done.path ;

        if( !path ) {
            path = args[0] ;
        }

        fs.exists( path , exists => {

            if( exists ) {

                fs.watchFile( path , {
                    persistent: true,
                    interval: 1500 // ms interval ask change
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
            assetsWatcheds = [] ;
        }

        res[ method ]( ...args );
    }
    // ,keysConfigAccept = [
    //     'assets'
    // ]
;

// config entry method
liveReloadMiddleware.set = function( config ) {

    if( typeof config != 'object' ) return {};
    
    process.liveReloading.config = config ;

    this.init() ;

    return process.liveReloading.config ;

} ;

// exec after read config
liveReloadMiddleware.init = function() {

    const { webDir,config } = process.liveReloading ;

    getAllFiles( webDir + config[ 'assets' ] ) ;
} ;

module.exports = {

    liveReloadMiddleware: liveReloadMiddleware,

    watchAssets: items2watch => {

        const { itemsAssets , assetsWatcheds } = process.liveReloading ;

        const ressources = items2watch.map( item => (
            item.split( /(localhost|127\.0\.0\.1):?(\d{1,4})?/i ).filter( l => l.length ).pop()
        ) ) ;

        ressources.forEach(  ressource => {

            ressource = ressource.split('/').filter( l => l.length ) ;

            itemsAssets.forEach( itemStyle => {

                src = itemStyle.source.split('\\').filter( l => l.length ) ;

                if( ressource.equal2(src) ) {

                    fs.watchFile( itemStyle.path , {
                        persistent: true
                        ,interval:2e3
                    } , onWatchFile ) ;

                    assetsWatcheds.push( itemStyle.path ) ;
                }

            } ) ;
        } ) ;
    },

} ;
