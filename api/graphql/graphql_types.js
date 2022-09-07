const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLInputObjectType, GraphQLList} = require("graphql/type");
const {getItemById} = require("./helpers/helpers");
const {queryNodesResolver, queryRelationsResolver} = require("./resolvers");
const {Accessor} = require("../../DBaccess/Accessor");

// Could not break this file into smaller ones for circular dependency reasons.

const Relation = new GraphQLObjectType({
    name: "Relation",
    fields: ()=>({
        id: { type: GraphQLString},
        title: { type: GraphQLString},
        parentId: { type: GraphQLString},
        sourceId: { type: GraphQLString},
        targetId: { type: GraphQLString},
        sourceNode: {
            type: Node,
            resolve: async (root)=> {
                return (await (new Accessor().getItems({id: root.source})))[0]
            }
        },
        targetNode: {
            type: Node,
            resolve: async(root)=> {
                return (await (new Accessor().getItems({id: root.target})))[0]
            }
        },
        parentNode: {
            type: Relation,
            resolve: async (root)=> {
                return (await (new Accessor().getItems({id: root.parentId})))[0]
            }
        },
    })
})

const RelationInput = new GraphQLInputObjectType({
    name: "RelationInput",
    fields: {
        id: {
            type: GraphQLString,
            description: "the id to filter by"
        },
        title: {
            type: GraphQLString,
            description: "the title to filter by"
        },
        parentId: {type: GraphQLString},
        sourceId: {type: GraphQLString},
        targetId: {type: GraphQLString}
    }
})

const Node = new GraphQLObjectType({
    name: "Node",
    fields: ()=>({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        parentId: {type: GraphQLString},
        created: {type: GraphQLString},
        updated: {type: GraphQLString},
        parentNode: {
            type: Node,
            resolve: async (root, params) => {
                if(params.id !== undefined) console.log("parentId of parentNode cannot be redefined. Custom parentId parameter will be ignored")
                params.id = root.parentId
                return (await queryNodesResolver(params))[0]
            }
        },
        childrenNodes: {
            type: new GraphQLList(Node),
            args: {
                nodeInput: { type: NodeInput }
            },
            resolve: async (root, args) => {
                const params = args.nodeInput
                if(params.parentId !== undefined) console.log("parentId of parentNode cannot be redefined. Custom parentId parameter will be ignored")
                params.parentId = root.id
                return (await queryNodesResolver(params))
            }
        },
        relations: {
            type: new GraphQLList(Relation),
            resolve: async (root, args) => {
                return [...(await queryRelationsResolver({targetId: root.id})), ...(await queryRelationsResolver({targetId: root.id}))]
            }
        }
    })
})

const NodeInput = new GraphQLInputObjectType({
    name: "NodeInput",
    fields: {
        id: {
            type: GraphQLString,
            description: "the id to filter by"},
        title: {
            type: GraphQLString,
            description: "the title to filter by"},
        parentId: {
            type: GraphQLString,
            description: "the parentID to filter by"},
    }
})

module.exports = {Node, NodeInput, Relation, RelationInput}