async function Filter(view) {

    const htmlString = `<h2>${view}</h2>
<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <img src="..." class="rounded me-2" alt="...">
    <strong class="me-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>

</div>
            `


    let filterDOM = document.createElement("div");
    filterDOM.className = "filter-container"
    filterDOM.innerHTML = htmlString;
    document.getElementById("app").appendChild(filterDOM)


}

export default Filter;