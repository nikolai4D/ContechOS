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
            "attributes": {
                "title": ""
            }
        },
        {
            "nodeTypeId": 2,
            "title": "propKey",
            "abbr": "pk",
            "attributes": {
                "title": "",
                "propTypeId": { "nodeTypeId": 1, "attributes": "id" }
            }
        },
        {
            "nodeTypeId": 3,
            "title": "propVal",
            "abbr": "pv",
            "attributes": {
                "title": "",
                "propKey": { "nodeTypeId": 2, "attributes": "id" }
            }
        },
        {
            "nodeTypeId": 4,
            "title": "config",
            "abbr": "c",
            "attributes": {
                "title": "",
                "propKeys": [{ "nodeTypeId": 2, "attributes": "id" }],
            }
        },
        {
            "nodeTypeId": 5,
            "title": "configRel",
            "abbr": "cr",
            "attributes": {
                "title": "",
                "propKeys": [{ "nodeTypeId": 2, "attributes": "id" }],
                "source": { "nodeTypeId": 4, "attributes": "id" },
                "target": { "nodeTypeId": 4, "attributes": "id" },
                "modelRel": Boolean
            }

        },
        {
            "nodeTypeId": 6,
            "title": "data",
            "abbr": "d",
            "attributes": {
                "title": "",
                "props": [
                    {
                        key: { "nodeTypeId": 2, "attributes": "id" },
                        value: { "nodeTypeId": 3, "attributes": "id" }
                    }
                ],
                "config": { "nodeTypeId": 4, "attributes": "id" }
            }
        },
        {
            "nodeTypeId": 7,
            "title": "dataRel",
            "abbr": "dr",
            "attributes": {
                "title": { "nodeTypeId": 5, "attributes": "title" },
                "props": [{ "nodeTypeId": 2, "attributes": "id" }],
                "source": { "nodeTypeId": 6, "attributes": "id" },
                "target": { "nodeTypeId": 6, "attributes": "id" },
                "props": [
                    {
                        key: { "nodeTypeId": 2, "attributes": "id" },
                        value: { "nodeTypeId": 3, "attributes": "id" }
                    }
                ],
                "configRel": { "nodeTypeId": 5, "attributes": "id" },
            }
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