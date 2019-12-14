if( !(io instanceof Function) )
    throw "io Function not exists call script : `/socket.io/socket.io.js` before this script" ;

( socket => {

    // socket
    // .on('change' , () => {
    //     console.log( 'listen' );
    //     document.location.reload();
    // } )
    // .on('error' , status => {

    //     const {type} = status;

    //     if( /not.*found/i.test(type) ) {
    //         console.error('hot reload module error file not found for : ' , type.path );
    //     }

    // } ) ;

    socket.on('simply' , ({done}) => eval( done ) ) ;

    document.addEventListener('DOMContentLoaded' , () => {

        socket.emit(
            'styles' ,
            [ ...document.querySelectorAll('link') ]
            .map( style => (
                style.href
            ) ) )
        ;
        socket.emit(
            'script' ,
            [ ...document.querySelectorAll('script') ]
            .map( script => (
                script.src
            ) ) )
        ;

    } ) ;

} )( io('/live-reload') ) ;
