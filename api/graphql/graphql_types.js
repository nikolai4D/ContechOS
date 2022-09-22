const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLInputObjectType, GraphQLList} = require("graphql/type");
const {queryNodesResolver, queryRelationsResolver, graphResolver} = require("./resolvers");
const {GraphQLEnumType, GraphQLNonNull, GraphQLID, GraphQLInt} = require("graphql");

const DefinitionType = new GraphQLEnumType({
    name: "DefinitionType",
    values: {
        "configDef":{value:"configDef"},
        "configDefExternalRel":{value:"configDefExternalRel"},
        "configDefInternalRel":{value:"configDefInternalRel"},
        "configObj":{value: "configDef"},
        "configObjExternalRel":{value:"configObjExternalRel"},
        "configObjInternalRel":{value:"configObjInternalRel"},
        "typeData":{value:"typeData"},
        "typeDataExternalRel":{value:"typeDataExternalRel"},
        "typeDataInternalRel":{value:"typeDataInternalRel"},
        "instanceData":{value:"instanceData"},
        "instanceDataExternalRel":{value:"instanceDataExternalRel"},
        "instanceDataInternalRel":{value:"instanceDataInternalRel"},
        "PropType":{value:"PropType"},
        "PropKey":{value:"PropKey"},
        "PropVal":{value:"PropVal"}
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

const Relation = new GraphQLObjectType({
    name: "Relation",
    fields: ()=>({
        error: { type: GraphQLString},
        limit: { type: GraphQLInt},
        from: { type: GraphQLInt},
        id: { type: GraphQLString},
        title: { type: GraphQLString},
        defType: {
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
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relation source node")
                return (await queryNodesResolver(args.nodeInput, {id:root.source, kindOfItem:"node"}))[0]
            }
        },
        targetNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("resolving target node")
                return (await queryNodesResolver(args.nodeInput, {id:root.target, kindOfItem:"node"}))[0]
            }
        },
        parentNode: {
            type: Relation,
            args: {
                relationInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relation parent node")
                return (await queryRelationsResolver(args.relationInput, {id:root.parentId, kindOfItem:"relation"}))[0]
            }
        },
    })
})

const Node = new GraphQLObjectType({
    name: "Node",
    fields: ()=>({
        error: { type: GraphQLString},
        id: {type: GraphQLID},
        defType: {
            type: GraphQLString,
            resolve: (root)=> {return root.defType}},
        title: {type: GraphQLString},
        parentId: {type: GraphQLID},
        created: {type: GraphQLString},
        updated: {type: GraphQLString},
        parentNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, {id:root.parentId, kindOfItem:"node"}))[0]
            }
        },
        childrenNodes: {
            type: new GraphQLList(Node),
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, {parentId: root.id, kindOfItem:"node"}))
            }
        },
        relations: {
            type: new GraphQLList(Relation),
            args: {
                relationInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("RESOLVING RELATIONS, rootid: " + root.id)
                return [...(await graphResolver(args.relationInput,{targetId: root.id, kindOfItem:"relation"})),
                        ...(await graphResolver(args.relationInput,{sourceId: root.id, kindOfItem:"relation"}))]
            }
        }
    })
})

const Property = new GraphQLObjectType({
    name: "Property",
    fields: ()=> ({
        error: { type: GraphQLString},
        id: { type: GraphQLID},
        title: { type: GraphQLString},
        defType: { type: DefinitionType},
        created: { type: GraphQLString},
        updated: { type: GraphQLString},
        parentNode: {
            type: Property,
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await graphResolver(args.nodeInput, {id:root.parentId, kindOfItem:"property"}))[0]
            }
        },
        childrenNodes: {
            type: new GraphQLList(Node),
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await graphResolver(args.nodeInput, {parentId: root.id, kindOfItem:"property"}))
            }
        },
    })
})

//Sounded good but forces to query for each individual
// const ItemsByDefinitionType = new GraphQLObjectType ({
//     name: "ItemsByDefinitionType",
//     fields: {
//         configDef: {type: new GraphQLList(Node)},
//         configDefExternalRel: {type: new GraphQLList(Relation)},
//         configDefInternalRel: {type: new GraphQLList(Relation)},
//         configObj: {type: new GraphQLList(Node)},
//         configObjExternalRel: {type: new GraphQLList(Relation)},
//         configObjInternalRel: {type: new GraphQLList(Relation)},
//         typeData: {type: new GraphQLList(Node)},
//         typeDataExternalRel: {type: new GraphQLList(Relation)},
//         typeDataInternalRel: {type: new GraphQLList(Relation)},
//         instanceData: {type: new GraphQLList(Node)},
//         instanceDataExternalRel: {type: new GraphQLList(Relation)},
//         instanceDataInternalRel: {type: new GraphQLList(Relation)},
//         PropType: {type: new GraphQLList(Property)},
//         PropKey: {type: new GraphQLList(Property)},
//         PropVal: {type: new GraphQLList(Property)}
//     }
// })


const QueryInput = new GraphQLInputObjectType({
    name: "QueryInput",
    fields: {
        error: { type: GraphQLString},
        kindOfItem: { type: KindOfItem },
        defType: { type: DefinitionType},
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        sourceId: { type: GraphQLString },
        targetId: {type: GraphQLString},
        created: { type: GraphQLString},
        updated: { type: GraphQLString},
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
        defType: { type: GraphQLID },
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

module.exports = { Node, Relation, Property, QueryInput, CreateInput, UpdateInput, MutationItem }