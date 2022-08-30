const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType, GraphQLString } = require('graphql');
const {GraphQLInputObjectType} = require("graphql/type");

//This is purposely not a json tree.
const myArrayFullOfStuff =
    {
        projects: [
            "project1",
            "project2",
            "project3",
        ],
        profiles: [
            {
                name: "A",
                project: "project1",
            },
            {
                name: "B",
                project: "project2"
            },
            {
                name: "C",
                project: "project3"
            }
        ]
    }


const profileType = new GraphQLObjectType({
    name: "Profile",
    fields: {
        name: {type:GraphQLString},
        project: {type:GraphQLString},
    }
})

const ProfileInputType = new  GraphQLInputObjectType({
    name: "ProfileInput",
    fields: {
        name: {type:GraphQLString},
        project: {type:GraphQLString},
    }
})

let schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                hello: {
                    type: GraphQLString,
                    args: {
                        pseudo: {
                            type: GraphQLString,
                            description: "it s a pseudo"
                        }
                    },
                    resolve(root, args) {
                        console.log("args: " + JSON.stringify(args))
                        return `world + ${args.pseudo}`;
                    },
                },
                goodbye: {
                    type: GraphQLString,
                    resolve() {
                        return `bye world`;
                    },
                },
            },
        }),
        mutation: new GraphQLObjectType({
            name: "RootMutationType",
            fields: {
                create: {
                    type: profileType,
                    args: {
                        profile: {type: ProfileInputType}
                    },
                    resolve(args){
                        myArrayFullOfStuff.push(args.profile)
                        console.log("Array full of stuff: " + JSON.stringify(myArrayFullOfStuff))
                    }
                }
            }
        }),
        types: [profileType]
    }
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;