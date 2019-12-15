const 
    fs = require('fs')
    ,fileState = require('./file-emitter')
    ,getAllFiles = require('./get-all-files')
    ,attach = (watcher,types) => {
        
        types = types.split(',').map( type => type.trim() ) ;

        types.forEach( type => (
            watcher.on( type , onWatchFile( type ) )
        ) ) ;

        return watcher;
    }
    ,onWatchFile = type => (
        () => (
            fileState.emit( type )
        )
    ) ,
    liveReloadMiddleware = (rq,res) => {

        let { chokidar,lastURL } = process.liveReloading ;

        const {method,args} = res.done;
    
        let path = res.done.path ;

        if( !path ) {
            path = args[0] ;
        }
        
        if( lastURL === rq.url ) { // not change watch file
            process.liveReloading.changeWatch = false;
            return res[ method ]( ...args ) ;
        } else {

            process.liveReloading.changeWatch = true;
        }

        process.liveReloading.lastURL = rq.url ;

        Promise.all(
            chokidar.watchers.map( watcher => (
                watcher.close()
            ) )
        )
        .then( () => {

            chokidar.watchers = [] ;
    
            fs.exists( path , exists => {

                if( exists ) {

                    const watcher = chokidar.manager.watch( path ) ;

                    attach(watcher , 'add, change, unlink');

                    chokidar.watchers.push( watcher ) ;

                } else {
                    fileState.emit('not watchable' , path ) ;
                }
            } ) ;

        } )
        .catch( () => {
            throw 'an watcher file have failed close';
        } ) ;

        res[ method ]( ...args );
    }
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

        const { changeWatch, itemsAssets , chokidar } = process.liveReloading ;

        if( !changeWatch )
            return;

        const ressources = items2watch.map( item => (
            item.split( /(localhost|127\.0\.0\.1):?(\d{1,4})?/i ).filter( l => l.length ).pop()
        ) ) ;

        ressources.forEach(  ressource => {

            ressource = ressource.split('/').filter( l => l.length ) ;

            itemsAssets.forEach( itemStyle => {

                src = itemStyle.source.split('\\').filter( l => l.length ) ;

                if( ressource.equal2(src) ) {

                    let watcher = chokidar.manager.watch( itemStyle.path )

                    watcher = attach( watcher , 'add, change, unlink' )

                    chokidar.watchers.push( watcher ) ;
                }

            } ) ;
        } ) ;
    },

} ;
