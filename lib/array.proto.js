/**
 * @method equal2
 * @memberof Array
 * @description test equal array
 */
Array.prototype.equal2 = function(ref) {

    if( !(ref instanceof Array) ) return false;

    let eq = true;

    this.forEach( (el,key) => {

        if( el != ref[key] )
            eq = false;
    } );

    return eq;
} ;
