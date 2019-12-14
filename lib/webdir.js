// resolve path web directory
module.exports = function() {
    
    const sep = __dirname.indexOf('/') != -1 ? '/' : '\\' ;

    let foundLast = false; 

    return __dirname
        .split( sep )
        .filter( ressource => {
            
            if( 
                foundLast ||
                /express-live-reload|nodes?_modules?/.test( ressource )
            ) {
                foundLast = true;
                return false;
            }

            return ressource;
        } )
        .join( sep ) + '\\'
    ;
}
