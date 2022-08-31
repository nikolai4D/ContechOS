const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');
const {GraphQLInputObjectType, GraphQLList} = require("graphql/type");
const {Node, Relation, ContechNode, ContechRelation} = require("./customGraphQLTypes");
const {queryNodeResolver, queryContechNodeResolver, queryParentNodeResolver} = require("./resolvers");

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
            },
            {
                name: "C2",
                project: "project3"
            }
        ]
    }

const Profile = new GraphQLObjectType({
    name: "Profile",
    fields: {
        name: {type:GraphQLString},
        project: {type:GraphQLString},
    }
})

const ProfileInput = new  GraphQLInputObjectType({
    name: "ProfileInput",
    fields: {
        name: {type:GraphQLString},
        project: {type:GraphQLString},
    }
})

// Downside with the above implementation -> it s db model opinionated (hope I am using this word right)
// Below is an attempt at an agnostic implementation


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
                projectProfiles: {
                    type: new GraphQLList(Profile),
                    args: {
                        projectName: {
                            type: GraphQLString,
                            description: "the profiles related to a project"
                        }
                    },
                    resolve(root, args) {
                        console.log("args: " + JSON.stringify(args))
                        const project = myArrayFullOfStuff.projects.find(el => el === args.projectName)
                        console.log("project: " + project)
                        console.log("myArray: " + JSON.stringify(myArrayFullOfStuff))
                        const projectProfiles = myArrayFullOfStuff.profiles.filter(el => el.project === project)
                        console.log("project profiles: " + JSON.stringify(projectProfiles))
                        return projectProfiles;
                    },
                },
                node: {
                    type: new GraphQLList(Node),
                    args: {
                        id: {
                            type: GraphQLString,
                            description: "the unique identifier of the node.Starts with an n."
                        },
                    },
                    resolve(root, args) {
                        return queryNodeResolver(args)
                    }
                },
                contechNode: {
                    type: new GraphQLList(ContechNode),
                    args: {
                        id: {
                            type: GraphQLString,
                            description: "the unique identifier of the node.Starts with an n."
                        },
                    },
                    resolve(root, args) {
                        return queryContechNodeResolver(args)
                    }
                }
            },
        }),
        mutation: new GraphQLObjectType({
            name: "RootMutationType",
            fields: {
                create: {
                    type: Profile,
                    args: {
                        profile: {
                            type: ProfileInput,
                            description: "the input for profile"
                        }
                    },
                    resolve(root, args){
                        myArrayFullOfStuff.profiles.push(args.profile)
                        console.log("Array full of stuff: " + JSON.stringify(myArrayFullOfStuff))
                    }
                }
            }
        }),
        types: [Profile, ProfileInput, Relation, Node, ContechNode, ContechRelation]
    }
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;