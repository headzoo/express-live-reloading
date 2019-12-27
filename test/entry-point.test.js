const
    {expect,assert} = require('chai')
    ,entryPointTest = require('./../express-live-reloading')
;

describe('entry point test' , () => {

    it('should be an Function' , () => {

        assert.isFunction(entryPointTest)

    }  ) ;

} ) ;