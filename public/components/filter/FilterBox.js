import {State} from "../../store/State.js";

async function FilterBox(allNodes, checkedNodes) {

  // const nodes = [{
  //   id: "patate",
  //   title: "Patate",
  //   children: [{
  //       id: "patate1",
  //       title: "Patate1",
  //       children: [{
  //           id: "patate11",
  //           title: "Patate11",
  //           children: []
  //       },
  //       {
  //           id: "patate12",
  //           title: "Patate12",
  //           children: [ {
  //               id: "patate121",
  //               title: "Patate121"
  //           }]
  //       }]
  //   }]
  // },
  // {
  //   id: "patate2",
  //   title: "Patate2",
  //   children: [{
  //       id: "patate21",
  //       title: "Patate21",
  //       children: [{
  //           id: "patate211",
  //           title: "Patate211",
  //           children: [{
  //               id: "patate2111",
  //               title: "Patate2111",
  //           }]
  //       }]
  //   }]
  // }]

    const nodes = State.treeOfNodes

  let nodeHtmlString = ``
  nodes.forEach(node => {
        nodeHtmlString += itemRow(node)
      }
  )

  const htmlString = `
<div class="accordion w-25 position-absolute" id="accordionPanelsStayOpenExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
        Filter
      </button>
    </h2>
    <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
      <div class="accordion-body">
      ${nodeHtmlString}
      </div>
    </div>
    </div>
</div>  
            `


  let filterDOM = document.createElement("div");
  filterDOM.className = "filter-container"
  filterDOM.innerHTML = htmlString;
  return filterDOM;
}

function itemRow(node){
  let childrenFrame = `<br/>`

    if (node.hasOwnProperty("children") && node.children.length !== 0){
      console.log("nodeId:" + node.id)
      childrenFrame = `
          <ul>
          `
      for(let child of node.children){
          console.log("childId:" + child.id)
            childrenFrame += itemRow(child)
      }

      childrenFrame += `</ul>`
    }

     let mainRow = `
          <input class="form-check-input" type="checkbox" value="" id="checkbox_${node.id}" data-function="checkFilter" ${ node.visible? "checked": ""}>
          <label class="form-check-label" for="checkbox_${node.id}"> ${node.title}</label>
          
          ${ childrenFrame }
     `

    return mainRow
}

export default FilterBox;