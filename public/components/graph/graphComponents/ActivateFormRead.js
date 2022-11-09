import { State } from '../../../store/State.js';
import { FormRead } from '../FormRead.js';
import { moveBoxToTopRight } from "./helpers.js"

export default function (d3) {
    d3.select(".contextMenuContainer").remove();
    d3.select(".FormMenuContainer").remove();

  d3.select("#root")
        .append("div")
        .attr("class", "FormMenuContainer")
        .html(FormRead(State.clickedObjEvent, State.contextMenuItem, State.clickedObj))
        .select(".formRead")
        .style("top", 70 + "px")


        moveBoxToTopRight(d3, ".formRead")
}