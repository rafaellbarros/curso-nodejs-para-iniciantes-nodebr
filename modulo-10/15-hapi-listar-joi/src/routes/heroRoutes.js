const BaseRoute = require('./base/baseRoutes')
const Joi = require('joi')

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
                    failAction: (request, headers, erro) => {
                        throw erro
                    },
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
}

module.exports = HeroRoutes