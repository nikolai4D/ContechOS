import { State } from '../../../store/State.js';
import { FormCreate } from '../FormCreate.js';
import { reCalcTopPlacement } from "./helpers.js"

export default function (d3) {
    d3.select(".contextMenuContainer").remove();
    d3.select(".FormMenuContainer").remove();

    d3.select("#root")
        .append("div")
        .attr("class", "FormMenuContainer")
        .html(FormCreate(State.clickedObjEvent, State.contextMenuItem, State.clickedObj))
        .select(".formCreate")
        .style("top", (State.clickedObj.clientY + 10) + "px")
        .style("left", State.clickedObj.clientX + 50 + "px");

    reCalcTopPlacement(d3, ".formCreate")
}
