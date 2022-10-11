import {State} from "../store/State.js";

export default function(){

    const header = "Generated API from active filter"

    let cascadeInput = State.treeOfNodes.getCascadeParams()
    console.log("cascadeInput", JSON.stringify(cascadeInput, null, 2))
    const dynamicQuery = `
    {
        query:\`query RooterQueryType($cascadeInput: CascadeInput){
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
    }}, variables: {
            cascadeInput: ${JSON.stringify(cascadeInput, null, 2)}
        }
    }`

    const query =`
{
    query:
    \`query RooterQueryType($input:QueryInput){
        nodes(itemInput:$input){
        id
        title
        defType
        parentId
        updated
        created
        }
    }\`,
    variables: {
        input: {
            parentId: parentId
        }
    }
}`

    const { protocol, port, hostname } = window.location;

    const requestType = "/POST"
    const textPort = port ? `:${port}` : null;
    const url = protocol + "//" +hostname + textPort + "/api/graphql";
    const api = "Click to show API Key"

    const classDiv = "p-3 border rounded border-1"
    const classPre =`border rounded border-1 bg-light`
    

      
    const copyIcon = (part) => {
        return `<i data-function="copyToClipboard" id="modalClipboard${part}" class="p-1 bi bi-clipboard text-secondary" role="button"></i>`
    }

    return `
    <div class="p-2 link-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" >
    <i class="bi bi-braces" role="button"></i>
    </div>
    

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                
                    <h5 class="modal-title" id="exampleModalLabel">${header}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>Header</h5>
                    <div class="${classDiv}" id="textHeader">
                        <div>Request type:
                            <div>
                                <pre id="textRequest" class="${classPre}"> ${requestType}</pre>
                            </div>
                        </div>
                        <div>URL: ${copyIcon("Url")}
                            <pre id="textUrl" class="${classPre}"> ${url}</pre>
                        </div>
                        <div>API key: ${copyIcon("Api")}
                            <pre id="textApi" class="${classPre}" data-function="showApi"> ${api}</pre>
                        </div>
                    </div>

                    <hr>
                        <h5>Body</h5>
                        <div id="textBody" class="${classDiv}">
                        Query: ${copyIcon("Query")}

                            <pre id="textQuery" class="${classPre}">
                            ${dynamicQuery}
                            </pre>
                        </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`
}


