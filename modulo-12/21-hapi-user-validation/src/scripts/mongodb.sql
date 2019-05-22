// docker ps
// docker exec -it mongodb mongo -u rafaelbarros -p root --authenticationDatabase herois

// databases
show dbs 

// mudando o contexto para uma database 
use herois

// mostrar tables  (colecoes)
show collections

for (let i=0; i <= 5000; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: `Poder-${i}`,
        dataNascimento: '1988-01-01'
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({nome: -1})
db.herois.find({}, {poder: 1, _id: 0})

// CREATE
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1988-01-01'
})

// READ

db.herois.find()
db.herois.find().pretty()

// UPDATE
// Atenção
db.herois.update({ _id: ObjectId("5c6b623d5f94f3a383f51da1")},
                { nome: 'Mulher maravilha' })

db.herois.update({ _id: ObjectId("5c6b63035f94f3a383f51da2") },
                { $set: { nome: 'Lanterna Verde'}} )

// so atualiza o primeiro que encontra, por padrão na deixa atualizar vários
db.herois.update({ poder: 'Velocidade' },
                { $set: { poder: 'super força' }} )


db.herois.find({ _id: ObjectId("5c6b63035f94f3a383f51da2")})

// DELETE 
// deleta todos
db.herois.remove({})
db.herois.remove({{ _id: ObjectId("5c6b63035f94f3a383f51da2")})
db.herois.remove({nome: 'Lanterna Verde'})