const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema,GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');
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
                    type: GraphQLString,
                    args: {
                        projectName: {
                            type: GraphQLInt,
                            description: "the profiles related to a project"
                        }
                    },
                    resolve(root, args) {
                        console.log("args: " + JSON.stringify(args))
                        const project = myArrayFullOfStuff.projects.find(el => el.name === args.name)
                        const projectProfiles = myArrayFullOfStuff.profiles.filter(el => el.project = project.name)
                        console.log("project profiles: " + projectProfiles)
                        return project;
                    },
                },
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
        types: [Profile, ProfileInput]
    }
)

router.use('', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

module.exports = router;