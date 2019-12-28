const
    {assert} = require('chai')
    ,entryPointTest = require('./../lib/entry-point')
;

describe('test `entry-point` module' , () => {

    it('should be an Function' , () => {

        assert.isFunction( entryPointTest ) ;

    } ) ;

    let TCPAttach = entryPointTest() ;

    it('should be return Function' , () => {

        assert.isFunction( TCPAttach ) ;

    } ) ;

    // it.skip('should active env dev' , () => {

    //     assert.isTrue( process.liveReload.devUse ) ;

    // } ) ;

    // it.skip('should not active env dev' , () => {

    //     TCPAttach( serverFactory ) ;

    //     assert.isFalse( process.liveReload.devUse ) ;

    // } ) ;


} ) ;