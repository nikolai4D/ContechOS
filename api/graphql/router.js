const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType, GraphQLString} = require('graphql');
const {GraphQLList} = require("graphql/type")
const {Node, QueryNodeInput, Relation, QueryRelationInput, MutationItem, CreateInput} = require("./graphql_types")
const {queryRelationsResolver, queryNodesResolver} = require("./resolvers");
const {deleteItem} = require("../../database/crud/delete");
const {createItem} = require("../../database/crud/create");

let schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                node: {
                    type: new GraphQLList(Node),
                    args: {
                        nodeInput: { type: QueryNodeInput }
                    },
                    async resolve (root, args){
                        return await queryNodesResolver(args.nodeInput)
                    }
                },
                relation: {
                    type: new GraphQLList(Relation),
                    args: {
                        relationInput: { type: QueryRelationInput }
                    },
                    async resolve(root, args) {
                        return await queryRelationsResolver(args.relationInput)
                    }
                },
                properties: {
                    type: new GraphQLList(Relation),
                    args: {
                        relationInput: { type: QueryRelationInput }
                    },
                    async resolve(root, args) {
                        return await queryRelationsResolver(args.relationInput)
                    }
                },
            },
        }),
        mutation: new GraphQLObjectType({
            name: "RootMutationType",
            fields: {
                create: {
                    type: MutationItem,
                    args: {
                        item: { type: CreateInput }
                    },
                    async resolve(root, args){
                        console.log("graphQL create request received.")
                        return await createItem(args.item)
                    }
                },
                delete: {
                    type: new GraphQLList( GraphQLString),
                    args: { id: GraphQLString },
                    async resolve(root, args){
                        return await deleteItem(args.id)
                    }
                },
                update: {
                    type: MutationItem,
                    args: { id: GraphQLString },
                    async resolve(root, args){
                        return await updateItem(args.id)
                    }
                },
            }
        }),
        types: [Node, Relation, CreateInput, MutationItem]
    }
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;