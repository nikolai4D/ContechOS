const { GraphQLObjectType, GraphQLString } = require("graphql/index");
const { GraphQLInputObjectType, GraphQLList } = require("graphql/type");
const { queryNodesResolver, queryRelationshipsResolver, graphResolver, cascadeResolver} = require("./resolvers");
const { GraphQLEnumType, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLBoolean} = require("graphql");

const DefinitionType = new GraphQLEnumType({
    name: "DefinitionType",
    values: {
        "configDef": { value: "configDef" },
        "configDefExternalRel": { value: "configDefExternalRel" },
        "configDefInternalRel": { value: "configDefInternalRel" },
        "configObj": { value: "configDef" },
        "configObjExternalRel": { value: "configObjExternalRel" },
        "configObjInternalRel": { value: "configObjInternalRel" },
        "typeData": { value: "typeData" },
        "typeDataExternalRel": { value: "typeDataExternalRel" },
        "typeDataInternalRel": { value: "typeDataInternalRel" },
        "instanceData": { value: "instanceData" },
        "instanceDataExternalRel": { value: "instanceDataExternalRel" },
        "instanceDataInternalRel": { value: "instanceDataInternalRel" },
        "PropType": { value: "PropType" },
        "PropKey": { value: "PropKey" },
        "PropVal": { value: "PropVal" }
    }
})

const KindOfItem = new GraphQLEnumType({
    name: "KindOfItem",
    values: {
        node: { value: "node" },
        relationship: { value: "relationship" },
        property: { value: "relationship" }
    }
})

const Relationship = new GraphQLObjectType({
    name: "Relationship",
    fields: () => ({
        error: { type: GraphQLString },
        limit: { type: GraphQLInt },
        from: { type: GraphQLInt },
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        defType: {
            type: GraphQLString,
            resolve: (root) => { return root.defType }
        },
        parentId: { type: GraphQLString },
        sourceId: {
            type: GraphQLString,
            resolve: (root) => { return root.source }
        },
        targetId: {
            type: GraphQLString,
            resolve: (root) => { return root.target }
        },
        sourceNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relationship source node")
                return (await queryNodesResolver(args.nodeInput, { id: root.source, kindOfItem: "node" }))[0]
            }
        },
        targetNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("resolving target node")
                return (await queryNodesResolver(args.nodeInput, { id: root.target, kindOfItem: "node" }))[0]
            }
        },
        parentNode: {
            type: Relationship,
            args: {
                relationshipInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("resolving relationship parent node")
                return (await queryRelationshipsResolver(args.relationshipInput, { id: root.parentId, kindOfItem: "relationship" }))[0]
            }
        },
        created: { type: GraphQLString },
        updated: { type: GraphQLString },
    })
})

const Node = new GraphQLObjectType({
    name: "Node",
    fields: () => ({
        error: { type: GraphQLString },
        id: { type: GraphQLID },
        defType: {
            type: GraphQLString,
            resolve: (root) => { return root.defType }
        },
        title: { type: GraphQLString },
        parentId: { type: GraphQLID },
        created: { type: GraphQLString },
        updated: { type: GraphQLString },
        parentNode: {
            type: Node,
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, { id: root.parentId, kindOfItem: "node" }))[0]
            }
        },
        childrenNodes: {
            type: new GraphQLList(Node),
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await queryNodesResolver(args.nodeInput, { parentId: root.id, kindOfItem: "node" }))
            }
        },
        relationships: {
            type: new GraphQLList(Relationship),
            args: {
                relationshipInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                console.log("RESOLVING RELATIONshipS, rootid: " + root.id)
                return [...(await graphResolver(args.relationshipInput, { targetId: root.id, kindOfItem: "relationship" })),
                ...(await graphResolver(args.relationshipInput, { sourceId: root.id, kindOfItem: "relationship" }))]
            }
        }
    })
})

const Property = new GraphQLObjectType({
    name: "Property",
    fields: () => ({
        error: { type: GraphQLString },
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        defType: { type: DefinitionType },
        created: { type: GraphQLString },
        updated: { type: GraphQLString },
        parentNode: {
            type: Property,
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await graphResolver(args.nodeInput, { id: root.parentId, kindOfItem: "property" }))[0]
            }
        },
        childrenNodes: {
            type: new GraphQLList(Node),
            args: {
                nodeInput: { type: QueryInput }
            },
            resolve: async (root, args) => {
                return (await graphResolver(args.nodeInput, { parentId: root.id, kindOfItem: "property" }))
            }
        },
    })
})

const QueryInput = new GraphQLInputObjectType({
    name: "QueryInput",
    fields: {
        error: { type: GraphQLString },
        kindOfItem: { type: KindOfItem },
        defType: { type: DefinitionType },
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        parentId: { type: GraphQLString },
        sourceId: { type: GraphQLString },
        targetId: { type: GraphQLString },
        created: { type: GraphQLString },
        updated: { type: GraphQLString },
    }
})

const MutationItem = new GraphQLObjectType({
    name: "MutationItem",
    fields: {
        created: { type: GraphQLString },
        updated: { type: GraphQLString },
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        defType: { type: GraphQLID },
        parentId: { type: GraphQLID },
        targetId: { type: GraphQLID },
        sourceId: { type: GraphQLID },
        props: {
            type: new GraphQLList(GraphQLString),
            description: `a stringified JSON like '{"pk_whateverpropkeyid":"pv_thepropvalueid"}'`
        },
        propKeys: { type: new GraphQLList(GraphQLString) },
        typeDataPropKeys: { type: new GraphQLList(GraphQLString) },
        instanceDataPropKeys: { type: new GraphQLList(GraphQLString) },
    }
})

const CascadeWrapper = new GraphQLObjectType({
    name: "CascadeWrapper",
    fields: {
        nodes: { type: new GraphQLList(Node) },
    }
})

const CascadeNode = new GraphQLObjectType({
    name: "CascadeNode",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        defType: { type: GraphQLString },
        parentId: { type: GraphQLID },
        childrenNodes: {
            type: new GraphQLList(CascadeNode),
            resolve: async (root) => {
                return await cascadeResolver(root.cascade, root.depth + 1, root.id)
            }
        },
        created: { type: GraphQLString },
        updated: { type: GraphQLString },
    })
})

const CascadeLayerInput = new GraphQLInputObjectType({
    name: "CascadeLayerInput",
    fields: {
        id: { type: new GraphQLList(GraphQLID) },
        title: { type: new GraphQLList(GraphQLString) },
        parentId: { type: new GraphQLList(GraphQLID) }
    }
})

const CascadeInput = new GraphQLInputObjectType({
    name: "CascadeInput",
    fields: {
        configDef: { type: CascadeLayerInput },
        configObj: { type: CascadeLayerInput },
        typeData: { type: CascadeLayerInput },
        instanceData: { type: CascadeLayerInput },
        intersect: { type: GraphQLBoolean}
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

module.exports = { Node, Relationship, Property, CascadeWrapper, CascadeNode, QueryInput, CascadeInput, MutationItem, CreateInput }