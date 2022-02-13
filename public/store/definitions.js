const nodeDefs = {
    "general": [{
        "attributes":
        {
            "created": Date(),
            "updated": Date()
        }
    }],
    "nodeTypes": [
        {
            "nodeTypeId": 1,
            "title": "propType",
            "abbr": "pt",
            "attributes": [{
                "title": ""
            }]
        },
        {
            "nodeTypeId": 2,
            "title": "propKey",
            "abbr": "pk",
            "attributes": [
                { "title": "" },
                { "propTypeId": { "nodeTypeId": 1, "attributes": "id", "title": "propType" } }
            ]
        },
        {
            "nodeTypeId": 3,
            "title": "propVal",
            "abbr": "pv",
            "attributes": [
                { "title": "" },
                { "propKey": { "nodeTypeId": 2, "attributes": "id", "title": "propKey" } }
            ]
        },
        {
            "nodeTypeId": 4,
            "title": "config",
            "abbr": "c",
            "attributes": [
                { "title": "" },
                { "propKeys": [{ "nodeTypeId": 2, "attributes": "id", "title": "propKey" }] },
            ]
        },
        {
            "nodeTypeId": 5,
            "title": "configRel",
            "abbr": "cr",
            "attributes": [
                { "title": "" },
                { "propKeys": [{ "nodeTypeId": 2, "attributes": "id", "title": "propKey" }] },
                { "source": { "nodeTypeId": 4, "attributes": "id", "title": "config" } },
                { "target": { "nodeTypeId": 4, "attributes": "id", "title": "config" } },
                { "modelRel": Boolean }
            ]
        },
        {
            "nodeTypeId": 6,
            "title": "data",
            "abbr": "d",
            "attributes": [
                { "title": "" },
                {
                    "props": [
                        {
                            key: { "nodeTypeId": 2, "attributes": "id", "title": "propKey" },
                            value: { "nodeTypeId": 3, "attributes": "id", "title": "propVal" }
                        }
                    ]
                },
                { "config": { "nodeTypeId": 4, "attributes": "id", "title": "config" } }
            ]
        },
        {
            "nodeTypeId": 7,
            "title": "dataRel",
            "abbr": "dr",
            "attributes": [
                { "title": { "nodeTypeId": 5, "attributes": "title", "title": "configRel" } },
                { "source": { "nodeTypeId": 6, "attributes": "id", "title": "data" } },
                { "target": { "nodeTypeId": 6, "attributes": "id", "title": "data" } },
                {
                    "props": [
                        {
                            key: { "nodeTypeId": 2, "attributes": "id", "title": "propKey" },
                            value: { "nodeTypeId": 3, "attributes": "id", "title": "propVal" }
                        }
                    ]
                },
                { "configRel": { "nodeTypeId": 5, "attributes": "id", "title": "configRel" } },
            ]
        }
    ],
    "nodeGroups": [
        {
            "nodeGroupId": 1,
            "title": "configs",
            "nodeTypes": [4, 5]
        },
        {
            "nodeGroupId": 2,
            "title": "datas",
            "nodeTypes": [6, 7]
        }, {
            "nodeGroupId": 3,
            "title": "props",
            "nodeTypes": [1, 2]
        }, {
            "nodeGroupId": 4,
            "title": "propVals",
            "nodeTypes": [3]
        }
    ]
};

export default nodeDefs;