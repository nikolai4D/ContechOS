import { State } from '../../store/State.js';
import ContextMenu from '../ContextMenu.js';

export default function (d3) {
    d3.select(".FormMenuContainer").remove();
    d3.select(".contextMenuContainer").remove();
    event.preventDefault();
    return d3.select("#app")
        .append("div")
        .attr("class", "contextMenuContainer")
        .html(ContextMenu(event, State.clickedObj))
        .select(".contextMenu")
        .style("top", State.clickedObj.clientY + "px")
        .style("left", State.clickedObj.clientX + "px");
}