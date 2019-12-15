/**
 * @object config filter/sorted and validate keys config for live reloading
 */
module.exports = {

    /**
     * @var keyAccepts {array<string>} list name **keys** config is accepteds
     */
    _keysAccept: [
        'assets'
        ,'strict'
    ]
    ,get keysAccept() {
        return this._keysAccept;
    }
    ,set keysAccept(val) {/* immutable attribute reject all set */}

    /**
     * @var done config client send from `set` method
     */
    ,done: {}

    /**
     * @var client config client after filter/validate
     */
    ,client: {}

    /**
     * @method affect save valid keys config
     * @param keysAccept {array<string>} name keys valid
     * @return self
     */
    ,affect( keysAccept ) {

        keysAccept.forEach( key => (
            this.client[ key ] = this.done[ key ]
        ) ) ;

        return this ;
    }
    
    /**
     * @method broke throw exec because user have define an strict execution and have found an key not valid 
     */
    ,broke( keyError ) {

        console.log( 'key "' , keyError , '" is not a valid config key' );
        throw 'you have define an strict execution , config key not valid are blocked' ;
    }

    /**
     * @method alert log warn keys reject config
     * @param keysAccept {array<string>} name keys reject
     * @return self
     */
    ,alert( keysReject ) {

        const sizeKey = keysReject.length , 
            staticLog = 'reject because not recognize'
        ;

        if( this.client['strict'] && sizeKey )
            this.broke( keysReject[ 0 ] ) ;

        if( sizeKey <= 5 )

            keysReject.forEach( key => {
                // @TODO: add an cli color dependency

                console.log( `key name: "${key}" is ${staticLog}` ) ;
            } ) ;

        else
            console.log(`you'r ${sizeKey} keys ${staticLog} `)

        return this;
    }

    /**
     * @getter sorted filter **keys** config accept and reject
     * @eturn {object<array<string>>} name keys filter with reject/valid
     */
    ,get sorted() {

        return {
            keysAccept: Object.keys( this.done ).filter( attr => (
                this.keysAccept.includes(attr) 
            ) ) ,
            keysReject: Object.keys( this.done ).filter( attr => (
                !this.keysAccept.includes(attr)
            ) )
        } ;
    }
} ;
