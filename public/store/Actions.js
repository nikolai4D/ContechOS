import Mutations from "./Mutations.js";
// import { stack } from "d3";

class Actions {
  constructor() { }

  async CREATE(view, nodeType, attrs) {
    try {
      const record = await fetch(`/api/${nodeType}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify(await attrs),
      });
      const recordJson = await record.json();

      const recordsInView = JSON.parse(sessionStorage.getItem(view));


      let type = "nodes";
      console.log(nodeType)
      if (nodeType.slice(-3) === "Rel") {
        type = "rels"
      }

      recordsInView[0][type].push(recordJson);
      console.log(recordJson, recordsInView);

      if (view === "props" && nodeType === "propKey") {
        let source = recordJson.id;
        let target = await attrs.propTypeId;
        let newRel = {
          id: `${source}_${target}`,
          source,
          target,
          title: "has propType",
        };
        recordsInView[0].rels.push(newRel);
      }
      sessionStorage.setItem(view, JSON.stringify(recordsInView));
    } catch (err) {
      console.log(err);
    }
  }

  async GETALL(view) {
    try {
      let getHeaders = {
        "Content-Type": "application/json",
        authorization: sessionStorage.getItem("accessToken"),
      };
      const records = await fetch(`/api/${view}`, {
        method: "GET",
        headers: getHeaders,
      });

      const sendRecords = await records.json();
      const mutate = Mutations;
      mutate.SET_STATE(view, sendRecords);
    } catch (err) {
      console.log(err);
    }
  }

  async GETDEF() {
    let view = "definitions";

    try {
      let getHeaders = {
        "Content-Type": "application/json",
        authorization: sessionStorage.getItem("accessToken"),
      };
      const getNodeDefs = await fetch(`/api/definitions`, {
        method: "GET",
        headers: getHeaders,
      });

      const sendNodeDefs = await getNodeDefs.json();
      const mutate = Mutations;
      mutate.SET_STATE(view, sendNodeDefs);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Actions();
