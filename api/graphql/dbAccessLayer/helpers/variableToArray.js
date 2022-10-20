/**
 * Converts a variable value to an array, null or undefined remains null or undefined
 * @param variable
 * @returns {null|*[]|*}
 */
function variableToArray(variable){
    if(variable === null) return null
    else if (variable === undefined) return undefined
    if (Array.isArray(variable)) {
        return variable
    } else {
        return [variable]
    }
}

module.exports = variableToArray