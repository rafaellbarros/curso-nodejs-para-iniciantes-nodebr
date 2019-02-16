const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Postgres())
const MOCK_HEROI_CADASTRAR = { 
    nome: 'Gavião Negro',
    poder: 'flexas'
}



describe('Postgres Strategy', function ()  {
    this.timeout(Infinity);
    
    this.beforeAll(async () => {
        await context.connect()
    })

    it ('PostgresSQL Connection', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it ('cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it ('listar', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome})
        // pegar a primeira posição
        // const posicaoZero = result[0]
        // const [posicao1, posicao2] = ['esse e o 1', 'esse eo 2']
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    
})