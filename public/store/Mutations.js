class Mutations {
    async SET_STATE(view, records) {
        let data = await JSON.parse(sessionStorage.getItem(`${view}`));
        if (data == null) {
            if (!Array.isArray(records)) {
                data = []
                data.push(records)
            }
            else {
                data = records;
            }
            sessionStorage.setItem(`${view}`, JSON.stringify(data));
        }
    }

    async ADD_NODE_TO_STATE(view, records) {
        let data = await JSON.parse(sessionStorage.getItem(`${view}`))


        if (await data == null) {
            data = []
        }
        data[0]["nodes"].push(records);
        sessionStorage.setItem(`${view}`, JSON.stringify(data));

    }
}

export default new Mutations();

