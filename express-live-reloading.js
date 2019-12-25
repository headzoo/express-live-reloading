/**
 * @author S.Gaborieau <sam.gabor@hotmail.com>
 *
 * @package [npm] express-live-reloading
 * @version 0.7.0 `review version`
 *
 * @git <https://github.com/Orivoir/express-live-reloading>
 * @npm <https://www.npmjs.com/package/express-live-reloading>
 */
const
    fs = require('fs')
    ,chokidar = require('chokidar')
    ,reloadEmitter = new ( require('events') )()
    ,clientDir = require('./lib/client-dir')
    ,entryPoint = require('./lib/entry-point')( reloadEmitter )
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

            if( fs.existsSync( this.path ) ) { // render path give exists

                const watcher = chokidar.watch( this.path ) ;

                watcher
                    // event add emit immediately after invoke on file use only for listen an directory
                    // emit reload
                    // attach watcher
                    // emit reload
                    // ...
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
                // socket immediately re emit after re start server on last channel but not new HTTP request listen
                reloadEmitter.emit('reload') ; // server re start detect and synchronize client with an reload

                // console.log('render :' , this.path , ' not found' );
                // throw 'render not found';
            }

        } ).catch( err => { // watcher.s file error close , app broke for dont memory overflow

            console.log( 'close err status: ' , err );
            throw "one or many watcher file fail close" ;

        } ) ;

    }
} ;

/**
 * @exports Function *entry point* **hydrate config** attach **TCP/IP** server and return `middleware` for **express**
 */
module.exports = entryPoint;
