const
    {expect,assert} = require('chai')
    ,addWatcherTest = require('./../lib/add-watcher')
;

describe('test `add-watcher` module' , () => {

    let watcherTest = null ;

    it('should be an Function' , () => {

        assert.isFunction( addWatcherTest ) ;

    } ) ;

    it('should be return an object' , () => {

        watcherTest = addWatcherTest('');
         assert.isObject( watcherTest  ) ;
    } ) ;


    it('should be remove `listener file`' , () => {

        watcherTest.close() ;
    } ) ;

} ) ;