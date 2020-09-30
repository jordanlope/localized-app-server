const xss = require('xss')

const BusinessesService = {
    getAllBusinesses(db) { //Get all works well on Postman
        return db  
            .from('business AS business')
            .select(
                'business.id',
                'business.name',
                'business.description',
                'business.typeofbusiness'
            )
    },

    insertBusiness(db, newBusiness) {
        return db
            .insert(newBusiness)
            .into('business')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(db, id) { // Get ID works well on Postman
        return BusinessesService.getAllBusinesses(db)
        .where({ id }, id)
        .first()
    },

    deleteBusiness(db, id) { // Delete house works well on Postman
        return db.from('business')
            .where({ id })
            .first()
            .delete()
    },

    updateBusiness(db, id, newBusinessFields) { //Update house works well on Postman
        return db.from('business')
            .where({ id })
            .first()
            .update(newBusinessFields)
    },

    serializeBusiness(business) {
        return {
            id: business.id,
            name: xss(business.name),
            description: xss(business.description),
            typeOfBusiness: business.typeofbusiness,
        }
    },
}

module.exports = BusinessesService