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
    ,path  = require('path')
    ,chokidar = require('chokidar')
    ,reloadEmitter = new ( require('events') )()
    ,clientDir = require('./lib/client-dir')
    ,entryPoint = require('./lib/entry-point')( reloadEmitter )
;

process.liveReload = {

    _path: null
    ,get path() {

        return this._path;
    }
    ,set path( val ) {

        if( !!this.viewsDir ) {

            val = path.join(this.viewsDir , val  ) ;
        }

        if( typeof val === 'string' ) {

            if( !path.isAbsolute( val ) ) {

                val = path.join( clientDir()  , val ) ;
            }

            if( fs.existsSync( val ) ) {

                this._path = val ;

            } else {

                console.log('live reload path render directory not found with: ' , val ) ;
                throw 'please check you call method `liveReload`' ;
            }

        }

    }

    ,_viewsDir: null
    ,get viewsDir() {

        return this._viewsDir;
    }
    ,set viewsDir( val ) {

        if( typeof val === 'string' ) {

            const absolutePath = path.join( clientDir() , val ) ;

            if( fs.existsSync( absolutePath ) ) {

                this._viewsDir = val ;

            } else {

                console.log( 'live reload views directory not found with: ' , absolutePath );
                throw 'please check you call method `views`' ;

            }

        } else {

            console.log('live reload views directory bust me an string but you have give : ' , typeof val );
            throw 'please go read README.md';
        }
    }

    ,_virtualDir: ""
    ,get virtualDir() {

        return this._virtualDir ;
    }
    ,set virtualDir( val ) {

        this._virtualDir = typeof val === 'string' ? val: null;

        if( !this._virtualDir ) {
            console.log('live reaload argument error for call `static` method , virtual directory bust be a string') ;
            throw 'live reaload argument error please go read README.md' ;
        }
    }

    ,_staticDir: ""
    ,get staticDir() {
        return this._staticDir ;
    }
    ,set staticDir( val ) {

        if( typeof val === 'string' ) {

            const absolutePath = path.join( clientDir() , val ) ;

            if( fs.existsSync( absolutePath ) ) {

                this._staticDir = val ;

            } else {
                // path not found
                console.log("live reloading static path not found with : " , absolutePath );
                throw "please check you call of method `static`";
            }

        } else{
            // path not an string
            console.log("live reloading `static` argument error : ( staticDirectory: string)");
            throw "please check you call of method `static`";
        }
    }

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

            let pathRender = this.path;


            if( fs.existsSync( pathRender ) ) { // render path give exists

                const watcher = chokidar.watch( pathRender ) ;

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

                reloadEmitter.emit('success watch' , pathRender ) ;

                Object.keys( this.assets ).forEach( assetType => {

                    this.assets[ assetType ].forEach( relativeSource => {

                        if( this.virtualDir ) {

                            relativeSource = relativeSource.replace( this.virtualDir , '' ) ;
                        }

                        const absolutePath = path.join( clientDir()  , this.staticDir , relativeSource ) ;

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
