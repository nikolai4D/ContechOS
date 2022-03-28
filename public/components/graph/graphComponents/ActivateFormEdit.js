import { State } from '../../../store/State.js';
import { FormEdit } from '../FormEdit.js';

export default function (d3) {
    d3.select(".contextMenuContainer").remove();
    d3.select(".FormMenuContainer").remove();

    return d3.select("#root")
        .append("div")
        .attr("class", "FormMenuContainer")
        .html(FormEdit(State.clickedObjEvent, State.contextMenuItem, State.clickedObj))
        .select(".formEdit")
        .style("top", (State.clickedObj.clientY + 10) + "px")
        .style("left", State.clickedObj.clientX + "px");
}