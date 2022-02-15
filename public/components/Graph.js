import * as d3 from "https://cdn.skypack.dev/d3@6";
import ContextMenu from "./ContextMenu.js";
import { FormNode } from './FormNode.js';
import styles from './graphComponents/styles.js';
import endArrow from './graphComponents/endArrow.js';
import startArrow from './graphComponents/startArrow.js';
import formNodeFunction from './graphFunctions/formNodeFunction.js'

async function Graph(view) {

  let nodes, rels = []
  let graphJsonData = await JSON.parse(sessionStorage.getItem(view));

  nodes = graphJsonData[0].nodes;
  rels = graphJsonData[0].rels;

  const updateData = async (view) => {
    // Preserve position of nodes/rels
    const old = new Map(nodes.map(d => [d.id, d]));
    graphJsonData = await JSON.parse(sessionStorage.getItem(view));
    nodes = graphJsonData[0].nodes.map(d =>
      Object.assign(old.get(d.id) || {}, d)
    );
    rels = graphJsonData[0].rels.map(d => Object.assign({}, d));
  }

  let width = window.innerWidth,
    height = window.innerHeight - 20;


  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(rels)
        .id((d) => d.id)
        .distance(styles.link.length)
    )
    .force("charge", d3.forceManyBody().strength(-1000))
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


  let svg = d3
    .create("svg")
    .style("position", styles.svg.position)
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
      let clickedObj = d;

      if (d.target.tagName === 'svg') {
        console.log(d.target.tagName)

        d3.select(".FormMenuContainer").remove();
        d3.select(".contextMenuContainer").remove();
        event.preventDefault();
        d3.select("#app")
          .append("div")
          .attr("class", "contextMenuContainer")
          .html(ContextMenu(event, d))
          .select(".contextMenu")
          .style("top", d.clientY + "px")
          .style("left", d.clientX + "px");
        let clickEvent = event;
        let x_cord = d.clientX;
        let y_cord = d.clientY;

        d3.selectAll(".context_menu_item")
          .on("click", async (d) => {
            d3.select(".contextMenuContainer").remove();
            d3.select(".FormMenuContainer").remove();

            d3.select('#root').append("div").attr("class", "FormMenuContainer").html(await FormNode(clickEvent, d, clickedObj)).select('.formNode')
              .style("top", y_cord + "px")
              .style("left", x_cord + "px");

            d3.selectAll('.FormNodeSubmit').on('click', async (e) => {
              await formNodeFunction(view, d)

              await updateData(view);
              await render(view)
            });

            // d3.selectAll(".form_add_more_props_button")
            //   .on("click", (d) => {

            //     d3.selectAll(".form_add_props")
            //       .append("div")
            //       .clone(d3.selectAll(".form_add_props"))
            //       .html("<div>hello</div>")

            //     // return document.getElementById("form_add_props")
            //   });
          });
      }
    });

  const firstG = svg.append("g").attr("transform", `translate(20,20)`);
  const g = firstG.append("g").attr("class", "secondG")

  // end arrow
  endArrow(g);

  // start arrow
  startArrow(g);

  const clicked = (event, d) => {
    console.log(d);
  };

  const rightClicked = (event, d) => {

    event.preventDefault();
    let clickedObj = d;

    if (event.target.tagName === 'circle') {
      console.log(event.target.tagName)

      d3.select(".FormMenuContainer").remove();
      d3.select(".contextMenuContainer").remove();
      event.preventDefault();
      d3.select("#app")
        .append("div")
        .attr("class", "contextMenuContainer")
        .html(ContextMenu(event, d))
        .select(".contextMenu")
        .style("top", event.clientY + "px")
        .style("left", event.clientX + "px");
      let clickEvent = event;
      let x_cord = event.clientX;
      let y_cord = event.clientY;

      d3.selectAll(".context_menu_item")
        .on("click", async (d) => {
          d3.select(".contextMenuContainer").remove();
          d3.select(".FormMenuContainer").remove();

          d3.select('#root').append("div").attr("class", "FormMenuContainer").html(await FormNode(clickEvent, d, clickedObj)).select('.formNode')
            .style("top", y_cord + "px")
            .style("left", x_cord + "px");

          d3.selectAll('.FormNodeSubmit').on('click', async (e) => {
            await formNodeFunction(view, d)

            await updateData(view);
            await render(view)
          });

          // d3.selectAll(".form_add_more_props_button")
          //   .on("click", (d) => {

          //     d3.selectAll(".form_add_props")
          //       .append("div")
          //       .clone(d3.selectAll(".form_add_props"))
          //       .html("<div>hello</div>")

          //     // return document.getElementById("form_add_props")
          //   });
        });
    }

  };


  let link = g
    .append("g")
    .attr("class", "forLinks")
    .select(".forLinks");
  // .selectAll("path")


  let linkLabel = g
    .selectAll(".linkLabel")
    .attr("class", "linkLabel")
    .style("color", "#fff")
    .attr("dy", 0);


  let node = g
    .append("g")
    .selectAll("circle")

  let nodeLabel = g
    .append("g")
    .selectAll("circle")
    .append("text")
    .style("font-size", styles.nodeLabel.fontSize)
    .attr("class", "nodeLabel")
    .attr("dy", 4)

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
      .style("text-anchor", styles.linkLabel.textAnchor)
      .style("fill", styles.linkLabel.fill)
      .style("font-size", styles.linkLabel.fontSize)
      .style("background-color", styles.linkLabel.backgroundColor)
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
  async function render(view) {
    updateData(view);
    simulation.stop();

    link = svg
      .select(".forLinks")
      .selectAll(".linkSVG")
      .data(rels)
      .join(
        enter => {
          const link_enter = enter
            .append("path")
            .style("stroke", styles.link.stroke)
            .style("fill", styles.link.fill)
            .attr("class", "linkSVG")
            .attr("marker-end", d => {
              return d.source == d.target
                ? "url(#self-arrow)"
                : "url(#end-arrow)";
            });
          return link_enter;
        },
        update => update

          .attr("marker-end", (d) => {
            return d.source == d.target ? "url(#self-arrow)" : "url(#end-arrow)";
          })
      )
      .join("path")
      .on("click", clicked)
      .on("contextmenu", rightClicked);

    node = g
      .selectAll("circle")
      .data(nodes, d => d['id'])
      .join(enter => {
        let entered =
          enter.append("circle")
            .attr("fill", (d) => styles.node.fill)
            .attr("class", "node")
            .attr("stroke", (d) => styles.node.borderColor)
            .attr("r", styles.node.radius)
            .call(drag(simulation))
            .on("click", clicked)
            .on("contextmenu", rightClicked);
        return entered;
      },
        update => {
          let updated = update
            .attr("fill", styles.node.fill)
          return updated
        }
      )

    nodeLabel = g
      .selectAll("text")
      .data(nodes, d => d['id'])
      .join(enter => {
        let entered =
          enter.append("text")
            .text((node) => node.title)
            .style("text-anchor", styles.nodeLabel.textAnchor)
            .style("fill", styles.nodeLabel.fill)
            .attr("dy", 4)
        return entered;
      },
        update => update
      )


    linkLabel = g
      .selectAll(".linkLabel")
      .data(rels, d => d['id'])
      .join((enter) => {
        const linkLabel = enter
          .append("text")
          .text((link) => link.title)
        return linkLabel;
      },
        update => {
          const linkLabel = update
            .append("text")
            .text((link) => link.title)
          return linkLabel;
        },

      ).attr("id", function (d) {
        return "linkLabel" + d.id;
      })
      .attr("class", "linkLabel")
      .style("color", "#fff")
      .attr("dy", 0);

    simulation
      .nodes(nodes)
      .force("link")
      .links(rels);
    simulation.alpha(1).restart();

  }
  await render(view)
  return svg.node();
};
export default Graph;
