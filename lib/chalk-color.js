const
    chalk = require('chalk')
    ,error = text => console.log( 'error , ',chalk.bgHex("#e74c3c" ).bold( text ) )
    ,success = text => console.log( 'success',chalk.bgHex('#27ae60').bold(text) )
    ,warn = text => console.log( 'warn , ',chalk.bgHex('#f1c40f').rgb( 40,40,40 ).bold(text) )
    ,info = text => console.log( 'info , ',chalk.bgHex('#2980b9').rgb( 5,5,5 ).bold(text) )
    ,other = text => console.log( 'other , ',chalk.bgHex( '#8e44ad' ).bold( text ) )
;

module.exports= {

    custom: chalk
    ,error: error
    ,success: success
    ,warn: warn
    ,info: info
    ,other: other
} ;
