const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')
const Subscription = require('./resolvers/Subscription')
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()


const resolvers = {
    Query,
    Mutation,
    User,
    Subscription,
    Link,
    Vote,
}

const prisma = new PrismaClient()

// 2
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        console.log("context is called")
        return {
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization
                    ? getUserId(req.headers.authorization)
                    : returnnull()
        };
    }
});

const returnnull = () => {
    console.log("null was called")
    return null
}

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );