async function checkFilter(event) {
    //
    const checkBoxParent = event.target.parentElement
    const ids = []
    checkBoxParent.querySelectorAll("input").forEach((input) => {
        if(input.hasAttribute("checked")){
            ids.push(input.getAttribute("id").substring(9))
        }
    })

    console.log("ParsedIds: " + ids)
}


export default checkFilter;