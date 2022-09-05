//req example to get meta api info.
const req2 = JSON.stringify({
    query: `query RootQueryType{
  __schema {
    queryType {
      name
    }
  }
}`
})

//The server side graphql take care of filtering the fields we want in the response (here only the name).
const req5 = JSON.stringify({
    query: `query RootQueryType($projectName: String){
    projectProfiles(projectName:$projectName){
    name
    }
  }`, variables: {
        projectName:"project3"
    }
})

// This request fetch recursively the following nodes required in the request, and only them.
const req6 = JSON.stringify({
    query: `query RootQueryType($id: String){
    node(id:$id){
      title,
      relations{
        id
        source {
          title
          }
        target {
          title
          }
        }
    }
  }`, variables: {
        id:"n_1"
    }
})

// What happened to req7? We don't ask.

// Chained queries
// From my current knowledge there is no way to feed the result of the first query to the second.
const req8 = JSON.stringify({
    query: `query RootQueryType($id: String){
    node1: node(id:$id){
      title
    },
    node2: node(id:$id){
      title
    }
  }`, variables: {
        id:"n_1"
    }
})

// Here some parameters are not passed to the query and it s ok
const req9 = JSON.stringify({
    query: `query RooterQueryType($id:id,$title:String,$parentId:String){
  node(title:$title,parentId:$parentId){
      title
    }
  }`, variables: {
        title:"Aulan1"
    }
})

// Instead of passing params 1 by one we can group them in an  input object. The input object have to be declared serverside as a parameter of the route.
const req10 = JSON.stringify({
    query: `query RooterQueryType($nodeInput:NodeInput){
  node(nodeInput:$nodeInput){
      title
    }
  }`, variables: {
        nodeInput: {title:"Aulan1"}
    }
})


//To get the properties related to a project via a profile or a phase, assuming we only now the title of the project

const firstQuery= JSON.stringify( {
    query: `query RooterQueryType($nodeInput:NodeInput){
    node(nodeInput:$nodeInput){
        id
        parentNode {
          relations {
            title,
            id
          }
        }
      }
    }`, variables: {
        nodeInput: {
            title: "Aulan1"
        }
    }
})

// From the request above we infer the ids of the project and the parent relations profileToProject and phaseToProject
//  We use these data in the second request.

// Get all the phases and profiles related to node
const secondQuery = JSON.stringify({
    query: `query RooterQueryType($relationInput1:RelationInput, $relationInput2:RelationInput){
  projects: relation(relationInput:$relationInput1){
      sourceNode {
        relations {
          sourceNode {
            title
            id
            parentId
          }
        }
      }
    },
  phases: relation(relationInput:$relationInput2){
      sourceNode {
        relations {
          sourceNode {
            title
            id
            parentId
          }
        }
      }
    },
  }`, variables: {
        relationInput1: {
            parentId:"r_t_1",
            target:"n_i_1"
        },
        relationInput2: {
            parentId:"r_t_2",
            target:"n_i_1"
        }
    }
})