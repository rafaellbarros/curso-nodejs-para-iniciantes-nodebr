const service = require('./service')

async function main() {
    try {
        const result = await service.obterPessoas('a');
        const names = []
 
            console.time('for')
            for (let index = 0; index < result.results.length - 1; index++) {
                const pessoa = result.results[index];
                names.push(pessoa.name)
            }
            console.timeEnd('for')
     
       
            console.time('forin')
            for(let index in result.results) {
                const pessoa = result.results[index];
                names.push(pessoa.name)
            }
            console.timeEnd('forin')
        
            console.time('forof')
            for(pessoa of result.results) {
                names.push(pessoa.name)
            }
            console.timeEnd('forof')


        console.log(`names: `, names)

    } catch (error) {
        console.log(`error interno: `, error)
    }

}

main()