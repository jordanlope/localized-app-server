const express = require('express')
const xss = require('xss')
const PostService = require('./posts-service')

const postRouter = express.Router()
const jsonParser = express.json()

postRouter
    .route('/')
    .get((req, res, next) => {
        PostService.getAllPosts(req.app.get('db'))
            .then(posts => {
                res.json(posts)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { businessid, posttitle, description } = req.body

        const newPost = {
            posttitle: xss(posttitle), 
            description: xss(description), 
            businessid
        }

        for (const [key, value] of Object.entries(newPost))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        PostService.insertPost(
            req.app.get('db'),
            newPost
        ).then(post => {
            res
                .status(201)
                .json(post)
        }).catch(next)
    })

postRouter
    .route('/all/:postId')
    .get((req, res, next) => {
        PostService.getAllPostsWithId(req.app.get('db'), req.params.postId)
            .then(posts => {
                res.json(posts)
            })
            .catch(next)
    })
    
postRouter
    .route('/:postId')
    .all((req, res, next) => {
        PostService.getById(
            req.app.get('db'),
            req.params.postId
        ).then(post => {
            if (!post) {
                return res.status(404).json({
                    error: { message: `Post doesn't exist` }
                })
            }
            res.post = post
            next()
        }).catch(next)
    })
    .get((req, res, next) => {
        res.json(res.post)
    })
    .delete((req, res, next) => {
        console.log('Post Id', req.params.postId)
        PostService.deletePost(
            req.app.get('db'),
            req.params.postId
        ).then(numRowsAffected => {
            res.status(204).end()
        }).catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { businessid, description, posttitle } = req.body
        const postToUpdate = { 
            businessid: xss(businessid), 
            description, 
            posttitle: xss(posttitle), 
        }

        PostService.updatePost(
            req.app.get('db'),
            req.params.postId,
            postToUpdate
        ).then(numRowsAffected => {
            res.json('Successful').status(204).end()
        }).catch(next)
    })

module.exports = postRouter