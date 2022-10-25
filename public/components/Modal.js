export default function() {

    const header = "Generated API from active filter"
    const {protocol, port, hostname} = window.location;
    const requestType = "/POST"
    const textPort = port ? `:${port}` : "";
    const url = protocol + "//" +hostname + textPort + "/api/graphql";
    const api = "Click to show API Key"
    const classDiv = "p-3 border rounded border-1"
    const classPre =`border rounded border-1 bg-light`
    

      
    const copyIcon = (part) => {
        return `<i data-function="copyToClipboard" id="modalClipboard${part}" class="p-1 bi bi-clipboard text-secondary" role="button"></i>`
    }

    let modalContent = document.createElement("div");
    modalContent.className = "modal fade"
    modalContent.id = "exampleModal"
    modalContent.setAttribute("tabindex", "-1")
    modalContent.setAttribute("aria-labelledby", "exampleModalLabel")
    modalContent.setAttribute("aria-hidden", "true")
    modalContent.innerHTML =
        `<div class="modal-dialog">
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
                                </pre>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`

    return {
        modalButton: `
            <div class="p-2 link-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" >
            <i class="bi bi-braces"  data-function="getQuery"  role="button"></i>
            </div>`,

        modalContent
    }
}


