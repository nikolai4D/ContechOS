const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString} = require('graphql');
const { GraphQLList } = require("graphql/type")
const { Node, Relationship, Property, MutationItem, QueryInput, CascadeNode} = require("./graphqlTypes")
const { graphResolver } = require("./resolvers");
const cascade = require("./dbAccessLayer/helpers/cascade");

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
            cascade: {
                type: new GraphQLList(CascadeNode),
                args: {
                    configDefs: { type: new GraphQLList(GraphQLString) },
                    configObjs: { type: new GraphQLList(GraphQLString) },
                    typeInstances: { type: new GraphQLList(GraphQLString) },
                    dataInstances: { type: new GraphQLList(GraphQLString) },
                },
                async resolve(root, args) {
                    let intersection = await cascade(args)
                    intersection["depth"] = 0

                    return [intersection]
                }
            }
        },
    }),
    types: [Node, Relationship, Property, CascadeNode, QueryInput, MutationItem]
})

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;