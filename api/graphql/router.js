const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const { GraphQLList } = require("graphql/type")
const { Node, Relationship, Property, MutationItem, QueryInput } = require("./graphqlTypes")
const { graphResolver } = require("./resolvers");

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            nodes: {
                type: new GraphQLList(Node),
                args: {
                    itemInput: { type: QueryInput }
                },
                async resolve(root, args) {
                    return await graphResolver(args.itemInput, { kindOfItem: "node" })
                }
            },
            relationships: {
                type: new GraphQLList(Relationship),
                args: {
                    itemInput: { type: QueryInput }
                },
                async resolve(root, args) {
                    return await graphResolver(args.itemInput, { kindOfItem: "relationship" })
                }
            },
            properties: {
                type: new GraphQLList(Property),
                args: {
                    itemInput: { type: QueryInput }
                },
                async resolve(root, args) {
                    return await graphResolver(args.itemInput, { kindOfItem: "property" })
                }
            },
        },
    }),
    types: [Node, Relationship, Property, QueryInput, MutationItem]
}
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;