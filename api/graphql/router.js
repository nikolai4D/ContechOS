const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType, GraphQLString} = require('graphql');
const {GraphQLList} = require("graphql/type")
const {Items, Node, Relation, Property, MutationItem, CreateInput, QueryInput, ItemsByDefinitionType} = require("./graphql_types")
const {itemsResolver} = require("./resolvers");
const {deleteItem} = require("../../database/crud/delete");
const {createItem} = require("../../database/crud/create");

let schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                items: {
                    type: ItemsByDefinitionType,
                    args: {
                        itemInput: { type: QueryInput }
                    },
                    async resolve (root, args){
                        console.log("hello")
                        return await itemsResolver(args.itemInput)
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
                    args: { id: {type: GraphQLString} },
                    async resolve(root, args){
                        return await deleteItem(args.id)
                    }
                },
                update: {
                    type: MutationItem,
                    args: { id: {type: GraphQLString} },
                    async resolve(root, args){
                        return await updateItem(args.id)
                    }
                },
            }
        }),
        types: [Node, Relation, Property, Items, QueryInput, CreateInput, MutationItem]
    }
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;