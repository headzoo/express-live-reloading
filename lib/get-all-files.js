
const fs = require('fs') ;

function getAllFiles( path ) {
 
    const { itemsAssets } = process.liveReloading ;

    fs.exists( path , exists => {
        
        if( exists ) {

            fs.readdir( path , (err , items ) => {

                if( err )
                    throw 'asset dir not readable';

                items.forEach( item => {

                    if( fs.statSync( path + '\\' + item ).isDirectory() ) {
                        getAllFiles( path + '\\' + item ) ;
                    } else {
                        if( /js|css/i.test(item.split('.').pop()) )
                            itemsAssets.push( {
                                path: path+ '\\' + item
                                ,source: path.split('public')[1] + '\\' + item
                            } ) ;
                    }

                } ) ;

            } ) ;

        } else {
            console.log( liveReloadMiddleware.config['assets'] + ' dir not found asset not watched');
        }

    } ) ;
} ;

module.exports = getAllFiles ;