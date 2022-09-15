const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLInputObjectType, GraphQLList} = require("graphql/type");
const {queryNodesResolver, queryRelationsResolver} = require("./resolvers");
const {GraphQLEnumType, GraphQLNonNull, GraphQLID} = require("graphql");

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

const KindOfItem = new GraphQLEnumType({
    name: "KindOfItem",
    values: {
        node:{value:"node"},
        relation:{value:"relation"},
        property:{value:"relation"}
    }
})

const DefType = new GraphQLEnumType({
    name: "DefType",
    values: {
        "configDef":{value:"configDef"},
        "configObj":{value: "configDef"},
    }
})

const CreateInput = new GraphQLInputObjectType({
    name: "CreateInput",
    fields: {
        kindOfItem: { type: new GraphQLNonNull(KindOfItem)},
        title:  { type: new GraphQLNonNull(GraphQLString)},
        parentId: { type: GraphQLID},
        targetId: { type: GraphQLID},
        sourceId: { type: GraphQLID},
        props: {
            type: new GraphQLList(GraphQLString),
            description: `a stringified JSON like '{"pk_whateverpropkeyid":"pv_thepropvalueid"}'`
        },
        propKeys: { type: new GraphQLList(GraphQLString) },
        typeDataPropKeys: { type: new GraphQLList(GraphQLString) },
        instanceDataPropKeys: { type: new GraphQLList(GraphQLString) },
    }
})

const UpdateInput = new GraphQLInputObjectType({
    name: "UpdateInput",
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID)},
        title:  { type: new GraphQLNonNull(GraphQLString)},
        props: {
            type: new GraphQLList(GraphQLString),
            description: `a stringified JSON like '{"pk_whateverpropkeyid":"pv_thepropvalueid"}'`
        },
        propKeys: { type: new GraphQLList(GraphQLString) },
        typeDataPropKeys: { type: new GraphQLList(GraphQLString) },
        instanceDataPropKeys: { type: new GraphQLList(GraphQLString) },
    }
})

const MutationItem = new GraphQLObjectType({
    name: "MutationItem",
    fields: {
        created: { type: GraphQLString },
        updated: { type: GraphQLString },
        id: { type: GraphQLID },
        title:  { type: new GraphQLNonNull(GraphQLString)},
        definitionType: { type: GraphQLID },
        parentId: { type: GraphQLID},
        targetId: { type: GraphQLID},
        sourceId: { type: GraphQLID},
        props: {
            type: new GraphQLList(GraphQLString),
            description: `a stringified JSON like '{"pk_whateverpropkeyid":"pv_thepropvalueid"}'`
        },
        propKeys: { type: new GraphQLList(GraphQLString) },
        typeDataPropKeys: { type: new GraphQLList(GraphQLString) },
        instanceDataPropKeys: { type: new GraphQLList(GraphQLString) },
    }
})

module.exports = { Node, QueryNodeInput,Relation, QueryRelationInput, CreateInput, UpdateInput, MutationItem }