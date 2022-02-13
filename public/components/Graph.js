import * as d3 from "https://cdn.skypack.dev/d3@6";
import Actions from "../store/store.js";
import ContextMenu from "./ContextMenu.js";
import FormNode from './FormNode.js';
import nodeDefs from "../store/definitions.js";

const Graph = async (view) => {
  let graphJsonData = await JSON.parse(sessionStorage.getItem(`${view}`));

  let width = window.innerWidth,
    height = window.innerHeight - 20;

  let { nodes, rels } = graphJsonData[0],
    r = 38,
    svgStyle = {
      position: "absolute",
    },
    linkLength = 200,
    nodeFill = "#FFCCCC",
    nodeStyle = {
      strokeWidth: 0,
      borderColor: "#000",
    },
    nodeLabelStyle = {
      textAnchor: "middle",
      fill: "#000",
      fontSize: "12px",
    },
    linkLabelStyle = {
      textAnchor: "middle",
      fill: "#000",
      fontSize: "12px",
      backgroundColor: "#fff",
    },
    linkSvgStyle = {
      stroke: "#000",
      fill: "#000",
    }

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(rels)
        .id((d) => d.id)
        .distance(linkLength)
    )
    .force("charge", d3.forceManyBody().strength(-50))
    .force(
      "x",
      d3
        .forceX()
        .strength(0.03)
        .x(width / 2)
    )
    .force(
      "y",
      d3
        .forceY()
        .strength(0.03)
        .y(height / 2)
    );

  const drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      simulation.alpha(1).restart();
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };


  const svg = d3
    .create("svg")
    .style("position", svgStyle.position)
    .attr("width", width)
    .attr("height", height)
    .call(
      d3.zoom().on("zoom", function ({ transform }) {
        g.attr("transform", transform);
      })
    )
    .on("click", () => {
      d3.select(".contextMenuContainer").remove();
      d3.select(".FormMenuContainer").remove();
    })
    .on("contextmenu", (d) => {
      d3.select(".FormMenuContainer").remove();

      d3.select(".contextMenuContainer").remove();
      event.preventDefault();
      d3.select("#app")
        .append("div")
        .attr("class", "contextMenuContainer")
        .html(ContextMenu(d))
        .select(".contextMenu")
        .style("top", d.clientY + "px")
        .style("left", d.clientX + "px");

      let x_cord = d.clientX
      let y_cord = d.clientY

      d3.selectAll(".context_menu_item")
        .on("click", async (d) => {
          d3.select(".contextMenuContainer").remove();
          d3.select(".FormMenuContainer").remove();

          d3.select('#root').append("div").attr("class", "FormMenuContainer").html(await FormNode(d)).select('.formNode')
            .style("top", y_cord + "px")
            .style("left", x_cord + "px");

          d3.selectAll('.FormNodeSubmit').on('click', async e => {

            const nodeTypesDetail = nodeDefs.nodeTypes.find(obj => {
              return obj.nodeTypeId === parseInt(d.target.id);
            });
            const data = Object.keys(nodeTypesDetail.attributes)
            const attrs = {}

            data.forEach(obj => attrs[obj] = d3.select(`#form_${obj}`)._groups[0][0].value)
            await Actions.CREATE(view, nodeTypesDetail.title, attrs)
          });

          d3.selectAll(".form_add_more_props_button")
            .on("click", (d) => {
              // console.log("hellooo")
              d3.selectAll(".form_add_props")
                .append("div")
                .clone(d3.selectAll(".form_add_props"))
                .html("<div>hello</div>")

              // return document.getElementById("form_add_props")
            })
        });
    });



  const firstG = svg.append("g").attr("transform", `translate(20,20)`);

  const g = firstG.append("g");

  // end arrow
  g.append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 45)
    .attr("refY", 0)
    .attr("markerWidth", 11)
    .attr("markerHeight", 11)
    .attr("orient", "auto")
    .attr("class", "linkSVG")
    .append("path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

  // self arrow
  g.append("svg:defs")
    .append("svg:marker")
    .attr("id", "self-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 41.5)
    .attr("refY", 2)
    .attr("markerWidth", 11)
    .attr("markerHeight", 11)
    .attr("orient", "168deg")
    .attr("class", "linkSVG")
    .append("path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

  const clicked = (event, d) => {
    console.log(d);
  };

  const rightClicked = (event, d) => {
    console.log(d, "right");
    event.preventDefault();
  };

  const link = g
    .append("g")
    .style("stroke", linkSvgStyle.stroke)
    .style("fill", linkSvgStyle.fill)
    .attr("class", "linkSVG")
    .selectAll("path")
    .data(rels)
    .join((enter) => {
      const link_enter = enter
        .append("path")
        .attr("id", function (d) {
          return "edge" + d.id;
        })
        .attr("marker-end", (d) => {
          return d.source == d.target ? "url(#self-arrow)" : "url(#end-arrow)";
        });
      return link_enter;
    })
    .join("path")
    .on("click", clicked)
    .on("contextmenu", rightClicked);

  const linkLabel = g
    .selectAll(".linkLabel")
    .data(rels)
    .join((enter) => {
      const linkLabel = enter
        .append("text")
        .text((link) => link.title)
        .attr("id", function (d) {
          return "linkLabel" + d.id;
        })
        .attr("class", "linkLabel")
        .style("color", "#fff")
        .attr("dy", 0);

      return linkLabel;
    });

  const node = g
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .style("stroke-with", nodeStyle.strokeWidth)
    .attr("stroke-with", (d) => nodeStyle.strokeWidth)
    .attr("fill", (d) => nodeFill)
    .attr("stroke", (d) => nodeStyle.borderColor)
    .attr("r", r)
    .call(drag(simulation))
    .on("click", clicked)
    .on("contextmenu", rightClicked)
    .attr("class", "node");

  const nodeLabel = g
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((node) => node.title)
    .style("text-anchor", nodeLabelStyle.textAnchor)
    .style("fill", nodeLabelStyle.fill)
    .style("font-size", nodeLabelStyle.fontSize)
    .attr("class", "nodeLabel")
    .attr("dy", 4);

  /* Sets angle on link label */
  const angle = (cx, cy, ex, ey) => {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;
    return theta;
  };

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    link.attr("d", function (d) {
      let x1 = d.source.x,
        y1 = d.source.y,
        x2 = d.target.x,
        y2 = d.target.y;
      if (x1 === x2 && y1 === y2) {
        return `M${x1 - 5},${y1 - 30}A26,26 -10,1,1 ${x2 + 1},${y2 + 1}`;
      }
      // else, straight line between nodes
      return `M${x1},${y1}A0,0 0,0,1 ${x2},${y2}`;
    });
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    linkLabel
      .style("text-anchor", linkLabelStyle.textAnchor)
      .style("fill", linkLabelStyle.fill)
      .style("font-size", linkLabelStyle.fontSize)
      .style("background-color", linkLabelStyle.backgroundColor)
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);

    linkLabel.attr("transform", function (d) {
      let bbox = this.getBBox();
      let rx = bbox.x + bbox.width / 2;
      let ry = bbox.y + bbox.height / 2;
      let theAngle = angle(d.source.x, d.source.y, d.target.x, d.target.y);
      // Self link
      if (d.target == d.source) {
        return `rotate(1 ${rx + 3500} ${ry + 2800})`;
      }
      if (d.target.x < d.source.x) {
        // Rotating label 180 degrees (prevent it going upside down)
        return `rotate(${180 + theAngle} ${rx} ${ry})`;
      } else {
        return `rotate(${theAngle} ${rx} ${ry})`;
      }
    });

    nodeLabel.attr("x", (data) => data.x).attr("y", (data) => data.y);
  });

  return svg.node();
};
export default Graph;
