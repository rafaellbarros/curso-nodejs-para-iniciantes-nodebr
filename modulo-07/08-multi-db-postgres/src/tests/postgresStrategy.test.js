const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Postgres())
const MOCK_HEROI_CADASTRAR = { 
    nome: 'Gavião Negro',
    poder: 'flexas'
}

const MOCK_HEROI_ATUALIZAR = { 
    nome: 'Batman',
    poder: 'dinheiro'
}

describe('Postgres Strategy', function ()  {
    this.timeout(Infinity);
    
    this.beforeAll(async () => {
        await context.connect()
        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
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

    it ('atualizar', async () => {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id})
        assert.deepEqual(result, 1)
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
        /*
            No Javascript temos uma tecnica chamada rest/spread que é um metodo usado para mergear objectos
            ou separa-lo
            {
                nome: 'Batman',
                poder: 'Dinheiro'
            }
            {
                dataNascimento: '1988-01-01'
            }
            //final
            {
                nome: 'Batman',
                poder: 'Dinheiro',
                dataNascimento: '1988-01-01'                
            }
        */
    })

    it ('remover por id', async () => {
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)
    })
    
})