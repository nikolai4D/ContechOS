const firstQuery = JSON.stringify({
  query: `query RooterQueryType($input:QueryInput){
    nodes(itemInput:$input){
        id
        title
        defType
      }
    }`, variables: {
    input: {
      "title": "Intec1"
    }
  }
})

const allRelationshipsQuery = JSON.stringify({
  query: `query RooterQueryType($input:QueryInput){
    relationships(itemInput:$input){
        id
        title
        defType
      }
    }`, variables: {
    input: {
    }
  }
})

const allpropertiesQuery = JSON.stringify({
  query: `query RooterQueryType($input:QueryInput){
    properties(itemInput:$input){
        id
        title
        defType
      }
    }`, variables: {
    input: {
    }
  }
})
