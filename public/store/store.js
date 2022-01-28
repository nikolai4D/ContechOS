class Mutations {
  async GET_STATE(view, records) {
    let data = await JSON.parse(window.localStorage.getItem(`${view}`));
    //console.log(data)

    if (data == null) {
      data = [];
      data.push(records);
      //console.log("data", data);
      window.localStorage.setItem(`${view}`, JSON.stringify(data));
    }
  }
}

class Actions {
  // async CREATE(nodeType, type) {

  //     const record = await fetch(`/api/${nodeType}/create`, {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ type }),
  //     })

  //     const sendRecord = await record.json();
  //     const mutate = new Mutations();
  //     mutate.SET_STATE(nodeType, sendRecord);
  // }

  async GETALL(view) {
    const records = await fetch(`/api/${view}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const sendRecords = await records.json();
    const mutate = new Mutations();
    mutate.GET_STATE(view, sendRecords);
  }
}

export default new Actions();
