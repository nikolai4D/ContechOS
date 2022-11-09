import { State } from '../../../store/State.js';

export function reCalcTopPlacement(d3, attr) {
    let form = d3.select(attr).node();

    let divOffsets = form.getBoundingClientRect();
    let divBottom = divOffsets.bottom;

    let appOffsets = document.querySelector("#app").getBoundingClientRect();
    let appHeight = appOffsets.height; 

    if (divBottom > appHeight) {
        let bodyDOM = d3.select(attr).node();
        let bodyDOMHeight = bodyDOM.getBoundingClientRect().height;

        let height = appOffsets.height - (bodyDOMHeight + 10 ) + "px";

        d3.select(attr)
            .style("top", height)
            .style("left", State.clickedObj.clientX + 50 + "px");

    }
}


export function moveBoxToTopRight(d3, attr) {

    let appOffsets = document.querySelector("#app").getBoundingClientRect();
    let formOffsets = document.querySelector(attr).getBoundingClientRect();

    d3.select(attr)
    .style("left", appOffsets.width - formOffsets.width - 10 + "px");
}