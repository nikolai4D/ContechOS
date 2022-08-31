const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLList} = require("graphql/type");
const simplifiedDB = require("./simplifiedDB");
const slightlyMoreComplexDB = require("./slighltyMoreComplexDB");
const {queryContechNodeResolver, queryParentNodeResolver} = require("./resolvers");

const Relation = new GraphQLObjectType({
    name: "Relation",
    fields: ()=> ({
        id: {type: GraphQLString},
        title:{type: GraphQLString},
        source: {
            type: Node,
            resolve(root) {
                console.log("root: " + JSON.stringify(root))
                return simplifiedDB.nodes.find( el => el.id === root.source)
            }},
        target: {
            type: Node,
            resolve(root) {
                console.log("root: " + JSON.stringify(root))
                return simplifiedDB.nodes.find( el => el.id === root.target)
            }}
    })
})

const Node = new GraphQLObjectType({
    name: "Node",
    fields: () =>({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        relations: {
            type: new GraphQLList(Relation),
            resolve(root) {
                return simplifiedDB.relations.filter( el => el.target === root.id || el.source === root.id)
        }}
    })
})

const ContechNode = new GraphQLObjectType({
    name: "ContechNode",
    fields: () =>({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        parentNode: {
            // Rather unsatisfying implementation which needs to fetch the root node once more in the db.
            // Rejected aLternatives:
            // - add a string field "parentid" in the root node -> not pretty from user perspective, "parentid" and "parentnode" properties side to side
            // - fetch the parent node in the root resolver. Might work but I suspect it may cause if not infinite at least fetching nodes until there is no more parents. To be tested tho.
            type: ContechNode,
            resolve(root) {
                console.log("resolving parentNode")
                return queryParentNodeResolver(root.id)
            }
        }
    })
})

// const ContechRelation = new GraphQLObjectType({
//     name: "Relation",
//     fields: ()=> ({
//         id: {type: GraphQLString},
//         title:{type: GraphQLString},
//         source: {
//             type: Node,
//             resolve(root) {
//                 console.log("root: " + JSON.stringify(root))
//                 return simplifiedDB.nodes.find( el => el.id === root.source)
//             }},
//         target: {
//             type: Node,
//             resolve(root) {
//                 console.log("root: " + JSON.stringify(root))
//                 return simplifiedDB.nodes.find( el => el.id === root.target)
//             }}
//     })
// })

module.exports = {Node,Relation, ContechNode}