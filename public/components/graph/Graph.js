import * as d3 from "https://cdn.skypack.dev/d3@6";
import styles from "./graphComponents/Styles.js";
import endArrow from "./graphComponents/ActivateEndArrow.js";
import startArrow from "./graphComponents/ActivateStartArrow.js";
import endArrowParent from "./graphComponents/ActivateEndArrowParent.js";
import startArrowParent from "./graphComponents/ActivateStartArrowParent.js";
import selfArrow from "./graphComponents/ActivateSelfArrow.js";
import { State } from "../../store/State.js";
import formCreateFunction from "./graphFunctions/formCreateFunction.js";
import formSaveEditFunction from "./graphFunctions/formSaveEditFunction.js";

import Actions from "../../store/Actions.js";
import ActivateContextMenu from "./graphComponents/ActivateContextMenu.js";
import ActivateFormMenu from "./graphComponents/ActivateFormMenu.js";
import ActivateFormRead from "./graphComponents/ActivateFormRead.js";
import ActivateFormEdit from "./graphComponents/ActivateFormEdit.js";

import generatePropKeysFromParentIdTypeData from "./graphFunctions/generatePropKeysFromParentIdTypeData.js";
import contextMenuItemClick from "./graphFunctions/contextMenuItemClick.js";
import { ReactiveFormCreate } from "./graphComponents/ReactiveFormCreate.js";
import { FilterBox} from "../filter/FilterBox.js"
import { triggerTreeGetHtml } from "../filter/FilterBox.js"

async function Graph(view) {
  State.view = view;
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
    .force("charge", d3.forceManyBody().strength(-2000))
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
      if (d.target.tagName === "svg") {
        State.clickedObj = d;
        ActivateContextMenu(d3);
        State.clickedObjEvent = event

        d3.selectAll(".context_menu_item").on("click", (d) => {
          State.contextMenuItem = d;
          ActivateFormMenu(d3);

          State.propKeys = [];

          d3.selectAll(".form-close-button").on("click", (e) => {
            d3.selectAll(".FormMenuContainer").remove();
          });
          d3.selectAll(".formCreateSubmit").on("click", async (e) => {
            await formCreateFunction(
              view,
              d,
              "rel",
              State.clickedObj,
              State.propKeys
            );
            await updateData(view);
            await render(view);
          });

          d3.selectAll(".field_parentId_typeData").on("change", async (e) => {
            generatePropKeysFromParentIdTypeData("typeData", "nodes");
          });
        });
      }
    });

  const firstG = svg.append("g").attr("transform", `translate(20,20)`);
  const g = firstG.append("g").attr("class", "secondG");

  endArrow(g);
  startArrow(g);
  endArrowParent(g);
  startArrowParent(g);
  selfArrow(g);

  const clicked = (event, d) => {
    if (document.getElementById("field_target")) {
      document.getElementById("field_target").classList.remove("is-invalid");
      document
        .getElementsByClassName("formCreateSubmit")[0]
        .classList.remove("disabled");

      if (
        State.clickedObj.id === d.id &&
        (d.id === "typeData" || d.id === "instanceData")
      ) {
        document.getElementById("field_target").value = "Cannot be self!";
        document.getElementById("field_target").classList.add("is-invalid");
        document.getElementById("field_props").innerHTML = "";
        document
          .getElementsByClassName("formCreateSubmit")[0]
          .classList.add("disabled");
      } else if (State.clickedObj.defTypeTitle === d.defTypeTitle) {
        document.getElementById("field_target").value = d.title;
        document
          .getElementById("field_target")
          .setAttribute("data-parentId", d.parentId);
        document.getElementById("field_target").setAttribute("data-id", d.id);

        // decide on which relationship to use
        State["targetObject"] = d;
        if (State.clickedObj.defTypeTitle === "configDef") {
          if (State.clickedObj.id === State.targetObject.id) {
            State["validDefTypeRels"] = ["configDefInternalRel"];
          } else {
            State["validDefTypeRels"] = ["configDefExternalRel"];
          }
        }
        if (State.clickedObj.defTypeTitle === "configObj") {
          if (State.clickedObj.parentId === State.targetObject.parentId) {
            State["validDefTypeRels"] = ["configObjInternalRel"];
          } else {
            State["validDefTypeRels"] = ["configObjExternalRel"];
          }
        }
        if (State.clickedObj.defTypeTitle === "typeData") {
          // check parents, what their relationship are. If there aren't any, reject the try.
          let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0]
            .rels;
          let rel = configRels.filter(
            (rel) =>
              rel.source === State.clickedObj.parentId &&
              rel.target === State.targetObject.parentId
          );
          if (rel.length > 0) {
            rel = rel[0].defTypeTitle;
          }
          if (rel === "configObjInternalRel") {
            State["validDefTypeRels"] = ["typeDataInternalRel"];
          } else if (rel === "configObjExternalRel") {
            State["validDefTypeRels"] = ["typeDataExternalRel"];
          } else {
            State.validDefTypeRels = [];
          }
        }

        if (State.clickedObj.defTypeTitle === "instanceData") {
          // check parents, what their relationship are. If there aren't any, reject the try.
          let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;
          let rel = configRels.filter(
            (rel) =>
              rel.source === State.clickedObj.parentId &&
              rel.target === State.targetObject.parentId
          );
          if (rel.length > 0) {
            rel = rel[0].defTypeTitle;
          }
          if (rel === "typeDataInternalRel") {
            State["validDefTypeRels"] = ["instanceDataInternalRel"];
          } else if (rel === "typeDataExternalRel") {
            State["validDefTypeRels"] = ["instanceDataExternalRel"];
          } else {
            State.validDefTypeRels = [];
          }
        }
        ReactiveFormCreate();
        State.propKeys = [];
        contextMenuItemClick(d3);
      }
    } else {
      State.validDefTypeRels = [];
      d.clientX = event.clientX;
      d.clientY = event.clientY;
      State.clickedObj = d;
      State.clickedObj.defId = 1;

      State.propKeys = [];

      ActivateFormRead(d3);

      d3.select("#penFormEdit").on("click", e => {
        ActivateFormEdit(d3);

        d3.selectAll(".form-save-edit-button").on("click", async (e) => {
          await formSaveEditFunction(
            view,
            null,
            "rel",
            State.clickedObj,
            State.propKeys
          );
          await updateData(view);
          await render(view);
          d3.select(".FormMenuContainer").remove();

        });

        d3.selectAll(".form-close-button").on("click", (e) => {
          d3.selectAll(".FormMenuContainer").remove();
        });
      })

      d3.selectAll(".form-close-button").on("click", (e) => {
        d3.selectAll(".FormMenuContainer").remove();
      });



    }
  };

  const rightClicked = (event, d) => {
    event.preventDefault();
    d.clientX = event.clientX;
    d.clientY = event.clientY;
    State.clickedObj = d;

    if (
      event.target.tagName === "circle" ||
      event.target.className.baseVal === "nodeLabel" ||
      event.target.className.baseVal === "linkLabel" ||
      event.target.className.baseVal === "linkSVG"
    ) {
      ActivateContextMenu(d3);
      State.clickedObjEvent = event;

      document
        .getElementById("delete-item")
        .classList.add(
          "list-group-item",
          "list-group-item-action",
          "text-danger"
        );
      document.getElementById(
        "delete-item"
      ).innerHTML = `- Delete (${State.clickedObj.title})`;

      d3.selectAll("#delete-item").on("click", async (e) => {
        await Actions.DELETE(
          State.view,
          State.clickedObj.defTypeTitle,
          State.clickedObj.id
        );
        await updateData(State.view);
        await render(State.view);
        d3.select(".contextMenuContainer").remove();
      });

      d3.selectAll(".context_menu_item").on("click", async (d) => {
        State.contextMenuItem = d;
        ActivateFormMenu(d3);

        State.propKeys = [];
        // contextMenuItemClick(d3)
        d3.selectAll(".form-close-button").on("click", (e) => {
          d3.selectAll(".FormMenuContainer").remove();
        });
        d3.selectAll(".formCreateSubmit").on("click", async (e) => {
          await formCreateFunction(
            view,
            State.contextMenuItem,
            "rel",
            State.clickedObj,
            State.propKeys
          );
          await updateData(view);
          await render(view);
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
      .style("stroke", (d) => {
        if (d.title === "has parent") {
          return styles.link.parent.stroke;
        } else {
          return styles.link.stroke;
        }
      })
      .style("stroke-dasharray", (d) => {
        if (d.title === "has parent") {
          return styles.link.parent.strokeDash;
        } else {
          return 0;
        }
      })
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
      .style("fill", (d) => {
        if (d.title === "has parent") {
          return styles.linkLabel.parent.fill;
        } else {
          return styles.linkLabel.fill;
        }
      })
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

    nodeLabel
      .attr("x", (data) => data.x)
      .attr("y", (data) => data.y)
      .style("font-size", styles.nodeLabel.fontSize);
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
            .on("contextmenu", rightClicked)

            .attr("class", "linkSVG")
            .attr("marker-end", (d) => {
              if (d.title === "has parent") {
                return d.source == d.target
                  ? "url(#self-arrow-parent)"
                  : "url(#end-arrow-parent)";
              } else {
                return d.source == d.target
                  ? "url(#self-arrow)"
                  : "url(#end-arrow)";
              }
            });
          return link_enter;
        },
        (update) => update

      )
      .join("path")
      .on("click", clicked)
      .on("contextmenu", rightClicked);

    function setColour(d) {
      if (d.defType === "propType") {
        return "#89A7B0";
      } else if (d.defType === "propKey") {
        return "#E9BD60";
      } else if (d.defType === "propVal") {
        return "#C3B65B";
      } else if (d.defType === "configDef") {
        return "#70AA6C";
      } else if (d.defType === "configObj") {
        return "#32BCC3";
      } else if (d.defType === "typeData") {
        return "#E44167";
      } else if (d.defType === "instanceData") {
        return "#A79587";
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
            .attr("cursor", styles.node.cursor)

            .call(drag(simulation))

            .on("click", clicked)
            .on("contextmenu", rightClicked)

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
            .attr("class", "nodeLabel")

            .text((d) => {
              if (d.title.length > 25) {
                return d.title.slice(0, 25) + "...";
              }
              return d.title;
            })
            .style("text-anchor", styles.nodeLabel.textAnchor)
            .style("cursor", "default")

            .style("fill", styles.nodeLabel.fill)
            .on("click", (d) => {
              event.preventDefault();
            })
            .on("contextmenu", rightClicked)
            .attr("dy", 4);
          return entered;
        },
        (update) => {
          const updated = update
            .text(node => node.title)
          return updated;
        }
      );

    linkLabel = g
      .selectAll(".linkLabel")
      .data(rels, (d) => d["id"])
      .join(
        (enter) => {
          const linkLabel = enter
            .append("text")
            .text((link) => link.title)
            // .on("click", clicked)
            .style("fill", (d) => {
              if (d.title === "has parent") {
                return "red";
              } else {
                return "#fff";
              }
            })

            .on("click", clicked)

            .on("contextmenu", rightClicked);
          return linkLabel;
        },
        (update) => {
          return update;
        }
      )
      .attr("id", function (d) {
        return "linkLabel" + d.id;
      })
      .attr("class", "linkLabel")
      .attr("dy", 0);

    simulation.nodes(nodes).force("link").links(rels);
    simulation.alpha(1).restart();
  }

  await render(view);

  let divContainer = 
  d3.select(await FilterBox())

  let divContainerCheck = divContainer.selectAll(".form-check-input").on("click", async function(e) {
    d3.select(".accordion-body").append(d3.select(await triggerTreeGetHtml()).node())

    // render("filter");
    // d3.select(".filter-container").remove();
    // d3.select(await FilterBox())
    // console.log(e)

  })


  // console.log(divContainerCheck)
  // let divContainer =   d3.select(await FilterBox()).attr("id", "TEST").selectAll(".form-check-input").on("change", (d) => console.log(d, "click!"))

  // console.log(  d3.select(await FilterBox()).selectAll(".form-check-input").on("click", (d) => console.log(d, "click!")),  "filter")

  // console.log(d3.select("#accordionPanelsStayOpenExample"))
  // let divContainer = d3.select(await FilterBox()).on("click", () => console.log("click!"))


  // let divContainer = d3.select("#app")
  // .append("div")
  // .attr("class","filterContainer")
  // .select(".filterbutton")
  // .on("click", () => console.log("hello"))

  
  // .append("button")
  // .attr("id", "testbutton")
  
 
  return [svg.node(), divContainer.node()]

  // return svg.node();
}
export default Graph;
