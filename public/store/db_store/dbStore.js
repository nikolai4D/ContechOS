// TOdo
// query all the definitions

function Layer(name, prefix){
    this.name = name
    this.prefix = prefix
    this.repos = [
        new DeftypeRepo(name, "node"),
        new DeftypeRepo(name + "ExternalRels", "relation", prefix + "er"),
        new DeftypeRepo(name + "InternalRels", "relation", prefix + "ir")
    ]
}

function DeftypeRepo(name, kindOfItem, prefix) {
    this.name = name,
    this.kindOfItem = kindOfItem
    this.prefix = prefix
    this.repos = null
}

function ItemRepo(parentId = null){
    this.parentId = parentId
    this.items = null
}

export const dbStore = {
    mimic: [
        new Layer("configDef", "cd"),
        new Layer("configObj", "co"),
        new Layer("typeData", "td"),
        new Layer("instanceData", "id"),
    ],


    async getRepoContent(repo) {
        return undefined;
    },

    async getRelatedNodesAndRels(ticked) {
        return {relations: [], nodes: []}
    },
    getChildren(parentId) {

    },
    getItem(id) {
        
    }
}


const findDefTypeInMimic = (id, mimic) => {
    const idAbbr = id.split("_")[0]
    return mimic.map(layer => layer.repos.find(repo => repo.prefix === idAbbr))
}

function getAbbr(id) {
    return id.split("_")[0]
}

function getLayerIndex(id, mimic) {
    const abbr = getAbbr(id)
    return mimic.findIndex(layer => layer.repos.find(repo => repo.prefix === abbr))
}

export function findItemInStore(id, mimic, parentId = null) { // This implementation allow not to pass a parentId, but find faster if there is one.
    const defType = findDefTypeInMimic(id, mimic)
    if(parentId !== null){
        const OffspringRepo = defType.OffspringRepos.find(repo => repo.parentId === parentId)
        return OffspringRepo.items.find(item => item.id === id)
    }
    else {
        for(let repo of defType.OffspringRepos){
            const item = repo.items.find(item => item.id === id)
            if(item !== undefined) return item
        }
    }
}

async function getOffspring(parentId, mimic) {
    const childrenLayer = getLayerIndex(parentId, mimic) + 1
    if(childrenLayer === 3) return []

    const defTypeRepo = mimic[childrenLayer].repos.find(repo => repo.prefix === getAbbr(parentId))
    const offspringRepo = defTypeRepo.OffspringRepos.find(repo => repo.parentId === parentId)
    if (offspringRepo === undefined) {
        console.log("OffspringRepo not found, fetching from database")
        defTypeRepo.OffspringRepos.push(await queryNodeChildren(parentId, "node"))
    }
    return offspringRepo.items
}


function mapItemsToDbStore(array){

}

async function queryDefinitions() {
    const nodeQuery = JSON.stringify({
        query: `query RooterQueryType($input:QueryInput){
        relations(itemInput:$input){
        id
        title
        defType
        parentId
        updated
        created
      }
    }`, variables: {
            input: {layer: 0}
        }
    })
    const nodes = await graphQLQuery(nodeQuery)

    const relationQuery = JSON.stringify({
        query: `query RooterQueryType($input:QueryInput){
        relations(itemInput:$input){
        id
        title
        defType
        parentId
        updated
        created
      }
    }`, variables: {
            input: {layer: 0}
        }
    })
    const relations = await graphQLQuery(relationQuery)

    return {nodes, relations}
}

async function queryNodeChildren(parentId, kindOfItem) {
    const query= JSON.stringify( {
        query: `query RooterQueryType($input:QueryInput){
    nodes(itemInput:$input){
        id
        title
        defType
        parentId
        updated
        created
      }
    }`, variables: {
            input: {
                parentId: parentId
            }
        }
    })

    return (await graphQLQuery(query))
}

async function queryRelationsChildren(parentId, kindOfItem) {
    const query= JSON.stringify( {
        query: `query RooterQueryType($input:QueryInput){
    relations(itemInput:$input){
        id
        title
        defType
        parentId
        sourceId
        targetId
        updated
        created
      }
    }`, variables: {
            input: {
                parentId: parentId
            }
        }
    })
    return (await graphQLQuery(query))
}

async function graphQLQuery(query) {
    {
        let response
        try {
            response = await fetch(`/api/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: sessionStorage.getItem("accessToken"),
                },
                body: query
            });
        } catch (err) {
            console.log(err);
        }
        return await response.json()
    }
}