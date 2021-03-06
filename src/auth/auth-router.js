const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { username, password } = req.body
    const loginUser = { username, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.username
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'user_name not found',
          })

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect user_name or password',
              })
            console.log(dbUser.id)
            const id = `${dbUser.id}`
            const token = AuthService.createJwt(id, {
                businessId: dbUser.id,
                name: dbUser.name,
                typeOfBusiness: dbUser.typeofbusiness,
                description: dbUser.description
            })

            res.send({
                token,
                businessId: dbUser.id,
                name: dbUser.name,
                typeOfBusiness: dbUser.typeofbusiness,
                description: dbUser.description
            })
          })
      })
      .catch(next)
  })

module.exports = authRouter