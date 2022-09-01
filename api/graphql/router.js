const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType} = require('graphql');
const {GraphQLList} = require("graphql/type");
const {Node, NodeInput, Relation, RelationInput} = require("./graphql_types");
const {queryNodesResolver} = require("./resolvers/node_resolvers");
const {queryRelationsResolver} = require("./resolvers/relation_resolvers");

let schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                node: {
                    type: new GraphQLList(Node),
                    args: {
                        nodeInput: { type: NodeInput }
                    },
                    resolve(root, args) {
                        return queryNodesResolver(args.nodeInput)
                    }
                },
                relation: {
                    type: new GraphQLList(Relation),
                    args: {
                        relationInput: { type: RelationInput }
                    },
                    resolve(root, args) {
                        return queryRelationsResolver(args.relationInput)
                    }
                },
            },
        }),
        // mutation: new GraphQLObjectType({
        //     name: "RootMutationType",
        //     fields: {
        //         create: {
        //             type: Profile,
        //             args: {
        //                 profile: {
        //                     type: ProfileInput,
        //                     description: "the input for profile"
        //                 }
        //             },
        //             resolve(root, args){
        //                 myArrayFullOfStuff.profiles.push(args.profile)
        //                 console.log("Array full of stuff: " + JSON.stringify(myArrayFullOfStuff))
        //             }
        //         }
        //     }
        // }),
        types: [Node, NodeInput, Relation]
    }
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;