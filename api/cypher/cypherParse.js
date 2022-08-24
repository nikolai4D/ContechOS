function cypherParse(query){
    console.log("original query: " + query)
    query.replace(" ", "")

    const firstWordLength = query.indexOf("(")
    if(firstWordLength === -1) {
        console.log("first parenthesis was not found. Syntax error.")
        return
    }

    const firstClause = query.substring(0, firstWordLength).toUpperCase()
    console.log({firstClause})

    const firstNodeRefEnd = query.indexOf(":")
    if(firstNodeRefEnd === -1){
        console.log("':' was not found. Syntax error.")
        return
    }

    const firstNodeRef = query.substring(firstWordLength, firstNodeRefEnd)
    console.log({firstNodeRef})



    return {forNow: "nothing"}
}

function parseNode(string){

    const separatorIndex = string.find(":")

    const specificationsIndex = string.find("{")
    if(specificationsIndex !== -1){
        specifications = JSON
    }
    const nodeRef = string.substring(0, separatorIndex)
}

const clauses = [
    "MATCH",
]

module.exports = cypherParse