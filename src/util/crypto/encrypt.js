const crypto = require('crypto')

const algorithm = 'aes-256-cbc'

const params = {
    key : 'Q0IgmneFqf8nE7Jxjee1HlvqZhHlGZSk',
    iv : 'tPWi5B3KJvqdRqcM'
}

const encryption = {

    encrypt(text) {
        const cipher = crypto.createCipheriv(algorithm, params.key, params.iv)
        let encrypted = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return encrypted
    },

    decrypt(text) {
        const encryptedText = Buffer.from(text, 'hex')
        const decipher = crypto.createDecipheriv(algorithm, params.key, params.iv)
        const decrypted = decipher.update(encryptedText)
        const final = Buffer.concat([decrypted, decipher.final()])
        return final.toString()
    }
}

