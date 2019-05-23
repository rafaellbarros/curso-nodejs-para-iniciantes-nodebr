// npmn i hapi
// npm i vision inert hapi-swagger
// npm i hapi-auth-jwt2
// npm i bcrypt
// npm i dotenv
// npm i -g cross-env
// cross-env NODE_ENV=prod npm t
const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"

ok(env === 'prod' || env === 'dev', 'a env é invalida, ou dev ou prod')

const configPath = join(__dirname, './config', `.env.${env}`)

config({
    path: configPath
})

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')

const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const HapiJwt = require('hapi-auth-jwt2')
const UtilRoutes = require('./routes/utilRoutes')

const MINHA_CHAVE_SECRETA = process.env.JWT_KEY

const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {

    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const usuarioModelSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioModelSchema))

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'

        },
        lang: 'pt'
    }
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: MINHA_CHAVE_SECRETA,
        // options: {
        //     expiresIn: 20
        // }
        validate: async (dado, request) => {

            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase(),
                id: dado.id
            })

            if (!result) 
              return {
                  isValid: false
              }

            // verifica no banco se usuario continua ativo
            // verfiica no banco se usuario continua pagando

            return {
                isValid: true // caso nao valido false
            }
        }
    })
    
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(MINHA_CHAVE_SECRETA, contextPostgres), AuthRoute.methods()),
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)

    return app
}
module.exports = main()