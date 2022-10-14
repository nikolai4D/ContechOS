import {State} from "../../store/State.js";
import { iconEye } from "./toggleHideShow.js";

async function FilterBox() {
  let nodeHtmlString = await triggerTreeGetHtml();

  const htmlString = `
<div class="accordion w-25 position-absolute open" id="accordionPanelsStayOpenExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
      <button class="accordion-button col-sm" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
        Filter
      </button>
    </h2>
    <div id="panelsStayOpen-collapseOne" class="accordion-collapse show" aria-labelledby="panelsStayOpen-headingOne">
    <div id="accordion-container-switch-modalbtn" class="d-flex justify-content-end"></div>
      <div class="accordion-body" id="accordion-body-id">
      ${nodeHtmlString}
      </div>
    </div>
    </div>
</div>  
            `


  let filterDOM = document.createElement("div");
  filterDOM.className = "filter-container container-fluid"
  filterDOM.id = "filter-container-id"
  filterDOM.innerHTML = htmlString;
  return filterDOM;
}

async function triggerTreeGetHtml() {
  let tree = State.treeOfNodes.tree;
  await State.treeOfNodes.ensureInit();

  let nodeHtmlString = ``;
  tree.forEach(node => {
    nodeHtmlString += itemRow(node);
  }
  );
  return nodeHtmlString;
}

function itemRow(node){
    if(node.excluded) return ""

    let childrenFrame = `<br/>`

    if (node.selected === true && node.hasOwnProperty("children") && node.children.length !== 0){
      childrenFrame = `
            <ul>
            <input class="form-check-input" type="checkbox" value="" id="all_${node.id}"  ${ node.viewAll? "checked": ""}>
            <label class="form-check-label" for="all_${node.id}"> All</label>
            <br/>
          `
      for(let child of node.children){
            childrenFrame += itemRow(child)
      }

      childrenFrame += `</ul>`
    }

    //const eye = node.hidden? iconEye(node.id).hide : iconEye(node.id).show
    let eye
    if(node.hidden){
        eye = iconEye(node.id).hide
    }
    else {
        eye = iconEye(node.id).show
    }

    const eyeDiv = `<div class="d-inline-block" id="toggleEyeContainer_${node.id}">${eye}</div>`

     let mainRow = `
     <div id="form-check-input-container" class="d-inline-block" role="button">
          <input class="form-check-input" type="checkbox" value="" id="checkbox_${node.id}" ${ node.selected? "checked": ""}>
          <label class="form-check-label" for="checkbox_${node.id}"> ${node.title}</label> 
          ${ node.selected? eyeDiv : ""}
          </div>
          ${ childrenFrame }
     `

    return mainRow
}

export {FilterBox, triggerTreeGetHtml};