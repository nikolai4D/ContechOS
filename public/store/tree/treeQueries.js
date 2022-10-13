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
    }, null, 2)

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


export async function queryCascade(cascadeInput) {
    const query = JSON.stringify({

        query: `query RooterQueryType($cascadeInput: CascadeInput){
        cascade(cascadeInput:$cascadeInput){
        id
        title
        defType
        parentId
        updated
        created
        childrenNodes{
            id
            title
            defType
            parentId
            updated
            created
            
            childrenNodes{
                id
                title
                defType
                parentId
                updated
                created
                            
                childrenNodes{
                    id
                    title
                    defType
                    parentId
                    updated
                    created
                }
            }
        }
    }}`, variables: {
            cascadeInput: cascadeInput
    }
    }, null, 2)

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