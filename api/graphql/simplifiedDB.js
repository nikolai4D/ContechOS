const simplifiedDB = {
    nodes : [
        {
            id: "n_1",
            title:"node1",
        },
        {
            id: "n_2",
            title:"node2",
        },
        {
            id: "n_3",
            title:"node3",
        },
        {
            id: "n_4",
            title:"node4",
        },
        {
            id: "n_5",
            title:"node5",
        }
    ],
    relations: [
        {
            id: "r_1",
            title: "n1_to_n3",
            source: "n_1",
            target: "n_3"
        },
        {
            id: "r_2",
            title: "n2_to_n3",
            source: "n_2",
            target: "n_3"
        },
        {
            id: "r_3",
            title: "n3_to_n4",
            source: "n_3",
            target: "n_4"
        },
        {
            id: "r_4",
            title: "n4_to_n1",
            source: "n_4",
            target: "n_1"
        },
        {
            id: "r_5",
            title: "n5_to_n3",
            source: "n_5",
            target: "n_3"
        },

    ],
}

module.exports = simplifiedDB