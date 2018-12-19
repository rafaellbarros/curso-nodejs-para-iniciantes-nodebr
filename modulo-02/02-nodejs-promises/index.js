/*
    0 - Obter um usuário
    1 - Obter o número de telefone de um usuário a partir de seu Id
    2 - Obter o endereco do usuario pelo Id

*/
// importamos um módulo inter do node.js

const util = require('util')
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    // quando der algum problema -> reject(ERRO)
    // quando sucess -> RESOLVE
    return  new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            // return reject(new Error('DEU RUIM DE VERDADE!'))
            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            })
        }, 1000)
    })

}

function obterTelefone(idUsuario) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                telefone: '1199002',
                ddd: 11
            })
        }, 2000)    
    })

}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'dos felas',
            numero: 0
        })
    })

}

const usuarioPromise = obterUsuario()
// para manipular o sucesso usamos a função .then
// para manipular erros, usamos o .catch
// usuario -> telefone -> telefone
usuarioPromise
    .then((usuario) => {
        return obterTelefone(usuario.id)
        .then((result) => {
            return {
                usuario: {
                    nome: usuario.nome,
                    id: usuario.id,
                },
                telefone: result
            }
        })
    })
    .then((resultado) => {
        const endereco = obterEnderecoAsync(resultado.usuario.id)
        return endereco.then((result) => {
            return {
                usuario: resultado.usuario,
                telefone: resultado.telefone,
                endereco: result
            }
        })
    })
    .then((resultado) => {
        console.log(`
            Nome: ${resultado.usuario.nome}
            Endereco: ${resultado.endereco.rua}, ${resultado.endereco.numero}
            Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
        `);
    })
    .catch((error) => {
        console.error('DEU RUIM: ', error);
    })


// const telefone = obterTelefone(usuario.id)

// console.log('telefone: ', telefone);