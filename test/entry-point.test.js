const
    {assert,expect,done} = require('chai')
    ,emitterFactory = new ( require('events') )
    ,entryPointTest = require('./../lib/entry-point')
;

describe('test `entry-point` module' , () => {

    it('should be an Function' , () => {

        assert.isFunction( entryPointTest ) ;

    } ) ;

    it('should be return Function' , () => {

        assert.isFunction( entryPointTest( emitterFactory ) ) ;

    } ) ;

    it('should be throw TypeError' , () => {

        try {

            expect( entryPointTest() ).to.throw( 'arg1 must be an object emitter' ) ;

            throw 'have not throw TypeError' ;

        } catch( TypeError ) {
            // ok !
        }

    } ) ;

} ) ;