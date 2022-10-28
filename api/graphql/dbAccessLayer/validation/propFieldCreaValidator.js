const {idValidator} = require("./idValidator")

function propFieldCreaValidator(params, itemParentId = null){
        this.parent = getParent(itemParentId)
        this.props = ()=> getProps(this.parent, params)

        this.typeDataPropKeys = ()=> getTypeDataPropKeys(this.parent, params)

        this.instanceDataPropKeys = ()=> getInstanceDataPropKeys(this.parent, params)
        this.propKeys = ()=> getPropKeys(this.parent, params)

        this.formattedParams = getFormattedParams(this, params)

}

function getParent(itemParentId){
        if(itemParentId === null) return null

        let itemParent = new idValidator(itemParentId)
        if(itemParent === undefined) return null

        if([3,4].includes(itemParent.layerIndex)) throw new Error("Invalid parent of an item with a prop field. Parent: " + JSON.stringify(itemParent))
        return itemParent
}

function checkPropsAreValid(props, validKeys){
        let formattedProps = []
        for (let prop of props){
                if(!validKeys.includes(prop.key)) throw new Error("error: prop have invalid propKey. Prop: " + prop.key + ": " + JSON.stringify(prop.key))
                else {
                        let propCon = new idValidator(prop.value)
                        if(propCon.parentId() !== prop.key) throw new Error("error: prop value associated to incorrect propKey. PropValue: " + prop.value + ", propKey: " + prop.key)
                        let formattedProp = {}
                        formattedProp[prop.key] = prop.value
                        formattedProps.push(formattedProp)
                }
        }
        return formattedProps
}

function getProps(parent, params){
        if(parent === null) throw new Error("Invalid request for props: configDef Items cannot have a 'prop' field. ConfigDef layer was inferred because no parent id was provided.")
        if(!params.hasOwnProperty("props")) return []

        const props = params.props
        let validKeys
        if (parent.layerIndex == 2){
                let granPa = new idValidator(parent.getParent())
                validKeys = granPa.instanceDataPropKey()
        }
        else if (parent.layerIndex == 1) validKeys = parent.typeDataPropKeys()
        else if (parent.layerIndex == 0) {
                validKeys = parent.propKeys()
        }

        return checkPropsAreValid(props, validKeys)
}

function checkPropKeysAreValid(propKeys){

        for(let propKey of propKeys){
                const keyCon = new idValidator(propKey)
                if(keyCon.defType !== "propKey") throw new Error("the id proposed as a propKey is not a propKey.")
        }

        return propKeys
}

function getTypeDataPropKeys(parent, params){
        if(parent === null || parent.layerIndex != 0) throw new Error("'getTypeDataPropKeys' can only be set on configObj. Parent layerIndex provided: " + parent.layerIndex)
        else if(!params.hasOwnProperty("typeDataPropKeys")) return []
        else return checkPropKeysAreValid(params.typeDataPropKeys)
}

function getInstanceDataPropKeys(parent, params){
        if(parent === null || parent.layerIndex != 0) throw new Error("'getInstanceDataPropKeys' can only be set on configObj. Parent layerIndex provided: " + parent.layerIndex)
        else if(!params.hasOwnProperty("instanceDataPropKeys")) return []
        else return checkPropKeysAreValid(params.instanceDataPropKeys)
}

function getPropKeys(parent, params){

        if(parent !== null && parent !== undefined) throw new Error("'propKeys' can only be created on a configDef item. A parent was provided: " + parent.id)
        else if(!params.hasOwnProperty("propKeys")) return []
        else return checkPropKeysAreValid(params.propKeys)
}

function getFormattedParams(vld){
        parent = vld.parent

        if(parent === null || parent === undefined) return {propKeys: vld.propKeys()}
        else if(parent.layerIndex == 0) {
                return {
                        props: vld.props(),
                        typeDataPropKeys: vld.typeDataPropKeys(),
                        instanceDataPropKeys: vld.instanceDataPropKeys()
                }
        }
        else if([1,2].includes(parent.layerIndex)) return {props: vld.props()}
}

module.exports = { propFieldCreaValidator }