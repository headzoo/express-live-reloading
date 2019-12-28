const
    {assert} = require('chai')
    ,entryPointTest = require('./../lib/entry-point')
    ,serverFactory = require('http').Server( () => {} )
;

describe('test `entry-point` module' , () => {

    it('should be an Function' , () => {

        assert.isFunction( entryPointTest ) ;

    } ) ;

    it('should be return Function' , () => {

        assert.isFunction( entryPointTest( serverFactory ) ) ;

    } ) ;

    it.skip('should active env dev' , () => {

        entryPointTest( serverFactory , __dirname ) ;

        assert.isTrue( process.liveReload.devUse ) ;

    } ) ;

} ) ;