const ICrud = require('./interfaces/interfaceCrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando',
}

class MongoDb extends ICrud {
    constructor() {
        super()
        this._herois = null
        this._driver = null
    }

    async isConnected() {
        const state = STATUS[ this._driver.readyState]
        if (state === 'Conectado') return state

        if (state !== 'Conectando') return state
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return  STATUS[ this._driver.readyState]

    }

    defineModel() {

        const heroisSchema = new Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertAt: {
                type: Date,
                default: new Date()
            }
        })
        
        this._herois = Mongoose.model('herois', heroisSchema)

    }

    connect() {

        Mongoose.connect('mongodb://rafaelbarros:root@192.168.99.100:27017/herois', 
        { useNewUrlParser: true}, function (error) {
            if (!error) return;
    
            console.log('Falha na conexão!', error)
        })
    
        const connection = Mongoose.connection
        connection.once('open', () => console.log('database rodando!!!'))

        this._driver = connection
        this.defineModel()
    }

    create(item) {
       return this._herois.create(item)
    }

    read(item, skip=0, limit=10) {
       return this._herois.find(item).skip(skip).limit(skip);
    }

    update(id, item) {
        return this._herois.updateOne({ _id: id}, {$set: item})
    }

    delete(id) {
        return this._herois.deleteOne({_id: id})
    }

}

module.exports = MongoDb