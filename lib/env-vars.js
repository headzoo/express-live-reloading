const
    fs = require('fs')
    ,path  = require('path')
    ,chokidar = require('chokidar')
;

let clientDir = require('./client-dir')() ;

process.liveReload = {

    reloadEmitter: new ( require('events') )()

    ,_devUse: false
    ,get devUse() {

        return this._devUse ;
    }
    ,set devUse(val) {

        this._devUse = !!val;

        if( !!this._devUse ) {

            this.logs = require('./chalk-color') ;
        }
    }

    ,_clientDir: null
    ,get clientDir() {

        return this._clientDir ;
    }
    ,set clientDir( val ) {

        clientDir = val;

        if( typeof clientDir !== "string" ) {

            throw new TypeError('clientDir should be an string') ;
        }
    }

    ,_path: null
    ,get path() {

        return this._path;
    }
    ,set path( val ) {

        if( !!this.viewsDir ) {

            val = path.join(this.viewsDir , val  ) ;
        }

        if( !!this.devUse ) {
            this.logs.info( 'path render : ' , val );
        }

        if( typeof val === 'string' ) {

            if( !path.isAbsolute( val ) ) {

                val = path.join( clientDir  , val ) ;
            }

            if( fs.existsSync( val ) ) {

                this._path = val ;

            } else {

                console.log('live reload path render directory not found with: ' , val ) ;
                throw 'please check you call method `liveReload`' ;
            }

        } else {

            throw new TypeError('path should be an string') ;
        }

    }

    ,_viewsDir: null
    ,get viewsDir() {

        return this._viewsDir;
    }
    ,set viewsDir( val ) {

        if( typeof val === 'string' ) {

            const absolutePath = path.join( clientDir , val ) ;

            if( fs.existsSync( absolutePath ) ) {

                this._viewsDir = val ;

            } else {

                console.log( 'live reload views directory not found with: ' , absolutePath );
                throw 'please check you call method `views`' ;

            }

        } else {
            throw new TypeError('views directory bust be an string value , please go read README.md');
        }
    }

    ,_virtualDir: ""
    ,get virtualDir() {

        return this._virtualDir ;
    }
    ,set virtualDir( val ) {

        this._virtualDir = typeof val === 'string' ? val: null;

        if( !this._virtualDir ) {
            throw new TypeError('live reaload argument error for virtual directory please go read README.md') ;
        }
    }

    ,_staticDir: ""
    ,get staticDir() {
        return this._staticDir ;
    }
    ,set staticDir( val ) {

        if( typeof val === 'string' ) {

            const absolutePath = path.join( clientDir , val ) ;

            if( fs.existsSync( absolutePath ) ) {

                this._staticDir = val ;

            } else {
                // path not found
                console.log("live reloading static path not found with : " , absolutePath );
                throw "please check you call of method `static`";
            }

        } else{
            // path not an string
            throw new TypeError("static directory bust be an string please check you call of method `static`");
        }
    }

    ,assets: {
        scripts: []
        ,styles: []
    }
    ,watchers: []
    ,lastReq: null

    ,done() {

        const {reloadEmitter} = this;

        Promise
        .all( this.watchers.map( watcher => watcher.close() ) )
        .then( () => { // all watchers close with success

            let pathRender = this.path;

            if( !!this.devUse ) {

                this.logs.info( 'try watch with: ' , pathRender );
            }

            if( fs.existsSync( pathRender ) ) { // render path give exists

                const watcher = chokidar.watch( pathRender ) ;

                watcher
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

                        if( !!this.devUse ) {

                            if( !!this.virtualDir ) {
                                this.logs.info( 'asset virtual dir : '  , this.virtualDir );
                            } else {
                                this.logs.info( 'not virtual dir define' );
                            }
                        }

                        const absolutePath = path.join( clientDir  , this.staticDir , relativeSource ) ;

                        if( !!this.devUse ) {

                            this.logs.info( 'try call asset with:' , absolutePath );
                        }

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

            } else { // path render not exists

                if(typeof pathRender !== 'string' ) {
                    // socket immediately re emit after re start server on last channel but not new HTTP request listen

                    if( !!this.devUse ) {
                        this.logs.info( 're start server detect auto reload run' );
                    }

                    // server re start detect and synchronize client with an reload
                    reloadEmitter.emit('reload') ;

                } else {

                    if( !!this.devUse ) {
                        this.logs.error('render :' , pathRender , ' not found') ;
                    } else {

                        // error path give by client not reload else infinite reload
                        console.log('render :' , pathRender , ' not found' );
                    }
                    throw 'please check you call method `liveReload` in you response middleware';
                }

            }

        } ).catch( err => { // watcher.s file error close , app broke for dont memory overflow

            console.log( 'close err status: ' , err );
            throw "one or many watcher file fail close" ;

        } ) ;

    }
} ;
