import {getParentIdFromId} from "./Helpers";

function getParentIds(ids, filters){
    const parentIds = []

    for(let id in ids){
        parentIds.push(getParentIdFromId(id))
    }

    return parentIds
}

function getChildrenIds(ids, filters){
    const childrenIds = []

    for(let id in ids){
        childrenIds.push(getChildrenFromId(id))
    }
    return childrenIds
}

function getRelIdsItIsTargetOf(ids, filters){
    const relIds = []

    return relIds
}

function getRelsIdsItIsSourceOf(ids, filters){
    const relIds = []

    return relIds
}