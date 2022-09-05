export default function generateDataTable(tableData) {
    console.log(tableData)
    console.log(tableData[0])

    var max = Object.keys(tableData[0]).length
    var largestObj = tableData[0];
    tableData.forEach(i=>{
      if(Object.keys(i).length> max){
        max = Object.keys(i).length;
        largestObj = i;
      }
    });
    var sortedObjectList = Object.values(tableData).sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
    
    console.log(sortedObjectList)
    let result = '<table><tr><th scope="col">Id</th>';
    for (let header in largestObj){
      if(header === "id"){
        continue;
      }
      result += `<th>${header}</th>`
    }
    result += `</tr>`
    sortedObjectList.forEach((dataObject, index, array) => {
      console.log(dataObject)
      result += `<tr>`
      for (let el in dataObject) {
        result += `<td>${dataObject[el]}</td>`;
      }
      result += `</tr>`
    });
    result += '</table>';
    console.log(result)    
    return result;
}
