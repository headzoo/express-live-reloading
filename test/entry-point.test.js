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

} ) ;
