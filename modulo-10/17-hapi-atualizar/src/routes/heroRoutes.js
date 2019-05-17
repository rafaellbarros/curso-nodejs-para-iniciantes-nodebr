const BaseRoute = require('./base/baseRoutes')
const Joi = require('joi')
const failAction = (request, headers, erro) => {
    throw erro
}

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this._db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> nar URL :id
                    // query -> ?skip=0&limit=100
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100).default('')
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome} = request.query
                   
                    const query = nome ? { nome: {$regex: `.*${nome}*.`} } : {}

                    return this._db.read(nome ? query : {}, skip, limit)
                }
                catch(error) {
                    console.error('DEU RUIM', error)
                    return "Error interno no servidor"
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this._db.create({ nome, poder })

                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    }
                } 
                catch (error) {
                    console.log('DEU RUIM', error)
                    return 'Internal Error!'
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload }  = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this._db.update(id, dados)
                    if ( result.nModified !== 1) return {
                        message: 'Não foi possivel atualizar!'
                    }
                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }
                } 
                catch (error) {
                    console.log('DEU RUIM', error)
                    return 'Erro interno!'
                }
            }
        }
    }

}

module.exports = HeroRoutes