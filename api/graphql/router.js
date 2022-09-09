const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType} = require('graphql');
const {GraphQLList} = require("graphql/type")
const {Node, QueryNodeInput, Relation, QueryRelationInput, CreateNodeInput, CreateRelationInput} = require("./graphql_types")
const {queryRelationsResolver, queryNodesResolver} = require("./resolvers");
const {access} = require("../../database/access");

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
            },
        }),
        mutation: new GraphQLObjectType({
            name: "RootMutationType",
            fields: {
                createNode: {
                    type: Node,
                    args: {
                        node: {
                            type: CreateNodeInput
                        }
                    },
                    async resolve(root, args){
                        const params = {...args.node, kindOfItem: "node"}
                        return await access.createItem(params)
                    }
                },
                createRelation: {
                    type: Relation,
                    args: {
                        relation: {
                            type: CreateRelationInput
                        }
                    },
                    async resolve(root, args){
                        const params = {...args.relation, kindOfItem: "relation"}
                        return await access.createItem(params)
                    }
                }
            }
        }),
        types: [Node, QueryNodeInput, CreateNodeInput, Relation, QueryRelationInput, CreateRelationInput]
    }
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;