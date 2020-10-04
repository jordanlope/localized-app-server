const xss = require('xss')

const PostService = {
    getAllPosts(db) { //Get all works well on Postman
        return db  
            .from('post as post')
            .select(
                'post.id',
                'post.businessid',
                'post.posttitle',
                'post.description'
            )
    },

    insertPost(db, newPost) {
        return db
            .insert(newPost)
            .into('post')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    
    getById(db, id) { // Get ID works well on Postman
        return PostService.getAllPosts(db)
        .where({ id }, id)
        .first()
    },

    getAllPostsWithId(db, id) {
        return PostService.getAllPosts(db)
        .where( id === id)
    },

    deletePost(db, id) { // Delete house works well on Postman
        return db.from('post')
            .where({ id })
            .first()
            .delete()
    },

    updatePost(db, id, newPostFields) { //Update house works well on Postman
        return db.from('post')
            .where({ id })
            .first()
            .update(newPostFields)
    },

    serializePost(post) {
        return {
            id: post.id,
            postTitle: xss(post.posttitle),
            description: xss(post.description),
            businessId: post.businessid,
        }
    },
}

module.exports = PostService