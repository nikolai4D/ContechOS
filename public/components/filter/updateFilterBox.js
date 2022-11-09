import {FilterBox} from "./FilterBox.js";
import {setFilterBoxCallback} from "./filterFunctions.js";
import Filter from  "../../views/Filter.js";

export async function updateFilterBox(render, view) {

    let filterBox = await FilterBox(); // Generates a new filter box w/o event listeners
    await setFilterBoxCallback(filterBox, async () => await render(view)); // Generates event listeners on every checkbox
    let filterBoxContainerNode = document.querySelector("#data-display-grid-container-id");
    filterBoxContainerNode.innerHTML = "";
    filterBoxContainerNode.appendChild(filterBox);
    let firstColumnDiv = document.querySelector("#filterbox-grid-container-id");
    let secondColumnDiv = filterBoxContainerNode;
    await new Filter().setupToolBar(firstColumnDiv, secondColumnDiv, secondColumnDiv.querySelector("#accordion-container-switch-modalbtn"), render);    // Generates switch + modal btn over checkboxes
  }
