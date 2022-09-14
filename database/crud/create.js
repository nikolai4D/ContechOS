const {createFile} = require("../FileManager")
const {RelCreaController} = require("../control/RelCreaController");
const {NodeCreaController} = require("../control/NodeCreaController");
const {PropCreaController} = require("../control/PropCreaController");
const {PropFieldCreaController} = require("../control/PropFieldCreaController");

function itemCreationParams(
    title,
    defType,
    parentId,
    sourceId,
    targetId,
    kindOfItem
){
    this.title = title
    this.parentId = parentId
    this.sourceId = sourceId
    this.targetId = targetId
    this.kindOfItem = kindOfItem
}

/**
 *
 * @param {itemCreationParams} params
 * @constructor
 */
async function createItem(params) {
    try {

        console.log("provided params: " + JSON.stringify(params))

        let id
        let defType
        const formattedParams = {
            created: new Date(),
            updated: new Date()
        }

        if (!params.hasOwnProperty("title")) throw "Creation interrupted: a title was not provided"
        else if (params.title === "" || params.title === null || params.title === undefined) throw "Creation interrupted: title invalid."
        else formattedParams.title = params.title

        let controller
        if(!params.hasOwnProperty("kindOfItem")) {
            throw "creation interrupted: kindOfItem was not provided in params. params: " + JSON.stringify(params, null, 2)
        }
        else if(params.kindOfItem === "node") controller = new NodeCreaController(params)
        else if(params.kindOfItem === "relation") controller = new RelCreaController(params)
        else if(params.kindOfItem === "property") controller = new PropCreaController(params)
        else throw "Creation interrupted: kindOfItem was invalid. kind of item: " + params.kindOfItem

        const fParams = controller.formattedParams
        id = controller.id
        defType = controller.defType
        for(let field in fParams){
            formattedParams[field] = fParams[field]
        }

        if(["node","relation"].includes(controller.kindOfItem)) {
            const propFieldCon = new PropFieldCreaController(params, params.parentId)
            const formattedProps = propFieldCon.formattedParams
            for(let field in formattedProps){
                formattedParams[field] = formattedProps[field]
            }
        }

        console.log("defType: " + defType)
        console.log("id: " + id)
        console.log("formattedParams: " + JSON.stringify(formattedParams, null, 2))

        return await createFile(defType, id, formattedParams)

    } catch(e){
        return e
    }
}

module.exports = { createItem }