const express = require("express");
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
// const bodyParser = require("body-parser");

// Bodyparser
// router.use(bodyParser.text());
// router.use(bodyParser.json());


const schema = buildSchema(`
    type Query {
        hello: String
    }
    ` )

//The root provides a resolver function  for each api endpoint
const root = {
    hello:  ()=> {
        return 'hello world!'
    },
}

router.use('', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// router.post("/", async (req, res) => {
//     console.log("entered cypher router.")
//     try {
//         const query = req.body
//         console.log("query: " + JSON.stringify(query))
//         const data = cypherParse(query)
//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

module.exports = router;