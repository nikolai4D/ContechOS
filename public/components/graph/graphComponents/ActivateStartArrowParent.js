import styles from './Styles.js';

const startArrow = (g) => {
    return g.append("svg:defs")
        .append("svg:marker")
        .attr("id", "self-arrow-parent")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 41.5)
        .attr("refY", 2)
        .attr("markerWidth", 11)
        .attr("markerHeight", 11)
        .attr("orient", "168deg")
        // .attr("class", "linkSVG")
        .append("path")
        .attr("fill", styles.arrows.parent.fill)
        .attr("d", "M 0,-5 L 10 ,0 L 0,5");

}

export default startArrow;