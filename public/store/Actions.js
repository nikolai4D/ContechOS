import Mutations from "./Mutations.js";

class Actions {
    constructor() {
    }

    async CREATE(view, nodeType, attrs) {

        try {
            const record = await fetch(`/api/${nodeType}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: sessionStorage.getItem("accessToken"),
                },
                body: JSON.stringify(attrs),
            })
            const recordJson = await record.json();

            const recordsInView = JSON.parse(sessionStorage.getItem(view));

            recordsInView[0].nodes.push(recordJson)

            if (view === 'props' && nodeType === 'propKey') {
                let source = recordJson.id;
                let target = attrs.propTypeId;
                let newRel = { "id": `${source}_${target}`, source, target, "title": "has propType" }
                recordsInView[0].rels.push(newRel)

            }
            sessionStorage.setItem(view, JSON.stringify(recordsInView));

        }
        catch (err) {
            console.log(err)

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
        }
        catch (err) {
            console.log(err)

        }
    }
}

export default new Actions();