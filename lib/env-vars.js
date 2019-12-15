/**
 * @author <sam.gabor@hotmail.com>
 * @git <https://github.com/Orivoir/express-live-reloading>
 * 
 * @define variable environement for live reloading middleware express
 * 
 * @var fileWatched path of current file watch
 * @var assetsWatcheds path of currents assets file watch
 * @var itemsAssets items styles/js found inside web directory
 * @var webDir path root of web directory
 * @var config **live reloading** `config` after filter and validate **keys**
 */

process.liveReloading = {

    fileWatched: null
    , assetsWatcheds: [] 
    , itemsAssets: []
    ,webDir:  require('./webdir')()
    ,_config: require('./config')

    ,get config() {
        return this._config.client;
    }

    /**
     * @setter config
     * @param config {object} config user
     * @description filter/validate **keys** config
     */
    ,set config( config ) {

        this._config.done = config ;

        const {keysAccept,keysReject} = this._config.sorted ;

        this._config
            .affect( keysAccept )
            .alert( keysReject )
        ;

    }
} ;
