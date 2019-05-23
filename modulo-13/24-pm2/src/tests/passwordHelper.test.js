const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Rafael@123'
const HASH = '$2b$04$k1zOne4Kk5ykOLC2RXvP4uCp//BbuKU94.Y6vAHs3Tj/Tehe0VDyK'

describe('UserHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    });


    it('deve comparar um senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    });
})
