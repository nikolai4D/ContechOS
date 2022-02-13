const nodeDefs = {
    "general": [{
        "attributes":
        {
            "created": Date(),
            "updated": Date()
        }
    }],
    "relTypes": [
        {
            "relTypeId": 1,
            "title": "defInternalRel",
            "abbr": "cdir",
            "attributes": [
                { "title": "" },
                { "propKeys": [{ "nodeTypeId": 2, "attributes": "id" }] },
                { "source": { "nodeTypeId": 4, "attributes": "id" } } // target is set to source in the API 
            ]
        },
        {
            "relTypeId": 2,
            "title": "defExternalRel",
            "abbr": "cder",
            "attributes": [
                { "title": "" },
                { "propKeys": [{ "nodeTypeId": 2, "attributes": "id" }] },
                { "source": { "nodeTypeId": 4, "attributes": "id" } },
                { "target": { "nodeTypeId": 4, "attributes": "id" } } // target !== source (validated in the API)
            ]
        },
    ],
    "nodeTypes": [
        {
            "nodeTypeId": 1,
            "title": "propType",
            "abbr": "pt",
            "attributes": [
                {
                    "title": ""  // input
                }
            ]
        },
        {
            "nodeTypeId": 2,
            "title": "propKey",
            "abbr": "pk",
            "attributes": [
                { "title": "" },
                { "propTypeId": { "nodeTypeId": 1, "attributes": "id", "title": "propType" } } // dropdown
            ]
        },
        {
            "nodeTypeId": 3,
            "title": "propVal",
            "abbr": "pv",
            "attributes": [
                { "title": "" },
                { "propKey": { "nodeTypeId": 2, "attributes": "id", "title": "propKey" } } // dropdown
            ]
        },
        {
            "nodeTypeId": 4,
            "title": "configDef",
            "abbr": "cd",
            "attributes": [
                { "title": "" },
                { "propKeys": [{ "nodeTypeId": 2, "attributes": "id" }] }, // dropdown multiple
            ]
        },


        // {
        //     "nodeTypeId": 4,
        //     "title": "config",
        //     "abbr": "c",
        //     "attributes": [
        //         { "title": "" },
        //         { "propKeys": [{ "nodeTypeId": 2, "attributes": "id", "title": "propKey" }] }, // dropdown multiple
        //     ]
        // },
        // {
        //     "nodeTypeId": 5,
        //     "title": "configRel",
        //     "abbr": "cr",
        //     "attributes": [
        //         { "title": "" },
        //         { "propKeys": [{ "nodeTypeId": 2, "attributes": "id", "title": "propKey" }] },
        //         { "source": { "nodeTypeId": 4, "attributes": "id", "title": "config" } },
        //         { "target": { "nodeTypeId": 4, "attributes": "id", "title": "config" } },
        //         { "modelRel": Boolean }
        //     ]
        // },
        // {
        //     "nodeTypeId": 6,
        //     "title": "data",
        //     "abbr": "d",
        //     "attributes": [
        //         { "title": "" },
        //         {
        //             "props": [
        //                 {
        //                     key: { "nodeTypeId": 2, "attributes": "id", "title": "propKey" },
        //                     value: { "nodeTypeId": 3, "attributes": "id", "title": "propVal" }
        //                 }
        //             ]
        //         },
        //         { "config": { "nodeTypeId": 4, "attributes": "id", "title": "config" } }
        //     ]
        // },
        // {
        //     "nodeTypeId": 7,
        //     "title": "dataRel",
        //     "abbr": "dr",
        //     "attributes": [
        //         { "title": { "nodeTypeId": 5, "attributes": "title", "title": "configRel" } },
        //         { "source": { "nodeTypeId": 6, "attributes": "id", "title": "data" } },
        //         { "target": { "nodeTypeId": 6, "attributes": "id", "title": "data" } },
        //         {
        //             "props": [
        //                 {
        //                     key: { "nodeTypeId": 2, "attributes": "id", "title": "propKey" },
        //                     value: { "nodeTypeId": 3, "attributes": "id", "title": "propVal" }
        //                 }
        //             ]
        //         },
        //         { "configRel": { "nodeTypeId": 5, "attributes": "id", "title": "configRel" } },
        //     ]
        // }
    ],
    "groups": [
        {
            "groupId": 1,
            "title": "configs",
            "nodeTypes": [4],
            "relTypes": [1, 2]

        },
        // {
        //     "groupId": 2,
        //     "title": "datas",
        //     "nodeTypes": []
        // }, 
        {
            "groupId": 3,
            "title": "props",
            "nodeTypes": [1, 2]
        }, {
            "groupId": 4,
            "title": "propVals",
            "nodeTypes": [3]
        }
    ]
};

export default nodeDefs;