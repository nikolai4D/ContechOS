import Actions from "../store/Actions.js";
import {State} from "../store/State.js";

export function copyToClipboard(e) {
    const buttonId = e.target.id;
    const partOfDOMtoCopy = buttonId.split("modalClipboard")[1]
    const copyText = document.getElementById(`text${partOfDOMtoCopy}`).innerText;
  
    navigator.clipboard.writeText(copyText);

    alert("Copied: " + copyText);
  } 

export async function showApi() {
  const apiText = document.getElementById(`textApi`).innerText;
  if (/\d/.test(apiText)) return // if contains a number (as api keys do)

  const accessToken = sessionStorage.getItem("accessToken");
  const email = parseJwt(accessToken).email;
  await Actions.GET_API(email)
  const apiKey = JSON.parse(sessionStorage.getItem("apiKey"))[0]
  document.getElementById(`textApi`).innerText = ` ${apiKey}`
}

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};


export function getQuery () {

  let cascadeInput = State.treeOfNodes.getCascadeParams()

  const query = JSON.stringify({

      query: `query RooterQueryType($cascadeInput: CascadeInput){
      cascade(cascadeInput:$cascadeInput){
      id
      title
      defType
      parentId
      updated
      created
      childrenNodes{
          id
          title
          defType
          parentId
          updated
          created
          
          childrenNodes{
              id
              title
              defType
              parentId
              updated
              created
                          
              childrenNodes{
                  id
                  title
                  defType
                  parentId
                  updated
                  created
              }
          }
      }
  }}`, variables: {
          cascadeInput: cascadeInput
      }
  }, null, 2)


  document.getElementById(`textQuery`).innerText = ` ${query}`

}