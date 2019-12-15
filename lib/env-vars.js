/**
 * @author <sam.gabor@hotmail.com>
 * @git <https://github.com/Orivoir/express-live-reloading>
 * 
 * @define variable environement for live reloading middleware express
 * 
 * @var itemsAssets items styles/js found inside web directory
 * @var changeWatch boolean if current request is equal to last request
 * @var lastURL stock last request url ask 
 * @var webDir path root of web directory
 * @var config **live reloading** `config` after filter and validate **keys**
 * @var chokidar manager watch files
 */
process.liveReloading = {

    itemsAssets: []
    ,changeWatch: true
    ,lastURL: null
    ,webDir:  require('./webdir')()
    ,_config: require('./config')
    ,chokidar: {
        manager: require('chokidar')
        ,watchers: []
    }

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
