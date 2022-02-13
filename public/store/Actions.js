import Mutations from "./Mutations.js";

class Actions {
    constructor() {
    }

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
        const mutate = Mutations;
        mutate.SET_STATE(view, sendRecords);
    }

}

export default new Actions();