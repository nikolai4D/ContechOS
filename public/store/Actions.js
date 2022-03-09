import Mutations from "./Mutations.js";
// import { stack } from "d3";

class Actions {
  constructor() { }

  async CREATE(view, defType, attrs) {
    let defTypeTitle = defType.defTypeTitle;

    try {
      const record = await fetch(`/api/${defTypeTitle}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("accessToken"),
        },
        body: JSON.stringify(await attrs),
      });
      const recordJson = await record.json();
      recordJson.defTypeTitle = defType.defTypeTitle;
      delete recordJson.created;
      delete recordJson.updated;

      const recordsInView = JSON.parse(sessionStorage.getItem(view));

      let type = "nodes";
      if (defType.defTypeTitle.slice(-3) === "Rel") {
        type = "rels";
      }

      recordsInView[0][type].push(recordJson);

      //   if (view === "props" && (defType.defTypeTitle === "propKey" || defType.defTypeTitle === "propVal")) {
      console.log(defType.defTypeTitle);
      if (
        defType.defTypeTitle === "propKey" ||
        defType.defTypeTitle === "propVal" ||
        defType.defTypeTitle === "configObj" ||
        defType.defTypeTitle === "instanceData"
      ) {
        let source = recordJson.id;
        let target = await attrs.parentId;
        let newRel = {
          id: `${source}_${target}`,
          source,
          target,
          title: "has parent",
        };
        recordsInView[0].rels.push(newRel);
      }

      sessionStorage.setItem(view, JSON.stringify(recordsInView));
    } catch (err) {
      console.log(err);
    }
  }

  async DELETE(view, defType, id) {
    try {
      let response = await fetch(`/api/${defType}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("accessToken"),
        },
      });

      if (response.status === 200) {
        const recordsInView = JSON.parse(sessionStorage.getItem(view));

        let type = "nodes";
        if (defType.slice(-3) === "Rel") {
          type = "rels";
        } else {
          let newRecords = recordsInView[0].rels.filter(
            (obj) => obj.source !== id
          );
          recordsInView[0].rels = newRecords;
        }

        let newRecords = recordsInView[0][type].filter((obj) => obj.id !== id);
        recordsInView[0][type] = newRecords;
        sessionStorage.setItem(view, JSON.stringify(recordsInView));

        if (
          view === "props" &&
          (defType === "propKey" || defType === "propVal")
        ) {
          let newRecords = recordsInView[0].rels.filter(
            (obj) => obj.source !== id
          );
          recordsInView[0].rels = newRecords;

          recordsInView[0].rels.push(newRel);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async GETALL(view) {
    try {
      console.log(view)
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
