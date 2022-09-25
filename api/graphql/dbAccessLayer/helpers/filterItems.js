const filterItems = (item, params) => {
    // console.log("filterItems: " + JSON.stringify(params, null, 2))
    for (let key in params) {
        if (params[key] !== null && (!item.hasOwnProperty(key) || params[key] !== item[key])) {
            return false
        }

    }

    return true
}

module.exports = { filterItems }