const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean} = require('graphql');
const { GraphQLList } = require("graphql/type")
const { Node, Relationship, Property, MutationItem, QueryInput, CascadeNode, CascadeInput} = require("./graphqlTypes")
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
                    cascadeInput: { type: CascadeInput }
                },
                async resolve(root, args) {
                    let answer = await cascade(args.cascadeInput)

                    answer.configDefNodes.map(node => {
                        node.cascade = answer
                        node.depth = 0
                    })

                    return answer.configDefNodes
                }
            }
        },
    }),
    types: [Node, Relationship, Property, CascadeNode, CascadeInput, QueryInput, MutationItem]
})

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;