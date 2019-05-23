const BaseRoute = require('./base/baseRoutes')
const Joi = require('joi')
const Boom = require('boom')

// npm i jsonwebtoken
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (request, headers, erro) => {
    throw erro
}
const USER = {
    username: 'manolodasilva',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this._secret = secret
        this._db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'faz login com user e senha do banco',
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload

                const [usuario] = await this._db.read({
                    username: username.toLowerCase()
                })

                if (!usuario)
                    return Boom.unauthorized('O usuario informado não existe!')

                const match = await PasswordHelper.comparePassword(password, usuario.password)

                if (!match)
                    return Boom.unauthorized('O usuario ou senha invalidos!')

                // if (username.toLowerCase() !== USER.username || password !== USER.password)
                //     return Boom.unauthorized()

                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this._secret)

                return  {
                    token
                }
            }
        }
    }
}

module.exports = AuthRoutes