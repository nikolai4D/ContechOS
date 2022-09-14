const {IdController} = require("./IdController")

function PropFieldCreaController(params, itemParentId = null){
        this.parent = getParent(itemParentId)
        this.props = ()=> getProps(params)
        this.typeDataPropKeys = ()=> getTypeDataPropKeys(params)
        this.instanceDataPropKeys = ()=> getInstanceDataPropKeys(params)
        this.propKeys = ()=> getPropKeys(params)

        this.formattedParams = getFormattedParams()
}

function getParent(itemParentId){
        if(itemParentId === null) return null
        let itemParent = new IdController(itemParentId)
        if([3,4].includes(itemParent.layerIndex)) throw "Invalid parent: instanceData cannot be parent, property cannot be parent of an item with a prop field. Parent: " + JSON.stringify(itemParent)
        return itemParent
}

function checkPropsAreValid(props, validKeys){
        for (let propKey in props){
                if(!validKeys.includes(propKey)) throw "error: prop have invalid propKey. Prop: " + propKey + ": " + JSON.stringify(props[propKey])
                else {
                        let propCon = new IdController(props[propKey])
                        if(propCon.parentId() !== propKey) throw "error: prop value associated to incorrect propKey. PropValue: " + props[propKey] + ", propKey: " + propKey
                }
        }
        return props
}

function getProps(parent, params){
        if(parent === null) throw "Invalid request for props: configDef Items cannot have a 'prop' field. ConfigDef layer was inferred because no parent id was provided."
        if(!params.hasOwnProperty("props")) return []

        const props = params.props
        let validKeys
        if (parent.layerIndex == 2){
                let granPa = new IdController(parent.getParent())
                validKeys = granPa.instanceDataPropKey()
        }
        else if (parent.layerIndex == 1) validKeys = parent.typeDataPropKeys()
        else if (parent.layerIndex == 0) validKeys = parent.propKeys()
        return checkPropsAreValid(props, validKeys)
}

function checkPropKeysAreValid(propKeys){
        for(let propKey in propKeys){
                const keyCon = new IdController(propKey)
                if(keyCon.defType !== "propKey") throw "the id proposed as a propKey is not a propKey."
        }
        return propKeys
}

function getTypeDataPropKeys(parent, params){
        if(parent.layerIndex != 0) throw "'getTypeDataPropKeys' can only be set on configObj. Parent layerIndex provided: " + parent.layerIndex
        else if(!params.hasOwnProperty("typeDataPropKeys")) return []
        else return checkPropKeysAreValid(params.typeDataPropKeys)
}

function getInstanceDataPropKeys(parent, params){
        if(parent.layerIndex != 0) throw "'getInstanceDataPropKeys' can only be set on configObj. Parent layerIndex provided: " + parent.layerIndex
        else if(!params.hasOwnProperty("instanceDataPropKeys")) return []
        else return checkPropKeysAreValid(params.instanceDataPropKeys)
}

function getPropKeys(parent, params){
        if(parent !== null) throw "'propKeys' can only be created on a configDef item. A parent was provided: " + parent.id
        else if(!params.hasOwnProperty("propKeys")) return []
        else return checkPropKeysAreValid(params.propKeys)
}

function getFormattedParams(parent, props, propKeys, typeDataPropKeys, instanceDataPropKeys){
        if(parent === null) return propKeys()
        else if(parent.layerIndex == 0) return {propKeys: props(), typeDataPropKeys: typeDataPropKeys(), instanceDataPropKeys: instanceDataPropKeys()}
        else if([1,2].includes(parent.layerIndex)) return {props: props()}
}

module.exports = { PropFieldCreaController }