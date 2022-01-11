
class Mutations {
    SET_STATE(nodeType, record) {
        let data = JSON.parse(window.localStorage.getItem(`${nodeType}s`))
        console.log(data)


        if (data == null) {
            data = []
        }
        data.push(record)
        console.log("data", data)
        window.localStorage.setItem(`${nodeType}s`, JSON.stringify(data))
    }

}


class Actions {
    async CREATE(nodeType, type) {

        const record = await fetch(`/api/${nodeType}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type }),
        })

        const sendRecord = await record.json();
        const mutate = new Mutations();
        mutate.SET_STATE(nodeType, sendRecord);
    }

    GETALL() {

    }



}


export default new Actions();