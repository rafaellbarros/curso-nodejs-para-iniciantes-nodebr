const BaseRoute = require('./base/baseRoutes')

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this._db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                return this._db.read()
            }
        }
    }
}

module.exports = HeroRoutes