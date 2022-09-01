const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLInputObjectType, GraphQLList} = require("graphql/type");
const {queryNodesResolver} = require("./resolvers/node_resolvers");
const {queryRelationsResolver} = require("./resolvers/relation_resolvers");
const {getItemById} = require("./helpers/helpers");

// Could not break this file into smaller ones for circular dependency reasons.

const Relation = new GraphQLObjectType({
    name: "Relation",
    fields: ()=>({
        id: { type: GraphQLString},
        title: { type: GraphQLString},
        parentId: { type: GraphQLString},
        sourceId: {
            type: GraphQLString,
            resolve: (root)=>{
                return root.source
            }
        },
        targetId: {
            type: GraphQLString,
            resolve: (root)=>{
                return root.target
            }
        },
        sourceNode: {
            type: Node,
            resolve: (root)=> {
                console.log({root})
                return getItemById(root.source)
            }
        },
        targetNode: {
            type: Node,
            resolve: (root)=> {
                return getItemById(root.target)
            }
        }
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
        source: {type: GraphQLString},
        target: {type: GraphQLString}
    }
})

const Node = new GraphQLObjectType({
    name: "Node",
    fields: ()=>({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        parentId: {type: GraphQLString},
        parentNode: {
            type: Node,
            resolve(root) {
                return getItemById(root.parentId)
            }
        },
        relations: {
            type: new GraphQLList(Relation),
            resolve(root, args) {
                return [...queryRelationsResolver({target: root.id}), ...queryRelationsResolver({source: root.id})]
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