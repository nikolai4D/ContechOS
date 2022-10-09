import { State} from "../store/State.js";

export default function(){

    console.log(State)
    const header = "Query"

    const query =
    `
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
    const textPort = port ? `:${port}` : null;
    const url = protocol + "//" +hostname + textPort + "/api";
    const requestType = "/POST"
    const API = "..."
    const borderClass = "p-3 border rounded border-1"
    const copyIconHeader = `<i data-function="copyToClipboard" id="modalClipboardHeader" class="p-1 bi bi-clipboard text-secondary"></i>`
    const copyIconBody = `<i data-function="copyToClipboard" id="modalClipboardBody" class="p-1 bi bi-clipboard text-secondary"></i>`

    return `
    <div class="p-2 link-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    <i class="bi bi-braces"></i>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${header}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>Header ${copyIconHeader}</h5>
                    <div class="${borderClass}" id="textHeader" role="alert">
                        <div>Request type: <pre>${requestType}</pre></div>
                        <div>URL: <pre>${url}</pre></div>
                        <div>API key: <pre>${API}</pre></div>
                    </div>

                    <hr>
                        <h5>Body ${copyIconBody}</h5>
                        <div id="textBody" class="${borderClass}">
                            <pre>
                            ${query}
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


