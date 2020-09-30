function makeBusinessesArray() {
    return [
        {
            id: 1,
            name: 'Venmo',
            description: 'Transfer all of your money virtually',
            typeofbusiness: 'Finance'
        },
        {
            id: 2,
            name: 'Big Burger',
            description: 'The most delicious burgers in the USA',
            typeofbusiness: 'Food'
        },
        {
            id: 3,
            name: 'AX',
            description: 'Top quality clothing at the finest price',
            typeofbusiness: 'Clothing'
        }
    ]
}

function makePostsArray() {
    return [
        {
            id: 2,
            businessid: 1,
            posttitle: 'Make the payment of your Life',
            description: 'Get 3% cash on each transaction'
        },
        {
            id: 3,
            businessid: 2,
            posttitle: '$5 Burger Special',
            description: 'Try our new special burger that will only be available every other month'
        },
        {
            id: 4,
            businessid: 3,
            posttitle: '50% off your Online Order',
            description: 'Get this coupon now when you can a purchase in-person'
        }
    ]
}

function getBusinesses(db) {
    return db
    .select('*')
    .from('business')
}

function getPosts(db) {
    return db
    .select('*')
    .from('post')
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          business,
          post`
      )
      .then((res) => console.log("Truncated")
      )
    )
}

async function seedBusinessesTable(db) {
    const businesses = helpers.makeBusinessesArray()

    await db
        .into('business')
        .insert(businesses)
}

async function seedPostsTable(db) {
    const posts = helpers.makePostsArray()

    await db
    .into('post')
    .insert(posts)
}

module.exports = {
    makeBusinessesArray,
    makePostsArray,
    getBusinesses,
    getPosts,
    cleanTables,
    seedBusinessesTable,
    seedPostsTable
}