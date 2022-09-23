import {getDefTypeFromId, getKindOfItemFromId, getParentIdFromId} from "./Helpers";

/**
 * A node as understood by cypher. It can be a node or a property.
 * While a parental relation is not stored as such in the database, it needs to be treated as such by cypher in order to traverse the graph.
 */
function Cy_Node(id){
    this.id = id
    this.defType = ()=> getDefTypeFromId(id)
    this.kindOfItem = ()=> getKindOfItemFromId(this.id)
    this.parentId = ()=> getParentIdFromId(this.id)

    //Function used for graph traversal
    // this.getRelsIdsThisIsSource = ()=> getRelsIdsThisIsSource()
    // this.getRelsIdsThisIsTarget = ()=> getRelIdsThisIsTarget()
    // this.getParentRel = ()=> getParentRel()
    // this.getChildrenRels = ()=> getChildrenRels()

    // Additional function to filter by.
    // this.getParentRelId = ()=> getParentRelId()
    // this.getParentIdTitle = ()=> getParentRelTitle()

    //this.data = ()=> getData() //If no specific property is queried,  return id, created, updated, parentId, props, title, defType, kindOfItem

}
//
// function getKindOfItem(){
//
// }
//
// function getTitle(){
//
// }
//
// function getParentId(){
//
// }
//
// function getParentRelId(){
//
// }
//
// function getParentRelTitle(){
//
// }
//
//
// function getRelsIdsThisIsSource(nodeDefType, relationParentId, relationTitle, targetId){
//
//
// }
//
// function getRelIdsThisIsTarget(relationId, relationParentId, relationTitle, sourceId){
//
// }
//
// function getParentRel(){
//
// }
//
// function getChildrenRels(){
//
// }
//
//
//
//
// function getData(){
//
// }