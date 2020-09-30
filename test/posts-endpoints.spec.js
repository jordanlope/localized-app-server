const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')
const config = require('../src/config')

describe('Posts Endpoints', () => {
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

    const businesses = helpers.makeBusinessesArray()

    before('insert Business', async function () {
        await db    
            .into('business')
            .insert(businesses)
    })

    //Get all posts
    describe('GET /api/posts', () => {
        context('Given no posts', () => {
            return supertest(app)
                .get('/api/posts')
                .expect(200, [])
        })

        context('Given posts in database', () => {
            const posts = helpers.makePostsArray()

            before('insert Posts', async function () {
                await db    
                    .into('post')
                    .insert(posts)
            })

            it('responds with 200 and the specified post', () => {
                const posts = helpers.makePostsArray()
                const postId = posts[0].id
                return supertest(app)
                    .get(`/api/posts/${postId}`)
                    .expect(200)
            })

            it('responds with 200 and all of the posts', () => {
                return supertest(app)
                    .get('/api/posts')
                    .expect(200)
                    .then(async (res) => {
                        expect(res.body).to.be.an('array');
                    })
            })
        })
    })

    // describe.skip('POST /api/posts', () => {
    //     const posts = helpers.makePostsArray()

    //     before('insert Posts', async function () {
    //         await db    
    //             .into('post')
    //             .insert(posts)
    //     })

    //     it('creates a post, responding with 201 and the new post', () => {
    //         const posts = helpers.makePostsArray()
    //         const businessId = posts[0].businessid
    //         console.log(businessId)

    //         return supertest(app)
    //             .post('/api/posts')
    //             .send({
    //                 posttitle: 'Kintyre',
    //                 description: "vident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum solut",
    //                 businessid: businessId
    //             })
    //             .expect(201)
    //     })
    // })
})