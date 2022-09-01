const {GraphQLObjectType, GraphQLString} = require("graphql/index");
const {GraphQLList} = require("graphql/type");
const slightlyMoreComplexDB = require("./slightlyMoreComplexDB");

// const Relation = new GraphQLObjectType({
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


module.exports = {Node}