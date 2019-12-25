document.addEventListener('DOMContentLoaded' , () => {

    if( !(io instanceof Function) ) {
        throw 'io not exists' ;
    }

    const socket = io('/live-reload') ;

    let hostname = document.location.host ;
    let skip = null ;

    const extractDns = source => (
        source.split('://')[1].split('/')[0]
    ) ;

    const checkSend = (source,sourceRelative,type) => {

        const ext = type === 'style' ? 'css':'js';
        const minifiedRegexp = new RegExp('\.(min|(pre-)?prod|dist)\.'+ext+'$') ;

        return !(
            !source ||
            extractDns( source ) !== hostname ||
            skip[type+'s'].includes( sourceRelative ) ||
            minifiedRegexp.test( sourceRelative )
        ) ;

    } ;

    /**
     * emit asset 2 server
     */
    const done = function() {

        const styles = [ ...document.querySelectorAll('link') ].filter( style => (

            checkSend( style.href , style.getAttribute('href') , 'style' )

        ) ).map( style => style.getAttribute('href') ) ;

        const scripts = [ ...document.querySelectorAll('script') ].filter( script => (
            checkSend( script.src , script.getAttribute('src') ,  'script' )
        ) ).map( script => script.getAttribute('src') ) ;

        socket.emit('assets' , {
            styles: styles
            ,scripts: scripts
        } ) ;
    } ;

    socket.on('skip' , assetsSkip => {

        skip = assetsSkip ;

        done() ;
    } ) ;

    socket.on('connect' , () => {

        console.info('%c[live reload] on' , `color:green;background:rgb(0,0,25);padding: 3px 5px;` );

    } ) ;

    socket.on('disconnect' , () => {

        console.warn('%c[live reload] off' , `color:red;background:rgb(0,0,25);padding: 3px 5px;` );

    } ) ;

    socket.on('reload' , () => document.location.reload() ) ;

    socket.on('success watch' , path => console.info( path , ' --watched with success' ) ) ;

    socket.on('fail watch' , path => console.warn( path , ' fail watch' ) ) ;

} ) ;