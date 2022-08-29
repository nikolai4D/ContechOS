const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType, GraphQLString } = require('graphql');

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            hello: {
                type: GraphQLString,
                resolve() {
                    return 'world1';
                },
            },
        },
    }),
});

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;