import Mutations from "./Mutations.js";

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
      recordJson.defType = defType.defTypeTitle;
      delete recordJson.created;
      delete recordJson.updated;

      const recordsInView = JSON.parse(sessionStorage.getItem(view));

      let type = "nodes";
      if (defType.defTypeTitle.slice(-3) === "Rel") {
        type = "rels";
      }
      if (view === "filter") Mutations.ADD_NODE_TO_TREE(recordJson)

      recordsInView[0][type].push(recordJson);

      if (
        defType.defTypeTitle === "propKey" ||
        defType.defTypeTitle === "propVal" ||
        defType.defTypeTitle === "typeData" ||
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

  async UPDATE(view, defType, attrs) {
    let defTypeTitle = defType.defTypeTitle;

    try {
      const record = await fetch(`/api/${defTypeTitle}/update`, {
        method: "PUT",
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
      let type = "nodes";
      if (defType.defTypeTitle.slice(-3) === "Rel") {
        type = "rels";
      }

      const recordsInView = JSON.parse(sessionStorage.getItem(view))[0]
      const typesInView = recordsInView[type]
      // Find node/rel in session storage, get index to then replace content of object
      let nodeRel = typesInView.find((node) => node.id === attrs.id);
      let index = typesInView.indexOf(nodeRel);
      for (const prop in recordJson) {
        typesInView[index][prop] = recordJson[prop]
      }
      recordsInView[type] = typesInView
      console.log([recordsInView], 'toSessionStorage')
      sessionStorage.setItem(view, JSON.stringify([recordsInView]));
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

  async GET_API(email) {
    try {
        let getHeaders = {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("accessToken"),
        };
    
        const records = await fetch(`/api/user/apiKey`, {
          method: "POST",
          body:  JSON.stringify({email}),
          headers: getHeaders,
        });
    
        const sendRecords = (await records.json());
        const mutate = Mutations;
        mutate.SET_STATE("apiKey", sendRecords);
    
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
