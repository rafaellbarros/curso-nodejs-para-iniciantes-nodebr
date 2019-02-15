const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Constext = require('../db/strategies/base/contextStrategy')

const context = new Constext(new Postgres())

describe('Postgres Strategy', function()  {
    this.timeout(Infinity);
    it ('PostgresSQL Connection', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })
})