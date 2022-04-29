const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema/schema')
const mongoose = require('mongoose')

const app = express()
const port = 3000

mongoose
    .connect(process.env.REACT_APP_MONGO_URL)
    .then((res) => console.log('Connected to Mongo DB'))
    .catch(error => console.log(error))

app.use(
    '/graphql',
    graphqlHTTP(async (request, response, graphQLParams) => ({
        schema: schema,
        graphiql: true,
    })),
)

const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`Connection error: ${err}`))
dbConnection.once('open', () => console.log('Connected to DB!'))

app.listen(port, err => {
    err ? console.log(err) : console.log('Server started!')
})
