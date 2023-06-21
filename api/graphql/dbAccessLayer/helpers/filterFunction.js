const filterFunction = (item, params) => {
    for (let key in params) {
        if (params[key] !== null && (!item.hasOwnProperty(key) || !params[key].find( value => value === item[key]))) {
            return false
        }

    }

    return true
}

module.exports = { filterItems: filterFunction }