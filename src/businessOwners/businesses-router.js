const express = require('express')
const xss = require('xss')
const BusinessService = require('./businesses-service')
const UserService = require('../auth/auth-service')
const { hasUserWithUserName, hashPassword } = require('../auth/auth-service')
const UsersService = require('../auth/auth-service')
const businessesRouter = express.Router()
const jsonParser = express.json()

businessesRouter
    .route('/')
    .get((req, res, next) => {
        BusinessService.getAllBusinesses(req.app.get('db'))
        .then(businesses => {
            res.json(businesses)
        }).catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, description, typeofbusiness, username, password } = req.body

        for (const field of ['name', 'description', 'typeofbusiness', 'username', 'password'])
        if (!req.body[field])
          return res.status(400).json({
            error: `Missing '${field}' in request body`
          })

        UserService.hasUserWithUserName(
            req.app.get('db'),
            username
        ).then(hasUserWithUserName => {
            if(hasUserWithUserName) 
                return res.status(400).json({ error: 'Username already taken' })

            const checkPassword = UserService.validatePassword(password)
            if(checkPassword)
                return res.status(401).json({ error: 'Password invalid' })

            return UserService.hashPassword(password)
                .then(hashedPassword => {
                    const newBusiness = {
                        name: xss(name),
                        description: xss(description), 
                        typeofbusiness, 
                        username: xss(username),
                        password: hashedPassword,
                    }
                    console.log('Hashed', hashedPassword)
                    return UserService.insertUser(
                        req.app.get('db'),
                        newBusiness
                    ).then(user => 
                        res
                            .status(201)
                            // .location(path.posix.join(req.originalUrl, `/${user.id}`))
                            .json(UserService.serializeUser(user))
                    )
                })
        })
        .catch(next)
    })

businessesRouter
    .route('/:businessId')
    .all((req, res, next) => {
        BusinessService.getById(
            req.app.get('db'),
            req.params.businessId
        ).then(business => {
            if (!business) {
                return res.status(404).json({
                    error: { message: `Business doesn't exist` }
                })
            }
            res.business = business
            next()
        }).catch(next)
    })
    .get((req, res, next) => {
        res.json(res.business)
    })
    .delete((req, res, next) => {
        console.log('Business Id', req.params.businessId)
        BusinessService.deleteBusiness(
            req.app.get('db'),
            req.params.businessId
        ).then(numRowsAffected => {
            res.status(204).end()
        }).catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, description, typeofbusiness } = req.body
        const businessUpdated = { 
            name: xss(name), 
            description: xss(description), 
            typeofbusiness, 
        }

        BusinessService.updateBusiness(
            req.app.get('db'),
            req.params.businessId,
            businessUpdated
        ).then(numRowsAffected => {
            res.json('Successful').status(204).end()
        }).catch(next)
    })

module.exports = businessesRouter