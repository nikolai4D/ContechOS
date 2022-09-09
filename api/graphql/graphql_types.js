const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLInputObjectType, GraphQLList} = require("graphql/type");
const {queryNodesResolver, queryRelationsResolver} = require("./resolvers");
const {Accessor} = require("../../DBaccess/access");

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
            args: {
                nodeInput: { type: NodeInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relation source node")
                return (await queryNodesResolver(args.nodeInput, {id:root.source}))[0]
            }
        },
        targetNode: {
            type: Node,
            args: {
                nodeInput: { type: NodeInput }
            },
            resolve: async (root, args) => {
                console.log("resolving target node")
                return (await queryNodesResolver(args.nodeInput, {id:root.target}))[0]
            }
        },
        parentNode: {
            type: Relation,
            args: {
                relationInput: { type: RelationInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relation parent node")
                return (await queryRelationsResolver(args.relationInput, {id:root.parentId}))[0]
            }
        },
    })
})

const RelationInput = new GraphQLInputObjectType({
    name: "RelationInput",
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        sourceId: {type: GraphQLString},
        targetId: {type: GraphQLString},
        created: { type: GraphQLString},
        updated: { type: GraphQLString},
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
            args: {
                nodeInput: { type: NodeInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, {id:root.parentId}))[0]
            }
        },
        childrenNodes: {
            type: new GraphQLList(Node),
            args: {
                nodeInput: { type: NodeInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, {parentId: root.id}))
            }
        },
        relations: {
            type: new GraphQLList(Relation),
            args: {
                relationInput: { type: RelationInput }
            },
            resolve: async (root, args) => {
                console.log("RESOLVING RELATIONS, rootid: " + root.id)
                return [...(await queryRelationsResolver(args.relationInput,{targetId: root.id})),
                        ...(await queryRelationsResolver(args.relationInput,{sourceId: root.id}))]
            }
        }
    })
})

const NodeInput = new GraphQLInputObjectType({
    name: "NodeInput",
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        created: { type: GraphQLString},
        updated: { type: GraphQLString},
    }
})

module.exports = {Node, NodeInput, Relation, RelationInput}