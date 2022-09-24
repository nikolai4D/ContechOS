async function Filter() {


  let nodes,
    rels = [];

  let view = window.location.pathname.substring(1)

  let graphJsonData = await JSON.parse(sessionStorage.getItem(`${view}`));
  let nodeHtmlString = ``

  nodes = graphJsonData[0].nodes;

  nodes.forEach(node => {
    nodeHtmlString += `
    
    <input class="form-check-input" type="checkbox" value="" id="checkbox_${node.id}" data-function="checkFilter" checked>
    <label class="form-check-label" for="checkbox_${node.id}"> ${node.title}</label>
    <br/>

`
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

export default Filter;