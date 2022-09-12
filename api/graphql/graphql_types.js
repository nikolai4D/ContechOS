const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLInputObjectType, GraphQLList} = require("graphql/type");
const {queryNodesResolver, queryRelationsResolver} = require("./resolvers");

const Relation = new GraphQLObjectType({
    name: "Relation",
    fields: ()=>({
        id: { type: GraphQLString},
        title: { type: GraphQLString},
        definitionType: {
            type: GraphQLString,
            resolve: (root)=> {return root.defType}},
        parentId: { type: GraphQLString},
        sourceId: {
            type: GraphQLString,
            resolve: (root) => {return root.source}},
        targetId: {
            type: GraphQLString,
            resolve: (root) => {return root.target}
            },
        sourceNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryNodeInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relation source node")
                return (await queryNodesResolver(args.nodeInput, {id:root.source}))[0]
            }
        },
        targetNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryNodeInput }
            },
            resolve: async (root, args) => {
                console.log("resolving target node")
                return (await queryNodesResolver(args.nodeInput, {id:root.target}))[0]
            }
        },
        parentNode: {
            type: Relation,
            args: {
                relationInput: { type: QueryRelationInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relation parent node")
                return (await queryRelationsResolver(args.relationInput, {id:root.parentId}))[0]
            }
        },
    })
})

const QueryRelationInput = new GraphQLInputObjectType({
    name: "QueryRelationInput",
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        sourceId: { type: GraphQLString },
        targetId: {type: GraphQLString},
        created: { type: GraphQLString},
        updated: { type: GraphQLString},
    }
})

const CreateRelationInput = new GraphQLInputObjectType({
    name: "CreateRelationInput",
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        sourceId: { type: GraphQLString },
        targetId: {type: GraphQLString}
    }
})

const Node = new GraphQLObjectType({
    name: "Node",
    fields: ()=>({
        id: {type: GraphQLString},
        defTypeTitle: {
            type: GraphQLString,
            resolve: (root)=> {return root.defType}},
        title: {type: GraphQLString},
        parentId: {type: GraphQLString},
        created: {type: GraphQLString},
        updated: {type: GraphQLString},
        parentNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryNodeInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, {id:root.parentId}))[0]
            }
        },
        childrenNodes: {
            type: new GraphQLList(Node),
            args: {
                nodeInput: { type: QueryNodeInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, {parentId: root.id}))
            }
        },
        relations: {
            type: new GraphQLList(Relation),
            args: {
                relationInput: { type: QueryRelationInput }
            },
            resolve: async (root, args) => {
                console.log("RESOLVING RELATIONS, rootid: " + root.id)
                return [...(await queryRelationsResolver(args.relationInput,{targetId: root.id})),
                        ...(await queryRelationsResolver(args.relationInput,{sourceId: root.id}))]
            }
        }
    })
})

const QueryNodeInput = new GraphQLInputObjectType({
    name: "QueryNodeInput",
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        created: { type: GraphQLString},
        updated: { type: GraphQLString},
    }
})

const CreateNodeInput = new GraphQLInputObjectType({
    name: "CreateNodeInput",
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        // TODO Props!
    }
})

module.exports = {Node, QueryNodeInput, CreateNodeInput, Relation, QueryRelationInput, CreateRelationInput}