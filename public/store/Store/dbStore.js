// General idea:
// The store is divided into four layers. Each layer is a collection of deftYpeNodeRepos and defTypeRelRepos.
// Each defTypeNodeRepo contains a childrenRepos, grouping nodes by parentId.
// Each defTypeRelRepo contains a list of relations. The layer say for witch nodes the relations have been fetched for in the relsFetchedForIds array.
// This inconsistent structure allow efficient calls from the intersection function.

export function Store(){
    this.stock = [
        new Layer("configDef", "cd"),
        new Layer("configObj", "co"),
        new Layer("typeData", "td"),
        new Layer("instanceData", "id"),
    ]

    this.getDefinitionNodes = () => getDefinitionNodes(this.stock)
    this.getRelatedRels = async (id) => await getRelatedRels(id, this.stock)
    this.getChildren = async (id) => await getChildren(id, this.stock)

}

function Layer(name, prefix){
    this.name = name
    this.prefix = prefix
    this.relsFetchedForIds = []
    this.repos = [
        new DefTypeNodeRepo(name, "node", prefix),
        new DefTypeRelRepo(name + "ExternalRels", "relationship", prefix + "er"),
        new DefTypeRelRepo(name + "InternalRels", "relationship", prefix + "ir")
    ]
}

function DefTypeNodeRepo(name, kindOfItem, prefix) {
    this.name = name
    this.kindOfItem = kindOfItem
    this.prefix = prefix
    this.repos = []
}

function ChildrenNodeRepo(parentId = null, items = []) {
    this.parentId = parentId
    this.items = items
}

function DefTypeRelRepo(){
    this.items = []
}

function getAbbr(id) {
    return id.split("_")[0]
}

function getLayerIndex(id, mimic) {
    const abbr = getAbbr(id)
    return mimic.findIndex(layer => layer.repos.find(repo => repo.prefix === abbr))
}

async function getDefinitionNodes(stock) {
    const layer = stock.find(layer => layer.name === "configDef")
    const defTypeRepo = layer.repos[0]

    if (defTypeRepo.repos.length === 0) {
        const defNodes = await queryDefinitions()
        defTypeRepo.repos.push(new ChildrenNodeRepo(null, defNodes))
    }
    else console.log("defnodes: " + JSON.stringify(defTypeRepo.repos[0]))
    return defTypeRepo.repos[0].items
}

async function getChildren(parentId, store) {
    const childrenLayer = getLayerIndex(parentId, store) + 1
    if(childrenLayer === 3) throw new Error("No children for this item")

    const defTypeRepo = store[childrenLayer].repos.find(repo => repo.prefix === getAbbr(parentId))
    const offspringRepo = defTypeRepo.repos.find(repo => repo.parentId === parentId)
    if (offspringRepo === undefined) {
        console.log("repo containing children of " + parentId + " not found, fetching from database")
        defTypeRepo.repos.push(await queryNodeChildren(parentId, "node"))
    }
    return offspringRepo.items
}

async function getRelatedRels(id, stock) {
    const layer = stock[getLayerIndex(id, stock)]

    if(layer.relsFetchedForIds.includes(id)) {
        const externalRelsRepo = layer.repos.find(repo => repo.name === layer.name + "ExternalRels")
        const externalRels = externalRelsRepo.items.filter(rel => rel.sourceId === id || rel.targetId === id)
        const internalRelsRepo = layer.repos.find(repo => repo.name === layer.name + "InternalRels")
        const internalRels = internalRelsRepo.items.filter(rel => rel.sourceId === id || rel.targetId === id)

        return [...externalRels, ...internalRels]
    }
    else {
        const relations = await queryRelations(id)
        for (let rel of relations) {
            if(rel.id.charAt(2) === 'e') layer.repos[1].items.push(rel)
            else if(rel.id.charAt(2) === 'i') layer.repos[2].items.push(rel)
            else throw new Error("Invalid relation id: " + rel.id)
        }
        layer.relsFetchedForIds.push(id)
        return relations
    }
}

export async function queryDefinitions() {
    const nodeQuery = JSON.stringify({
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
            input: { defType: "configDef"}
        }
    })
    const nodes = (await graphQLQuery(nodeQuery)).data.nodes

    return nodes
}

export async function queryNodeChildren(parentId) {
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

    return (await graphQLQuery(query)).data.nodes
}

export async function asyncQueryNodeChildren(parentId) {
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

    return graphQLQuery(query)
}

export async function queryRelations(nodeId) {
    const query= JSON.stringify( {
        query: `query RooterQueryType($inputSource:QueryInput, $inputTarget:QueryInput){
        sourceRels: relationships(itemInput:$inputSource){
        id
        title
        defType
        parentId
        sourceId
        targetId
        updated
        created
      },
      targetRels: relationships(itemInput:$inputTarget){
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
            inputSource: {
                sourceId: nodeId
            },
            inputTarget: {
                targetId: nodeId
            }
        }
    })
    const data = await graphQLQuery(query)
    return [...data.data.sourceRels, ...data.data.targetRels]
}

export async function asyncQueryRelations(nodeId) {
    const query= JSON.stringify( {
        query: `query RooterQueryType($inputSource:QueryInput, $inputTarget:QueryInput){
        sourceRels: relationships(itemInput:$inputSource){
        id
        title
        defType
        parentId
        sourceId
        targetId
        updated
        created
      },
      targetRels: relationships(itemInput:$inputTarget){
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
            inputSource: {
                sourceId: nodeId
            },
            inputTarget: {
                targetId: nodeId
            }
        }
    })
    return graphQLQuery(query)
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