import styles from './Styles.js';

const endArrow = (g) => {
    return g.append("svg:defs")
        .append("svg:marker")
        .attr("id", "end-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 45)
        .attr("refY", 0)
        .attr("markerWidth", 11)
        .attr("markerHeight", 11)
        .attr("orient", "auto")
        // .attr("class", "linkSVG")
        .append("path")
        .attr("fill", styles.arrows.fill)
        .attr("d", "M 0,-5 L 10 ,0 L 0,5");
}
export default endArrow;