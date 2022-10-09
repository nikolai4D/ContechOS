export default function copyToClipboard(e) {
    // Get the text field
    let buttonId = e.target.id;
    let partOfDOMtoCopy = buttonId.split("modalClipboard")[1]
    let copyText = document.getElementById(`text${partOfDOMtoCopy}`).innerText;
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);

    // Alert the copied text
    alert("Copied: " + copyText);
  } 