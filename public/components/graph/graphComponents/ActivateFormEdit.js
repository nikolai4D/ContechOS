import { State } from '../../../store/State.js';
import { FormEdit } from '../FormEdit.js';
import { moveBoxToTopRight } from "./helpers.js"

export default function (d3) {
    d3.select(".contextMenuContainer").remove();
    d3.select(".FormMenuContainer").remove();

    d3.select("#root")
        .append("div")
        .attr("class", "FormMenuContainer")
        .html(FormEdit(State.clickedObjEvent, State.contextMenuItem, State.clickedObj))
        .select(".formEdit")
        .style("top", 70 + "px")

        moveBoxToTopRight(d3, ".formEdit")

}