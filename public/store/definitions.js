
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
                "propTypeId": `pt_GUID`
            }
        },
        {
            "nodeTypeId": 3,
            "title": "propVal",
            "abbr": "pv",
            "attributes": {
                "title": "",
                "propKey": `pk_GUID`
            }
        },
        {
            "nodeTypeId": 4,
            "title": "config",
            "abbr": "c",
            "attributes": {
                "title": "",
                "propKeys": [`pk_GUID`],
            }
        },
        {
            "nodeTypeId": 5,
            "title": "configRel",
            "abbr": "cr",
            "attributes": {
                "title": "",
                "propKeys": [`pk_GUID`],
                "source": `c_GUID`,
                "target": `c_GUID`,
                "modelRel": Boolean
            }

        },
        {
            "nodeTypeId": 6,
            "title": "data",
            "abbr": "d",
            "attributes": {
                "title": "",
                "props": [{ "pk_GUID": "pv_GUID" }],
                "config": `c_GUID`
            }
        },
        {
            "nodeTypeId": 7,
            "title": "dataRel",
            "abbr": "dr",
            "attributes": {
                "title": `cr_GUID.key`,
                "props": [`pk_GUID`],
                "source": `d_GUID`,
                "target": `d_GUID`,
                "props": [{ "pk_GUID": "pv_GUID" }],
                "configRel": `cr_GUID`,

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