const express = require('express')
const xss = require('xss')
const BusinessService = require('./businesses-service')

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
        const { name, description, typeofbusiness } = req.body

        const newBusiness = {
            name: xss(name), 
            description: xss(description), 
            typeofbusiness, 
        }

        for (const [key, value] of Object.entries(newBusiness))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        BusinessService.insertBusiness(req.app.get('db'), newBusiness).then(business => {
            res.send(business)
        }).then(business => {
            res
                .status(201)
                .json(business)
        }).catch(next)
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