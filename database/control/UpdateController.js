const { IdController } = require("./IdController")

function UpdateController(params){
    this.idCon = new IdController(params.id)
    this.title = getTitle(params)
}

function getTitle(params){
    if(params.hasOwnProperty("title") && params.title !== "" && params.title !== null && params.title !== undefined) return params.title
    else throw new Error("Provided title is invalid.")
}