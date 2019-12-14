/**
 * @author <sam.gabor@hotmail.com>
 * @git <https://github.com/Orivoir/express-live-reloading>
 * 
 * @define variable environement for live reloading middleware express
 * 
 * @var fileWatched path of current file watch
 * @var assetsWatcheds path of currents assets file watch
 * @var itemsAssets items styles/js found web directory
 */

process.liveReloading = {
    fileWatched: null
    , assetsWatcheds: [] 
    , itemsAssets: []  
} ;
