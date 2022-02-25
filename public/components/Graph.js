import * as d3 from "https://cdn.skypack.dev/d3@6";
import ContextMenu from "./ContextMenu.js";
import { FormCreate } from "./FormCreate.js";
import styles from "./graphComponents/styles.js";
import endArrow from "./graphComponents/endArrow.js";
import startArrow from "./graphComponents/startArrow.js";
import selfArrow from "./graphComponents/selfArrow.js";
import dropDown from "./DropDownField.js";

import formCreateFunction from "./graphFunctions/formCreateFunction.js";
import Actions from "../store/Actions.js";

async function Graph(view) {
  Actions.GETDEF();

  let nodes,
    rels = [];
  let graphJsonData = await JSON.parse(sessionStorage.getItem(view));

  nodes = graphJsonData[0].nodes;
  rels = graphJsonData[0].rels;

  const updateData = async (view) => {
    // Preserve position of nodes/rels
    if (nodes !== undefined) {
      const old = new Map(nodes.map((d) => [d.id, d]));
      graphJsonData = await JSON.parse(sessionStorage.getItem(view));
      nodes = graphJsonData[0].nodes.map((d) =>
        Object.assign(old.get(d.id) || {}, d)
      );
      rels = graphJsonData[0].rels.map((d) => Object.assign({}, d));
    }
  };

  console.log(nodes)

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

    })
    .on("contextmenu", (d) => {
      let clickedObj = d;

      if (d.target.tagName === "svg") {
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

        d3.selectAll(".context_menu_item").on("click", async (d) => {
          d3.select(".contextMenuContainer").remove();
          d3.select(".FormMenuContainer").remove();

          d3.select("#root")
            .append("div")
            .attr("class", "FormMenuContainer")
            .html(await FormCreate(clickEvent, d, clickedObj))
            .select(".formCreate")
            .style("top", y_cord + "px")
            .style("left", x_cord + "px");


          // stop watching
          // d3.selectAll("#field_target").on()
          let propKeys = []

          d3.selectAll(".formCreateSubmit").on("click", async (e) => {
            await formCreateFunction(view, d, "rel", clickedObj, propKeys);

            await updateData(view);
            await render(view);
          });

          d3.selectAll(".field_parentId_typeData").on("change", async (e) => {
            const parentId = document.getElementById("field_parentId_typeData").value;
            console.log(parentId)

            let dropDownHtmlString = ''
            let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;
            let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;

            let parentConfigObject = configNodes.find(node => { return node.id === parentId })

            // console.log(parentConfigObject)

            parentConfigObject.typeDataPropKeys.forEach(propKey => {
              let filtered = getPropsForParentId.filter(node => node.parentId === propKey)
              console.log(filtered)

              let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
              console.log(propKeyObj)
              if (filtered.length > 0) {
                propKeys.push({ "title": propKeyObj.title, "id": propKey })
                dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
              }
            })

            document.getElementById('field_filteredProps_typeData').innerHTML = ""
            document.getElementById('field_filteredProps_typeData').innerHTML = dropDownHtmlString

          });

        });
      }
    });

  const firstG = svg.append("g").attr("transform", `translate(20,20)`);
  const g = firstG.append("g").attr("class", "secondG");

  endArrow(g);

  startArrow(g);

  selfArrow(g);

  const clicked = (event, d) => {
    console.log(d);
    if (document.getElementById("field_target")) { document.getElementById("field_target").value = d.id }
  };

  const rightClicked = (event, d) => {
    event.preventDefault();
    let clickedObj = d;

    if (event.target.tagName === "circle") {
      console.log(event.target.tagName);

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
      let y_cord = event.clientY

      console.log(d)
      document.getElementById("delete-item").classList.add("list-group-item", "list-group-item-action", "text-danger")
      document.getElementById("delete-item").innerHTML = `- Delete`


      d3.selectAll("#delete-item").on("click", async (d) => {
        console.log(`Delete ${clickedObj.defTypeTitle}!`)
      })

      d3.selectAll(".context_menu_item").on("click", async (d) => {
        d3.select(".contextMenuContainer").remove();
        d3.select(".FormMenuContainer").remove();

        d3.select("#root")
          .append("div")
          .attr("class", "FormMenuContainer")
          .html(await FormCreate(clickEvent, d, clickedObj))
          .select(".formCreate")
          .style("top", y_cord + "px")
          .style("left", x_cord + "px");

        let propKeys = [];
        d3.selectAll(".formCreateSubmit").on("click", async (e) => {
          await formCreateFunction(view, d, "rel", clickedObj, propKeys);
          await updateData(view);
          await render(view);
        });

        d3.selectAll(".field_configDefInternalRel").on("change", async (e) => {
          const propsParentId = document.getElementById("field_configDefInternalRel").value;
          let dropDownHtmlString = ''
          let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
          let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


          let parentConfigDefInternalRels = configRels.find(rel => { return rel.id === propsParentId })


          parentConfigDefInternalRels.propKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            // console.log(propKeyObj)
            if (filtered.length > 0) {
              propKeys.push({ "title": propKeyObj.title, "id": propKey })
              dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
            }
          })

          document.getElementById('field_filteredProps').innerHTML = ""
          document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
        });

        d3.selectAll(".field_configObjInternalRel").on("change", async (e) => {
          const propsParentId = document.getElementById("field_configObjInternalRel").value;
          console.log(propsParentId)
          let dropDownHtmlString = ''
          let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
          let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


          let parentConfigDefInternalRels = configRels.find(rel => { return rel.id === propsParentId })

          console.log(parentConfigDefInternalRels)
          parentConfigDefInternalRels.typeDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            console.log(propKeyObj)
            if (filtered.length > 0) {
              propKeys.push({ "title": propKeyObj.title, "id": propKey })
              dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
            }
          })

          document.getElementById('field_filteredProps').innerHTML = ""
          document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
        });

        d3.selectAll(".field_typeDataInternalRel").on("change", async (e) => {
          const propsParentId = document.getElementById("field_typeDataInternalRel").value;
          console.log(propsParentId)
          let dropDownHtmlString = ''
          let datasRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;
          let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

          let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


          let parentDatasRels = datasRels.find(rel => { return rel.id === propsParentId }).parentId

          let getParentsParent = configRels.find(node => node.id === parentDatasRels)

          console.log(getParentsParent)

          getParentsParent.instanceDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            console.log(propKeyObj)
            if (filtered.length > 0) {
              propKeys.push({ "title": propKeyObj.title, "id": propKey })
              dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
            }
          })


          // parentConfigDefInternalRels.instanceDataRelPropKeys.forEach(propKey => {
          //   let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

          //   let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
          //   console.log(propKeyObj)
          //   if (filtered.length > 0) {
          //     propKeys.push({ "title": propKeyObj.title, "id": propKey })
          //     dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
          //   }
          // })

          document.getElementById('field_filteredProps').innerHTML = ""
          document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
        });

        d3.selectAll(".field_typeDataExternalRel").on("change", async (e) => {
          const propsParentId = document.getElementById("field_typeDataExternalRel").value;
          console.log(propsParentId)
          let dropDownHtmlString = ''
          let datasRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;
          let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

          let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


          let parentDatasRels = datasRels.find(rel => { return rel.id === propsParentId }).parentId

          let getParentsParent = configRels.find(node => node.id === parentDatasRels)

          console.log(getParentsParent)

          getParentsParent.instanceDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            console.log(propKeyObj)
            if (filtered.length > 0) {
              propKeys.push({ "title": propKeyObj.title, "id": propKey })
              dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
            }
          })

          document.getElementById('field_filteredProps').innerHTML = ""
          document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
        });



        d3.selectAll(".field_configObjExternalRel").on("change", async (e) => {
          const propsParentId = document.getElementById("field_configObjExternalRel").value;
          console.log(propsParentId)
          let dropDownHtmlString = ''
          let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
          let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


          let parentConfigObjExternalRels = configRels.find(rel => { return rel.id === propsParentId })

          console.log(parentConfigObjExternalRels)
          parentConfigObjExternalRels.typeDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            console.log(propKeyObj)
            if (filtered.length > 0) {
              propKeys.push({ "title": propKeyObj.title, "id": propKey })
              dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
            }
          })

          document.getElementById('field_filteredProps').innerHTML = ""
          document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
        });


        d3.selectAll(".field_configDefExternalRel").on("change", async (e) => {
          const propsParentId = document.getElementById("field_configDefExternalRel").value;
          let dropDownHtmlString = ''
          let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
          let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


          let parentConfigDefExternalRels = configRels.find(rel => { return rel.id === propsParentId })


          parentConfigDefExternalRels.propKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            // console.log(propKeyObj)
            if (filtered.length > 0) {
              propKeys.push({ "title": propKeyObj.title, "id": propKey })
              dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
            }
          })

          document.getElementById('field_filteredProps').innerHTML = ""
          document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
        });
      });
    }
  };

  let link = g.append("g").attr("class", "forLinks").select(".forLinks");
  // .selectAll("path")

  let linkLabel = g
    .selectAll(".linkLabel")
    .attr("class", "linkLabel")
    .style("color", "#fff")

    .attr("dy", 0);

  let node = g.append("g").selectAll("circle");

  let nodeLabel = g
    .append("g")
    .selectAll("circle")
    .append("text")
    .style("font-size", styles.nodeLabel.fontSize)
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
      .style("text-anchor", styles.linkLabel.textAnchor)
      .style("fill", styles.linkLabel.fill)
      .style("font-size", styles.linkLabel.fontSize)

      .style("background-color", styles.linkLabel.backgroundColor)
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2)

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
        (enter) => {
          const link_enter = enter
            .append("path")
            .style("stroke", styles.link.stroke)
            .style("fill", "none")

            .attr("class", "linkSVG")
            .attr("marker-end", (d) => {
              return d.source == d.target
                ? "url(#self-arrow)"
                : "url(#end-arrow)";
            });
          return link_enter;
        },
        (update) =>
          update.attr("marker-end", (d) => {
            return d.source == d.target
              ? "url(#self-arrow)"
              : "url(#end-arrow)";
          })
      )
      .join("path")
      .on("click", clicked)
      .on("contextmenu", rightClicked);

    function setColour(d) {
      if (d.defTypeTitle === 'propType') {
        return '#89A7B0'
      }
      else if (d.defTypeTitle === 'propKey') {
        return '#E9BD60'
      }
      else if (d.defTypeTitle === 'propVal') {
        return '#C3B65B'
      }
      else if (d.defTypeTitle === 'configDef') {
        return '#70AA6C'
      }
      else if (d.defTypeTitle === 'configObj') {
        return '#32BCC3'
      }
      else if (d.defTypeTitle === 'typeData') {
        return '#E44167'
      }
      else if (d.defTypeTitle === 'instanceData') {
        return '#A79587'

      }
    }

    node = g
      .selectAll("circle")
      .data(nodes, (d) => d["id"])
      .join(
        (enter) => {
          let entered = enter
            .append("circle")
            .attr("fill", (d) => setColour(d))
            .attr("class", "node")
            .attr("stroke", (d) => styles.node.borderColor)
            .attr("r", styles.node.radius)
            .call(drag(simulation))
            .on("click", clicked)
            .on("contextmenu", rightClicked);
          return entered;
        },
        (update) => {
          return update;
        }
      );

    nodeLabel = g
      .selectAll("text")
      .data(nodes, (d) => d["id"])
      .join(
        (enter) => {
          let entered = enter
            .append("text")
            .text((node) => node.title)
            .style("text-anchor", styles.nodeLabel.textAnchor)
            .style("fill", styles.nodeLabel.fill)
            .attr("dy", 4);
          return entered;
        },
        (update) => update
      );

    linkLabel = g
      .selectAll(".linkLabel")
      .data(rels, (d) => d["id"])
      .join(
        (enter) => {
          const linkLabel = enter.append("text").text((link) => link.title)
          return linkLabel;
        },
        (update) => {
          const linkLabel = update.append("text").text((link) => link.title);
          return linkLabel;
        }
      )
      .attr("id", function (d) {
        return "linkLabel" + d.id;
      })
      .attr("class", "linkLabel")
      .style("color", "#fff")
      .attr("dy", 0)

    simulation.nodes(nodes).force("link").links(rels);
    simulation.alpha(1).restart();
  }
  await render(view);
  return svg.node();
}
export default Graph;
