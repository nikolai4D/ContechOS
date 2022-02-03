class Mutations {
  async GET_STATE(view, records) {
    let data = await JSON.parse(sessionStorage.getItem(`${view}`));
    //console.log(data)

    if (data == null) {
      data = [];
      data.push(records);
      //console.log("data", data);
      sessionStorage.setItem(`${view}`, JSON.stringify(data));
    }
  }
  async SET_STATE(view, records) {
    sessionStorage.setItem(`${view}`, JSON.stringify(records));

  }
  async ADD_NODE_TO_STATE(view, records) {
    console.log(view)
    let data = await JSON.parse(sessionStorage.getItem(`${view}`))


    if (await data == null) {
      data = []
    }
    console.log(data)
    data[0]["nodes"].push(records);
    sessionStorage.setItem(`${view}`, JSON.stringify(data));
    // return await JSON.parse(sessionStorage.getItem(`${view}`))

  }
}

class Actions {
  async CREATE(view, nodeType, type) {

    await fetch(`/api/${nodeType}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify(type),
    })



    if (view == "props") {

      let getHeaders = {
        "Content-Type": "application/json",
        authorization: sessionStorage.getItem("accessToken"),
      };
      const records = await fetch(`/api/${view}`, {
        method: "GET",
        headers: getHeaders,
      });
      const sendRecords = await records.json();

      console.log(sendRecords)

      sessionStorage.setItem(`${view}`, JSON.stringify([sendRecords]));


    }

    // return mutate.ADD_NODE_TO_STATE(view, sendRecord);
  }

  async GETALL(view) {
    let getHeaders = {
      "Content-Type": "application/json",
      authorization: sessionStorage.getItem("accessToken"),
    };
    const records = await fetch(`/api/${view}`, {
      method: "GET",
      headers: getHeaders,
    });

    const sendRecords = await records.json();
    const mutate = new Mutations();
    mutate.GET_STATE(view, sendRecords);
  }
}

export default new Actions();
