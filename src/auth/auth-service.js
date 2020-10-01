const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getAllUsers(db) {
        return db
            .from('business')
            .select('*')
    },
    getById(db, id) {
        return UsersService.getAllUsers(db)
            .where({ id })
            .first()
    },
    hasUserWithUserName(db, name) {
        return db('business')
          .where({ name })
          .first()
          .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
          .insert(newUser)
          .into('business')
          .returning('*')
          .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
          return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
          return 'Password be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
          return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
          return 'Password must contain one upper case, lower case, number and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            name: xss(user.name),
            description: xss(user.description),
            typeofbusiness: user.typeofbusiness
        }
    },
    getUserWithUserName(db, username) {
        return db('business')
          .where({ username })
          .first()
    },
    comparePasswords(password, hash) { 
        return bcrypt.compare(password, hash)
    },
}

module.exports = UsersService