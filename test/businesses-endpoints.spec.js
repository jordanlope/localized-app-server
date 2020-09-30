const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')
const config = require('../src/config')

describe('Businesses Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: "postgresql://jordanlopez992@localhost/localized_server"
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    //Get all businesses

    describe('GET /api/businesses', () => {
        context('Given no businesses', () => {
            return supertest(app)
                .get('/api/businesses')
                .expect(200, [])
        })

        context('Given businesses in database', () => {
            const businesses = helpers.makeBusinessesArray()

            beforeEach('insert Businesses', async function () {
                await db    
                    .into('business')
                    .insert(businesses)
            })

            it('responds with 200 and all of the businesses', () => {
                return supertest(app)
                    .get('/api/businesses')
                    .expect(200)
                    .then(async (res) => {
                        expect(res.body).to.be.an('array');
                    })
            })

            it('responds with 200 and the specified business', () => {
                const businesses = helpers.makeBusinessesArray()
                const businessId = businesses[0].id
                return supertest(app)
                    .get(`/api/businesses/${businessId}`)
                    .expect(200)
            })
        })
    })

    describe('POST /api/businesses', () => {
        const businesses = helpers.makeBusinessesArray()

        before('insert Businesses', async function () {
            await db    
                .into('business')
                .insert(businesses)
        })

        it('creates a post, responding with 201 and the new post', () => {
            const posts = helpers.makePostsArray()
            const businessId = posts[1].businessid

            return supertest(app)
                .post('/api/businesses')
                .send({
                    name: 'Kintyre',
                    description: "vident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum solut",
                    businessId,
                    typeofbusiness: 'technology'
                })
                .expect(200)
        })
    })
})