/*
    0 - Obter um usuário
    1 - Obter o número de telefone de um usuário a partir de seu Id
    2 - Obter o endereco do usuario pelo Id

*/

function obterUsuario(callback) {
    setTimeout(() => {
        return callback(null, {
            id: 1,
            nome: 'Aladin',
            dataNascimento: new Date()
        })
    }, 1000)
}

function obterTelefone(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            telefone: '1199002',
            ddd: 11,
            dataNascimento: new Date()
        })
    }, 2000)
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'dos felas',
            numero: 0
        })
    })

}

function resolverUsuario(erro, usuario) {
    console.log('usuario: ', usuario);
}

obterUsuario(function resolverUsuario(error, usuario) {
    // null || "" || 0 === false
    if (error) {
        console.error('DEU RUIM em USUARIO');
        return;
    }

    obterTelefone(usuario.id, function resolverTelefone(erro1, telefone) {
        if (erro1) {
            console.error('DEU RUIM em TELEFONE');
            return;
        }

        obterEndereco(usuario.id, function resolverEndereco(erro2, endereco) {
            if (erro2) {
                console.error('DEU RUIM em ENDERECO');
                return;
            }

            console.log(`
                Nome: ${usuario.nome}.,
                Endereco: ${endereco.rua}, ${endereco.numero}
                Telefone: ${telefone.ddd}, ${telefone.telefone}
            `)
        })
    })
})

// const telefone = obterTelefone(usuario.id)

// console.log('telefone: ', telefone);