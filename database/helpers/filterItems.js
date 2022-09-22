const filterItems = (item, params) => {
    for(let key in params){
        if (params[key] !== null && (!item.hasOwnProperty(key) || params[key] !== item[key])) return false

    }
    return true
}

module.exports = {filterItems}