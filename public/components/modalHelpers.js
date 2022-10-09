import Actions from "../store/Actions.js";

export function copyToClipboard(e) {
    let buttonId = e.target.id;
    let partOfDOMtoCopy = buttonId.split("modalClipboard")[1]
    let copyText = document.getElementById(`text${partOfDOMtoCopy}`).innerText;
  
    navigator.clipboard.writeText(copyText);

    alert("Copied: " + copyText);
  } 

export async function showApi() {

let apiText = document.getElementById(`textApi`).innerText;

if (/\d/.test(apiText)) return // if contains a number (as api keys do)

const accessToken = sessionStorage.getItem("accessToken");
const email = parseJwt(accessToken).email;
await Actions.GET_API(email)
const apiKey = JSON.parse(sessionStorage.getItem("apiKey"))[0]
document.getElementById(`textApi`).innerText = ` ${apiKey}`
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};
